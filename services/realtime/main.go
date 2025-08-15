package main

import (
	"context"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	redis "github.com/redis/go-redis/v9"
)

type Hub struct {
	clients map[*websocket.Conn]bool
}

func main() {
	app := fiber.New()
	port := os.Getenv("REALTIME_PORT")
	if port == "" { port = "4100" }

	rdb := redis.NewClient(&redis.Options{Addr: os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT")})
	ctx := context.Background()
	if err := rdb.Ping(ctx).Err(); err != nil { log.Fatal(err) }

	hub := &Hub{clients: make(map[*websocket.Conn]bool)}

	app.Get("/health", func(c *fiber.Ctx) error { return c.JSON(fiber.Map{"ok": true}) })

	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) { return c.Next() }
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", websocket.New(func(conn *websocket.Conn) {
		hub.clients[conn] = true
		defer func() { delete(hub.clients, conn); conn.Close() }()
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil { break }
			for client := range hub.clients {
				client.WriteMessage(websocket.TextMessage, msg)
			}
		}
	}))

	go func(){
		for range time.Tick(30 * time.Second) {
			for client := range hub.clients { client.WriteMessage(websocket.TextMessage, []byte("ping")) }
		}
	}()

	log.Printf("realtime on :%s", port)
	log.Fatal(app.Listen(":" + port))
}