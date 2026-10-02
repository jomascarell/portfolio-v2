import type { Locale } from '../config'
import { ca } from './ca'
import { en } from './en'
import { es } from './es'
import type { Messages } from './types'

/* All three are small, so they ship together rather than loading on demand. */
export const MESSAGES: Record<Locale, Messages> = { en, ca, es }
export type { Messages }
