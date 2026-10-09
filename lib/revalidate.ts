import { revalidatePath, revalidateTag } from 'next/cache'
import { SCHOOLS_CACHE_TAG } from './database'

// Las páginas públicas se cachean 24 h; cualquier cambio desde el admin debe verse al instante.
export function revalidatePublicPages() {
  revalidateTag(SCHOOLS_CACHE_TAG)
  revalidatePath('/', 'layout')
}
