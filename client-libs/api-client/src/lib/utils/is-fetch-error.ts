import { FetchError } from 'ofetch'

export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError || (typeof error === 'object' && error !== null && 'response' in error)
}
