package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
	redis "github.com/redis/go-redis/v9"
)

var upgrader = websocket.Upgrader{CheckOrigin: func(r *http.Request) bool { return true }}

func main() {
	addr := ":8083"
	if v := os.Getenv("REALTIME_PORT"); v != "" { addr = ":" + v }

	rdb := redis.NewClient(&redis.Options{Addr: fmt.Sprintf("%s:%s", getenv("REDIS_HOST", "redis"), getenv("REDIS_PORT", "6379"))})
	ctx := context.Background()

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil { log.Println("upgrade:", err); return }
		defer conn.Close()

		userId := r.URL.Query().Get("u")
		if userId == "" { userId = "anon" }

		heartbeatKey := fmt.Sprintf("ws:heartbeat:%s", userId)
		done := make(chan struct{})

		go func() {
			for {
				_, msg, err := conn.ReadMessage()
				if err != nil { close(done); return }
				if string(msg) == "ping" {
					rdb.Set(ctx, heartbeatKey, time.Now().Unix(), time.Minute)
					conn.WriteMessage(websocket.TextMessage, []byte("pong"))
				}
			}
		}()

		ticker := time.NewTicker(25 * time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-done:
				return
			case <-ticker.C:
				conn.WriteMessage(websocket.PingMessage, []byte("keepalive"))
			}
		}
	})

	log.Printf("Realtime listening on %s", addr)
	http.ListenAndServe(addr, nil)
}

func getenv(k, d string) string { if v := os.Getenv(k); v != "" { return v } ; return d }