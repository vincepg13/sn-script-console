import { useState } from 'react';
import { errorHandler } from '@/lib/utils';
import { getSessionToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { getAxiosInstance } from 'sn-shadcn-kit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type SessionExpiredDialogProps = {
  open: boolean;
  onRetry: () => void;
};

export function SessionExpiredDialog({ open, onRetry }: SessionExpiredDialogProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenLogin = () => {
    window.open('/login.do', '_blank', 'noopener,noreferrer');
  };

  const handleRetry = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);

    try {
      const token = await getSessionToken();

      if (!token) {
        errorHandler(new Error('Missing session token'), 'Unable to refresh session');
        return;
      }

      const axi = getAxiosInstance();
      axi.defaults.headers['X-UserToken'] = token;
      onRetry();
    } catch (e) {
      errorHandler(e, 'Unable to refresh session');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={event => event.preventDefault()}
        onEscapeKeyDown={event => event.preventDefault()}
        className="sm:max-w-[520px] text-accent-foreground"
      >
        <DialogHeader>
          <DialogTitle>Session expired</DialogTitle>
          <DialogDescription>
            You are not signed in to ServiceNow right now. Sign in in another tab, then come back here and retry.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={handleOpenLogin}>
            Open login
          </Button>
          <Button type="button" onClick={handleRetry} disabled={isRefreshing}>
            Retry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
