import { toast } from 'sonner';

/**
 * Toast notification wrapper — gọi 1 dòng duy nhất từ bất kỳ component nào.
 * Sử dụng thư viện `sonner` làm engine hiển thị.
 */
export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },

  error: (message: string) => {
    toast.error(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  warning: (message: string) => {
    toast.warning(message);
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  /**
   * Promise-based toast: hiển thị loading -> success / error tự động.
   */
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => {
    return toast.promise(promise, messages);
  },
} as const;
