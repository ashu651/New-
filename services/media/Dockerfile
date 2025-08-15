# syntax=docker/dockerfile:1
FROM rust:1.79 AS builder
WORKDIR /app
COPY Cargo.toml .
RUN mkdir src && echo "fn main(){}" > src/main.rs && cargo build --release && rm -rf src
COPY src ./src
RUN cargo build --release

FROM debian:stable-slim
WORKDIR /app
COPY --from=builder /app/target/release/snapzy-media /usr/local/bin/snapzy-media
EXPOSE 4200
CMD ["snapzy-media"]