from ..config import settings
import httpx
from httpx import Response

BASE_URL = "https://api.powerbi.com/v1.0/myorg"


def get_access_token() -> str:
    """
    Retorna token de acesso usando client_id, client_secret e tenant_id.
    """
    url = f"https://login.microsoftonline.com/{settings.TENANT_ID}/oauth2/v2.0/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": settings.CLIENT_ID,
        "client_secret": settings.CLIENT_SECRET,
        "scope": "https://analysis.windows.net/powerbi/api/.default",
    }
    response = httpx.post(
        url,
        data=data,
        verify=False,
    )
    response.raise_for_status()
    token = response.json()["access_token"]
    return token


def get_all_groups() -> dict:
    """
    Retorna a lista de grupos do Power BI.
    """
    token = get_access_token()
    headers = {"Authorization": f"Bearer {token}"}

    response: Response = httpx.get(f"{BASE_URL}/groups", headers=headers, verify=False)
    response.raise_for_status()
    groups = response.json().get("value", [])
    return {
        "groups": groups,
    }
