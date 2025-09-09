"""
Exemplo prático demonstrando como os modelos Pydantic do PowerBI
ignoram campos extras vindos da API.

Este exemplo simula respostas reais da API do PowerBI com campos extras
que não estão definidos nos nossos modelos.
"""

from src.models.powerbi import GroupsResponse, ReportsResponse


def exemplo_resposta_api_grupo():
    """Simula uma resposta real da API do PowerBI para grupos"""
    # Exemplo de resposta da API do PowerBI com campos extras
    api_response = {
        "value": [
            {
                "id": "f089354e-8366-4e18-aea3-4cb4a3a50b48",
                "name": "Sample Group 001",
                "description": "Grupo de exemplo para demonstração",
                "isOnDedicatedCapacity": False,
                # Campos extras que vêm da API real mas não precisamos
                "type": "Workspace",
                "state": "Active",
                "isReadOnly": False,
                "capacityId": "0FC313FE-090C-4B01-8197-E87875F959BA",
                "defaultDatasetStorageFormat": "Small",
                "users": [
                    {
                        "emailAddress": "john@contoso.com",
                        "groupUserAccessRight": "Admin",
                        "displayName": "John Nick",
                        "identifier": "john@contoso.com",
                        "principalType": "User"
                    }
                ]
            }
        ]
    }
    
    # Criar objeto usando o modelo - campos extras serão ignorados
    groups_response = GroupsResponse(**api_response)
    
    # Validações silenciosas
    assert len(groups_response.value) == 1
    group = groups_response.value[0]
    assert group.id == "f089354e-8366-4e18-aea3-4cb4a3a50b48"
    assert group.name == "Sample Group 001"
    assert not hasattr(group, 'type')  # Campo extra ignorado
    assert not hasattr(group, 'users')  # Campo extra ignorado
    
    return groups_response


def exemplo_resposta_api_report():
    """Simula uma resposta real da API do PowerBI para reports"""
    # Exemplo de resposta da API do PowerBI com campos extras
    api_response = {
        "value": [
            {
                "id": "5b218778-e7a5-4d73-8187-f10824047715",
                "name": "SalesMarketing",
                "datasetId": "cfafbeb1-8037-4d0c-896e-a46fb27ff229",
                "webUrl": "https://app.powerbi.com/groups/f089354e-8366-4e18-aea3-4cb4a3a50b48/reports/5b218778-e7a5-4d73-8187-f10824047715",
                "embedUrl": "https://app.powerbi.com/reportEmbed?reportId=5b218778-e7a5-4d73-8187-f10824047715&groupId=f089354e-8366-4e18-aea3-4cb4a3a50b48",
                "isFromPbix": True,
                "isOwnedByMe": True,
                # Campos extras da API real
                "reportType": "PowerBIReport",
                "modifiedBy": "john@contoso.com",
                "modifiedDateTime": "2017-06-12T10:55:07.877Z",
                "createdDateTime": "2017-06-12T10:55:07.877Z",
                "appId": "3d9b93c6-7b6d-4801-a491-1738910904fd",
                "subscriptions": [],
                "users": [
                    {
                        "emailAddress": "john@contoso.com",
                        "reportUserAccessRight": "Owner",
                        "displayName": "John Nick",
                        "identifier": "john@contoso.com",
                        "principalType": "User"
                    }
                ]
            }
        ]
    }
    
    # Criar objeto usando o modelo - campos extras serão ignorados
    reports_response = ReportsResponse(**api_response)
    
    # Validações silenciosas
    assert len(reports_response.value) == 1
    report = reports_response.value[0]
    assert report.id == "5b218778-e7a5-4d73-8187-f10824047715"
    assert report.name == "SalesMarketing"
    assert not hasattr(report, 'reportType')  # Campo extra ignorado
    assert not hasattr(report, 'users')  # Campo extra ignorado
    assert not hasattr(report, 'subscriptions')  # Campo extra ignorado
    
    return reports_response


if __name__ == "__main__":
    # Executa os exemplos silenciosamente
    try:
        groups = exemplo_resposta_api_grupo()
        reports = exemplo_resposta_api_report()
        print("✅ Teste: exemplo_resposta_api_grupo - PASSOU")
        print("✅ Teste: exemplo_resposta_api_report - PASSOU") 
        print("✅ Todos os campos extras da API foram ignorados com sucesso!")
    except Exception as e:
        print(f"❌ Erro nos testes: {e}")
