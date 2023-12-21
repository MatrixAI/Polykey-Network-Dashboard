import * as React from 'react';
import clsx from 'clsx';

const NodeCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    nodeId: string;
    remoteInfo?: { host: string; port: number };
  }
  // Complains about props not being validated
  // eslint-disable-next-line
>(({ className, nodeId, remoteInfo, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={clsx('bg-[#E4F6F2] rounded-2xl p-3', className)}
      {...props}
    >
      <span className="font-semibold">Node ID:</span>
      <div className="overflow-x-auto break-normal">{nodeId}</div>
      {remoteInfo != null ? (
        <>
          <span className="font-semibold">Address:</span>
          <div className="overflow-x-auto break-normal">
            {remoteInfo.host}:{remoteInfo.port}
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
