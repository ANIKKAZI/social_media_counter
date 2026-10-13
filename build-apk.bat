@echo off
setlocal

echo ================================================================
echo  Viral Counters - APK Builder
echo ================================================================
echo.

cd /d "%~dp0"

set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.12.1"
if not exist "%JAVA_HOME%\bin\java.exe" set "JAVA_HOME=C:\Program Files\Java\jdk-21"
if not exist "%JAVA_HOME%\bin\java.exe" (
    echo [!] Java 21 not found. Install JDK 21 and update JAVA_HOME at the top of this script.
    pause
    exit /b 1
)
echo Java:        %JAVA_HOME%

set "SDK=%LOCALAPPDATA%\Android\Sdk"
if not exist "%SDK%" (
    echo [!] Android SDK not found at %SDK%. Install Android Studio first.
    pause
    exit /b 1
)
echo Android SDK: %SDK%
echo.

set "SDK_ESCAPED=%SDK:\=\\%"
> android\local.properties echo sdk.dir=%SDK_ESCAPED%

echo [1/3] Building web app from .env ...
if exist build rmdir /s /q build
call npm run build
if errorlevel 1 goto :fail

echo [2/3] Syncing web app into the Android project ...
call npx cap sync android
if errorlevel 1 goto :fail

echo [3/3] Building and signing the APK ...
pushd android
call gradlew.bat clean assembleRelease
set "RESULT=%errorlevel%"
popd
if not "%RESULT%"=="0" goto :fail

copy /y android\app\build\outputs\apk\release\ViralCounters.apk ViralCounters.apk >nul
if errorlevel 1 goto :fail

echo.
echo ================================================================
echo  DONE:  %~dp0ViralCounters.apk
echo ================================================================
pause
exit /b 0

:fail
echo.
echo [!] Build failed - see the messages above.
pause
exit /b 1
