$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$localAddress = Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp |
    Where-Object {
        $_.IPAddress -notlike '127.*' -and
        $_.IPAddress -notlike '169.254.*' -and
        $_.IPAddress -notlike '172.17.*'
    } |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $localAddress) {
    throw 'Impossible de déterminer automatiquement l''adresse IPv4 locale du PC.'
}

Write-Host "URL réseau prévue : http://$localAddress`:5000"
Write-Host 'Lancement du conteneur. Arrêt avec Ctrl+C.'

docker run --rm -it `
    --name parachess-mobile-test `
    -p 5000:5000 `
    -e HOST=0.0.0.0 `
    -e PORT=5000 `
    -e "ADVERTISED_HOST=$localAddress" `
    parachess-mobile-test