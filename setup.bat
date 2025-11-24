@echo off
echo ========================================
echo   SETUP - Plataforma Juridica PrimeNG
echo ========================================
echo.

echo 1. Verificando Node.js...
node --version
if errorlevel 1 (
    echo ERRO: Node.js nao encontrado. Instale o Node.js primeiro.
    pause
    exit /b 1
)

echo.
echo 2. Verificando npm...
npm --version
if errorlevel 1 (
    echo ERRO: npm nao encontrado.
    pause
    exit /b 1
)

echo.
echo 3. Limpando cache e instalando dependencias...
npm cache clean --force
npm install

echo.
echo 4. Verificando Angular CLI...
npx ng version

echo.
echo ========================================
echo   SETUP CONCLUIDO!
echo ========================================
echo.
echo Para iniciar o projeto:
echo   npm start
echo.
echo Acesse: http://localhost:4200
echo.
pause
