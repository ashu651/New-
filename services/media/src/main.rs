use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use aws_sdk_s3::config::Region;

#[get("/health")]
async fn health() -> impl Responder { HttpResponse::Ok().json(serde_json::json!({"ok": true})) }

#[derive(Deserialize)]
struct SignReq { key: String, content_type: Option<String> }

#[post("/sign-upload")]
async fn sign_upload(body: web::Json<SignReq>) -> impl Responder {
    let endpoint = std::env::var("S3_ENDPOINT").unwrap_or_else(|_| "http://localhost:9000".to_string());
    let region = std::env::var("S3_REGION").unwrap_or_else(|_| "us-east-1".to_string());
    let bucket = std::env::var("S3_BUCKET").unwrap_or_else(|_| "snapzy-media".to_string());
    let access_key = std::env::var("S3_ACCESS_KEY").unwrap_or_else(|_| "minioadmin".to_string());
    let secret_key = std::env::var("S3_SECRET_KEY").unwrap_or_else(|_| "minioadmin".to_string());

    let conf = aws_config::from_env()
        .region(Region::new(region))
        .endpoint_url(endpoint)
        .load()
        .await;
    let creds = aws_sdk_s3::config::Credentials::new(access_key, secret_key, None, None, "static");
    let s3 = aws_sdk_s3::Client::new(&aws_sdk_s3::config::Builder::from(&conf).credentials_provider(creds).build());

    let presigned = s3
        .put_object()
        .bucket(bucket)
        .key(&body.key)
        .content_type(body.content_type.clone().unwrap_or("application/octet-stream".to_string()))
        .presigned(std::time::Duration::from_secs(300))
        .await;

    match presigned {
        Ok(req) => HttpResponse::Ok().json(serde_json::json!({"url": req.uri().to_string()})),
        Err(_) => HttpResponse::InternalServerError().finish()
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(health).service(sign_upload))
        .bind(("0.0.0.0", 4200))?
        .run()
        .await
}