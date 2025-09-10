import msal
import requests
from api.logger import get_logger


class Powerbi:
    def __init__(self, tenant_id, client_id, client_secret):
        self.logger = get_logger("hopper.api.powerbi")
        self.tenant_id = tenant_id
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = "https://api.powerbi.com/v1.0/myorg"

        if not self.tenant_id or not self.client_id or not self.client_secret:
            self.logger.error(
                "Variáveis de ambiente TENANT_ID, CLIENT_ID e CLIENT_SECRET são obrigatórias"
            )
            raise ValueError(
                "Variáveis de ambiente TENANT_ID, CLIENT_ID e CLIENT_SECRET são obrigatórias"
            )

        self.logger.info("Inicializando cliente PowerBI")
        self.access_token = self.acquire_bearer_token(
            self.tenant_id, self.client_id, self.client_secret
        )
        self.header = {"Authorization": f"Bearer {self.access_token}"}
        self.logger.info("Cliente PowerBI inicializado com sucesso")

    def acquire_bearer_token(
        self, tenant_id: str, client_id: str, client_secret: str
    ) -> str:
        """
        Adquire um token de acesso para a API do Power BI via Client Credentials Flow.
        Necessário que o App Registration tenha permissões do tipo Application
        (ex: Report.Read.All, Report.ReadWrite.All) com admin consent.
        """
        authority = f"https://login.microsoftonline.com/{tenant_id}"

        self.logger.debug(f"Solicitando token de acesso para tenant: {tenant_id}")

        try:
            app_msal = msal.ConfidentialClientApplication(
                client_id=client_id,
                authority=authority,
                client_credential=client_secret,
            )

            token_result = app_msal.acquire_token_for_client(
                scopes=["https://analysis.windows.net/powerbi/api/.default"]
            )

            if not token_result:
                self.logger.error("Nenhum resultado de token retornado pelo MSAL")
                raise Exception("No token result returned from MSAL.")

            if "access_token" in token_result:
                self.logger.info("Token de acesso adquirido com sucesso")
                return token_result["access_token"]

            error = token_result.get("error", "unknown_error")
            error_desc = token_result.get(
                "error_description", "No description provided"
            )
            error_uri = token_result.get("error_uri", "")

            error_msg = f"Failed to acquire token: {error}\nDescription: {error_desc}\nURI: {error_uri}"
            self.logger.error(error_msg)
            raise Exception(error_msg)

        except Exception as e:
            self.logger.error(f"Erro ao adquirir token do Power BI: {str(e)}")
            raise Exception(f"Erro ao adquirir token do Power BI: {str(e)}")

    # GROUPS
    async def get_all_powerbi_groups(self):
        self.logger.info("Obtendo todos os grupos do PowerBI")
        url = f"{self.base_url}/groups"

        try:
            response = requests.get(
                url,
                headers=self.header,
            )

            if response.status_code == 200:
                self.logger.info(
                    f"Grupos obtidos com sucesso: {len(response.json().get('value', []))} grupos encontrados"
                )
            else:
                self.logger.warning(
                    f"Resposta inesperada ao obter grupos: {response.status_code}"
                )

            return response.json()
        except Exception as e:
            self.logger.error(f"Erro ao obter grupos do PowerBI: {str(e)}")
            raise

    async def get_powerbi_group_by_id(self, group_id: str):
        self.logger.info(f"Obtendo grupo do PowerBI por ID: {group_id}")
        url = f"{self.base_url}/groups/{group_id}"

        try:
            response = requests.get(
                url,
                headers=self.header,
            )
            response.raise_for_status()
            self.logger.info(f"Grupo {group_id} obtido com sucesso")
            return response.json()
        except Exception as e:
            self.logger.error(f"Erro ao obter grupo {group_id}: {str(e)}")
            raise

    # REPORTS

    # GET
    async def get_powerbi_report(self, report_id: str):
        self.logger.info(f"Obtendo relatório do PowerBI por ID: {report_id}")

        if not self.access_token:
            self.logger.debug("Token de acesso expirado, renovando...")
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

        # Primeiro, tenta acessar o relatório diretamente (My Workspace)
        url = f"{self.base_url}/reports/{report_id}"

        try:
            response = requests.get(
                url,
                headers=self.header,
            )
            response.raise_for_status()
            self.logger.info(
                f"Relatório {report_id} obtido com sucesso da My Workspace"
            )
            return response.json()
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 403:
                self.logger.debug(
                    f"Acesso direto ao relatório {report_id} negado, tentando localizar em workspaces..."
                )
                # Se o acesso direto falhar com 403, tenta encontrar o relatório em todos os grupos
                return await self._find_report_in_groups(report_id)
            else:
                self.logger.error(f"Erro HTTP ao obter relatório {report_id}: {str(e)}")
                raise
        except Exception as e:
            self.logger.error(f"Erro ao obter relatório {report_id}: {str(e)}")
            raise

    async def _find_report_in_groups(self, report_id: str):
        """
        Procura um relatório específico em todos os grupos/workspaces disponíveis.
        Usado como fallback quando o acesso direto ao relatório falha.
        """
        self.logger.debug(f"Procurando relatório {report_id} em todos os workspaces...")

        try:
            groups_response = await self.get_all_powerbi_groups()

            for group in groups_response["value"]:
                try:
                    self.logger.debug(
                        f"Verificando grupo: {group['name']} ({group['id']})"
                    )

                    url = f"{self.base_url}/groups/{group['id']}/reports/{report_id}"
                    response = requests.get(url, headers=self.header)

                    if response.status_code == 200:
                        report_data = response.json()
                        report_data["workspace_id"] = group["id"]
                        report_data["workspace_name"] = group["name"]

                        self.logger.info(
                            f"Relatório {report_id} encontrado no workspace: {group['name']} ({group['id']})"
                        )
                        return report_data
                    elif response.status_code == 404:
                        continue
                    else:
                        self.logger.debug(
                            f"Erro {response.status_code} ao verificar relatório no grupo {group['name']}"
                        )
                        continue

                except Exception as e:
                    self.logger.debug(
                        f"Erro ao verificar grupo {group.get('name', 'unknown')}: {str(e)}"
                    )
                    continue

            self.logger.error(
                f"Relatório {report_id} não encontrado em nenhum workspace acessível"
            )
            raise Exception(
                f"Relatório {report_id} não encontrado em nenhum workspace acessível"
            )

        except Exception as e:
            self.logger.error(
                f"Erro ao procurar relatório {report_id} nos workspaces: {str(e)}"
            )
            raise

    async def get_powerbi_report_from_group(self, group_id: str, report_id: str):
        """
        Obtém um relatório específico de um workspace/grupo específico.
        Mais eficiente quando você conhece o workspace do relatório.
        """
        self.logger.info(f"Obtendo relatório {report_id} do grupo {group_id}")

        if not self.access_token:
            self.logger.debug("Token de acesso expirado, renovando...")
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

        url = f"{self.base_url}/groups/{group_id}/reports/{report_id}"

        try:
            response = requests.get(
                url,
                headers=self.header,
            )
            response.raise_for_status()

            report_data = response.json()
            report_data["workspace_id"] = group_id

            try:
                group_data = await self.get_powerbi_group_by_id(group_id)
                report_data["workspace_name"] = group_data.get("name", "Unknown")
            except Exception:
                report_data["workspace_name"] = "Unknown"

            self.logger.info(
                f"Relatório {report_id} obtido com sucesso do grupo {group_id}"
            )
            return report_data
        except Exception as e:
            self.logger.error(
                f"Erro ao obter relatório {report_id} do grupo {group_id}: {str(e)}"
            )
            raise

    async def get_all_powerbi_reports(self):
        self.logger.info("Obtendo todos os relatórios do PowerBI")

        if not self.access_token:
            self.logger.debug("Token de acesso expirado, renovando...")
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

        all_reports = []

        groups_response = await self.get_all_powerbi_groups()

        for group in groups_response["value"]:
            if group["id"]:
                try:
                    self.logger.debug(
                        f"Obtendo relatórios do grupo: {group['name']} ({group['id']})"
                    )
                    group_reports = await self.get_all_powerbi_reports_in_group(
                        group["id"]
                    )

                    for report in group_reports["value"]:
                        report["workspace_id"] = group["id"]
                        report["workspace_name"] = group["name"]
                        all_reports.append(report)

                except Exception as e:
                    self.logger.error(
                        f"Erro ao obter relatórios do grupo {group['name']}: {str(e)}"
                    )
                    raise e

        self.logger.info(f"Total de relatórios obtidos: {len(all_reports)}")
        return all_reports

    async def get_all_powerbi_reports_in_group(self, group_id: str):
        self.logger.debug(f"Obtendo relatórios do grupo: {group_id}")

        if not self.access_token:
            self.logger.debug("Token de acesso expirado, renovando...")
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

        url = f"{self.base_url}/groups/{group_id}/reports"

        try:
            response = requests.get(
                url,
                headers=self.header,
            )
            response.raise_for_status()

            reports_data = response.json()
            reports_count = len(reports_data.get("value", []))
            self.logger.debug(f"Obtidos {reports_count} relatórios do grupo {group_id}")

            return reports_data
        except Exception as e:
            self.logger.error(f"Erro ao obter relatórios do grupo {group_id}: {str(e)}")
            raise

    # POST
    async def create_report_in_group(
        self,
        group_id: str,
        pbix_file: bytes,
        nameConflict: str = "Overwrite",
        subfolderObjectId=None,
    ):
        if not self.access_token:
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

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
        if not self.access_token:
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

        try:
            self.logger.info(
                f"Obtendo detalhes do relatório {report_id} antes da exclusão"
            )
            report_details = await self.get_powerbi_report_from_group(
                group_id, report_id
            )
            dataset_id = report_details.get("datasetId")
            self.logger.info(f"Dataset ID associado ao relatório: {dataset_id}")
        except Exception as e:
            self.logger.warning(
                f"Não foi possível obter detalhes do relatório {report_id}: {str(e)}"
            )
            dataset_id = None

        self.logger.info(f"Excluindo relatório {report_id} do grupo {group_id}")
        url = f"{self.base_url}/groups/{group_id}/reports/{report_id}"

        response = requests.delete(
            url,
            headers=self.header,
        )

        response.raise_for_status()

        result = {
            "status": "report_deleted",
            "status_code": response.status_code,
            "report_id": report_id,
        }

        if dataset_id:
            try:
                self.logger.info(f"Tentando excluir dataset {dataset_id} associado")
                await self.delete_powerbi_dataset(group_id, dataset_id)
                result["dataset_status"] = "deleted"
                result["dataset_id"] = dataset_id
                self.logger.info(f"Dataset {dataset_id} excluído com sucesso")
            except Exception as e:
                self.logger.warning(f"Erro ao excluir dataset {dataset_id}: {str(e)}")
                result["dataset_status"] = "error"
                result["dataset_error"] = str(e)
        else:
            result["dataset_status"] = "not_found"

        return result

    # DATASETS
    async def delete_powerbi_dataset(self, group_id: str, dataset_id: str):
        """
        Exclui um dataset do PowerBI de um grupo específico.
        """
        self.logger.info(f"Excluindo dataset {dataset_id} do grupo {group_id}")

        if not self.access_token:
            self.access_token = self.acquire_bearer_token(
                self.tenant_id, self.client_id, self.client_secret
            )

        url = f"{self.base_url}/groups/{group_id}/datasets/{dataset_id}"

        try:
            response = requests.delete(
                url,
                headers=self.header,
            )
            response.raise_for_status()

            self.logger.info(
                f"Dataset {dataset_id} excluído com sucesso do grupo {group_id}"
            )
            return {
                "status": "deleted",
                "status_code": response.status_code,
                "dataset_id": dataset_id,
            }
        except Exception as e:
            self.logger.error(
                f"Erro ao excluir dataset {dataset_id} do grupo {group_id}: {str(e)}"
            )
            raise

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
