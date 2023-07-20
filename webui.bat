@echo off

if not defined PYTHON (set PYTHON=python)
if not defined PIP (set PIP=%PYTHON% -m pip)
if not defined NODEJS (set NODEJS=node)
if not defined NPM (set NPM=npm)
if not defined VENV_DIR (set "VENV_DIR=%~dp0%venv")

set ERROR_REPORTING=FALSE

mkdir tmp 2>NUL

@REM 判断 Node.js 是否已经安装
@REM :check_nodejs
where node >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0  goto :check_npm
echo Couldn't launch nodejs
goto :show_stdout_stderr

@REM 判断 npm 是否已经安装
:check_npm
where npm >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0 goto :check_python
echo Couldn't install npm
goto :show_stdout_stderr

@REM 判断 python 是否已经安装
:check_python
%PYTHON% -c "" >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0 goto :check_pip
echo Couldn't launch python
goto :show_stdout_stderr

@REM 判断 pip 是否已经安装
:check_pip
%PIP% --help >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0 goto :start_venv
if "%PIP_INSTALLER_LOCATION%" == "" goto :show_stdout_stderr
%PYTHON% "%PIP_INSTALLER_LOCATION%" >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0 goto :start_venv
echo Couldn't install pip
goto :show_stdout_stderr

:start_venv
if ["%VENV_DIR%"] == ["-"] goto :skip_venv
if ["%SKIP_VENV%"] == ["1"] goto :skip_venv

dir "%VENV_DIR%\Scripts\Python.exe" >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0 goto :activate_venv

for /f "delims=" %%i in ('CALL %PYTHON% -c "import sys; print(sys.executable)"') do set PYTHON_FULLNAME="%%i"
echo Creating venv in directory %VENV_DIR% using python %PYTHON_FULLNAME%
%PYTHON_FULLNAME% -m venv "%VENV_DIR%" >tmp/stdout.txt 2>tmp/stderr.txt
if %ERRORLEVEL% == 0 goto :activate_venv
echo Unable to create venv in directory "%VENV_DIR%"
goto :show_stdout_stderr

:activate_venv
set PYTHON="%VENV_DIR%\Scripts\Python.exe"
echo venv %PYTHON%

:skip_venv
if [%ACCELERATE%] == ["True"] goto :accelerate
goto :launch

:launch
echo launch
call %PYTHON% ./env_check.py
cd ./web
call %NPM% install
call %NPM% run build
cd ..
call %PYTHON% web\hcpdiff-server\main.py
goto :endofscript

:show_stdout_stderr

echo.
echo exit code: %errorlevel%

for /f %%i in ("tmp\stdout.txt") do set size=%%~zi
if %size% equ 0 goto :show_stderr
echo.
echo stdout:
type tmp\stdout.txt

:show_stderr
for /f %%i in ("tmp\stderr.txt") do set size=%%~zi
if %size% equ 0 goto :show_stderr
echo.
echo stderr:
type tmp\stderr.txt

:endofscript

echo.
echo Launch unsuccessful. Exiting.
pause
