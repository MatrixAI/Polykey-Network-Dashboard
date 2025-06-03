import type { SeednodesStatusGetResult } from '../types.js';
import * as React from 'react';
import clsx from 'clsx';

const NodeCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    nodeId: string;
    data?: SeednodesStatusGetResult[''];
  }
  // Complains about props not being validated
>(({ className, nodeId, data, ...props }, ref) => {
  let contents: React.JSX.Element | null;
  if (data == null) {
    contents = null;
  } else if ('error' in data) {
    contents = (
      <>
        <span className="font-semibold">Error:</span>
        <div className="flex items-center gap-1 overflow-x-auto break-normal">
          <div className="size-3 rounded-full bg-red-400" />
          {data.error}
        </div>
        <span className="font-semibold">Message:</span>
        <pre className="flex items-center gap-1 overflow-x-auto break-normal">
          {data.message}
        </pre>
      </>
    );
  } else if (data.status === 'DEAD') {
    contents = (
      <>
        <span className="font-semibold">Status:</span>
        <div className="flex items-center gap-1 overflow-x-auto break-normal">
          <div className="size-3 rounded-full bg-red-400" />
          {data.status}
        </div>
      </>
    );
  } else {
    contents = (
      <>
        <span className="font-semibold">Status:</span>
        <div className="flex items-center gap-1 overflow-x-auto break-normal">
          <div className="size-3 rounded-full bg-green-400" />
          {data.status}
        </div>
        <span className="font-semibold">Agent Service Address:</span>
        <div className="overflow-x-auto break-normal">
          {data.agentHost}:{data.agentPort}
        </div>
        <span className="font-semibold">Client Service Address:</span>
        <div className="overflow-x-auto break-normal">
          {data.clientHost}:{data.clientPort}
        </div>
        <span className="font-semibold">Commit Hash:</span>
        <div className="overflow-x-auto break-normal">
          <a
            href={`https://github.com/MatrixAI/Polykey-CLI/commit/${data.versionMetadata.commitHash}`}
          >
            {data.versionMetadata?.commitHash}
          </a>
        </div>
      </>
    );
  }
  return (
    <div
      className={clsx('rounded-2xl bg-[#E4F6F2] p-3', className)}
      ref={ref}
      {...props}
    >
      <span className="font-semibold">Node ID:</span>
      <div className="overflow-x-auto break-normal">{nodeId}</div>
      {contents}
    </div>
  );
});

NodeCard.displayName = 'SeednodeCard';

export default NodeCard;
