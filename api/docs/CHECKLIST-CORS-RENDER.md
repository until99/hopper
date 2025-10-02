# ✅ CHECKLIST: Configurar CORS no Render

## 🎯 Problema Identificado
- ❌ Erro 400 Bad Request no OPTIONS
- ❌ Origin: `https://hopper-opal.vercel.app` bloqueado
- ❌ API não aceita requisições do frontend Vercel

---

## 📋 PASSO A PASSO (5 minutos)

### ✅ 1. Acessar Render Dashboard
- [ ] Abrir navegador
- [ ] Ir para: https://dashboard.render.com
- [ ] Fazer login
- [ ] Localizar o serviço: **hopper-glyb**

### ✅ 2. Configurar Variável de Ambiente
- [ ] Clicar no serviço **hopper-glyb**
- [ ] No menu lateral, clicar em **Environment**
- [ ] Rolar até o final da página
- [ ] Clicar em **Add Environment Variable**
- [ ] Preencher:
  ```
  Key:   ALLOWED_ORIGINS
  Value: https://hopper-opal.vercel.app
  ```
- [ ] Clicar em **Save Changes**

### ✅ 3. Aguardar Redeploy Automático
- [ ] Aguardar 30-60 segundos
- [ ] Observar o status mudar para "Building..."
- [ ] Aguardar até o status voltar para "Live"

### ✅ 4. Verificar Logs (Opcional mas Recomendado)
- [ ] Clicar na aba **Logs**
- [ ] Procurar pela mensagem:
  ```
  CORS origins adicionais configuradas: ['https://hopper-opal.vercel.app']
  ```
- [ ] Confirmar que apareceu:
  ```
  CORS configurado para origins: [..., 'https://hopper-opal.vercel.app']
  ```

### ✅ 5. Testar no Frontend
- [ ] Abrir o frontend: https://hopper-opal.vercel.app
- [ ] Abrir DevTools (F12)
- [ ] Ir para aba **Network**
- [ ] Tentar fazer login
- [ ] Verificar que a requisição OPTIONS retorna **200 OK** (não 400)
- [ ] Verificar nos headers da resposta:
  ```
  access-control-allow-origin: https://hopper-opal.vercel.app
  ```

---

## 🧪 Teste Rápido via PowerShell (Opcional)

Execute no terminal:
```powershell
$headers = @{'Origin'='https://hopper-opal.vercel.app'; 'Access-Control-Request-Method'='POST'}
$response = Invoke-WebRequest -Uri 'https://hopper-glyb.onrender.com/api/v1/auth/login' -Method OPTIONS -Headers $headers -UseBasicParsing
Write-Host "Status: $($response.StatusCode) - $($response.StatusDescription)"
Write-Host "CORS: $($response.Headers['Access-Control-Allow-Origin'])"
```

**Resultado esperado após configurar:**
```
Status: 200 - OK
CORS: https://hopper-opal.vercel.app
```

---

## ❓ Troubleshooting

### "Ainda dá 400 depois de configurar"
✅ **Soluções:**
1. Verifique se não tem espaços extras no valor da variável
2. Confirme que o redeploy foi concluído (status "Live")
3. Limpe o cache do navegador (Ctrl+Shift+Del)
4. Force um novo deploy: Deploy > Manual Deploy > Deploy latest commit

### "Não vejo a mensagem nos logs"
✅ **Soluções:**
1. Aguarde mais 1-2 minutos (às vezes demora)
2. Force refresh dos logs (F5)
3. Verifique se a variável foi salva: Environment > procure por ALLOWED_ORIGINS

### "OPTIONS agora dá 200, mas POST dá 401"
✅ **Isso é normal!** 
- O CORS está funcionando ✅
- Erro 401 = problema de autenticação (credenciais)
- Verifique username/password no frontend

---

## 📸 Visual da Configuração

```
┌──────────────────────────────────────────────────────┐
│  Render Dashboard > hopper-glyb > Environment        │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Environment Variables                               │
│  ───────────────────────────────────────────────     │
│                                                      │
│  TENANT_ID          •••••••••••••                    │
│  CLIENT_ID          •••••••••••••                    │
│  CLIENT_SECRET      •••••••••••••                    │
│  JWT_SECRET         •••••••••••••                    │
│                                                      │
│  ⭐ ALLOWED_ORIGINS   https://hopper-opal.vercel.app │
│     ^^^^^ ADICIONE ESTA ^^^^^                        │
│                                                      │
│  [Add Environment Variable]  [Save Changes]          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 🎓 Por Que Isso é Necessário?

**CORS (Cross-Origin Resource Sharing)** é uma medida de segurança do navegador.

- 🌐 **Seu frontend**: `https://hopper-opal.vercel.app`
- 🔌 **Sua API**: `https://hopper-glyb.onrender.com`
- ⚠️ **Problema**: Domínios diferentes = "cross-origin"

O navegador BLOQUEIA requisições cross-origin por padrão, a menos que a API explicitamente permita.

**Como funciona:**
1. Browser envia OPTIONS (preflight) perguntando: "Posso fazer essa requisição?"
2. API responde: "Sim, se você for de `https://hopper-opal.vercel.app`"
3. Browser permite a requisição real (POST, GET, etc)

**Sem configurar ALLOWED_ORIGINS:**
- API não reconhece o origin
- Retorna 400 Bad Request
- Browser bloqueia tudo 🚫

**Com ALLOWED_ORIGINS configurado:**
- API reconhece o origin
- Retorna 200 OK com headers CORS
- Browser permite as requisições ✅

---

## 📚 Documentação Adicional

- **Guia completo**: [api/docs/URGENTE-CORS-FIX.md](URGENTE-CORS-FIX.md)
- **Deploy no Render**: [api/docs/deployment-render.md](deployment-render.md)
- **Exemplo de .env**: [api/.env.render.example](../.env.render.example)

---

## ✅ Quando Concluído

- [ ] CORS configurado no Render
- [ ] Login funcionando no frontend
- [ ] Sem mais erros 400 no console
- [ ] Celebrar! 🎉

**Tempo estimado:** 5 minutos
**Dificuldade:** ⭐☆☆☆☆ (muito fácil)

---

_Última atualização: 2 de outubro de 2025_
