import { Packer } from 'docx'
import { buildDocument } from './docx-builder'
import type { BuildOptions } from './docx-builder'

export { buildDocument }
export type { BuildOptions }

/** AST → .docx Blob */
export async function exportDocx(options: BuildOptions): Promise<Blob> {
  const doc = buildDocument(options)
  return Packer.toBlob(doc)
}
