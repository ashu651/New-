# syntax=docker/dockerfile:1.7
FROM golang:1.22-alpine AS build
RUN apk add --no-cache ca-certificates
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/realtime main.go

FROM gcr.io/distroless/static-debian12
WORKDIR /app
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=build /out/realtime /app/realtime
EXPOSE 8083
USER 65532:65532
ENTRYPOINT ["/app/realtime"]