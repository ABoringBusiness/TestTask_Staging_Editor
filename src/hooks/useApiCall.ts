import { useState, useCallback, useEffect } from 'react';
import { extractResultFiles, isApiResponseComplete, pollApiWithBackoff } from '../utils/apiUtils';

interface UseApiCallOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  autoExecute?: boolean;
}

interface UseApiCallResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (params?: any) => Promise<void>;
  reset: () => void;
  resultFiles: string[] | null;
}

/**
 * Custom hook for making API calls with polling support
 * @param apiFunction The API function to call
 * @param options Options for the API call
 * @returns Object with data, loading state, error, execute function, and reset function
 */
export function useApiCall<T>(
  apiFunction: (params?: any) => Promise<any>,
  options: UseApiCallOptions = {}
): UseApiCallResult<T> {
  const { onSuccess, onError, autoExecute = false } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(autoExecute);
  const [error, setError] = useState<Error | null>(null);
  const [resultFiles, setResultFiles] = useState<string[] | null>(null);
  const [params, setParams] = useState<any>(null);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setResultFiles(null);
  }, []);

  const execute = useCallback(async (executeParams?: any) => {
    setLoading(true);
    setError(null);
    setParams(executeParams || null);
    
    try {
      const response = await apiFunction(executeParams);
      
      if (isApiResponseComplete(response)) {
        handleSuccess(response);
      } else {
        // Start polling if response is not complete
        pollApiWithBackoff(
          () => apiFunction(executeParams),
          isApiResponseComplete,
          handleSuccess,
          handleError,
          () => setLoading(true)
        );
      }
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  }, [apiFunction]);

  const handleSuccess = useCallback((response: any) => {
    setLoading(false);
    setData(response);
    
    const files = extractResultFiles(response);
    if (files) {
      setResultFiles(files);
    }
    
    if (onSuccess) {
      onSuccess(response);
    }
  }, [onSuccess]);

  const handleError = useCallback((err: any) => {
    setLoading(false);
    const errorObj = err instanceof Error ? err : new Error('Unknown error occurred');
    setError(errorObj);
    
    if (onError) {
      onError(errorObj);
    }
  }, [onError]);

  // Auto-execute the API call if autoExecute is true
  useEffect(() => {
    if (autoExecute) {
      execute();
    }
    
    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, [autoExecute, execute]);

  return { data, loading, error, execute, reset, resultFiles };
}

export default useApiCall;