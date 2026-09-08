import { createConnection } from 'node:net'
import { APIError } from 'payload'

/** ClamAV INSTREAM: reject the upload before it reaches permanent storage. */
export async function scanUpload(data: Buffer, host: string, port: number): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const socket = createConnection({ host, port })
    let reply = ''
    let settled = false
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      socket.destroy()
      if (error) reject(error)
      else resolve()
    }
    socket.setTimeout(15000, () => finish(new APIError('بررسی امنیت فایل زمان‌بر شد. دوباره تلاش کنید.', 503)))
    socket.on('error', () => finish(new APIError('سرویس بررسی فایل در دسترس نیست.', 503)))
    socket.on('close', () => { if (!settled) finish(new APIError('بررسی امنیت فایل کامل نشد.', 503)) })
    socket.on('connect', () => {
      socket.write('zINSTREAM\0')
      for (let offset = 0; offset < data.length; offset += 65536) {
        const chunk = data.subarray(offset, offset + 65536)
        const size = Buffer.alloc(4)
        size.writeUInt32BE(chunk.length)
        socket.write(size)
        socket.write(chunk)
      }
      socket.write(Buffer.alloc(4))
    })
    socket.on('data', (chunk: Buffer) => {
      reply += chunk.toString('utf8')
      if (reply.length > 1024) return finish(new APIError('پاسخ بررسی امنیت فایل معتبر نیست.', 503))
      if (!reply.includes('\0')) return
      if (reply.trim().replaceAll('\0', '') === 'stream: OK') finish()
      else finish(new APIError('فایل تأیید امنیتی نشد. فایل سالم دیگری بارگذاری کنید.', 400))
    })
  })
}
