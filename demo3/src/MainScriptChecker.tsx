import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { useSnackbar } from 'notistack';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useState, useCallback, useEffect } from 'react';

interface Props {
  intervalTime: number;
  numberOfSegments: number;
}
export function MainScriptChecker({ intervalTime, numberOfSegments }: Props): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [progress, setProgress] = useState(100 / numberOfSegments);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const triggerHeadFetch = useCallback(() => {
    setProgress(100 / numberOfSegments);
    const mainScript = document.querySelector('script[src^="/static/js/"][defer]');
    const mainScriptpath = mainScript?.getAttribute('src'); // example of value: "/static/js/main.4141834e.js"
    if (!mainScriptpath) return;

    const fetchHead = async () => {
      try {
        const response = await fetch(mainScriptpath, {
          cache: 'no-store',
          method: 'HEAD',
        });
        // serve - https://www.npmjs.com/package/serve
        // serve is being used to host create react apps static output bundle.
        // if a path no longer exists, the content of index.html is sent in its place. -- this is to aid SPA's with client side routing.
        // So in order to detect the main script path no longer exists
        // (ie: an update is available) the responses contentType must be asserted.
        const contentType = response.headers.get('content-type');
        const isJavascript = contentType?.toLowerCase().includes('application/javascript');
        if (response.ok && !isJavascript) {
          setIsUpdateAvailable(true);
          enqueueSnackbar('Update available!', {
            variant: 'info',
            persist: true,
            preventDuplicate: true,
            anchorOrigin: { horizontal: 'center', vertical: 'top' },
            action: (
              <Button color="inherit" variant="outlined" onClick={() => document.location.reload()}>
                Reload
              </Button>
            ),
          });
        }
      } catch (error) {
        console.error('fetch network error1', error);
      }
    };
    fetchHead();
  }, [enqueueSnackbar, numberOfSegments]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 100 / numberOfSegments
      );
    }, intervalTime / numberOfSegments);
    // return a function to clean up the setInterval on unmount.
    return () => clearInterval(timer);
  }, [intervalTime, numberOfSegments]);

  useEffect(() => {
    if (progress === 0) {
      triggerHeadFetch();
    }
  }, [progress, triggerHeadFetch]);

  const onIconButtonClick = () => {
    if (isUpdateAvailable) {
      document.location.reload();
    } else {
      triggerHeadFetch();
    }
  };

  return (
    <Tooltip title={isUpdateAvailable ? 'Click to refresh page' : 'Check for an app update'}>
      <IconButton
        color="primary"
        aria-label={isUpdateAvailable ? 'refresh page' : ' check for updates'}
        onClick={onIconButtonClick}
      >
        <Box sx={{ position: 'relative', minHeight: 24, minWidth: 24 }}>
          {isUpdateAvailable ? (
            <RefreshIcon sx={{ position: 'absolute', left: 0 }} />
          ) : (
            <UpgradeIcon sx={{ position: 'absolute', left: 0 }} />
          )}
          <CircularProgress
            sx={{
              color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
              position: 'absolute',
              left: -4,
              top: -4,
            }}
            thickness={4}
            size={32}
            variant="determinate"
            value={100}
          />
          <CircularProgress
            sx={{
              position: 'absolute',
              left: -4,
              top: -4,
            }}
            thickness={4}
            size={32}
            variant="determinate"
            value={isUpdateAvailable ? 100 : progress}
          />
        </Box>
      </IconButton>
    </Tooltip>
  );
}
