from src.models.powerbi import Report, Group, DatasetRefresh


class TestModelExtraFields:
    """Testa se modelos ignoram campos extras da API"""

    def test_report_ignores_extra_fields(self):
        """Testa se Report ignora campos extras vindos da API"""
        # Dados simulando resposta da API com campos extras
        api_response = {
            "id": "report-123",
            "name": "Test Report",
            "datasetId": "dataset-456",
            "webUrl": "https://app.powerbi.com/report/123",
            "embedUrl": "https://app.powerbi.com/embed/123",
            # Campos extras que não estão definidos no modelo
            "extraField1": "some value",
            "anotherField": 123,
            "nestedExtra": {"key": "value"}
        }
        
        # Deve criar o objeto sem erro, ignorando campos extras
        report = Report(**api_response)
        
        assert report.id == "report-123"
        assert report.name == "Test Report"
        assert report.dataset_id == "dataset-456"
        assert report.web_url == "https://app.powerbi.com/report/123"
        
        # Verifica que os campos extras não estão presentes no objeto
        assert not hasattr(report, 'extraField1')
        assert not hasattr(report, 'anotherField')
        assert not hasattr(report, 'nestedExtra')

    def test_group_ignores_extra_fields(self):
        """Testa se Group ignora campos extras vindos da API"""
        api_response = {
            "id": "group-123",
            "name": "Test Group",
            "description": "Test description",
            "isOnDedicatedCapacity": False,
            # Campos extras
            "type": "Workspace",
            "state": "Active",
            "users": [{"id": "user1"}]
        }
        
        group = Group(**api_response)
        
        assert group.id == "group-123"
        assert group.name == "Test Group"
        assert group.description == "Test description"
        assert not group.is_on_dedicated_capacity
        
        # Campos extras devem ser ignorados
        assert not hasattr(group, 'type')
        assert not hasattr(group, 'state')
        assert not hasattr(group, 'users')

    def test_dataset_refresh_ignores_extra_fields(self):
        """Testa se DatasetRefresh ignora campos extras vindos da API"""
        api_response = {
            "id": "refresh-123",
            "refreshType": "ViaApi",
            "startTime": "2025-09-09T10:00:00Z",
            "endTime": "2025-09-09T10:05:00Z",
            "status": "Completed",
            # Campos extras
            "requestId": "req-456",
            "extendedStatus": "Success",
            "details": {"duration": "5 minutes"}
        }
        
        refresh = DatasetRefresh(**api_response)
        
        assert refresh.id == "refresh-123"
        assert refresh.refresh_type == "ViaApi"
        assert refresh.status == "Completed"
        
        # Campos extras devem ser ignorados
        assert not hasattr(refresh, 'requestId')
        assert not hasattr(refresh, 'extendedStatus')
        assert not hasattr(refresh, 'details')
