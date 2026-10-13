@echo off
setlocal enabledelayedexpansion

echo ================================================================
echo  Social Media Counter APK Builder
echo ================================================================
echo.

REM Set Java 21 path
set JAVA_21_PATH=C:\Program Files\Java\jdk-21
set JAVA_21_ALT=C:\Program Files\Java\jdk-21.0.1

REM Check if Java 21 exists
if exist "%JAVA_21_PATH%" (
    set JAVA_HOME=%JAVA_21_PATH%
    echo [✓] Found Java 21 at: %JAVA_HOME%
) else if exist "%JAVA_21_ALT%" (
    set JAVA_HOME=%JAVA_21_ALT%
    echo [✓] Found Java 21 at: %JAVA_HOME%
) else (
    echo [!] Java 21 not found at:
    echo     %JAVA_21_PATH%
    echo     %JAVA_21_ALT%
    echo.
    echo Please install Java 21 from:
    echo https://www.oracle.com/java/technologies/downloads/#java21
    echo.
    pause
    exit /b 1
)

REM Verify Java version
echo.
echo Verifying Java version...
"%JAVA_HOME%\bin\java" -version 2>&1 | findstr /R "21" >nul
if errorlevel 1 (
    echo [!] Java 21 verification failed
    "%JAVA_HOME%\bin\java" -version
    pause
    exit /b 1
)
echo [✓] Java 21 verified
echo.

REM Step 1: Build React app
echo ================================================================
echo [1/4] Building React app...
echo ================================================================
call npm run build
if errorlevel 1 (
    echo [!] React build failed
    pause
    exit /b 1
)
echo [✓] React build successful
echo.

REM Step 2: Sync with Android
echo ================================================================
echo [2/4] Syncing with Android...
echo ================================================================
call npx cap sync android
if errorlevel 1 (
    echo [!] Capacitor sync failed
    pause
    exit /b 1
)
echo [✓] Capacitor sync successful
echo.

REM Step 3: Build Release APK
echo ================================================================
echo [3/4] Building APK with Gradle...
echo ================================================================
cd android
set JAVA_HOME=%JAVA_HOME%
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo [!] Gradle build failed
    cd ..
    pause
    exit /b 1
)
cd ..
echo [✓] APK build successful
echo.

REM Step 4: Verify APK was created
echo ================================================================
echo [4/4] Verifying APK...
echo ================================================================
set APK_PATH=android\app\build\outputs\apk\release\app-release.apk
if exist "%APK_PATH%" (
    echo [✓] APK created successfully!
    echo.
    echo Location: %APK_PATH%
    echo.
    for /f "tokens=*" %%a in ('powershell -Command "(Get-Item '%APK_PATH%').length / 1MB"') do (
        echo Size: %%a MB
    )
    echo.
    echo Ready to deploy! Use:
    echo   adb install "%APK_PATH%"
    echo.
) else (
    echo [!] APK file not found
    echo Expected at: %APK_PATH%
    pause
    exit /b 1
)

echo ================================================================
echo  BUILD COMPLETE ✓
echo ================================================================
echo.
pause