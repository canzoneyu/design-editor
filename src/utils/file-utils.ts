/**
 * 读取文件为ArrayBuffer
 */
export async function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 读取文件为DataURL
 */
export async function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/**
 * 检测文件类型
 */
export function detectFileType(file: File | string): string {
  if (typeof file === 'string') {
    const ext = file.split('.').pop()?.toLowerCase() || ''
    return ext
  }
  
  const name = file.name.toLowerCase()
  if (name.endsWith('.png')) return 'png'
  if (name.endsWith('.jpg') || name.endsWith('.jpeg')) return 'jpeg'
  if (name.endsWith('.webp')) return 'webp'
  if (name.endsWith('.svg')) return 'svg'
  if (name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.psd')) return 'psd'
  if (name.endsWith('.ai')) return 'ai'
  
  return ''
}