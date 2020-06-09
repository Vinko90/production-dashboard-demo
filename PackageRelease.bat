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
CD ProductionDashboard
dotnet publish --runtime win-x64
echo.

echo ---- Packaging Release ----
echo.
SET "ReleaseFile=ProductionDashboard_%version%.zip"
CD ProductionDashboard.Web\bin\Debug\netcoreapp3.1\win-x64
DEL /Q "%ReleaseFile%"
7z a %ReleaseFile% ./publish/*