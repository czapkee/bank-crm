import { ref } from 'vue'

import { extractApiError } from '../utils.js'

import type { Ref } from 'vue'

export interface UseApiState {
  loading: Ref<boolean>
  error: Ref<string | null>
  run: <T>(action: () => Promise<T>) => Promise<T | null>
  reset: () => void
}

export function useApi(): UseApiState {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run<T>(action: () => Promise<T>): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      return await action()
    } catch (cause) {
      error.value = extractApiError(cause)
      return null
    } finally {
      loading.value = false
    }
  }

  function reset(): void {
    loading.value = false
    error.value = null
  }

  return { loading, error, run, reset }
}
