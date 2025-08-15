# syntax=docker/dockerfile:1.7
FROM rust:1.79 as builder
WORKDIR /src
COPY Cargo.toml ./
RUN mkdir -p src && echo "fn main(){}" > src/main.rs && cargo build --release || true
COPY src ./src
RUN cargo build --release

FROM gcr.io/distroless/cc-debian12
WORKDIR /app
COPY --from=builder /src/target/release/snapzy-media /app/media
EXPOSE 8084
USER 65532:65532
ENTRYPOINT ["/app/media"]