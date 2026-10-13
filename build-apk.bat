@echo off
setlocal enabledelayedexpansion

echo ================================================================
echo  Social Media Counter APK Builder
echo ================================================================
echo.

REM Set Java 21 path
set JAVA_21_PATH=C:\Program Files\Java\jdk-21.0.12.1
set JAVA_21_ALT=C:\Program Files\Java\jdk-21

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
"%JAVA_HOME%\bin\java" -version 2>&1 | findstr /I "21" >nul
if errorlevel 1 (
    echo [!] Java version verification failed
    echo.
    echo Java version found:
    "%JAVA_HOME%\bin\java" -version
    echo.
    echo Using Java at: %JAVA_HOME%
)
echo [✓] Java configured at: %JAVA_HOME%
echo.

REM Check for Android SDK
echo Checking for Android SDK...
set ANDROID_SDK_PATH=%USERPROFILE%\AppData\Local\Android\Sdk

if not exist "%ANDROID_SDK_PATH%" (
    echo [!] Android SDK not found!
    echo.
    echo Android SDK is required to build APK.
    echo.
    echo To fix this:
    echo 1. Download Android Studio from:
    echo    https://developer.android.com/studio
    echo.
    echo 2. Install it (default location works)
    echo.
    echo 3. Then run this script again:
    echo    build-apk.bat
    echo.
    pause
    exit /b 1
)

echo [✓] Found Android SDK at: %ANDROID_SDK_PATH%
echo.

REM Create/update local.properties with Android SDK path
set LOCAL_PROPS=android\local.properties
echo Creating local.properties with Android SDK path...
REM Escape backslashes for Gradle properties file
setlocal enabledelayedexpansion
set ESCAPED_SDK_PATH=!ANDROID_SDK_PATH:\=\\!
(
    echo sdk.dir=!ESCAPED_SDK_PATH!
) > "%LOCAL_PROPS%"
endlocal
echo [✓] local.properties created
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
set ANDROID_SDK_ROOT=%ANDROID_SDK_PATH%
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

REM Step 4: Sign APK
echo ================================================================
echo [4/5] Signing APK...
echo ================================================================
set KEYSTORE_PATH=android\app\release-key.jks
set UNSIGNED_APK=android\app\build\outputs\apk\release\app-release-unsigned.apk
set JAVA_TOOLS=%JAVA_21_PATH%\bin

REM Check if keystore exists, if not create it
if not exist "%KEYSTORE_PATH%" (
    echo Creating signing keystore...
    "%JAVA_TOOLS%\keytool.exe" -genkey -v -keystore "%KEYSTORE_PATH%" ^
        -keyalg RSA -keysize 2048 -validity 10000 ^
        -alias social-media-counter ^
        -dname "CN=Social Media Counter, OU=Development, O=SocialMediaCounter, L=Global, S=Global, C=US" ^
        -storepass "socialmediacounter123" ^
        -keypass "socialmediacounter123"
    if errorlevel 1 (
        echo [!] Failed to create keystore
        pause
        exit /b 1
    )
    echo [✓] Keystore created
)

REM Sign the APK
echo Signing %UNSIGNED_APK%...
"%JAVA_TOOLS%\jarsigner.exe" -verbose -sigalg SHA256withRSA -digestalg SHA-256 ^
    -keystore "%KEYSTORE_PATH%" -storepass "socialmediacounter123" ^
    "%UNSIGNED_APK%" social-media-counter
if errorlevel 1 (
    echo [!] Failed to sign APK
    pause
    exit /b 1
)
echo [✓] APK signed successfully
echo.

REM Step 5: Verify APK was created
echo ================================================================
echo [5/5] Verifying APK...
echo ================================================================
set APK_PATH=android\app\build\outputs\apk\release\app-release-unsigned.apk
if exist "%APK_PATH%" (
    echo [✓] APK created and signed successfully!
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