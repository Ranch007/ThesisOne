import { Packer } from 'docx'
import { buildDocument } from './docx-builder'
import type { BuildOptions } from './docx-builder'

export { buildDocument }
export type { BuildOptions }

/** AST → .docx Blob（分帧执行，保持 UI 响应） */
export async function exportDocx(options: BuildOptions): Promise<Blob> {
  // 先构建文档结构（JS 对象，较快）
  const doc = buildDocument(options)

  // 让出主线程后再进行 XML 序列化（Packer.toBlob 较重）
  await new Promise((resolve) => requestAnimationFrame(resolve))

  return Packer.toBlob(doc)
}
