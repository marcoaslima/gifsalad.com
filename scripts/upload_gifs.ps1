param (
    [Parameter(Mandatory=$false)]
    [string]$Folder = ".\",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:4000/gifs",

    [Parameter(Mandatory=$false)]
    [int]$DefaultWidth = 500,

    [Parameter(Mandatory=$false)]
    [int]$DefaultHeight = 500
)

# Load System.Net.Http assembly
Add-Type -AssemblyName System.Net.Http

$Folder = Resolve-Path $Folder
Write-Host "Looking for .webp files in $Folder" -ForegroundColor Cyan

$files = Get-ChildItem -Path $Folder -Filter "*.webp"

if ($files.Count -eq 0) {
    Write-Host "No .webp files found." -ForegroundColor Yellow
    exit
}

Write-Host "Found $($files.Count) files. Starting upload..." -ForegroundColor Cyan

foreach ($file in $files) {
    $fileName = $file.Name
    $filePath = $file.FullName
    $title = $file.BaseName
    
    Write-Host "Uploading $fileName..." -NoNewline

    try {
        $client = New-Object System.Net.Http.HttpClient
        $content = New-Object System.Net.Http.MultipartFormDataContent
        
        # Add text fields
        $content.Add((New-Object System.Net.Http.StringContent $title), "title")
        $content.Add((New-Object System.Net.Http.StringContent "uploaded-via-script"), "tags")
        $content.Add((New-Object System.Net.Http.StringContent $DefaultWidth.ToString()), "width")
        $content.Add((New-Object System.Net.Http.StringContent $DefaultHeight.ToString()), "height")
        $content.Add((New-Object System.Net.Http.StringContent "false"), "isAdult")
        $content.Add((New-Object System.Net.Http.StringContent $fileName), "originalId")

        # Add file content
        $fileStream = [System.IO.File]::OpenRead($filePath)
        $fileContent = New-Object System.Net.Http.StreamContent($fileStream)
        $fileContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("image/webp")
        $content.Add($fileContent, "file", $fileName)

        # Send request
        $result = $client.PostAsync($ApiUrl, $content).Result
        
        $fileStream.Close()
        $client.Dispose()

        if ($result.IsSuccessStatusCode) {
            Write-Host " [OK]" -ForegroundColor Green
        } else {
            $responseBody = $result.Content.ReadAsStringAsync().Result
            Write-Host " [FAILED] Status: $($result.StatusCode) - $responseBody" -ForegroundColor Red
        }
    }
    catch {
        Write-Host " [ERROR] $_" -ForegroundColor Red
    }
}

Write-Host "Done!" -ForegroundColor Cyan
