const { execFileSync } = require('child_process')
const fs = require('fs')
const os = require('os')
const path = require('path')

const root = path.join(__dirname, '..')
const exe = path.join(root, 'release', 'win-ia32-unpacked', 'FayedResort.exe')
const desktop = path.join(os.homedir(), 'Desktop')
const arabicName = '\u0641\u0627\u064a\u062f \u0631\u064a\u0632\u0648\u0631\u062a.lnk'
const tempName = 'Fayed Resort.lnk'

if (!fs.existsSync(exe)) {
  console.error('FayedResort.exe is missing. Build the app first.')
  process.exit(1)
}

function createShortcut(linkPath) {
  fs.mkdirSync(path.dirname(linkPath), { recursive: true })
  const scriptPath = path.join(os.tmpdir(), 'fayed-shortcut.ps1')
  const script = [
    '$ws = New-Object -ComObject WScript.Shell',
    `$sc = $ws.CreateShortcut(${JSON.stringify(linkPath)})`,
    `$sc.TargetPath = ${JSON.stringify(exe)}`,
    `$sc.WorkingDirectory = ${JSON.stringify(path.dirname(exe))}`,
    `$sc.IconLocation = ${JSON.stringify(`${exe},0`)}`,
    `$sc.Description = ${JSON.stringify('Fayed Resort')}`,
    '$sc.WindowStyle = 1',
    '$sc.Save()',
  ].join('\r\n')
  fs.writeFileSync(scriptPath, Buffer.concat([
    Buffer.from('\uFEFF', 'utf16le'),
    Buffer.from(script, 'utf16le'),
  ]))
  execFileSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', scriptPath], {
    stdio: 'inherit',
  })
}

const tempLink = path.join(desktop, tempName)
const arabicLink = path.join(desktop, arabicName)
if (fs.existsSync(tempLink)) fs.unlinkSync(tempLink)
if (fs.existsSync(arabicLink)) fs.unlinkSync(arabicLink)
createShortcut(tempLink)
fs.renameSync(tempLink, arabicLink)
console.log('desktop shortcut ready')
