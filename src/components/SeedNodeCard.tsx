import type { SeednodesStatusGetResult } from '../types';
import * as React from 'react';
import clsx from 'clsx';

const NodeCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    nodeId: string;
    data?: SeednodesStatusGetResult[''];
  }
  // Complains about props not being validated
  // eslint-disable-next-line
>(({ className, nodeId, data, ...props }, ref) => {
  let contents: React.JSX.Element;
  if (data == null) {
    contents = <></>;
  } else if ('error' in data) {
    contents = (
      <>
        <span className="font-semibold">Error:</span>
        <div className="overflow-x-auto break-normal flex gap-1 items-center">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          {data.error}
        </div>
        <span className="font-semibold">Message:</span>
        <pre className="overflow-x-auto break-normal flex gap-1 items-center">
          {data.message}
        </pre>
      </>
    );
  } else if (data.status === 'DEAD') {
    contents = (
      <>
        <span className="font-semibold">Status:</span>
        <div className="overflow-x-auto break-normal flex gap-1 items-center">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          {data.status}
        </div>
      </>
    );
  } else {
    contents = (
      <>
        <span className="font-semibold">Status:</span>
        <div className="overflow-x-auto break-normal flex gap-1 items-center">
          <div className="w-3 h-3 rounded-full bg-green-400" />
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
      ref={ref}
      className={clsx('bg-[#E4F6F2] rounded-2xl p-3', className)}
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
