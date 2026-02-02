interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

class ToastStore {
  #toasts = $state<Toast[]>([]);
  private nextId = 0;
  
  get toasts() {
    return this.#toasts;
  }
  
  show(message: string, type: Toast['type'] = 'success', duration = 3000) {
    const id = this.nextId++;
    this.#toasts = [...this.#toasts, { id, message, type, duration }];
    
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }
  
  dismiss(id: number) {
    this.#toasts = this.#toasts.filter(t => t.id !== id);
  }
}

export const toast = new ToastStore();
