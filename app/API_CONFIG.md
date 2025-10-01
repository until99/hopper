# 🔄 Configuração de API - Frontend

## URL Padrão

O frontend agora usa **automaticamente** a URL do backend em produção:

```
https://hopper-glyb.onrender.com
```

### Como funciona:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://hopper-glyb.onrender.com';
```

1. ✅ **Se `VITE_API_URL` está configurada**: Usa essa URL
2. ✅ **Se NÃO está configurada**: Usa `https://hopper-glyb.onrender.com` (produção)

## 🏠 Desenvolvimento Local

Se você quer rodar o backend localmente, crie um arquivo `.env.local`:

```bash
# .env.local
VITE_API_URL=http://localhost:8000
```

### Passos:

1. Copie o arquivo de exemplo:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edite `.env.local` e descomente:
   ```bash
   VITE_API_URL=http://localhost:8000
   ```

3. Inicie o backend local:
   ```bash
   cd ../api
   uv run uvicorn src.main:app --reload
   ```

4. Inicie o frontend:
   ```bash
   pnpm run dev
   ```

## 🌐 Produção (Vercel)

### Opção 1: Usar o padrão (Render)
Não precisa fazer nada! A URL do Render já está configurada como fallback.

### Opção 2: Usar outra URL
Configure no painel da Vercel:

1. Acesse: https://vercel.com/dashboard → Seu Projeto
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   ```
   VITE_API_URL=https://sua-api-customizada.com
   ```

## 📁 Arquivos Modificados

- ✅ `src/services/AuthApi.ts`
- ✅ `src/services/DashboardApi.ts`
- ✅ `src/services/CategoryApi.ts`
- ✅ `src/services/Dashboards.ts`
- ✅ `src/lib/authInterceptor.ts`

Todos agora usam `https://hopper-glyb.onrender.com` como fallback.

## ⚠️ Importante

### Para CORS funcionar:

O backend precisa ter a URL do frontend configurada no `.env`:

```bash
# No backend (Render)
FRONTEND_URL=https://seu-app.vercel.app
```

### Render Free Tier:

- 🔴 O backend "dorme" após 15 minutos de inatividade
- ⏱️ Primeira requisição pode demorar ~30 segundos
- 💡 **Solução**: A aplicação mostra loading enquanto aguarda

---

**Última atualização**: 01/10/2025
