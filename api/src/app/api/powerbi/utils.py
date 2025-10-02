import logging
import msal
import os
import dotenv

logger = logging.getLogger(__name__)
dotenv.load_dotenv()


def acquire_bearer_token() -> str | None:
    tenant_id = os.getenv("AZURE_TENANT_ID")
    client_id = os.getenv("AZURE_CLIENT_ID")
    client_secret = os.getenv("AZURE_CLIENT_SECRET")

    logger.info(f"Acquiring bearer token for client ID: {client_id}")
    app_msal = msal.ConfidentialClientApplication(
        client_id=client_id,
        authority=f"https://login.microsoftonline.com/{tenant_id}",
        client_credential=client_secret,
    )

    token_result = app_msal.acquire_token_for_client(
        scopes=["https://analysis.windows.net/powerbi/api/.default"]
    )

    if not token_result:
        logger.error("No token result returned from MSAL.")
        return None

    if "access_token" in token_result:
        logger.info("Bearer token acquired successfully.")
        return token_result["access_token"]

    if "error" in token_result:
        error = token_result.get("error", "unknown_error")
        error_desc = token_result.get("error_description", "No description provided")
        error_uri = token_result.get("error_uri", "")

        error_msg = f"Failed to acquire token: {error}\nDescription: {error_desc}\nURI: {error_uri}"

        logger.error(error_msg)
        return None
