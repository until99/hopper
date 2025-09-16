# Sistema de Cache para Dashboards

## Funcionalidades Implementadas

### 1. Cache no localStorage
- Os dashboards são automaticamente salvos no localStorage após serem buscados da API
- Cache tem expiração de 30 minutos para garantir dados atualizados
- Dados são carregados do cache primeiro (se válido) para melhor performance

### 2. Carregamento Inteligente
- **Primera carga**: Verifica cache válido → se existe, carrega do cache → senão busca da API
- **Atualização de página**: Carrega automaticamente do cache (se válido)
- **Cache expirado**: Remove automaticamente e busca da API

### 3. Refresh Forçado
- Botão "Refresh" limpa o cache e força busca na API
- Atualiza o cache com os novos dados
- Cooldown de 60 segundos para evitar spam de requests

### 4. Logs de Debug
- Console logs informativos sobre operações de cache
- Monitoramento de validade e idade do cache
- Transparência sobre origem dos dados (cache vs API)

## Arquivos Modificados

### `src/utils/dashboardCache.ts` (NOVO)
Utilitário completo para gerenciamento do cache:
- `saveDashboardsToCache()`: Salva dados no localStorage
- `getDashboardsFromCache()`: Recupera dados do localStorage  
- `isCacheValid()`: Verifica se cache não expirou
- `getValidCachedDashboards()`: Busca cache válido ou retorna null
- `forceRefreshDashboards()`: Limpa cache para forçar API call
- `clearDashboardsCache()`: Remove dados do localStorage

### `src/hooks/useDashboards.ts` (MODIFICADO)
Hook atualizado com funcionalidades de cache:
- Parâmetro `forceApiCall` para controlar origem dos dados
- Cache-first loading strategy
- Função `forceRefresh()` exportada
- Todas as operações (delete, assign category) atualizam o cache

### `src/routes/app/admin/dashboard/index.tsx` (MODIFICADO)
Componente da página usando novo sistema:
- Função `handleRefresh()` usa `forceRefresh()`
- Carregamento automático do cache na primeira visita
- Interface sem alterações para o usuário

## Como Funciona

### Fluxo Normal (Cache Hit)
1. Usuário acessa a página
2. Hook verifica cache válido no localStorage
3. Se existe e não expirou → carrega instantaneamente
4. Não faz request para API

### Fluxo Cache Miss
1. Usuário acessa a página
2. Cache não existe ou expirou
3. Faz request para API (PowerBI + categorias)
4. Salva resultado no localStorage
5. Renderiza dados

### Fluxo Refresh Manual
1. Usuário clica no botão "Refresh"
2. Cache é limpo
3. Force API call é executado
4. Novos dados salvos no cache
5. Cooldown de 60s ativado

## Benefícios

- ⚡ **Performance**: Carregamento instantâneo com cache
- 🔄 **Sincronização**: Refresh manual força dados atualizados  
- 💾 **Persistência**: Dados mantidos entre sessões/reloads
- 🧹 **Auto-limpeza**: Cache expirado é removido automaticamente
- 📊 **Observabilidade**: Logs claros sobre operações de cache

## Configuração

O cache é configurado com:
- **Chave**: `hopper_dashboards_cache`
- **Expiração**: 30 minutos (pode ser ajustada)
- **Estrutura**: `{ data: Dashboard[], timestamp: number }`

Para alterar o tempo de expiração, modifique `CACHE_EXPIRY_TIME` em `dashboardCache.ts`.