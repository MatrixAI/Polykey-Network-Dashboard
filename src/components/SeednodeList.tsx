import * as React from 'react';
import clsx from 'clsx';

const SeednodeList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    seedNodes: { [nodeId: string]: { host: string; port: number } };
  }
  // Complains about props not being validated
  // eslint-disable-next-line
>(({ className, seedNodes, ...props }, ref) => {
  const [seednodes, setSeednodes] = React.useState<{ [nodeId: string]: any }>();

  React.useEffect(() => {
    if (typeof globalThis.window !== 'undefined') {
      void fetch('/api/seednodes').then(async (data) => {
        setSeednodes(await data.json());
      });
    }
  }, []);

  return (
    <div className={clsx('space-y-3', className)} ref={ref} {...props}>
      {seednodes != null ? (
        Object.entries(seednodes).map(([nodeId, data]) => (
          <div key={nodeId} className="bg-[#E4F6F2] rounded-2xl p-3 flex-1">
            <span className="font-semibold">Node ID:</span>
            <div className="overflow-x-auto">{nodeId}</div>
            <span className="font-semibold">Address:</span>
            <div className="overflow-x-auto scroll">
              {data.host}:{data.port}
            </div>
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
