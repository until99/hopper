# 🚨 CORREÇÃO URGENTE: Erro 400 no OPTIONS (CORS)

## Problema Atual

```
Request URL: https://hopper-glyb.onrender.com/api/v1/auth/login
Request Method: OPTIONS
Status Code: 400 Bad Request
Origin: https://hopper-opal.vercel.app
```

## Causa

A API no Render não está permitindo requisições do seu frontend em `https://hopper-opal.vercel.app` porque essa origem não está configurada no CORS.

## ✅ Solução (2 minutos)

### Passo 1: Acessar o Render Dashboard

1. Acesse: https://dashboard.render.com
2. Selecione o serviço `hopper-glyb`

### Passo 2: Configurar Variável de Ambiente

1. Clique na aba **"Environment"** (menu lateral esquerdo)
2. Clique em **"Add Environment Variable"**
3. Configure:
   ```
   Key:   ALLOWED_ORIGINS
   Value: https://hopper-opal.vercel.app
   ```
4. Clique em **"Save Changes"**

### Passo 3: Aguardar Redeploy

- O Render vai automaticamente fazer redeploy (30-60 segundos)
- Aguarde até o status ficar "Live" novamente

### Passo 4: Testar

Abra o seu frontend e tente fazer login. O erro 400 deve desaparecer!

---

## 📋 Verificação dos Logs

Após o redeploy, verifique os logs no Render. Você deve ver:

```
CORS origins adicionais configuradas: ['https://hopper-opal.vercel.app']
CORS configurado para origins: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://127.0.0.1:3000', 'https://hopper-opal.vercel.app']
```

---

## 🧪 Teste Manual (Opcional)

Você pode testar com curl:

```bash
curl -X OPTIONS https://hopper-glyb.onrender.com/api/v1/auth/login \
  -H "Origin: https://hopper-opal.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type" \
  -v
```

**Resposta esperada:**
```
< HTTP/2 200 
< access-control-allow-origin: https://hopper-opal.vercel.app
< access-control-allow-credentials: true
< access-control-allow-methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
< access-control-allow-headers: *
```

---

## ❓ Se Você Tem Múltiplos Domínios

Se você tem staging, produção, etc, separe por vírgula:

```
ALLOWED_ORIGINS=https://hopper-opal.vercel.app,https://hopper-staging.vercel.app,https://www.seudominio.com
```

---

## 🔒 Importante: Segurança

- ✅ **Correto**: Lista específica de domínios (como estamos fazendo)
- ❌ **ERRADO**: Usar `*` (wildcard) com `allow_credentials=True`
- ✅ Sempre use HTTPS em produção
- ✅ Nunca commite o arquivo `.env` com valores reais

---

## 📸 Screenshot da Configuração no Render

```
┌─────────────────────────────────────────────────────────┐
│ Environment Variables                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Key: ALLOWED_ORIGINS                                    │
│ Value: https://hopper-opal.vercel.app                   │
│                                                         │
│ [Add Environment Variable]  [Save Changes]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Configuração

- [ ] Acessei o Render Dashboard
- [ ] Selecionei o serviço `hopper-glyb`
- [ ] Adicionei a variável `ALLOWED_ORIGINS`
- [ ] Valor configurado: `https://hopper-opal.vercel.app`
- [ ] Salvei as alterações
- [ ] Aguardei o redeploy completar
- [ ] Testei o login no frontend
- [ ] Verifiquei que não há mais erro 400

---

## 🆘 Troubleshooting

### "Ainda está dando 400 depois de configurar"

1. Verifique se salvou a variável corretamente (sem espaços extras)
2. Confirme que o redeploy foi concluído
3. Limpe o cache do browser (Ctrl+Shift+Del)
4. Verifique os logs do Render para confirmar que a variável foi carregada

### "Não vejo a mensagem nos logs"

- Procure por "CORS origins adicionais" ou "CORS configurado"
- Se não aparecer, a variável pode não ter sido carregada
- Tente fazer um redeploy manual

### "O OPTIONS retorna 200, mas o POST dá erro"

- Isso é outro problema (não é CORS)
- Verifique se as credenciais estão corretas
- Cheque os logs da API para erros de autenticação

---

## 📚 Referências

- Documentação do código: `api/docs/deployment-render.md`
- Arquivo de exemplo: `api/.env.render.example`
- Configuração CORS: `api/src/main.py` (linhas 75-102)
