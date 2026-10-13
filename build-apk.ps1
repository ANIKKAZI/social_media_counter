#!/usr/bin/env pwsh
# Social Media Counter - Automated APK Builder
# PowerShell version with better error handling

$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  Social Media Counter APK Builder" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Java 21 paths
$Java21Paths = @(
    "C:\Program Files\Java\jdk-21",
    "C:\Program Files\Java\jdk-21.0.1"
)

# Find Java 21
Write-Host "Checking for Java 21..." -ForegroundColor Yellow
$JavaHome = $null
foreach ($path in $Java21Paths) {
    if (Test-Path $path) {
        $JavaHome = $path
        Write-Host "[✓] Found Java 21 at: $JavaHome" -ForegroundColor Green
        break
    }
}

if (-not $JavaHome) {
    Write-Host "[!] Java 21 not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Install from: https://www.oracle.com/java/technologies/downloads/#java21" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or via command line:" -ForegroundColor Yellow
    Write-Host "  winget install OracleJDK.JDK.21" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

# Set environment
$env:JAVA_HOME = $JavaHome
$env:PATH = "$JavaHome\bin;$env:PATH"

# Verify Java version
Write-Host "Verifying Java version..." -ForegroundColor Yellow
$javaVersion = & "$JavaHome\bin\java" -version 2>&1
if ($javaVersion -notmatch "21") {
    Write-Host "[!] Java 21 verification failed" -ForegroundColor Red
    Write-Host $javaVersion
    exit 1
}
Write-Host "[✓] Java 21 verified" -ForegroundColor Green
Write-Host ""

# Step 1: Build React app
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "[1/4] Building React app..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] React build failed" -ForegroundColor Red
    exit 1
}
Write-Host "[✓] React build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Sync with Android
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "[2/4] Syncing with Android..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Capacitor sync failed" -ForegroundColor Red
    exit 1
}
Write-Host "[✓] Capacitor sync successful" -ForegroundColor Green
Write-Host ""

# Step 3: Build APK
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "[3/4] Building APK with Gradle..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Push-Location android
& ".\gradlew.bat" assembleRelease
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Gradle build failed" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "[✓] APK build successful" -ForegroundColor Green
Write-Host ""

# Step 4: Verify APK
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "[4/4] Verifying APK..." -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
$apkPath = "android\app\build\outputs\apk\release\app-release.apk"
if (Test-Path $apkPath) {
    $apkSize = (Get-Item $apkPath).Length / 1MB
    Write-Host "[✓] APK created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Location: $apkPath" -ForegroundColor Cyan
    Write-Host "Size: $([math]::Round($apkSize, 2)) MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ready to deploy! Use:" -ForegroundColor Yellow
    Write-Host "  adb install `"$apkPath`"" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "[!] APK file not found" -ForegroundColor Red
    Write-Host "Expected at: $apkPath" -ForegroundColor Red
    exit 1
}

Write-Host "================================================================" -ForegroundColor Green
Write-Host "  BUILD COMPLETE ✓" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
