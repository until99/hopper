import os
from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from api.v1.powerbi import Powerbi
from api.v1.exceptions import PowerBIAPIException
from api.logger import configure_api_logging, configure_external_loggers, get_logger
from api.middleware import LoggingMiddleware, SecurityLoggingMiddleware

# Configura o sistema de logging antes de qualquer outra coisa
configure_api_logging()
configure_external_loggers()

# Logger para o módulo principal
logger = get_logger("hopper.api.main")

load_dotenv()

logger.info("Iniciando aplicação Hopper API")

try:
    pbi = Powerbi(
        tenant_id=os.getenv("TENANT_ID"),
        client_id=os.getenv("CLIENT_ID"),
        client_secret=os.getenv("CLIENT_SECRET"),
    )
    logger.info("Cliente PowerBI inicializado com sucesso")
except Exception as e:
    logger.error(f"Erro ao inicializar cliente PowerBI: {str(e)}")
    raise

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
        "endpoints": {
            "groups": "/powerbi/groups - Lista todos os grupos do PowerBI",
            "group_by_id": "/powerbi/groups/{group_id} - Obtém um grupo específico",
            "reports": "/powerbi/reports - Lista todos os relatórios do PowerBI",
            "report_by_id": "/powerbi/reports/{report_id} - Obtém um relatório por ID (busca em todos os workspaces)",
            "report_from_group": "/powerbi/reports/group/{group_id}/reports/{report_id} - Obtém um relatório de um workspace específico",
            "reports_by_group": "/powerbi/reports/group/{group_id} - Lista relatórios de um grupo específico",
            "health": "/health - Verificação de saúde da API",
        },
    }


@health_router.get("/health")
async def health_check():
    """Endpoint de verificação de saúde da API"""
    return {"status": "healthy"}


@groups_router.get("")
async def get_groups():
    """Lista todos os grupos do PowerBI"""
    try:
        logger.info("Requisição para listar todos os grupos do PowerBI")
        result = await pbi.get_all_powerbi_groups()
        logger.info("Grupos listados com sucesso")
        return result
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao listar grupos: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao listar grupos: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@groups_router.get("/{group_id}")
async def get_group(group_id: str):
    """Obtém um grupo do PowerBI pelo ID"""
    try:
        logger.info(f"Requisição para obter grupo por ID: {group_id}")
        result = await pbi.get_powerbi_group_by_id(group_id)
        logger.info(f"Grupo {group_id} obtido com sucesso")
        return result
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao obter grupo {group_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter grupo {group_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@reports_router.get("")
async def get_reports():
    """Lista todos os relatórios do PowerBI"""
    try:
        logger.info("Requisição para listar todos os relatórios do PowerBI")
        result = await pbi.get_all_powerbi_reports()
        logger.info("Relatórios listados com sucesso")
        return result
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao listar relatórios: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao listar relatórios: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@reports_router.get("/group/{group_id}")
async def get_reports_in_group(group_id: str):
    """Obtém todos os relatórios do PowerBI dentro de um grupo"""
    try:
        logger.info(f"Requisição para listar relatórios do grupo: {group_id}")
        result = await pbi.get_all_powerbi_reports_in_group(group_id)
        logger.info(f"Relatórios do grupo {group_id} listados com sucesso")
        return result
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao listar relatórios do grupo {group_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao listar relatórios do grupo {group_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@reports_router.get("/{report_id}")
async def get_report(report_id: str):
    """Obtém um relatório do PowerBI pelo ID"""
    try:
        logger.info(f"Requisição para obter relatório por ID: {report_id}")
        result = await pbi.get_powerbi_report(report_id)
        logger.info(f"Relatório {report_id} obtido com sucesso")
        return result
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao obter relatório {report_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter relatório {report_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@reports_router.get("/group/{group_id}/reports/{report_id}")
async def get_report_from_group(group_id: str, report_id: str):
    """Obtém um relatório específico de um workspace/grupo específico"""
    try:
        logger.info(f"Requisição para obter relatório {report_id} do grupo {group_id}")
        result = await pbi.get_powerbi_report_from_group(group_id, report_id)
        logger.info(f"Relatório {report_id} obtido com sucesso do grupo {group_id}")
        return result
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao obter relatório {report_id} do grupo {group_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter relatório {report_id} do grupo {group_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@reports_router.post("/")
async def create_report(
    group_id: str,
    pbix_file: bytes,
    nameConflict: str,
    subfolderObjectId=None,
):
    """Cria um novo relatório no PowerBI"""
    try:
        return await pbi.create_report_in_group(
            group_id=group_id,
            pbix_file=pbix_file,
            nameConflict=nameConflict,
            subfolderObjectId=subfolderObjectId,
        )
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao criar relatório: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao criar relatório: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@groups_router.delete("/{group_id}/reports/{report_id}")
async def delete_report(group_id: str, report_id: str):
    """Deleta um relatório do PowerBI pelo ID"""
    try:
        return await pbi.delete_powerbi_report(group_id=group_id, report_id=report_id)
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao deletar relatório {report_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao deletar relatório {report_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@datasets_router.post("/{group_id}/datasets/{dataset_id}/refresh")
async def refresh_dataset(group_id: str, dataset_id: str):
    """Atualiza um conjunto de dados do PowerBI pelo ID"""
    try:
        return await pbi.refresh_powerbi_dataset(
            group_id=group_id, dataset_id=dataset_id
        )
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao atualizar dataset {dataset_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao atualizar dataset {dataset_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@datasets_router.get("/{group_id}/datasets/{dataset_id}/refreshes")
async def get_refreshes(group_id: str, dataset_id: str):
    """Obtém as atualizações de um conjunto de dados do PowerBI pelo ID"""
    try:
        return await pbi.get_powerbi_refresh_dataset(
            group_id=group_id, dataset_id=dataset_id
        )
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao obter refreshes do dataset {dataset_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao obter refreshes do dataset {dataset_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


@datasets_router.patch("/{group_id}/datasets/{dataset_id}/refreshSchedule")
async def update_refresh_schedule(
    group_id: str, dataset_id: str, refresh_schedule: dict, disable: bool
):
    """Atualiza o agendamento de atualização de um conjunto de dados do PowerBI pelo ID

    Exemplo:
    {
      "value":
      {
        "days":
        [
          "Sunday",
          "Tuesday",
          "Friday",
          "Saturday"
        ],
        "times":
        [
          "07:00",
          "11:30",
          "16:00",
          "23:30"
        ],
        "localTimeZoneId": "UTC"
      }
    }
    """
    try:
        return await pbi.update_powerbi_dataset_refresh_schedule(
            group_id=group_id,
            dataset_id=dataset_id,
            refresh_schedule=refresh_schedule,
            disable=disable,
        )
    except PowerBIAPIException as e:
        logger.error(f"Erro da API PowerBI ao atualizar agendamento do dataset {dataset_id}: {e.message}")
        raise HTTPException(status_code=e.status_code, detail=e.message)
    except Exception as e:
        logger.error(f"Erro inesperado ao atualizar agendamento do dataset {dataset_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro interno do servidor: {str(e)}")


app.include_router(health_router)
app.include_router(groups_router)
app.include_router(reports_router)
app.include_router(datasets_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
