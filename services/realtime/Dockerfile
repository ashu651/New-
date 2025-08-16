# syntax=docker/dockerfile:1
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod .
RUN go mod download
COPY . .
RUN go build -o realtime

FROM alpine:3.20
WORKDIR /app
COPY --from=builder /app/realtime /usr/local/bin/realtime
EXPOSE 4100
CMD ["realtime"]