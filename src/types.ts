import type { AuditMetric } from 'polykey/dist/audit/types';

type IpGeo = {
  range: Array<number>;
  country: string;
  region: string;
  eu: '0' | '1';
  timezone: string;
  city: string;
  ll: [number, number];
  metro: number;
  area: number;
};

type ResponseError = {
  error: string;
  message: string;
};

type AuditMetricGetResult = {
  [key: string]: AuditMetric;
};

type DeploymentsGetResult = {
  id: number;
  versionMetadata: Record<string, string>;
  startedOn: number;
  finishedOn?: number;
  progress: number;
};

type NodesGetResult = {
  [key: string]: {
    host: string;
    port: number;
  };
};

type NodesGeoGetResult = { [key: string]: IpGeo };

type ResourceGetResult = {
  [key: string]: {
    values: Array<number>;
    port: Array<number>;
  };
};

type SeednodesGetResult = {
  [key: string]: {
    host: string;
    port: number;
  };
};

type SeednodesStatusGetResult = {
  [key: string]:
    | ResponseError
    | {
        agentHost: string;
        agentPort: number;
        clientHost: string;
        clientPort: number;
        connectionsActive: number;
        nodeIdEncoded: string;
        nodesTotal: number;
        pid: number;
        startTime: number;
        version: string;
        sourceVersion: string;
        stateVersion: number;
        networkVersion: number;
        status: 'LIVE';
        versionMetadata: {
          commitHash?: string;
        };
      }
    | { status: 'DEAD'; nodeIdEncoded: string };
};

type SeednodesGeoGetResult = { [key: string]: IpGeo };

export type {
  IpGeo,
  AuditMetricGetResult,
  DeploymentsGetResult,
  NodesGetResult,
  NodesGeoGetResult,
  ResourceGetResult,
  SeednodesGetResult,
  SeednodesStatusGetResult,
  SeednodesGeoGetResult,
};
