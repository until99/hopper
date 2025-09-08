import os
from typing import List, Dict, Any
import msal
from fastapi import FastAPI, HTTPException
from pbipy import PowerBI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Hopper API",
    # description="",
    version="1.0.0"
)


def acquire_bearer_token(tenant_id: str, client_id: str, client_secret: str) -> str:
    """Adquire um token de acesso para a API do PowerBI"""
    authority = f"https://login.microsoftonline.com/{tenant_id}"
    app_msal = msal.ConfidentialClientApplication(
        client_id,
        authority=authority,
        client_credential=client_secret,
    )
    token_result = app_msal.acquire_token_for_client(
        scopes=["https://analysis.windows.net/powerbi/api/.default"]
    )
    if token_result and "access_token" in token_result:
        return token_result["access_token"]
    else:
        error_desc = (
            token_result.get("error_description", "Unknown error")
            if token_result
            else "No token result returned"
        )
        raise Exception(f"Failed to acquire token: {error_desc}")


def setup_powerbi_client() -> PowerBI:
    """Configura o cliente do PowerBI usando variáveis de ambiente"""
    tenant_id = os.getenv("TENANT_ID")
    client_id = os.getenv("CLIENT_ID")
    client_secret = os.getenv("CLIENT_SECRET")
    
    if not tenant_id or not client_id or not client_secret:
        raise ValueError("Variáveis de ambiente TENANT_ID, CLIENT_ID e CLIENT_SECRET são obrigatórias")
    
    access_token = acquire_bearer_token(tenant_id, client_id, client_secret)
    pbi = PowerBI(bearer_token=access_token)
    
    return pbi


@app.get("/")
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "Hopper PowerBI API",
        "version": "1.0.0",
        "endpoints": {
            "groups": "/groups - Lista todos os grupos do PowerBI"
        }
    }


@app.get("/groups", response_model=List[Dict[str, Any]])
async def list_groups():
    """Lista todos os grupos do PowerBI"""
    try:
        pbi = setup_powerbi_client()
        groups = []
        
        for group in pbi.groups():
            groups.append({
                "id": group.id,
                "name": str(group),
                "type": "workspace"
            })
        
        return groups
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno: {str(e)}")


@app.get("/health")
async def health_check():
    """Endpoint de verificação de saúde da API"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
