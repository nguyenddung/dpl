import time
import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

logger = structlog.get_logger("cocstudy.http")

class RequestLoggerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        response: Response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 2)
        log_fn = logger.error if response.status_code >= 500 else logger.info
        log_fn("http_request", method=request.method, path=request.url.path,
               status_code=response.status_code, duration_ms=duration_ms)
        response.headers["X-Response-Time"] = f"{duration_ms}ms"
        return response
