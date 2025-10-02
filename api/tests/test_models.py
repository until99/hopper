import pytest
from pydantic import ValidationError
from src.models.powerbi import ReportUpdateRequest


class TestPowerbIModels:
    """Testes unitários para os modelos Pydantic do PowerBI"""

    def test_report_update_request_valid(self):
        """Testa a criação válida de ReportUpdateRequest"""
        data = {"name": "Test Report"}
        request = ReportUpdateRequest(**data)
        
        assert request.name == "Test Report"

    def test_report_update_request_missing_name(self):
        """Testa que ValidationError é levantada quando name está faltando"""
        with pytest.raises(ValidationError) as exc_info:
            ReportUpdateRequest()
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]["loc"] == ("name",)
        assert errors[0]["type"] == "missing"

    def test_report_update_request_empty_name(self):
        """Testa que string vazia é aceita para name"""
        data = {"name": ""}
        request = ReportUpdateRequest(**data)
        
        assert request.name == ""

    def test_report_update_request_name_type_validation(self):
        """Testa validação de tipo para o campo name"""
        with pytest.raises(ValidationError) as exc_info:
            ReportUpdateRequest(name=123)
        
        errors = exc_info.value.errors()
        assert len(errors) == 1
        assert errors[0]["loc"] == ("name",)
        assert errors[0]["type"] == "string_type"

    def test_report_update_request_json_serialization(self):
        """Testa a serialização JSON do modelo"""
        request = ReportUpdateRequest(name="Test Report")
        json_data = request.model_dump()
        
        assert json_data == {"name": "Test Report"}

    def test_report_update_request_from_json(self):
        """Testa a criação do modelo a partir de JSON"""
        json_data = '{"name": "Test Report from JSON"}'
        request = ReportUpdateRequest.model_validate_json(json_data)
        
        assert request.name == "Test Report from JSON"
