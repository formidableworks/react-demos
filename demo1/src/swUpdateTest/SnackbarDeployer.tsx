import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { reloadApp } from '../redux/swAppUpdaterSlice';

export function SnackbarDeployer(): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const isUpdateAvailable = useAppSelector((state) => state.swAppUpdater.isUpdateAvailable);
  const dispatch = useAppDispatch();

  const memoizedReloadAction = useCallback(
    () => (
      <Button color="inherit" variant="outlined" onClick={() => dispatch(reloadApp())}>
        Reload
      </Button>
    ),
    [dispatch]
  );

  // note-worthy bit: deploy an appropriate snackbar
  // when isUpdateAvailable (in the redux store) transitions to true.
  useEffect(() => {
    if (!isUpdateAvailable) return;
    enqueueSnackbar('Update available!', {
      variant: 'info',
      persist: true,
      anchorOrigin: { horizontal: 'center', vertical: 'top' },
      action: memoizedReloadAction,
    });
  }, [enqueueSnackbar, memoizedReloadAction, isUpdateAvailable]);

  return <div />;
}
