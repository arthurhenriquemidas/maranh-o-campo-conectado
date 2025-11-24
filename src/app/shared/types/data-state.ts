export type DataStatus = 'loading' | 'success' | 'empty' | 'error';

export interface DataState<T> {
  status: DataStatus;
  data?: T;
  error?: unknown;
}

export const loadingState = <T>(): DataState<T> => ({ status: 'loading' });
export const emptyState = <T>(): DataState<T> => ({ status: 'empty' });
export const errorState = <T>(error?: unknown): DataState<T> => ({ status: 'error', error });
export const successState = <T>(data: T): DataState<T> => ({ status: 'success', data });
