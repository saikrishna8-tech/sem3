"""
AuraBuy API Gateway (FastAPI)
Routes all /api/* requests to the Spring Boot backend.
"""

import os
from typing import Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:2020").rstrip("/")

app = FastAPI(
    title="AuraBuy API Gateway",
    description="FastAPI gateway between React frontend and Spring Boot backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok", "service": "api-gateway", "backend": BACKEND_URL}


@app.get("/")
async def root():
    return {
        "message": "AuraBuy API Gateway",
        "docs": "/docs",
        "api_prefix": "/api",
        "backend": BACKEND_URL,
    }


async def _proxy(request: Request, backend_path: str) -> Response:
    url = f"{BACKEND_URL}{backend_path}"
    headers = {
        k: v
        for k, v in request.headers.items()
        if k.lower() not in ("host", "content-length")
    }
    body: Optional[bytes] = await request.body() if request.method in ("POST", "PUT", "PATCH") else None

    async with httpx.AsyncClient(timeout=60.0) as client:
        backend_response = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=body,
            params=request.query_params,
        )

    excluded = {"content-encoding", "content-length", "transfer-encoding", "connection"}
    response_headers = {
        k: v for k, v in backend_response.headers.items() if k.lower() not in excluded
    }

    return Response(
        content=backend_response.content,
        status_code=backend_response.status_code,
        headers=response_headers,
        media_type=backend_response.headers.get("content-type"),
    )


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def api_proxy(request: Request, path: str):
    return await _proxy(request, f"/{path}")
