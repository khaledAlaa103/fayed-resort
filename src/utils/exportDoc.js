import { formatArabicNumber } from './numbers.js'

function downloadHtmlAsWord(html, filename, title) {
  const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'><head><meta charset='utf-8'><style>table{border-collapse:collapse;width:100%;} th,td{border:1px solid black;padding:5px;text-align:right;} th{background:#2c3e50;color:white;}</style></head><body><h2 style='text-align:center'>${title}</h2>`
  const footer = '</body></html>'
  const blob = new Blob(['\ufeff' + header + html + footer], { type: 'application/msword' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

export function exportAccountsToWord(html) {
  downloadHtmlAsWord(html, 'تقرير_الحسابات.doc', 'تقرير حسابات فايد ريزورت')
}

export function exportInventoryToWord(html) {
  downloadHtmlAsWord(html, 'مخزن_فايد_ريزورت.doc', 'تقرير جرد المخزن - فايد ريزورت')
}

export function formatMoney(value, fractionDigits = 0) {
  const digits = fractionDigits || 2
  return formatArabicNumber(value, digits)
}
