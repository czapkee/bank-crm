export interface ApiHooks {
  getAccessToken?: () => string | null | undefined
  onUnauthorized?: () => boolean | Promise<boolean>
}

let hooks: ApiHooks = {}

export function configureApi(next: ApiHooks): void {
  hooks = { ...hooks, ...next }
}

export function getApiHooks(): ApiHooks {
  return hooks
}
