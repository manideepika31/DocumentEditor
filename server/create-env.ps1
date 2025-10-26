$envContent = "MONGODB_URI=mongodb+srv://pedaprolusaipranav_db_user:faRzNXMiEd0zR86u@cluster0.4kbyw0g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host ".env file created successfully"
