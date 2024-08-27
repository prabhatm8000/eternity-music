import { useDispatch, useSelector } from 'react-redux';
import type { RootDispatch, RootState } from '../store';

export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<RootDispatch>();
