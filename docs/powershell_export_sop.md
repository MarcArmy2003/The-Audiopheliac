# 🎧 **SOP: Exporting Folder or Directory Contents to a File (PowerShell)**  
**Purpose:**  
Generate a text, playlist, or data file listing all items within a folder (and subfolders) — useful for cataloging, backups, media migrations, or upload tools (e.g., TuneMyMusic, Plex imports).

---

## ⚙️ **1. Basic Command Structure**

```powershell
Get-ChildItem -Path "<TargetFolder>" -Recurse -Include <FileType> |
    Select-Object -ExpandProperty FullName |
    Out-File -FilePath "<OutputFile>" -Encoding UTF8
```

### **Parameters**
| Parameter | Purpose |
|------------|----------|
| `<TargetFolder>` | The root folder to scan (e.g., `M:\Music`) |
| `<FileType>` | File pattern — e.g., `*.flac`, `*.mp3`, `*.jpg`, `*.*` |
| `<OutputFile>` | Where to save results — e.g., `M:\Library_Export.m3u` |

---

## 🎧 **2. Common Use-Cases**

### 🟢 **Export All FLAC Files to M3U Playlist**
```powershell
Get-ChildItem -Path "M:\Music" -Recurse -Include *.flac |
    Select-Object -ExpandProperty FullName |
    Out-File -FilePath "M:\FLAC_Library_Export.m3u" -Encoding UTF8
```

✅ Best for: Uploading to TuneMyMusic, Soundiiz, or verifying your FLAC catalog.

---

### 🟢 **Export All Files to a Plain Text List**
```powershell
Get-ChildItem -Path "D:\Projects" -Recurse |
    Select-Object -ExpandProperty FullName |
    Out-File -FilePath "D:\Project_File_List.txt" -Encoding UTF8
```

✅ Best for: Creating file inventories, audits, or documentation backups.

---

### 🟢 **Export All Images to a CSV**
```powershell
Get-ChildItem -Path "E:\Photos" -Recurse -Include *.jpg, *.png |
    Select-Object FullName, Length, LastWriteTime |
    Export-Csv -Path "E:\Photo_Inventory.csv" -NoTypeInformation -Encoding UTF8
```

✅ Best for: Tracking image sizes or modification dates.

---

### 🟢 **Export All Files to XML (Structured Library)**
```powershell
Get-ChildItem -Path "C:\Samples" -Recurse |
    Select-Object FullName |
    Export-Clixml -Path "C:\Sample_Library.xml"
```

✅ Best for: Sharing machine-readable exports with other PowerShell scripts.

---

## 🧩 **3. Optional Flags & Variations**

| Option | Function |
|--------|-----------|
| `-Recurse` | Includes all subfolders |
| `-File` | Limits results to files (excludes folders) |
| `-Directory` | Lists only subfolders |
| `-Filter "*.ext"` | Alternate to `-Include` (faster for single types) |
| `-ErrorAction SilentlyContinue` | Ignores access-denied errors |

Example:
```powershell
Get-ChildItem -Path "F:\Backups" -File -Recurse -ErrorAction SilentlyContinue |
    Out-File -FilePath "F:\Backup_FileList.txt" -Encoding UTF8
```

---

## 🧠 **4. Notes**
- Use **UTF8 encoding** for best compatibility with upload tools.  
- M3U files are just plain text — ideal for music and video playlists.  
- CSV and XML formats preserve structure for sorting or automation.  
- Keep this SOP as a quick-reference — swap file extensions and paths as needed.

---

**Version:** 1.0  
**Maintainer:** *The Audiopheliac*  
**Last Updated:** 12 Nov 2025  
**Purpose:** Unified PowerShell export procedure for media and file inventories  
