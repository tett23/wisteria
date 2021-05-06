import type { ApiActions, ApiRequest, ApiResponse } from 'messages';
import { useCallback } from 'react';

export function useMessageRequester() {
  return useCallback(
    <T extends ApiActions>(
      action: T,
      arg: ApiRequest<T>,
    ): Promise<ApiResponse<T>> => {
      return global.api.message(action, arg);
    },
    [],
  );
}
