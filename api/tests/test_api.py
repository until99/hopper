import pytest
from unittest.mock import patch
from httpx import AsyncClient
from fastapi.testclient import TestClient
from src.main import app


class TestAPI:
    """Testes unitários para a API FastAPI"""

    @pytest.fixture
    def client(self):
        """Fixture que cria um cliente de teste"""
        return TestClient(app)

    @pytest.fixture
    async def async_client(self):
        """Fixture que cria um cliente assíncrono para testes"""
        async with AsyncClient(app=app, base_url="http://test") as ac:
            yield ac

    def test_root_endpoint(self, client):
        """Testa o endpoint raiz da API"""
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Hopper PowerBI API"
        assert data["version"] == "1.0.0"
        assert "endpoints" in data

    def test_health_check(self, client):
        """Testa o endpoint de verificação de saúde"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

    @patch('src.main.pbi.get_all_powerbi_groups')
    def test_get_groups_success(self, mock_get_groups, client):
        """Testa a busca bem-sucedida de grupos"""
        mock_get_groups.return_value = {"value": [{"id": "group1", "name": "Test Group"}]}
        
        response = client.get("/powerbi/groups")
        assert response.status_code == 200
        mock_get_groups.assert_called_once()

    @patch('src.main.pbi.get_all_powerbi_groups')
    def test_get_groups_error(self, mock_get_groups, client):
        """Testa o tratamento de erro na busca de grupos"""
        mock_get_groups.side_effect = Exception("PowerBI API Error")
        
        response = client.get("/powerbi/groups")
        assert response.status_code == 500
        assert "PowerBI API Error" in response.json()["detail"]

    @patch('src.main.pbi.get_powerbi_group_by_id')
    def test_get_group_by_id_success(self, mock_get_group, client):
        """Testa a busca bem-sucedida de um grupo específico"""
        group_id = "test-group-id"
        mock_get_group.return_value = {"id": group_id, "name": "Test Group"}
        
        response = client.get(f"/powerbi/groups/{group_id}")
        assert response.status_code == 200
        mock_get_group.assert_called_once_with(group_id)

    @patch('src.main.pbi.get_powerbi_group_by_id')
    def test_get_group_by_id_error(self, mock_get_group, client):
        """Testa o tratamento de erro na busca de grupo específico"""
        group_id = "test-group-id"
        mock_get_group.side_effect = Exception("Group not found")
        
        response = client.get(f"/powerbi/groups/{group_id}")
        assert response.status_code == 500
        assert "Group not found" in response.json()["detail"]

    @patch('src.main.pbi.get_all_powerbi_reports')
    def test_get_reports_success(self, mock_get_reports, client):
        """Testa a busca bem-sucedida de relatórios"""
        mock_get_reports.return_value = {"value": [{"id": "report1", "name": "Test Report"}]}
        
        response = client.get("/powerbi/reports")
        assert response.status_code == 200
        mock_get_reports.assert_called_once()

    @patch('src.main.pbi.get_all_powerbi_reports')
    def test_get_reports_error(self, mock_get_reports, client):
        """Testa o tratamento de erro na busca de relatórios"""
        mock_get_reports.side_effect = Exception("PowerBI API Error")
        
        response = client.get("/powerbi/reports")
        assert response.status_code == 500
        assert "PowerBI API Error" in response.json()["detail"]

    @patch('src.main.pbi.get_powerbi_report')
    def test_get_report_by_id_success(self, mock_get_report, client):
        """Testa a busca bem-sucedida de um relatório específico"""
        report_id = "test-report-id"
        mock_get_report.return_value = {"id": report_id, "name": "Test Report"}
        
        response = client.get(f"/powerbi/reports/{report_id}")
        assert response.status_code == 200
        mock_get_report.assert_called_once_with(report_id)

    @patch('src.main.pbi.get_powerbi_report')
    def test_get_report_by_id_error(self, mock_get_report, client):
        """Testa o tratamento de erro na busca de relatório específico"""
        report_id = "test-report-id"
        mock_get_report.side_effect = Exception("Report not found")
        
        response = client.get(f"/powerbi/reports/{report_id}")
        assert response.status_code == 500
        assert "Report not found" in response.json()["detail"]

    @patch('src.main.pbi.delete_powerbi_report')
    def test_delete_report_success(self, mock_delete_report, client):
        """Testa a exclusão bem-sucedida de um relatório"""
        group_id = "test-group-id"
        report_id = "test-report-id"
        mock_delete_report.return_value = {"status": "deleted", "status_code": 200}
        
        response = client.delete(f"/powerbi/reports/{group_id}/reports/{report_id}")
        assert response.status_code == 200
        mock_delete_report.assert_called_once_with(group_id=group_id, report_id=report_id)

    @patch('src.main.pbi.delete_powerbi_report')
    def test_delete_report_error(self, mock_delete_report, client):
        """Testa o tratamento de erro na exclusão de relatório"""
        group_id = "test-group-id"
        report_id = "test-report-id"
        mock_delete_report.side_effect = Exception("Delete failed")
        
        response = client.delete(f"/powerbi/reports/{group_id}/reports/{report_id}")
        assert response.status_code == 500
        assert "Delete failed" in response.json()["detail"]

    @patch('src.main.pbi.refresh_powerbi_dataset')
    def test_refresh_dataset_success(self, mock_refresh, client):
        """Testa o refresh bem-sucedido de um dataset"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        mock_refresh.return_value = {"id": "refresh-id"}
        
        response = client.post(f"/powerbi/groups/{group_id}/datasets/{dataset_id}/refresh")
        assert response.status_code == 200
        mock_refresh.assert_called_once_with(group_id=group_id, dataset_id=dataset_id)

    @patch('src.main.pbi.refresh_powerbi_dataset')
    def test_refresh_dataset_error(self, mock_refresh, client):
        """Testa o tratamento de erro no refresh de dataset"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        mock_refresh.side_effect = Exception("Refresh failed")
        
        response = client.post(f"/powerbi/groups/{group_id}/datasets/{dataset_id}/refresh")
        assert response.status_code == 500
        assert "Refresh failed" in response.json()["detail"]

    @patch('src.main.pbi.get_powerbi_refresh_dataset')
    def test_get_refreshes_success(self, mock_get_refreshes, client):
        """Testa a busca bem-sucedida de refreshes de um dataset"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        mock_get_refreshes.return_value = {"value": [{"id": "refresh1", "status": "Completed"}]}
        
        response = client.get(f"/powerbi/groups/{group_id}/datasets/{dataset_id}/refreshes")
        assert response.status_code == 200
        mock_get_refreshes.assert_called_once_with(group_id=group_id, dataset_id=dataset_id)

    @patch('src.main.pbi.get_powerbi_refresh_dataset')
    def test_get_refreshes_error(self, mock_get_refreshes, client):
        """Testa o tratamento de erro na busca de refreshes"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        mock_get_refreshes.side_effect = Exception("Get refreshes failed")
        
        response = client.get(f"/powerbi/groups/{group_id}/datasets/{dataset_id}/refreshes")
        assert response.status_code == 500
        assert "Get refreshes failed" in response.json()["detail"]

    @patch('src.main.pbi.update_powerbi_dataset_refresh_schedule')
    def test_update_refresh_schedule_success(self, mock_update_schedule, client):
        """Testa a atualização bem-sucedida do agendamento de refresh"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        refresh_schedule = {
            "days": ["Monday", "Wednesday"],
            "times": ["09:00", "18:00"],
            "localTimeZoneId": "UTC"
        }
        disable = False
        mock_update_schedule.return_value = {"success": True}
        
        response = client.patch(
            f"/powerbi/groups/{group_id}/datasets/{dataset_id}/refreshSchedule",
            params={"disable": disable},
            json=refresh_schedule
        )
        assert response.status_code == 200
        mock_update_schedule.assert_called_once_with(
            group_id=group_id,
            dataset_id=dataset_id,
            refresh_schedule=refresh_schedule,
            disable=disable
        )

    @patch('src.main.pbi.update_powerbi_dataset_refresh_schedule')
    def test_update_refresh_schedule_error(self, mock_update_schedule, client):
        """Testa o tratamento de erro na atualização do agendamento"""
        group_id = "test-group-id"
        dataset_id = "test-dataset-id"
        refresh_schedule = {
            "days": ["Monday"],
            "times": ["09:00"],
            "localTimeZoneId": "UTC"
        }
        disable = False
        mock_update_schedule.side_effect = Exception("Update failed")
        
        response = client.patch(
            f"/powerbi/groups/{group_id}/datasets/{dataset_id}/refreshSchedule",
            params={"disable": disable},
            json=refresh_schedule
        )
        assert response.status_code == 500
        assert "Update failed" in response.json()["detail"]
