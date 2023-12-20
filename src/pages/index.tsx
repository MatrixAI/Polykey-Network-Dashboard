import type { IpGeo } from '../types';
import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useQuery } from '@tanstack/react-query';
import NodeList from '../components/NodeList';
import Map from '../components/Map';
import SeednodeList from '../components/SeednodeList';
import ResourceChart from '../components/ResourceChart';

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
        <div className="max-w-2xl mx-auto space-y-3 p-3">
          <h1 className="text-2xl text-center">Seednodes:</h1>
          {seedNodesQuery.data != null ? (
            <SeednodeList seedNodes={seedNodesQuery.data} />
          ) : (
            <></>
          )}
          <h1 className="text-2xl text-center">Seednodes Resources:</h1>
          {resourceCpuQuery.data != null ? (
            <ResourceChart data={resourceCpuQuery.data} />
          ) : (
            <></>
          )}
          {resourceMemoryQuery.data != null ? (
            <ResourceChart data={resourceMemoryQuery.data} />
          ) : (
            <></>
          )}
          <h1 className="text-2xl text-center">Nodes:</h1>
          {nodesGeoQuery.data != null ? (
            <NodeList nodes={nodesGeoQuery.data} />
          ) : (
            <></>
          )}
        </div>
      </div>
    </Layout>
  );
}
