import time
import uuid
from typing import Callable, Any
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from api.logger import get_logger

logger = get_logger("hopper.api.middleware")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware para logging de requisições HTTP
    
    Registra informações sobre cada requisição incluindo:
    - Método HTTP e URL
    - Tempo de processamento
    - Status code da resposta
    - IP do cliente
    - User Agent
    - Tamanho da resposta
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable[[Request], Any]) -> Response:
        # Gera um ID único para a requisição
        request_id = str(uuid.uuid4())[:8]
        
        # Informações da requisição
        start_time = time.time()
        method = request.method
        url = str(request.url)
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        
        # Adiciona o request_id ao estado da requisição para uso posterior
        request.state.request_id = request_id
        
        # Log da requisição recebida
        logger.info(
            f"[{request_id}] {method} {url} - IP: {client_ip} - User-Agent: {user_agent[:100]}..."
        )
        
        try:
            # Processa a requisição
            response = await call_next(request)
            
            # Calcula o tempo de processamento
            process_time = time.time() - start_time
            
            # Obtém o tamanho da resposta se disponível
            content_length = response.headers.get("content-length", "unknown")
            
            # Log da resposta
            if response.status_code >= 400:
                logger.warning(
                    f"[{request_id}] {method} {url} - "
                    f"Status: {response.status_code} - "
                    f"Time: {process_time:.3f}s - "
                    f"Size: {content_length} bytes"
                )
            else:
                logger.info(
                    f"[{request_id}] {method} {url} - "
                    f"Status: {response.status_code} - "
                    f"Time: {process_time:.3f}s - "
                    f"Size: {content_length} bytes"
                )
            
            # Adiciona headers de performance/debug
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"
            
            return response
            
        except Exception as e:
            # Calcula o tempo até o erro
            process_time = time.time() - start_time
            
            # Log do erro
            logger.error(
                f"[{request_id}] {method} {url} - "
                f"ERROR after {process_time:.3f}s: {str(e)}",
                exc_info=True
            )
            
            # Retorna uma resposta de erro padronizada
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "message": "An unexpected error occurred",
                    "request_id": request_id
                },
                headers={
                    "X-Request-ID": request_id,
                    "X-Process-Time": f"{process_time:.3f}"
                }
            )


class SecurityLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware para logging de eventos de segurança
    
    Registra tentativas de acesso suspeitas ou potencialmente maliciosas
    """

    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.security_logger = get_logger("hopper.api.security")

    async def dispatch(self, request: Request, call_next: Callable[[Request], Any]) -> Response:
        client_ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "")
        
        # Detecta possíveis tentativas de ataque
        suspicious_patterns = [
            "sqlmap", "nmap", "nikto", "dirb", "gobuster",
            "burp", "zap", "w3af", "metasploit"
        ]
        
        # Verifica se o User-Agent contém padrões suspeitos
        if any(pattern in user_agent.lower() for pattern in suspicious_patterns):
            self.security_logger.warning(
                f"Suspicious User-Agent detected - IP: {client_ip} - "
                f"User-Agent: {user_agent} - URL: {request.url}"
            )
        
        # Detecta tentativas de acesso a endpoints administrativos
        admin_paths = ["/admin", "/api/admin", "/management", "/debug"]
        if any(path in str(request.url).lower() for path in admin_paths):
            self.security_logger.info(
                f"Admin endpoint access attempt - IP: {client_ip} - URL: {request.url}"
            )
        
        # Continua com o processamento normal
        response = await call_next(request)
        
        # Log de códigos de status específicos
        if response.status_code == 401:
            self.security_logger.warning(
                f"Unauthorized access attempt - IP: {client_ip} - URL: {request.url}"
            )
        elif response.status_code == 403:
            self.security_logger.warning(
                f"Forbidden access attempt - IP: {client_ip} - URL: {request.url}"
            )
        elif response.status_code == 404:
            self.security_logger.info(
                f"Not found - IP: {client_ip} - URL: {request.url}"
            )
        
        return response
