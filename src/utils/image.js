export function compressImage(file, maxWidth = 600, quality = 0.6) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = () => reject(new Error('فشل قراءة الصورة'))
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onerror = () => reject(new Error('فشل تحميل الصورة'))
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const scaleSize = maxWidth / img.width
        canvas.width = maxWidth
        canvas.height = img.height * scaleSize
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
    }
  })
}
