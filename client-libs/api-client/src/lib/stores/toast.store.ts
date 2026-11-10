import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

let nextId = 1

export const useToastStore = defineStore('toast', () => {
  const items = ref<ToastItem[]>([])

  function remove(id: number): void {
    items.value = items.value.filter((item) => item.id !== id)
  }

  function push(message: string, tone: ToastTone = 'success', timeout = 4000): void {
    const id = nextId++
    items.value.push({ id, message, tone })
    window.setTimeout(() => remove(id), timeout)
  }

  function success(message: string): void {
    push(message, 'success')
  }

  function error(message: string): void {
    push(message, 'error', 6000)
  }

  return { items, push, success, error, remove }
})
