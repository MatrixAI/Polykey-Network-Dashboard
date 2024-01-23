import * as React from 'react';
import clsx from 'clsx';

const NodeCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    nodeId: string;
    data?: {
      status: string;
      agentHost: string;
      agentPort: number;
      clientHost: string;
      clientPort: number;
      versionMetadata: {
        cliAgentCommitHash: string;
      };
    };
  }
  // Complains about props not being validated
  // eslint-disable-next-line
>(({ className, nodeId, data, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('bg-[#E4F6F2] rounded-2xl p-3', className)}
      {...props}
    >
      <span className="font-semibold">Node ID:</span>
      <div className="overflow-x-auto break-normal">{nodeId}</div>
      {data != null ? (
        <>
          <span className="font-semibold">Status:</span>
          <div className="overflow-x-auto break-normal flex gap-1 items-center">
            <div
              className={clsx(
                'w-3 h-3 rounded-full',
                data.status.toLocaleLowerCase() !== 'dead'
                  ? 'bg-green-400'
                  : 'bg-red-400',
              )}
            />
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
              href={`https://github.com/MatrixAI/Polykey-CLI/commit/${data.versionMetadata.cliAgentCommitHash}`}
            >
              {data.versionMetadata?.cliAgentCommitHash}
            </a>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
});

NodeCard.displayName = 'SeednodeCard';

export default NodeCard;
