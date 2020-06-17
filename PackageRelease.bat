@REM Created by WarOfDevil - 09/06/2020
@REM
@REM The following script build and publish the .Net Core Application
@REM then package the output in a zip file that can be released on Github.

cls
@echo off

echo ---- Reading revision number ----
echo.
setlocal enableextensions disabledelayedexpansion
set "version="
for /f "tokens=3 delims=<>" %%a in (
	'find /i "<Version>" ^< "./ProductionDashboard/ProductionDashboard.Web/ProductionDashboard.Web.csproj"'
) do set "version=%%a"
echo Application Version = %version%
echo.

echo ---- Building Application ----
echo.
RMDIR /s /q ProductionDashboard\ProductionDashboard.Web\bin\Release
CD ProductionDashboard
dotnet publish -c Release
echo.

echo ---- Packaging Release ----
echo.
SET "ReleaseFile=ProductionDashboard_%version%.zip"
CD ProductionDashboard.Web\bin\Release\netcoreapp3.1\win-x64\publish
echo start chrome "http://localhost:5000" >> LaunchMe.bat
echo call ProductionDashboard.Web.exe >> LaunchMe.bat
CD ..
7z a %ReleaseFile% ./publish/*

pause