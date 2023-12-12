// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'tutorials/README',
      },
      items: ['tutorials/getting-started', 'tutorials/installation'],
    },
    {
      type: 'category',
      label: 'How To Guides',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'how-to-guides/README',
      },
      items: [
        {
          type: 'category',
          label: 'Developers',
          items: ['how-to-guides/developers/development-environment-secrets'],
        },
        {
          type: 'category',
          label: 'DevOps',
          items: [
            'how-to-guides/devops/service-deployment-secrets-with-aws-ecs',
            'how-to-guides/devops/cloud-agnostic-secrets-management',
            'how-to-guides/devops/ci-cd-secrets-with-gitlab',
            'how-to-guides/devops/microservice-authentication-with-zero-trust-and-mtls',
          ],
        },
        {
          type: 'category',
          label: 'Companies and Teams',
          items: [
            'how-to-guides/companies-and-teams/employee-onboarding-and-offboarding',
            'how-to-guides/companies-and-teams/device-provisioning',
            'how-to-guides/companies-and-teams/delegation-of-authority',
          ],
        },
        {
          type: 'category',
          label: 'General',
          items: ['how-to-guides/general/cryptocurrency-wallet'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Theory',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'theory/README',
      },
      items: [
        'theory/secrets-management',
        'theory/decentralized-trust-network',
        'theory/centralized-vs-decentralized-platforms',
        'theory/glossary',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'reference/README',
      },
      items: [
        {
          type: 'category',
          label: 'Architecture',
          items: ['reference/architecture/agent-architecture'],
        },
        {
          type: 'category',
          label: 'CLI',
          items: [
            'reference/cli/cli-api',
            'reference/cli/bootstrapping',
            'reference/cli/cli-commands-design-and-style',
          ],
        },
        {
          type: 'category',
          label: 'Schema',
          items: ['reference/schema/schema'],
        },
        {
          type: 'category',
          label: 'GRPC',
          items: ['reference/grpc/session-management'],
        },
        {
          type: 'category',
          label: 'Keys',
          items: ['reference/keys/key-api', 'reference/keys/cryptography'],
        },
        {
          type: 'category',
          label: 'Vaults',
          items: ['reference/vaults/vault-storage'],
        },
        {
          type: 'category',
          label: 'Nodes',
          items: [
            'reference/nodes/node-connections',
            'reference/nodes/node-api',
            'reference/nodes/node-discovery',
            'reference/nodes/node-discovery-with-kademlia',
            'reference/nodes/node-identification',
          ],
        },
        {
          type: 'category',
          label: 'Gestalts',
          items: ['reference/gestalts/gestalt-graph'],
        },
        {
          type: 'category',
          label: 'Discovery',
          items: ['reference/discovery/discovery'],
        },
        {
          type: 'category',
          label: 'Identities',
          items: [
            'reference/identities/identification-with-third-party-services',
          ],
        },
        {
          type: 'category',
          label: 'Sigchain',
          items: ['reference/sigchain/sigchain'],
        },
        {
          type: 'category',
          label: 'ACL',
          items: ['reference/acl/acl'],
        },
        {
          type: 'category',
          label: 'Notifications',
          items: ['reference/notifications/notifications'],
        },
        {
          type: 'category',
          label: 'Network',
          items: ['reference/network/network'],
        },
        {
          type: 'category',
          label: 'Workers',
          items: ['reference/workers/worker-api'],
        },
        {
          type: 'category',
          label: 'GRPC',
          items: ['reference/grpc/client-api'],
        },
      ],
    },
    {
      type: 'category',
      label: 'Development Guide',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'development-guide/README',
      },
      items: [
        'development-guide/roadmap',
        'development-guide/software-architecture',
        'development-guide/style-guide',
        'development-guide/errors',
        'development-guide/async-functions',
        'development-guide/api-design',
        'development-guide/building',
        'development-guide/chocolatey',
      ],
    },
  ],
}

module.exports = sidebars
