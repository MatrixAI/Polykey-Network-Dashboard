import type { IpGeo } from '../types';
import type ResourceChartType from '../components/ResourceChart';
import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useQuery } from '@tanstack/react-query';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Map from '../components/Map';
import NodeCard from '../components/NodeCard';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const nodesGeoQuery = useQuery<{ [nodeId: string]: IpGeo }>({
    queryKey: ['nodesGeo'],
    queryFn: () =>
      fetch(
        `${siteConfig.url}/api/nodes/geo?seek=${
          Date.now() - 1000 * 60 * 60 * 24 * 7
        }`,
      ).then((response) => response.json()),
    refetchInterval: 60 * 1000,
  });
  const seedNodesQuery = useQuery<{ [nodeId: string]: any }>({
    queryKey: ['seedNodes'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/seednodes`).then((response) =>
        response.json(),
      ),
  });
  const resourceCpuQuery = useQuery<{
    [nodeId: string]: { values: Array<number>; timestamps: Array<number> };
  }>({
    queryKey: ['resourceCpu'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/resource/cpu`).then((response) =>
        response.json(),
      ),
    refetchInterval: 60 * 1000,
  });
  const resourceMemoryQuery = useQuery<{
    [nodeId: string]: { values: Array<number>; timestamps: Array<number> };
  }>({
    queryKey: ['resourceMemory'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/resource/memory`).then((response) =>
        response.json(),
      ),
    refetchInterval: 60 * 1000,
  });

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Polykey, a new approach to secrets management."
    >
      <div>
        <div className="bg-[#116466]">
          <div className="max-w-4xl mx-auto">
            <div className="px-3 py-6">
              <Map nodesGeo={nodesGeoQuery.data} />
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto p-3 space-y-3">
          <h1 className="text-2xl text-center">Seed Nodes</h1>
          <div className="flex flex-wrap justify-center gap-3">
            {seedNodesQuery.data != null ? (
              Object.entries(seedNodesQuery.data).map(([nodeId, data]) => (
                <NodeCard
                  className="flex-grow-[0.5] flex-shrink min-w-0"
                  nodeId={nodeId}
                  remoteInfo={data}
                />
              ))
            ) : (
              <></>
            )}
          </div>
          <BrowserOnly>
            {() => {
              const ResourceChart: typeof ResourceChartType = require('../components/ResourceChart').default;
              return (
                <div className="w-full">
                  <div className="w-full md:w-1/2 inline-block aspect-[1.5]">
                    {resourceCpuQuery.data != null ? (
                      <ResourceChart
                        title="CPU Usage"
                        data={resourceCpuQuery.data}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="w-full md:w-1/2 inline-block aspect-[1.5]">
                    {resourceMemoryQuery.data != null ? (
                      <ResourceChart
                        title="Memory Usage"
                        data={resourceMemoryQuery.data}
                      />
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            }}
          </BrowserOnly>
        </div>
      </div>
    </Layout>
  );
}
