use axum::{routing::get, Json, Router};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Deserialize)]
struct ThumbQuery { url: String, width: Option<u32>, height: Option<u32> }

#[derive(Serialize)]
struct Health { ok: bool }

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new("info"))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        .route("/health", get(|| async { Json(Health { ok: true }) }))
        .route("/thumbnail", get(thumbnail_handler));

    let port: u16 = std::env::var("MEDIA_PORT").ok().and_then(|v| v.parse().ok()).unwrap_or(8084);
    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("media_listen=?", %addr);
    axum::Server::bind(&addr).serve(app.into_make_service()).await.unwrap();
}

async fn thumbnail_handler(axum::extract::Query(q): axum::extract::Query<ThumbQuery>) -> Result<Json<serde_json::Value>, axum::http::StatusCode> {
    // For demo, return echo of params. Production would fetch from S3 signed URL and resize via image crate.
    Ok(Json(serde_json::json!({
        "source": q.url,
        "width": q.width.unwrap_or(512),
        "height": q.height.unwrap_or(512)
    })))
}