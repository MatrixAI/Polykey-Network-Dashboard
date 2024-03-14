import type { IpGeo, SeednodesStatusGetResult } from '../types';
import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useQuery } from '@tanstack/react-query';
import * as utils from '../utils';
import Map from '../components/Map';
import SeedNodeCard from '../components/SeedNodeCard';
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
      ).then(utils.unwrapJson),
    refetchInterval: 60 * 1000,
  });
  const seedNodesQuery = useQuery<SeednodesStatusGetResult>({
    queryKey: ['seedNodes'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/seednodes/status`).then(utils.unwrapJson),
  });
  const resourceCpuQuery = useQuery<{
    [nodeId: string]: { values: Array<number>; timestamps: Array<number> };
  }>({
    queryKey: ['resourceCpu'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/resource/cpu`).then(utils.unwrapJson),
    refetchInterval: 60 * 1000,
  });
  const resourceMemoryQuery = useQuery<{
    [nodeId: string]: { values: Array<number>; timestamps: Array<number> };
  }>({
    queryKey: ['resourceMemory'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/resource/memory`).then(utils.unwrapJson),
    refetchInterval: 60 * 1000,
  });
  const deploymentsQuery = useQuery<
    Array<{
      id: string;
      versionMetadata: Record<string, string | undefined>;
      startedOn: number;
      finishedOn?: number;
      progress: number;
    }>
  >({
    queryKey: ['deployments'],
    queryFn: () =>
      fetch(`${siteConfig.url}/api/deployments`).then(async (response) => {
        const resp = await utils.unwrapJson(response);
        if (Array.isArray(resp)) {
          resp.length = 5;
        }
        return resp;
      }),
    refetchInterval: 60 * 1000,
  });

  const versionMetadataKeys = deploymentsQuery.data?.reduce(
    (acc, deployment) => {
      for (const key of Object.keys(deployment.versionMetadata)) {
        acc.add(key);
      }
      return acc;
    },
    new Set<string>(),
  );
  const versionMetadataKeysSorted =
    versionMetadataKeys != null ? [...versionMetadataKeys].sort() : undefined;
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
                <SeedNodeCard
                  key={nodeId}
                  className="flex-grow-[0.5] flex-shrink min-w-0"
                  nodeId={nodeId}
                  data={data}
                />
              ))
            ) : (
              <></>
            )}
            {seedNodesQuery.error != null ? (
              <>Unable to fetch seednodes status from Polykey-Network-Status</>
            ) : (
              <></>
            )}
          </div>
          {resourceCpuQuery.error == null ||
          resourceMemoryQuery.error == null ? (
            <div className="bg-[#E4F6F2] rounded-2xl p-3">
              <div className="w-full md:w-1/2 inline-block aspect-[1.5]">
                {resourceCpuQuery.data != null ? (
                  <ResourceChart
                    title="CPU Usage"
                    data={utils.filterByKey(
                      resourceCpuQuery.data,
                      Object.keys(seedNodesQuery.data ?? []),
                    )}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div className="w-full md:w-1/2 inline-block aspect-[1.5]">
                {resourceMemoryQuery.data != null ? (
                  <ResourceChart
                    title="Memory Usage"
                    data={utils.filterByKey(
                      resourceMemoryQuery.data,
                      Object.keys(seedNodesQuery.data ?? []),
                    )}
                  />
                ) : (
                  <></>
                )}
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="bg-[#E4F6F2] rounded-2xl p-3">
            <span className="font-semibold">Deployments:</span>
            <table className="w-full mt-3">
              <tbody className="w-full table">
                <tr>
                  <th>ID</th>
                  {(versionMetadataKeysSorted ?? []).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Started On</th>
                  <th>Finished On</th>
                  <th>Progress</th>
                </tr>
                {deploymentsQuery.isLoading ? (
                  <tr>
                    <td colSpan={5} align="center">
                      Loading Deployments
                    </td>
                  </tr>
                ) : deploymentsQuery.error != null ? (
                  <tr>
                    <td colSpan={5} align="center">
                      Could not fetch deployments from Polykey-Network-Status
                    </td>
                  </tr>
                ) : deploymentsQuery.data != null &&
                  deploymentsQuery.data.length !== 0 ? (
                  deploymentsQuery.data.map((deployment) => {
                    const radius = 30;
                    const circumference = radius * 2 * Math.PI;
                    const progress = Math.min(deployment.progress, 1);
                    return (
                      <tr key={deployment.id}>
                        <>
                          <td>{deployment.id}</td>
                          {(versionMetadataKeysSorted ?? []).map((key) => {
                            const value = deployment.versionMetadata[key];
                            if (value == null) {
                              return <td key={key}></td>;
                            }
                            switch (key) {
                              case 'commitHash':
                                return (
                                  <td key={key}>
                                    <a
                                      title={value}
                                      href={`https://github.com/MatrixAI/Polykey-CLI/commit/${value}`}
                                    >
                                      {value.slice(0, 7)}
                                    </a>
                                  </td>
                                );
                              default:
                                return <td key={key}>{value}</td>;
                            }
                          })}
                          <td>
                            {new Date(deployment.startedOn).toISOString()}
                          </td>
                          <td>
                            {deployment.finishedOn == null
                              ? ''
                              : new Date(deployment.finishedOn).toISOString()}
                          </td>
                          <td className="text-center">
                            <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full">
                              <svg
                                transform="rotate(-90)"
                                style={{
                                  height: `${radius * 2}px`,
                                  width: `${radius * 2}px`,
                                }}
                              >
                                <circle
                                  className="text-gray-300"
                                  strokeWidth={10}
                                  stroke="currentColor"
                                  fill="transparent"
                                  r={radius}
                                  cx={radius}
                                  cy={radius}
                                />
                                <circle
                                  className="text-green-400"
                                  strokeWidth={10}
                                  strokeDasharray={circumference}
                                  strokeDashoffset={
                                    circumference - progress * circumference
                                  }
                                  strokeLinecap="round"
                                  stroke="currentColor"
                                  fill="transparent"
                                  r={radius}
                                  cx={radius}
                                  cy={radius}
                                />
                              </svg>
                              <span className="absolute">
                                {progress * 100}%
                              </span>
                            </div>
                          </td>
                        </>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} align="center">
                      No deployments have been recorded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
