import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
const AppDispatchWrapper = () => useDispatch<AppDispatch>();
type TypedDispatchHook = ReturnType<typeof AppDispatchWrapper>;

export const useAppDispatch = (): TypedDispatchHook => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
