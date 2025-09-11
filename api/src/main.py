import os
from fastapi import FastAPI, HTTPException, APIRouter, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Lida com importações dependendo do contexto de execução
try:
    # Importações relativas (quando executado como módulo)
    from .api.v1.powerbi import Powerbi
    from .api.v1.exceptions import PowerBIAPIException
    from .routes import auth_router, category_router
    from .utils import get_current_active_user
    from .models import UserResponse
    from .api.logger import (
        configure_api_logging,
        configure_external_loggers,
        get_logger,
    )
    from .api.middleware import LoggingMiddleware, SecurityLoggingMiddleware
    from .api.database import db_manager
except ImportError:
    # Importações absolutas (quando executado diretamente)
    from api.v1.powerbi import Powerbi
    from api.v1.exceptions import PowerBIAPIException
    from routes import auth_router, category_router
    from utils import get_current_active_user
    from models import UserResponse
    from api.logger import configure_api_logging, configure_external_loggers, get_logger
    from api.middleware import LoggingMiddleware, SecurityLoggingMiddleware
    from api.database import db_manager

# Configura o sistema de logging antes de qualquer outra coisa
configure_api_logging()
configure_external_loggers()

# Logger para o módulo principal
logger = get_logger("hopper.api.main")

load_dotenv()

logger.info("Iniciando aplicação Hopper API")

# Inicializa PowerBI se as credenciais estiverem disponíveis
pbi = None
try:
    tenant_id = os.getenv("TENANT_ID")
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")

    if all([tenant_id, client_id, client_secret]) and tenant_id != "SEU-TENANT-ID":
        pbi = Powerbi(
            tenant_id=tenant_id,
            client_id=client_id,
            client_secret=client_secret,
        )
        logger.info("Cliente PowerBI inicializado com sucesso")
    else:
        logger.warning(
            "PowerBI não configurado - credenciais não encontradas ou são valores de exemplo"
        )
except Exception as e:
    logger.error(f"Erro ao inicializar cliente PowerBI: {str(e)}")
    pbi = None

app = FastAPI(
    title="Hopper API",
    description="API para integração com o PowerBI",
    version="1.0.0",
)

# Adiciona middlewares de logging
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityLoggingMiddleware)

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

logger.info("Middlewares configurados")

health_router = APIRouter(tags=["Health"])
groups_router = APIRouter(prefix="/powerbi/groups", tags=["Groups"])
datasets_router = APIRouter(prefix="/powerbi/groups", tags=["Datasets"])
reports_router = APIRouter(prefix="/powerbi/reports", tags=["Reports"])


@app.get("/", tags=["Root"])
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "Hopper PowerBI API",
        "version": "1.0.0",
        "powerbi_available": pbi is not None,
        "endpoints": {
            "auth": "/api/v1/auth - Endpoints de autenticação",
            "groups": "/powerbi/groups - Lista todos os grupos do PowerBI",
            "group_by_id": "/powerbi/groups/{group_id} - Obtém um grupo específico",
            "reports": "/powerbi/reports - Lista todos os relatórios do PowerBI",
            "report_by_id": "/powerbi/reports/{report_id} - Obtém um relatório por ID",
            "health": "/health - Verificação de saúde da API",
        },
    }


@health_router.get("/health")
async def health_check():
    """Endpoint de verificação de saúde da API"""
    return {
        "status": "healthy",
        "powerbi_configured": pbi is not None,
        "database_type": "sqlite",
    }


@groups_router.get("/")
async def get_all_powerbi_groups(
    current_user: UserResponse = Depends(get_current_active_user),
):
    """Lista todos os grupos do PowerBI"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.get_all_powerbi_groups()
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter grupos: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@groups_router.get("/{group_id}")
async def get_powerbi_group_by_id(
    group_id: str, current_user: UserResponse = Depends(get_current_active_user)
):
    """Obtém um grupo específico do PowerBI"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.get_powerbi_group_by_id(group_id)
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter grupo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@groups_router.delete("/{group_id}/reports/{report_id}")
async def delete_powerbi_report(
    group_id: str,
    report_id: str,
    current_user: UserResponse = Depends(get_current_active_user),
):
    """Exclui um relatório específico de um grupo do PowerBI"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.delete_powerbi_report(group_id, report_id)
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao excluir relatório: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@reports_router.get("/")
async def get_all_powerbi_reports(
    current_user: UserResponse = Depends(get_current_active_user),
):
    """Lista todos os relatórios do PowerBI"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.get_all_powerbi_reports()
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter relatórios: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@reports_router.get("/{report_id}")
async def get_powerbi_report_by_id(
    report_id: str, current_user: UserResponse = Depends(get_current_active_user)
):
    """Obtém um relatório específico por ID (busca em todos os workspaces)"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.get_powerbi_report(report_id)
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter relatório: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@reports_router.get("/group/{group_id}")
async def get_reports_by_group(
    group_id: str, current_user: UserResponse = Depends(get_current_active_user)
):
    """Lista relatórios de um grupo específico"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.get_all_powerbi_reports_in_group(group_id)
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter relatórios do grupo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


@reports_router.get("/group/{group_id}/reports/{report_id}")
async def get_report_from_group(
    group_id: str,
    report_id: str,
    current_user: UserResponse = Depends(get_current_active_user),
):
    """Obtém um relatório de um workspace específico"""
    if not pbi:
        raise HTTPException(status_code=503, detail="PowerBI não está configurado")
    try:
        result = await pbi.get_powerbi_report_from_group(group_id, report_id)
        return result
    except PowerBIAPIException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter relatório do grupo: {str(e)}")
        raise HTTPException(status_code=500, detail="Erro interno do servidor")


# Inclui rotas na aplicação
app.include_router(health_router)
app.include_router(auth_router, prefix="/api/v1")
app.include_router(category_router, prefix="/api/v1")
app.include_router(groups_router)
app.include_router(datasets_router)
app.include_router(reports_router)


@app.on_event("startup")
async def startup_event():
    """Eventos executados na inicialização da aplicação"""
    try:
        await db_manager.connect()
        logger.info("Conexão com banco de dados estabelecida")
    except Exception as e:
        logger.error(f"Erro ao conectar com banco de dados: {str(e)}")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Eventos executados no encerramento da aplicação"""
    try:
        await db_manager.disconnect()
        logger.info("Conexão com banco de dados encerrada")
    except Exception as e:
        logger.error(f"Erro ao desconectar do banco de dados: {str(e)}")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
