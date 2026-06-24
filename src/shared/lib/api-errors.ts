import { AxiosError } from 'axios';

/**
 * Standardized API Error parsing utility.
 * Maps FastAPI 422 validation errors or standard HTTP errors into
 * a user-friendly string that can be displayed in a toast.
 */
export const parseApiError = (error: unknown, fallbackMessage = 'An unexpected error occurred'): string => {
  if (!error) return fallbackMessage;

  // Handle Axios errors
  if (error instanceof AxiosError) {
    // If no response, it's a network error or timeout
    if (!error.response) {
      if (error.code === 'ECONNABORTED') return 'Request timed out. Please try again.';
      return 'Network error. Please check your connection.';
    }

    const data = error.response.data;

    // FastAPI Validation Error (422 Unprocessable Entity)
    if (error.response.status === 422 && data && Array.isArray(data.detail)) {
      // Return the first validation error's message
      const firstError = data.detail[0];
      const field = firstError.loc ? firstError.loc[firstError.loc.length - 1] : 'Field';
      return `${field}: ${firstError.msg}`;
    }

    // Standard FastAPI error detail (e.g. 400, 401, 403, 404, 500)
    if (data && typeof data.detail === 'string') {
      return data.detail;
    }
    
    // Fallback to error message if present
    if (data && typeof data.message === 'string') {
        return data.message;
    }

    return `Error ${error.response.status}: ${error.response.statusText}`;
  }

  // Handle native Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown structure
  return fallbackMessage;
};
