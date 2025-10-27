/* eslint-disable no-restricted-globals */
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export default function FatalError({ className }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">500</h1>
        <span className="font-medium">Oops! Something went wrong {`:')`}</span>
        <p className="text-muted-foreground text-center">
          The script console application failed to initialise. <br />
          Do you have the global script include <em>"ScriptConsoleG"</em> included on your instance? <br />
          For installation instructions, please refer to{' '}
          <a
            href="https://github.com/vincepg13/sn-script-console"
            className="text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            Github
          </a>
          .
        </p>
      </div>
    </div>
  );
}
