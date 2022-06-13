import { Box, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import { useSnackbar } from 'notistack';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState, useCallback, useEffect } from 'react';

function getEnvelopedString(
  subjectString: string,
  startDelimeter: string,
  endDelimiter: string
): string | null {
  const envelopedString = subjectString.substring(
    subjectString.indexOf(startDelimeter) + startDelimeter.length,
    subjectString.lastIndexOf(endDelimiter)
  );
  // ensure hash contains only lowercase and number chars.
  if (/^[a-z0-9]*$/.test(envelopedString)) {
    return envelopedString;
  }
  return null;
}

interface Props {
  intervalTime: number;
  numberOfSegments: number;
}
export function HashChecker({ intervalTime, numberOfSegments }: Props): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const [progress, setProgress] = useState(100 / numberOfSegments);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const triggerHashCheck = useCallback(() => {
    setProgress(100 / numberOfSegments);

    const FetchIndex = async () => {
      try {
        const response = await fetch('/', {
          cache: 'no-store',
          method: 'GET',
        });
        if (!response.ok) return;
        const responseText = await response.text();
        const newBuildHash = getEnvelopedString(responseText, 'main.', '.js');
        if (newBuildHash !== null) {
          // after a hash has been obtained, get the current hash.
          const mainScript = document.querySelector('script[src^="/static/js/"][defer]');
          const mainScriptPath = mainScript?.getAttribute('src'); // example of value: "/static/js/main.4141834e.js"
          if (!mainScriptPath) return;
          const currentBuildHash = getEnvelopedString(mainScriptPath, 'main.', '.js');

          // if the hashes differ, an update is available.
          if (currentBuildHash !== newBuildHash) {
            setIsUpdateAvailable(true);
            enqueueSnackbar('Update available!', {
              variant: 'info',
              persist: true,
              preventDuplicate: true,
              anchorOrigin: { horizontal: 'center', vertical: 'top' },
              action: (
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => document.location.reload()}
                >
                  Reload
                </Button>
              ),
            });
          }
        }
      } catch (error) {
        console.error('fetch network error', error);
      }
    };
    FetchIndex();
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
      triggerHashCheck();
    }
  }, [progress, triggerHashCheck]);

  const onIconButtonClick = () => {
    if (isUpdateAvailable) {
      document.location.reload();
    } else {
      triggerHashCheck();
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
