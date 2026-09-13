// Downscale and re-encode a user-selected image entirely in the browser before
// upload, so product photos land in storage as small web-sized files (a few
// hundred KB) instead of multi-megabyte originals. This keeps the free storage
// quota effectively unlimited for a product catalog.

const MAX_DIMENSION = 1280
const JPEG_QUALITY = 0.82

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read-failed'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('decode-failed'))
    image.src = src
  })
}

export async function compressImage(file: File): Promise<Blob> {
  const dataUrl = await readAsDataUrl(file)
  const image = await loadImage(dataUrl)

  const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return file
  ctx.drawImage(image, 0, 0, width, height)

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY))
  return blob ?? file
}
