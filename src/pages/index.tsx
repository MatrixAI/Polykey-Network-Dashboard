import type { IpGeo } from '../types';
import * as React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import NodeList from '../components/NodeList';
import Map from '../components/Map';
import SeednodeList from '../components/NodeList';

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const [nodesGeo, setNodesGeo] = React.useState<
    | {
        [nodeId: string]: IpGeo;
      }
    | undefined
  >();
  const [seednodes, setSeednodes] = React.useState<{ [nodeId: string]: any }>();

  React.useEffect(() => {
    if (typeof globalThis.window !== 'undefined') {
      // Last 7 days
      void fetch(
        `${siteConfig.url}/api/nodes/geo?seek=${
          Date.now() - 1000 * 60 * 60 * 24 * 7
        }`,
      ).then(async (data) => {
        setNodesGeo(await data.json());
      });
      void fetch(`${siteConfig.url}/api/seednodes`).then(async (data) => {
        setSeednodes(await data.json());
      });
    }
  }, []);

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Polykey, a new approach to secrets management."
    >
      <div>
        <div className="bg-[#116466]">
          <div className="max-w-4xl mx-auto">
            <div className="px-3 py-6">
              <Map nodesGeo={nodesGeo} />
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto space-y-3 p-3">
          <h1 className="text-2xl text-center">Seednodes:</h1>
          {seednodes != null ? <SeednodeList nodes={seednodes} /> : <></>}
          <h1 className="text-2xl text-center">Nodes:</h1>
          {nodesGeo != null ? <NodeList nodes={nodesGeo} /> : <></>}
        </div>
      </div>
    </Layout>
  );
}
