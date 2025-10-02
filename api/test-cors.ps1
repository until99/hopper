# Script para testar CORS no Render
# Salve como: test-cors.ps1
# Execute com: .\test-cors.ps1

Write-Host "`n🧪 Testando CORS da API Hopper no Render`n" -ForegroundColor Cyan

$apiUrl = "https://hopper-glyb.onrender.com/api/v1/auth/login"
$origin = "https://hopper-opal.vercel.app"

Write-Host "📍 API URL: $apiUrl" -ForegroundColor Yellow
Write-Host "🌐 Origin: $origin" -ForegroundColor Yellow
Write-Host "`nEnviando requisição OPTIONS (preflight)...`n" -ForegroundColor Gray

try {
    $headers = @{
        "Origin" = $origin
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "content-type"
    }
    
    $response = Invoke-WebRequest -Uri $apiUrl -Method OPTIONS -Headers $headers -UseBasicParsing -ErrorAction Stop
    
    Write-Host "✅ STATUS: $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "`n📋 Headers de CORS recebidos:`n" -ForegroundColor Cyan
    
    $corsHeaders = @(
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials", 
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Headers",
        "Access-Control-Expose-Headers"
    )
    
    foreach ($header in $corsHeaders) {
        $value = $response.Headers[$header]
        if ($value) {
            Write-Host "  ✅ $header : $value" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $header : (não presente)" -ForegroundColor Red
        }
    }
    
    Write-Host "`n🎉 CORS configurado corretamente!" -ForegroundColor Green
    Write-Host "   Seu frontend pode fazer requisições para a API.`n" -ForegroundColor Green
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "❌ STATUS: $statusCode" -ForegroundColor Red
    
    if ($statusCode -eq 400) {
        Write-Host "`n⚠️  ERRO 400 - Bad Request" -ForegroundColor Red
        Write-Host "`nIsso significa que o CORS ainda NÃO está configurado!" -ForegroundColor Yellow
        Write-Host "`n📝 SOLUÇÃO:" -ForegroundColor Cyan
        Write-Host "   1. Acesse: https://dashboard.render.com" -ForegroundColor White
        Write-Host "   2. Selecione o serviço 'hopper-glyb'" -ForegroundColor White
        Write-Host "   3. Vá em Environment > Add Environment Variable" -ForegroundColor White
        Write-Host "   4. Configure:" -ForegroundColor White
        Write-Host "      Key:   ALLOWED_ORIGINS" -ForegroundColor Yellow
        Write-Host "      Value: $origin" -ForegroundColor Yellow
        Write-Host "   5. Salve e aguarde o redeploy (30-60 segundos)" -ForegroundColor White
        Write-Host "   6. Execute este script novamente para testar`n" -ForegroundColor White
    } else {
        Write-Host "`nErro inesperado: $_" -ForegroundColor Red
    }
}

Write-Host "────────────────────────────────────────────────────" -ForegroundColor Gray
Write-Host "📚 Para mais informações, consulte:" -ForegroundColor Gray
Write-Host "   api/docs/URGENTE-CORS-FIX.md`n" -ForegroundColor Gray
