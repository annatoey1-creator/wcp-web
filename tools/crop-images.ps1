# Crops website images out of the source slides in C:\projects\inbox\picture
# and writes them to assets/images/<group>/<name>.jpg.
# The source files are only read, never modified.
#
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File tools\crop-images.ps1

param(
  [string]$Src = 'C:\projects\inbox\picture',
  [string]$Out = (Join-Path $PSScriptRoot '..\public\images')
)
Add-Type -AssemblyName System.Drawing

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 85L

function Save-Jpeg($bmp, $relPath) {
  $path = Join-Path $Out $relPath
  New-Item -ItemType Directory -Force (Split-Path $path) | Out-Null
  $bmp.Save($path, $codec, $params)
}

# output path, source file, x, y, width, height, max output width
$jobs = @(
  @('brand/logo-mark.jpg',      'logo.jpg', 250, 185, 480, 490, 240),
  @('brand/logo-full.jpg',      'logo.jpg', 120, 170, 720, 620, 480),
  @('brand/line-qr.jpg',        'line.jpg',   0,   0, 574, 574, 574),

  @('factory/film-roll.jpg',    '1.png',   1105, 205, 510, 510, 900),
  @('factory/production-line.jpg','3.png', 1290,   0, 630,1080, 900),
  @('factory/pellets.jpg',      '3.png',    945, 725, 290, 290, 400),
  @('factory/thickness-gauge.jpg','8.png',  765, 750, 240, 240, 400),

  @('gallery/packed-1.jpg',     '2.png',    120, 484, 506, 370, 700),
  @('gallery/packed-2.jpg',     '2.png',    707, 484, 506, 370, 700),
  @('gallery/packed-3.jpg',     '2.png',   1294, 484, 506, 370, 700),
  @('gallery/event-1.jpg',      '9.png',    925,  28, 970, 644, 1000),
  @('gallery/event-2.jpg',      '9.png',    925, 707, 460, 343, 600),
  @('gallery/event-3.jpg',      '9.png',   1410, 707, 485, 343, 600),

  @('products/white.jpg',       '4.png',     98, 245, 336, 210, 500),
  @('products/red.jpg',         '4.png',    444, 245, 333, 210, 500),
  @('products/yellow.jpg',      '4.png',    787, 245, 336, 210, 500),
  @('products/red-print.jpg',   '4.png',   1145, 245, 335, 225, 500),
  @('products/hdpe-roll.jpg',   '4.png',   1490, 245, 327, 225, 500),
  @('products/green.jpg',       '4.png',     98, 600, 336, 215, 500),
  @('products/blue.jpg',        '4.png',    444, 600, 333, 215, 500),
  @('products/black.jpg',       '4.png',    787, 600, 336, 215, 500),
  @('products/latex.jpg',       '4.png',   1145, 600, 335, 225, 500),
  @('products/box-liner.jpg',   '4.png',   1490, 600, 327, 225, 500),
  @('products/handle-thin.jpg', '5.png',    110, 250, 440, 360, 500),
  @('products/black-thin.jpg',  '5.png',    660, 250, 480, 370, 500),
  @('products/handle-thick.jpg','5.png',   1300, 250, 450, 360, 500),
  @('products/ga-thin.jpg',     '6.png',    380, 225, 465, 240, 560),
  @('products/ga-thick.jpg',    '6.png',   1120, 220, 480, 245, 560),
  @('products/cold.jpg',        '6.png',    385, 595, 455, 210, 560),
  @('products/pp.jpg',          '6.png',   1060, 600, 520, 195, 560),

  @('oem/labels.jpg',           '7.png',   1215,   0, 705,1080, 700),
  @('oem/basic.jpg',            '10.png',   165, 745, 278, 315, 400),
  @('oem/standard.jpg',         '10.png',   605, 730, 258, 330, 400),
  @('oem/premium.jpg',          '10.png',  1025, 768, 330, 285, 400),
  @('oem/professional.jpg',     '10.png',  1483, 795, 310, 260, 400)
)

