import os
from fastapi import FastAPI, HTTPException, APIRouter
from dotenv import load_dotenv

from api.v1.powerbi import Powerbi

load_dotenv()


pbi = Powerbi(
    tenant_id=os.getenv("TENANT_ID"),
    client_id=os.getenv("CLIENT_ID"),
    client_secret=os.getenv("CLIENT_SECRET"),
)

app = FastAPI(
    title="Hopper API",
    description="API para integração com o PowerBI",
    version="1.0.0",
)

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
            "reports": "/powerbi/reports - Lista todos os relatórios do PowerBI",
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
        return await pbi.get_all_powerbi_groups()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@groups_router.get("/{group_id}")
async def get_group(group_id: str):
    """Obtém um grupo do PowerBI pelo ID"""
    try:
        return await pbi.get_powerbi_group_by_id(group_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@reports_router.get("")
async def get_reports():
    """Lista todos os relatórios do PowerBI"""
    try:
        return await pbi.get_all_powerbi_reports()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@reports_router.get("/{report_id}")
async def get_report(report_id: str):
    """Obtém um relatório do PowerBI pelo ID"""
    try:
        print("eita")
        return await pbi.get_powerbi_report(report_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@reports_router.get("/{group_id}")
async def get_reports_in_group(group_id: str):
    """Obtém todos os relatórios do PowerBI dentro de um grupo"""
    try:
        print("opa")
        return await pbi.get_all_powerbi_reports_in_group(group_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@reports_router.delete("/{group_id}/reports/{report_id}")
async def delete_report(group_id: str, report_id: str):
    """Deleta um relatório do PowerBI pelo ID"""
    try:
        return await pbi.delete_powerbi_report(group_id=group_id, report_id=report_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@datasets_router.post("/{group_id}/datasets/{dataset_id}/refresh")
async def refresh_dataset(group_id: str, dataset_id: str):
    """Atualiza um conjunto de dados do PowerBI pelo ID"""
    try:
        return await pbi.refresh_powerbi_dataset(
            group_id=group_id, dataset_id=dataset_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@datasets_router.get("/{group_id}/datasets/{dataset_id}/refreshes")
async def get_refreshes(group_id: str, dataset_id: str):
    """Obtém as atualizações de um conjunto de dados do PowerBI pelo ID"""
    try:
        return await pbi.get_powerbi_refresh_dataset(
            group_id=group_id, dataset_id=dataset_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


app.include_router(health_router)
app.include_router(groups_router)
app.include_router(reports_router)
app.include_router(datasets_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
