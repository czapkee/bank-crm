import { ref } from 'vue'

import type { Ref } from 'vue'

const accessToken: Ref<string | null> = ref(null)

export interface UseAccessTokenReturn {
  accessToken: Ref<string | null>
  setAccessToken: (token: string) => void
  clearAccessToken: () => void
}

export function useAccessToken(): UseAccessTokenReturn {
  function setAccessToken(token: string): void {
    accessToken.value = token
  }

  function clearAccessToken(): void {
    accessToken.value = null
  }

  return { accessToken, setAccessToken, clearAccessToken }
}