foreach ($j in $jobs) {
  $img = [System.Drawing.Image]::FromFile((Join-Path $Src $j[1]))
  $w = [int]$j[4]; $h = [int]$j[5]; $max = [int]$j[6]
  $scale = [Math]::Min(1.0, $max / $w)
  $ow = [int]($w * $scale); $oh = [int]($h * $scale)
  $bmp = New-Object System.Drawing.Bitmap $ow, $oh
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $ow, $oh), (New-Object System.Drawing.Rectangle $j[2], $j[3], $w, $h), 'Pixel')
  Save-Jpeg $bmp $j[0]
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

# menu.png is a finished graphic: resize only
$img = [System.Drawing.Image]::FromFile((Join-Path $Src 'menu.png'))
$bmp = New-Object System.Drawing.Bitmap 700, 980
$g = [System.Drawing.Graphics]::FromImage($bmp); $g.InterpolationMode = 'HighQualityBicubic'
$g.DrawImage($img, 0, 0, 700, 980)
Save-Jpeg $bmp 'products/bestseller.jpg'
$g.Dispose(); $bmp.Dispose(); $img.Dispose()

# ครอปภาพโรงงานจากสไลด์ให้เป็นภาพสี่เหลี่ยม (ไม่มีขอบวงกลม) ใช้ในหน้าแรก
$wide = @(
  @('factory/film-roll-wide.jpg',       '1.png', 1156, 307, 408, 306, 600),
  @('factory/thickness-gauge-wide.jpg', '8.png',  789, 798, 192, 144, 400)
)
foreach ($j in $wide) {
  $img = [System.Drawing.Image]::FromFile((Join-Path $Src $j[1]))
  $w = [int]$j[4]; $h = [int]$j[5]; $scale = [Math]::Min(1.0, [int]$j[6] / $w)
  $bmp = New-Object System.Drawing.Bitmap ([int]($w * $scale)), ([int]($h * $scale))
  $g = [System.Drawing.Graphics]::FromImage($bmp); $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, (New-Object System.Drawing.Rectangle 0, 0, $bmp.Width, $bmp.Height), (New-Object System.Drawing.Rectangle $j[2], $j[3], $w, $h), 'Pixel')
  Save-Jpeg $bmp $j[0]
  $g.Dispose(); $bmp.Dispose(); $img.Dispose()
}

# ภาพสินค้าแบรนด์ SUMO อยู่ในไฟล์ zip อ่านจาก zip ตรงๆ ไม่แตกไฟล์ลง inbox
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sumo = @(
  # output path, zip file, entry, output size (square)
  @('sumo/heavy.jpg',  'รูปภาพถุงขยะดำ sumo.zip', '1.png', 600),
  @('sumo/color.jpg',  'ถุงขยะสีต่างๆ.zip',        '1.png', 600),
  @('sumo/roll.jpg',   'ถุงขยะม้วนดำ.zip',         '1.png', 600),
  @('sumo/handle.jpg', 'ถุงขยะดำหูหิ้ว.zip',       '1.png', 600)
)
foreach ($j in $sumo) {
  $zip = [System.IO.Compression.ZipFile]::OpenRead((Join-Path $Src $j[1]))
  $stream = ($zip.Entries | Where-Object { $_.FullName -eq $j[2] }).Open()
  $img = [System.Drawing.Image]::FromStream($stream)
  $size = [int]$j[3]
  $bmp = New-Object System.Drawing.Bitmap $size, $size
  $g = [System.Drawing.Graphics]::FromImage($bmp); $g.InterpolationMode = 'HighQualityBicubic'
  $g.DrawImage($img, 0, 0, $size, $size)
  Save-Jpeg $bmp $j[0]
  $g.Dispose(); $bmp.Dispose(); $img.Dispose(); $stream.Dispose(); $zip.Dispose()
}

Get-ChildItem $Out -Recurse -File | Measure-Object Length -Sum | ForEach-Object { "{0} files, {1:N0} KB" -f $_.Count, ($_.Sum / 1KB) }
