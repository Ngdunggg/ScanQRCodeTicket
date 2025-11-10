import { AxiosError } from "axios";

/**
 * Get user-friendly error message from API error
 */
export const getErrorMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "Đã xảy ra lỗi không xác định. Vui lòng thử lại.";
  }

  if (error instanceof AxiosError) {
    if (error.response) {
      const status = error.response.status;
      if (status === 404) {
        return "Không tìm thấy vé với ID này.";
      }
      if (status === 401) {
        return "Không có quyền truy cập. Vui lòng đăng nhập lại.";
      }
      return (
        error.response.data?.message || `Lỗi server: ${status}`
      );
    }

    if (error.request) {
      return "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
    }

    if (error.code === "ECONNABORTED") {
      return "Request timeout. Vui lòng thử lại.";
    }
  }

  return error.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
};

