import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from main import app


@pytest.mark.integration
class TestAPIIntegration:
    """Testes de integração para a API"""

    @pytest.fixture
    def client(self):
        """Cliente para testes de integração"""
        return TestClient(app)

    @patch('main.pbi')
    def test_full_workflow_groups(self, mock_pbi, client):
        """Testa o fluxo completo de trabalho com grupos"""
        # Mock da resposta dos grupos
        mock_groups_response = {
            "value": [
                {"id": "group1", "name": "Group 1"},
                {"id": "group2", "name": "Group 2"}
            ]
        }
        # Configurar o mock como um mock assíncrono
        async def mock_get_groups():
            return mock_groups_response
        
        async def mock_get_group(group_id):
            return {"id": group_id, "name": "Group 1", "description": "Test group"}
        
        mock_pbi.get_all_powerbi_groups = mock_get_groups
        mock_pbi.get_powerbi_group_by_id = mock_get_group
        
        # Testa busca de todos os grupos
        response = client.get("/powerbi/groups")
        assert response.status_code == 200
        assert response.json() == mock_groups_response
        
        # Testa busca de grupo específico
        response = client.get("/powerbi/groups/group1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "group1"

    @patch('main.pbi')
    def test_full_workflow_reports(self, mock_pbi, client):
        """Testa o fluxo completo de trabalho com relatórios"""
        # Mock das respostas
        mock_reports_response = {
            "value": [
                {"id": "report1", "name": "Report 1"},
                {"id": "report2", "name": "Report 2"}
            ]
        }
        
        async def mock_get_reports():
            return mock_reports_response
        
        async def mock_get_report(report_id):
            return {"id": report_id, "name": "Report 1", "description": "Test report"}
        
        async def mock_delete_report(group_id, report_id):
            return {"status": "deleted", "status_code": 200}
        
        mock_pbi.get_all_powerbi_reports = mock_get_reports
        mock_pbi.get_powerbi_report = mock_get_report
        mock_pbi.delete_powerbi_report = mock_delete_report
        
        # Testa busca de todos os relatórios
        response = client.get("/powerbi/reports")
        assert response.status_code == 200
        assert response.json() == mock_reports_response
        
        # Testa busca de relatório específico
        response = client.get("/powerbi/reports/report1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "report1"
        
        # Testa exclusão de relatório
        response = client.delete("/powerbi/reports/group1/reports/report1")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "deleted"

    @patch('main.pbi')
    def test_full_workflow_datasets(self, mock_pbi, client):
        """Testa o fluxo completo de trabalho com datasets"""
        # Mock das respostas
        async def mock_refresh_dataset(group_id, dataset_id):
            return {"id": "refresh123"}
        
        async def mock_get_refreshes(group_id, dataset_id):
            return {
                "value": [
                    {"id": "refresh1", "status": "Completed"},
                    {"id": "refresh2", "status": "InProgress"}
                ]
            }
        
        async def mock_update_schedule(group_id, dataset_id, refresh_schedule, disable):
            return {"success": True}
        
        mock_pbi.refresh_powerbi_dataset = mock_refresh_dataset
        mock_pbi.get_powerbi_refresh_dataset = mock_get_refreshes
        mock_pbi.update_powerbi_dataset_refresh_schedule = mock_update_schedule
        
        # Testa refresh de dataset
        response = client.post("/powerbi/groups/group1/datasets/dataset1/refresh")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "refresh123"
        
        # Testa busca de refreshes
        response = client.get("/powerbi/groups/group1/datasets/dataset1/refreshes")
        assert response.status_code == 200
        data = response.json()
        assert "value" in data
        
        # Testa atualização de agendamento
        schedule_data = {
            "days": ["Monday", "Wednesday"],
            "times": ["09:00", "18:00"],
            "localTimeZoneId": "UTC"
        }
        response = client.patch(
            "/powerbi/groups/group1/datasets/dataset1/refreshSchedule",
            params={"disable": False},
            json=schedule_data
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] == True

    def test_api_endpoints_exist(self, client):
        """Testa que todos os endpoints principais existem e retornam respostas válidas"""
        # Endpoint raiz
        response = client.get("/")
        assert response.status_code == 200
        
        # Health check
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    @patch('main.pbi')
    def test_error_handling_chain(self, mock_pbi, client):
        """Testa o tratamento de erros em cadeia"""
        # Simula erro na autenticação/token
        async def mock_error():
            raise Exception("Authentication failed")
        
        mock_pbi.get_all_powerbi_groups = mock_error
        
        response = client.get("/powerbi/groups")
        assert response.status_code == 500
        assert "Authentication failed" in response.json()["detail"]
        
        # Simula erro HTTP
        async def mock_http_error():
            raise Exception("HTTP 404: Not Found")
        
        mock_pbi.get_all_powerbi_groups = mock_http_error
        
        response = client.get("/powerbi/groups")
        assert response.status_code == 500
        assert "HTTP 404: Not Found" in response.json()["detail"]
