"""
Exceções customizadas para a API do PowerBI
"""

import requests


class PowerBIAPIException(Exception):
    """Exceção base para erros da API do PowerBI"""
    
    def __init__(self, message: str, status_code: int = 500, detail: dict | None = None):
        self.message = message
        self.status_code = status_code
        self.detail = detail if detail is not None else {}
        super().__init__(self.message)

    @classmethod
    def from_response(cls, response: requests.Response, operation: str = ""):
        """Cria uma exceção a partir de uma resposta HTTP"""
        status_code = response.status_code
        
        try:
            detail = response.json()
        except Exception:
            detail = {"error": response.text or "No response body"}
        
        # Mapeia códigos de status para mensagens mais específicas
        status_messages = {
            400: "Bad Request - Requisição inválida",
            401: "Unauthorized - Token de acesso inválido ou expirado",
            403: "Forbidden - Acesso negado ao recurso",
            404: "Not Found - Recurso não encontrado",
            429: "Too Many Requests - Limite de requisições excedido",
            500: "Internal Server Error - Erro interno do servidor PowerBI",
            502: "Bad Gateway - Erro de gateway do PowerBI",
            503: "Service Unavailable - Serviço PowerBI indisponível",
            504: "Gateway Timeout - Timeout do gateway do PowerBI"
        }
        
        base_message = status_messages.get(status_code, f"HTTP {status_code}")
        message = f"{base_message}"
        if operation:
            message = f"{operation}: {message}"
        
        return cls(message, status_code, detail)


class PowerBIAuthenticationException(PowerBIAPIException):
    """Exceção para erros de autenticação"""
    pass


class PowerBIResourceNotFoundException(PowerBIAPIException):
    """Exceção para recursos não encontrados"""
    pass


class PowerBIPermissionException(PowerBIAPIException):
    """Exceção para erros de permissão"""
    pass
