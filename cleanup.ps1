$path = "c:\Users\talit\Downloads\lumiphoto-ia\App.tsx"
$lines = Get-Content $path
$startIdx = -1
$endIdx = -1
for ($i=0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Trim() -eq "}, [editingImage]);") { 
        $startIdx = $i 
        Write-Host "Found Start at $i"
    }
    if ($lines[$i].Trim() -eq "const handleGenerate = async () => {") { 
        $endIdx = $i 
        Write-Host "Found End at $i"
    }
}

if ($startIdx -ne -1 -and $endIdx -ne -1 -and $endIdx -gt $startIdx) {
    $p1 = $lines[0..$startIdx]
    $mid = @("", "")
    $p2 = $lines[$endIdx..($lines.Count-1)]
    $newLines = $p1 + $mid + $p2
    $newLines | Set-Content $path -Encoding UTF8
    Write-Host "File updated successfully."
} else {
    Write-Host "Markers logic failed. Start: $startIdx, End: $endIdx"
    exit 1
}
