import { open } from 'node:fs/promises'
import { extname } from 'node:path'
import { APIError, type CollectionBeforeOperationHook } from 'payload'

const maxSize = 10 * 1024 * 1024

export const validatePrivateUpload: CollectionBeforeOperationHook = async ({ operation, req }) => {
  if ((operation !== 'create' && operation !== 'update') || !req.file) return

  if (operation === 'update')
    throw new APIError(
      'برای حفظ سابقه، فایل اصلاح‌شده را به‌عنوان مدرک یا رسید جدید ثبت کنید.',
      400,
    )

  const file = req.file
  if (!file.size || file.size > maxSize) {
    throw new APIError('فایل باید غیرخالی و حداکثر ۱۰ مگابایت باشد.', 400)
  }

  let header = file.data.subarray(0, 8)
  if (file.tempFilePath) {
    const handle = await open(file.tempFilePath, 'r')
    try {
      const { size } = await handle.stat()
      if (!size || size > maxSize) throw new APIError('حجم فایل مجاز نیست.', 400)
      const result = await handle.read(Buffer.alloc(8), 0, 8, 0)
      header = result.buffer.subarray(0, result.bytesRead)
    } finally {
      await handle.close()
    }
  } else if (file.data.length !== file.size) {
    throw new APIError('فایل کامل دریافت نشده است. دوباره ارسال کنید.', 400)
  }

  const extension = extname(file.name).toLowerCase()
  const isPDF =
    file.mimetype === 'application/pdf' &&
    extension === '.pdf' &&
    header.subarray(0, 5).toString() === '%PDF-'
  const isPNG =
    file.mimetype === 'image/png' &&
    extension === '.png' &&
    header.equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  const isJPEG =
    file.mimetype === 'image/jpeg' &&
    ['.jpg', '.jpeg'].includes(extension) &&
    header.subarray(0, 3).equals(Buffer.from([255, 216, 255]))

  if (!isPDF && !isPNG && !isJPEG) {
    throw new APIError('محتوای فایل با فرمت PDF، JPG یا PNG مطابقت ندارد.', 400)
  }
}
