import { useSelector } from 'react-redux';
import type { RootDispatch, RootState } from '../store';
import { useDispatch } from 'react-redux';

export const useSearchSelector = useSelector.withTypes<RootState>();
export const useSearchDispatch = useDispatch.withTypes<RootDispatch>();
