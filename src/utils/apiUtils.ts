import { API_POLLING, API_STATUS } from '../constant/apiConstants';

/**
 * Polls an API with exponential backoff until a condition is met or max retries is reached
 * @param apiCall Function that makes the API call
 * @param isComplete Function that checks if polling should stop
 * @param onSuccess Callback for successful completion
 * @param onError Callback for error handling
 * @param onPolling Callback during polling
 */
export const pollApiWithBackoff = async (
  apiCall: () => Promise<any>,
  isComplete: (response: any) => boolean,
  onSuccess: (response: any) => void,
  onError: (error: any) => void,
  onPolling?: () => void,
): Promise<void> => {
  let retries = 0;
  let delay = API_POLLING.INITIAL_DELAY;

  const poll = async (): Promise<void> => {
    if (retries >= API_POLLING.MAX_RETRIES) {
      onError(new Error('Maximum polling retries reached'));
      return;
    }

    try {
      const response = await apiCall();
      
      if (isComplete(response)) {
        onSuccess(response);
        return;
      }
      
      // If not complete, continue polling with backoff
      retries++;
      delay = Math.min(delay * 1.5, API_POLLING.MAX_DELAY);
      
      if (onPolling) {
        onPolling();
      }
      
      setTimeout(poll, delay);
    } catch (error) {
      onError(error);
    }
  };

  // Start polling
  poll();
};

/**
 * Checks if an API response is complete
 * @param response API response object
 * @returns boolean indicating if the response is complete
 */
export const isApiResponseComplete = (response: any): boolean => {
  return response?.status === API_STATUS.COMPLETE;
};

/**
 * Checks if an API response is pending
 * @param response API response object
 * @returns boolean indicating if the response is pending
 */
export const isApiResponsePending = (response: any): boolean => {
  return response?.status === API_STATUS.PENDING;
};

/**
 * Extracts result files from API response
 * @param response API response object
 * @returns array of file URLs or null if no files
 */
export const extractResultFiles = (response: any): string[] | null => {
  return response?.job?.files || null;
};