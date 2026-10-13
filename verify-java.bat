@echo off
echo ================================================================
echo  Java 21 Verification Tool
echo ================================================================
echo.

REM Check Java 21 paths
set JAVA_21_PATH=C:\Program Files\Java\jdk-21.0.12.1
set JAVA_21_ALT=C:\Program Files\Java\jdk-21

echo Checking for Java 21 installation...
echo.

if exist "%JAVA_21_PATH%" (
    echo [✓] Found Java 21 at: %JAVA_21_PATH%
    echo     Version:
    "%JAVA_21_PATH%\bin\java" -version
) else if exist "%JAVA_21_ALT%" (
    echo [✓] Found Java 21 at: %JAVA_21_ALT%
    echo     Version:
    "%JAVA_21_ALT%\bin\java" -version
) else (
    echo [!] Java 21 NOT found!
    echo.
    echo Install from: https://www.oracle.com/java/technologies/downloads/#java21
    echo.
    echo Or via command line:
    echo   winget install OracleJDK.JDK.21
    echo.
    pause
    exit /b 1
)

echo.
echo [✓] Java 21 is installed and ready to use
echo.
echo To use it automatically, build APK with:
echo   build-apk.bat
echo.
pause
