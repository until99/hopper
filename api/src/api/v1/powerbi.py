import msal
import requests


class Powerbi:
    def __init__(self, tenant_id, client_id, client_secret):
        self.tenant_id = tenant_id
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://api.powerbi.com/v1.0/myorg"

        if not self.tenant_id or not self.client_id or not self.client_secret:
            raise ValueError(
                "Variáveis de ambiente TENANT_ID, CLIENT_ID e CLIENT_SECRET são obrigatórias"
            )

        self.access_token = self.acquire_bearer_token(
            self.tenant_id, self.client_id, self.client_secret
        )
        self.header = {"Authorization": f"Bearer {self.access_token}"}

    def acquire_bearer_token(
        self, tenant_id: str, client_id: str, client_secret: str
    ) -> str:
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

    # GROUPS
    async def get_all_powerbi_groups(self):
        url = f"{self.base_url}/groups"

        response = requests.get(
            url,
            headers=self.header,
        )

        response.raise_for_status()

        return response.json()

    async def get_powerbi_group_by_id(self, group_id: str):
        url = f"{self.base_url}/groups/{group_id}"

        response = requests.get(
            url,
            headers=self.header,
        )

        response.raise_for_status()
        return response.json()

    # REPORTS

    # GET
    async def get_powerbi_report(self, report_id: str):
        url = f"{self.base_url}/reports/{report_id}"

        response = requests.get(
            url,
            headers=self.header,
        )

        response.raise_for_status()
        return response.json()

    async def get_all_powerbi_reports(self):
        all_reports = []

        groups_response = await self.get_all_powerbi_groups()

        for group in groups_response['value']:
            if group['id']:
                try:
                    group_reports = await self.get_all_powerbi_reports_in_group(group['id'])

                    for report in group_reports['value']:
                        report['workspace_name'] = group['name']
                        all_reports.append(report)

                except Exception as e:
                    raise e

        return all_reports

    async def get_all_powerbi_reports_in_group(self, group_id: str):
        url = f"{self.base_url}/groups/{group_id}/reports"

        response = requests.get(
            url,
            headers=self.header,
        )

        response.raise_for_status()
        return response.json()

    # POST
    async def create_report_in_group(
        self,
        group_id: str,
        pbix_file: bytes,
        nameConflict: str = "Overwrite",
        subfolderObjectId=None,
    ):
        url = f"{self.base_url}/groups/{group_id}/imports"

        params = {}
        if nameConflict is not None:
            params["nameConflict"] = nameConflict
        if subfolderObjectId is not None:
            params["subfolderObjectId"] = subfolderObjectId

        files = {"file": pbix_file}

        response = requests.post(url, headers=self.header, params=params, files=files)

        response.raise_for_status()
        return response.json()

    # DELETE
    async def delete_powerbi_report(self, group_id: str, report_id: str):
        url = f"{self.base_url}/groups/{group_id}/reports/{report_id}"

        response = requests.delete(
            url,
            headers=self.header,
        )

        response.raise_for_status()
        return {"status": "deleted", "status_code": response.status_code}

    # DATASETS
    async def refresh_powerbi_dataset(self, group_id: str, dataset_id: str) -> dict:
        url = f"{self.base_url}/groups/{group_id}/datasets/{dataset_id}/refreshes"

        response = requests.post(
            url,
            headers=self.header,
        )

        response.raise_for_status()
        return response.json()

    # REFRESHES
    async def get_powerbi_refresh_dataset(self, group_id: str, dataset_id: str):
        url = f"{self.base_url}/groups/{group_id}/datasets/{dataset_id}/refreshes"

        response = requests.get(
            url,
            headers=self.header,
        )

        response.raise_for_status()
        return response.json()

    # UPDATE
    async def update_powerbi_dataset_refresh_schedule(
        self,
        group_id: str,
        dataset_id: str,
        refresh_schedule: dict,
        disable: bool,
    ) -> dict:
        url = f"{self.base_url}/groups/{group_id}/datasets/{dataset_id}/refreshSchedule"

        response = requests.patch(
            url,
            headers=self.header,
            json={"value": refresh_schedule, "disable": disable},
        )

        response.raise_for_status()
        return response.json()
