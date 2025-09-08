import pytest
from unittest.mock import Mock, patch
import requests
from src.api.v1.powerbi import Powerbi


class TestPowerbi:
    """Testes unitários para a classe Powerbi"""

    @pytest.fixture
    def mock_env_vars(self):
        """Mock das variáveis de ambiente necessárias"""
        return {
            "TENANT_ID": "test-tenant-id",
            "CLIENT_ID": "test-client-id", 
            "CLIENT_SECRET": "test-client-secret"
        }

    @pytest.fixture
    def mock_token_response(self):
        """Mock da resposta do token de acesso"""
        return {"access_token": "test-access-token"}

    @pytest.fixture
    def powerbi_instance(self, mock_env_vars, mock_token_response):
        """Fixture que cria uma instância do Powerbi com mocks"""
        with patch('src.api.v1.powerbi.msal.ConfidentialClientApplication') as mock_msal:
            mock_app = Mock()
            mock_app.acquire_token_for_client.return_value = mock_token_response
            mock_msal.return_value = mock_app
            
            powerbi = Powerbi(
                tenant_id=mock_env_vars["TENANT_ID"],
                client_id=mock_env_vars["CLIENT_ID"],
                client_secret=mock_env_vars["CLIENT_SECRET"]
            )
            return powerbi

    def test_init_success(self, mock_env_vars, mock_token_response):
        """Testa a inicialização bem-sucedida da classe Powerbi"""
        with patch('src.api.v1.powerbi.msal.ConfidentialClientApplication') as mock_msal:
            mock_app = Mock()
            mock_app.acquire_token_for_client.return_value = mock_token_response
            mock_msal.return_value = mock_app
            
            powerbi = Powerbi(
                tenant_id=mock_env_vars["TENANT_ID"],
                client_id=mock_env_vars["CLIENT_ID"],
                client_secret=mock_env_vars["CLIENT_SECRET"]
            )
            
            assert powerbi.tenant_id == mock_env_vars["TENANT_ID"]
            assert powerbi.client_id == mock_env_vars["CLIENT_ID"]
            assert powerbi.client_secret == mock_env_vars["CLIENT_SECRET"]
            assert powerbi.access_token == "test-access-token"
            assert powerbi.header == {"Authorization": "Bearer test-access-token"}

    def test_init_missing_credentials(self):
        """Testa que ValueError é levantada quando credenciais estão faltando"""
        with pytest.raises(ValueError, match="Variáveis de ambiente TENANT_ID, CLIENT_ID e CLIENT_SECRET são obrigatórias"):
            Powerbi(tenant_id=None, client_id="test", client_secret="test")

    def test_acquire_bearer_token_success(self, mock_env_vars, mock_token_response):
        """Testa a aquisição bem-sucedida do token de acesso"""
        with patch('src.api.v1.powerbi.msal.ConfidentialClientApplication') as mock_msal:
            mock_app = Mock()
            mock_app.acquire_token_for_client.return_value = mock_token_response
            mock_msal.return_value = mock_app
            
            powerbi = Powerbi(
                tenant_id=mock_env_vars["TENANT_ID"],
                client_id=mock_env_vars["CLIENT_ID"],
                client_secret=mock_env_vars["CLIENT_SECRET"]
            )
            
            token = powerbi.acquire_bearer_token(
                mock_env_vars["TENANT_ID"],
                mock_env_vars["CLIENT_ID"],
                mock_env_vars["CLIENT_SECRET"]
            )
            
            assert token == "test-access-token"

    def test_acquire_bearer_token_failure(self, mock_env_vars):
        """Testa que Exception é levantada quando falha ao adquirir token"""
        with patch('src.api.v1.powerbi.msal.ConfidentialClientApplication') as mock_msal:
            mock_app = Mock()
            mock_app.acquire_token_for_client.return_value = {"error": "invalid_client", "error_description": "Invalid client credentials"}
            mock_msal.return_value = mock_app
            
            with pytest.raises(Exception, match="Failed to acquire token"):
                Powerbi(
                    tenant_id=mock_env_vars["TENANT_ID"],
                    client_id=mock_env_vars["CLIENT_ID"],
                    client_secret=mock_env_vars["CLIENT_SECRET"]
                )

    @pytest.mark.asyncio
    async def test_get_all_powerbi_groups_success(self, powerbi_instance):
        """Testa a busca bem-sucedida de todos os grupos do PowerBI"""
        mock_response = Mock()
        mock_response.json.return_value = {"value": [{"id": "group1", "name": "Test Group"}]}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.get', return_value=mock_response) as mock_get:
            result = await powerbi_instance.get_all_powerbi_groups()
            
            mock_get.assert_called_once_with(
                "https://api.powerbi.com/v1.0/myorg/groups",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"value": [{"id": "group1", "name": "Test Group"}]}

    @pytest.mark.asyncio
    async def test_get_powerbi_group_by_id_success(self, powerbi_instance):
        """Testa a busca bem-sucedida de um grupo específico do PowerBI"""
        group_id = "test-group-id"
        mock_response = Mock()
        mock_response.json.return_value = {"id": group_id, "name": "Test Group"}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.get', return_value=mock_response) as mock_get:
            result = await powerbi_instance.get_powerbi_group_by_id(group_id)
            
            mock_get.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"id": group_id, "name": "Test Group"}

    @pytest.mark.asyncio
    async def test_get_all_powerbi_reports_success(self, powerbi_instance):
        """Testa a busca bem-sucedida de todos os relatórios do PowerBI"""
        mock_response = Mock()
        mock_response.json.return_value = {"value": [{"id": "report1", "name": "Test Report"}]}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.get', return_value=mock_response) as mock_get:
            result = await powerbi_instance.get_all_powerbi_reports()
            
            mock_get.assert_called_once_with(
                "https://api.powerbi.com/v1.0/myorg/reports",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"value": [{"id": "report1", "name": "Test Report"}]}

    @pytest.mark.asyncio
    async def test_get_powerbi_report_success(self, powerbi_instance):
        """Testa a busca bem-sucedida de um relatório específico do PowerBI"""
        report_id = "test-report-id"
        mock_response = Mock()
        mock_response.json.return_value = {"id": report_id, "name": "Test Report"}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.get', return_value=mock_response) as mock_get:
            result = await powerbi_instance.get_powerbi_report(report_id)
            
            mock_get.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/reports/{report_id}",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"id": report_id, "name": "Test Report"}

    @pytest.mark.asyncio
    async def test_get_all_powerbi_reports_in_group_success(self, powerbi_instance):
        """Testa a busca bem-sucedida de relatórios em um grupo específico"""
        group_id = "test-group-id"
        mock_response = Mock()
        mock_response.json.return_value = {"value": [{"id": "report1", "name": "Test Report"}]}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.get', return_value=mock_response) as mock_get:
            result = await powerbi_instance.get_all_powerbi_reports_in_group(group_id)
            
            mock_get.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}/reports",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"value": [{"id": "report1", "name": "Test Report"}]}

    @pytest.mark.asyncio
    async def test_delete_powerbi_report_success(self, powerbi_instance):
        """Testa a exclusão bem-sucedida de um relatório do PowerBI"""
        group_id = "test-group-id"
        report_id = "test-report-id"
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.delete', return_value=mock_response) as mock_delete:
            result = await powerbi_instance.delete_powerbi_report(group_id, report_id)
            
            mock_delete.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}/reports/{report_id}",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"status": "deleted", "status_code": 200}

    @pytest.mark.asyncio
    async def test_refresh_powerbi_dataset_success(self, powerbi_instance):
        """Testa o refresh bem-sucedido de um dataset do PowerBI"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        mock_response = Mock()
        mock_response.json.return_value = {"id": "refresh-id"}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.post', return_value=mock_response) as mock_post:
            result = await powerbi_instance.refresh_powerbi_dataset(group_id, dataset_id)
            
            mock_post.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}/datasets/{dataset_id}/refreshes",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"id": "refresh-id"}

    @pytest.mark.asyncio
    async def test_get_powerbi_refresh_dataset_success(self, powerbi_instance):
        """Testa a busca bem-sucedida de refreshes de um dataset"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        mock_response = Mock()
        mock_response.json.return_value = {"value": [{"id": "refresh1", "status": "Completed"}]}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.get', return_value=mock_response) as mock_get:
            result = await powerbi_instance.get_powerbi_refresh_dataset(group_id, dataset_id)
            
            mock_get.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}/datasets/{dataset_id}/refreshes",
                headers={"Authorization": "Bearer test-access-token"}
            )
            assert result == {"value": [{"id": "refresh1", "status": "Completed"}]}

    @pytest.mark.asyncio
    async def test_update_powerbi_dataset_refresh_schedule_success(self, powerbi_instance):
        """Testa a atualização bem-sucedida do agendamento de refresh de um dataset"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        refresh_schedule = {
            "days": ["Monday", "Wednesday"],
            "times": ["09:00", "18:00"],
            "localTimeZoneId": "UTC"
        }
        disable = False
        
        mock_response = Mock()
        mock_response.json.return_value = {"success": True}
        mock_response.raise_for_status = Mock()
        
        with patch('src.api.v1.powerbi.requests.patch', return_value=mock_response) as mock_patch:
            result = await powerbi_instance.update_powerbi_dataset_refresh_schedule(
                group_id, dataset_id, refresh_schedule, disable
            )
            
            mock_patch.assert_called_once_with(
                f"https://api.powerbi.com/v1.0/myorg/groups/{group_id}/datasets/{dataset_id}/refreshSchedule",
                headers={"Authorization": "Bearer test-access-token"},
                json={"value": refresh_schedule, "disable": disable}
            )
            assert result == {"success": True}

    @pytest.mark.asyncio
    async def test_requests_exception_handling(self, powerbi_instance):
        """Testa o tratamento de exceções de requests"""
        with patch('src.api.v1.powerbi.requests.get') as mock_get:
            mock_response = Mock()
            mock_response.raise_for_status.side_effect = requests.HTTPError("404 Not Found")
            mock_get.return_value = mock_response
            
            with pytest.raises(requests.HTTPError):
                await powerbi_instance.get_all_powerbi_groups()
