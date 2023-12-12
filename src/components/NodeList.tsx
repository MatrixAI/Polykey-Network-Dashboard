import * as React from 'react';
import clsx from 'clsx';

const SeednodeList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { nodes: { [nodeId: string]: any } }
  // Complains about props not being validated
  // eslint-disable-next-line
>(({ className, nodes, ...props }, ref) => {
  return (
    <div className={clsx('space-y-3', className)} ref={ref} {...props}>
      {nodes != null ? (
        Object.keys(nodes).map((nodeId) => (
          <div key={nodeId} className="bg-[#E4F6F2] rounded-2xl p-3 flex-1">
            <span className="font-semibold">Node ID:</span>
            <div className="overflow-x-auto">{nodeId}</div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
});

SeednodeList.displayName = 'SeednodeList';

export default SeednodeList;
