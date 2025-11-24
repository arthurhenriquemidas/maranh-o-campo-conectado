@echo off
echo ========================================
echo   PLATAFORMA JURIDICA - PRIMENG
echo ========================================
echo.
echo Verificando dependências...

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js não encontrado!
    echo Por favor, instale Node.js 16+ em: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se Angular CLI está instalado
ng version >nul 2>&1
if errorlevel 1 (
    echo [AVISO] Angular CLI não encontrado. Instalando...
    npm install -g @angular/cli@14
    if errorlevel 1 (
        echo [ERRO] Falha ao instalar Angular CLI
        pause
        exit /b 1
    )
)

REM Verificar se node_modules existe
if not exist "node_modules" (
    echo Instalando dependências do projeto...
    npm install
    if errorlevel 1 (
        echo [ERRO] Falha ao instalar dependências
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo   INICIANDO SERVIDOR DE DESENVOLVIMENTO
echo ========================================
echo.
echo ✅ Node.js: OK
echo ✅ Angular CLI: OK  
echo ✅ Dependências: OK
echo.
echo 🚀 Iniciando em: http://localhost:5050
echo.
echo CREDENCIAIS DE TESTE:
echo ---------------------
echo 👤 CLIENTE:
echo    Email: joao.silva@email.com
echo    Senha: 123456
echo    Tipo: Cliente
echo.
echo ⚖️ ADVOGADO:
echo    Email: carlos.oliveira@adv.com
echo    Senha: 123456  
echo    Tipo: Advogado
echo.
echo 🛠️ ADMIN:
echo    Email: admin@plataforma.com
echo    Senha: 123456
echo    Tipo: Admin
echo.
echo ========================================
echo.

REM Iniciar servidor
npm run start

pause
