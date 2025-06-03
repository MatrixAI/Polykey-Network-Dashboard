import type { IpGeo, SeednodesStatusGetResult } from '../types.js';
import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useQuery } from '@tanstack/react-query';
import * as utils from '../utils';
import Map from '../components/Map';
import SeedNodeCard from '../components/SeedNodeCard';
import ResourceChart from '../components/ResourceChart';

const Home = () => {
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
        return Array.isArray(resp) ? resp.slice(0, 5) : [];
      }),
    refetchInterval: 60 * 1000,
  });

  const preferredOrder = [
    'commitHash',
    'version',
    'libVersion',
    'libSourceVersion',
    'libStateVersion',
    'libNetworkVersion',
  ];

  const versionMetadataLabels: Record<string, string> = {
    version: 'Version',
    commitHash: 'Commit',
    libVersion: 'LibVersion',
    libStateVersion: 'StateVer',
    libSourceVersion: 'LibSrcVer',
    libNetworkVersion: 'NetVer',
  };

  return (
    <Layout
      description="Polykey, a new approach to secrets management."
      title={`${siteConfig.title}`}
    >
      <div>
        <div className="bg-[#116466]">
          <div className="mx-auto max-w-4xl">
            <div className="px-3 py-6">
              <Map nodesGeo={nodesGeoQuery.data} />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl space-y-3 p-3">
          <h1 className="text-center text-2xl">Seed Nodes</h1>
          <div className="flex flex-wrap justify-center gap-3">
            {seedNodesQuery.data != null
              ? Object.entries(seedNodesQuery.data).map(([nodeId, data]) => (
                  <SeedNodeCard
                    className="min-w-0 shrink grow-[0.5]"
                    data={data}
                    key={nodeId}
                    nodeId={nodeId}
                  />
                ))
              : null}
            {seedNodesQuery.error != null ? (
              <>Unable to fetch seednodes status from Polykey-Network-Status</>
            ) : null}
          </div>
          {resourceCpuQuery.error == null ||
          resourceMemoryQuery.error == null ? (
            <div className="rounded-2xl bg-[#E4F6F2] p-3">
              <div className="inline-block aspect-[1.5] w-full md:w-1/2">
                {resourceCpuQuery.data != null ? (
                  <ResourceChart
                    data={utils.filterByKey(
                      resourceCpuQuery.data,
                      Object.keys(seedNodesQuery.data ?? []),
                    )}
                    title="CPU Usage"
                  />
                ) : null}
              </div>
              <div className="inline-block aspect-[1.5] w-full md:w-1/2">
                {resourceMemoryQuery.data != null ? (
                  <ResourceChart
                    data={utils.filterByKey(
                      resourceMemoryQuery.data,
                      Object.keys(seedNodesQuery.data ?? []),
                    )}
                    title="Memory Usage"
                  />
                ) : null}
              </div>
            </div>
          ) : null}
          <div className="rounded-2xl bg-[#E4F6F2] p-3">
            <span className="font-semibold">Deployments:</span>
            <table className="mt-3 w-full table-auto">
              <thead>
                <tr>
                  <th>ID</th>
                  {preferredOrder.map((key) => (
                    <th key={key}>{versionMetadataLabels[key] ?? key}</th>
                  ))}
                  <th>Started On</th>
                  <th>Finished On</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {deploymentsQuery.isLoading ? (
                  <tr>
                    <td align="center" colSpan={5}>
                      Loading Deployments
                    </td>
                  </tr>
                ) : deploymentsQuery.error != null ? (
                  <tr>
                    <td align="center" colSpan={5}>
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
                        <td>{deployment.id}</td>
                        {preferredOrder.map((key) => {
                          const value = deployment.versionMetadata[key];
                          if (value == null) {
                            return <td key={key}></td>;
                          }
                          switch (key) {
                            case 'commitHash':
                              return (
                                <td key={key}>
                                  <a
                                    href={`https://github.com/MatrixAI/Polykey-CLI/commit/${value}`}
                                    title={value}
                                  >
                                    {value.slice(0, 7)}
                                  </a>
                                </td>
                              );
                            default:
                              return <td key={key}>{value}</td>;
                          }
                        })}
                        <td
                          title={new Date(deployment.startedOn).toISOString()}
                        >
                          {new Date(deployment.startedOn).toLocaleString()}
                        </td>
                        <td
                          title={
                            deployment.finishedOn
                              ? new Date(deployment.finishedOn).toISOString()
                              : ''
                          }
                        >
                          {deployment.finishedOn
                            ? new Date(deployment.startedOn).toLocaleString()
                            : ''}
                        </td>
                        <td className="text-center">
                          <div className="relative inline-flex items-center justify-center overflow-hidden rounded-full">
                            <svg
                              style={{
                                height: `${radius * 2}px`,
                                width: `${radius * 2}px`,
                              }}
                              transform="rotate(-90)"
                            >
                              <circle
                                className="text-gray-300"
                                cx={radius}
                                cy={radius}
                                fill="transparent"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth={10}
                              />
                              <circle
                                className="text-green-400"
                                cx={radius}
                                cy={radius}
                                fill="transparent"
                                r={radius}
                                stroke="currentColor"
                                strokeDasharray={circumference}
                                strokeDashoffset={
                                  circumference - progress * circumference
                                }
                                strokeLinecap="round"
                                strokeWidth={10}
                              />
                            </svg>
                            <span className="absolute">{progress * 100}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td align="center" colSpan={5}>
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
};

export default Home;
