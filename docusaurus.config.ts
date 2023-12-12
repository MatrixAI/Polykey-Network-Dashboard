import type { Config } from '@docusaurus/types';
import type { UserThemeConfig } from '@docusaurus/theme-common';
import type { Options as PluginPagesOptions } from '@docusaurus/plugin-content-pages';
import type { Options as ThemeClassicOptions } from '@docusaurus/theme-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const lightCodeTheme = prismThemes.github;
const darkCodeTheme = prismThemes.dracula;

const pluginPages: [string, PluginPagesOptions] = [
  '@docusaurus/plugin-content-pages',
  {
    path: './src/pages',
  },
];

const pluginThemeClassic: [string, ThemeClassicOptions] = [
  '@docusaurus/theme-classic',
  {
    customCss: './src/css/custom.css',
  },
];

const pluginClientRedirects = ['@docusaurus/plugin-client-redirects', {}];

const themeConfig: UserThemeConfig = {
  colorMode: {
    disableSwitch: true,
  },
  navbar: {
    logo: {
      alt: 'Polykey Logo',
      src: 'images/polykey-logotype-light-light.svg',
      href: 'https://polykey.com',
      target: '_self',
    },
    items: [
      {
        label: 'Home',
        to: 'pathname:///',
        autoAddBaseUrl: false,
        target: '_self',
        position: 'right',
      }
    ],
  },
  footer: {
    style: 'dark',
    logo: {
      alt: 'Polykey Logo',
      src: 'images/polykey-logotype-light-light.svg',
      href: 'https://polykey.com',
      target: '_self',
    },
    links: [
      {
        title: 'Resources',
        items: [
          {
            label: 'Download',
            to: 'https://polykey.com/download',
            autoAddBaseUrl: false,
            target: '_self',
          },
          {
            label: 'Blog',
            to: 'https://polykey.com/blog',
            autoAddBaseUrl: false,
            target: '_self',
          },
          {
            label: 'Docs',
            to: 'https://polykey.com/docs',
            autoAddBaseUrl: false,
          },
          {
            label: 'Mainnet Network',
            to: 'https://mainnet.polykey.com',
          },
          {
            label: 'Testnet Network',
            to: 'https://testnet.polykey.com',
          },
        ],
      },
      {
        title: 'Community',
        items: [
          {
            label: 'Discord',
            to: 'https://discord.gg/vfXQZwwugc',
          },
          {
            label: 'Twitter/X',
            to: 'https://twitter.com/PolykeyIO',
          },
          {
            label: 'Stack Overflow',
            to: 'https://stackoverflow.com/questions/tagged/polykey',
          },
        ],
      },
      {
        title: 'Open Source',
        items: [
          {
            label: 'Polykey Core',
            to: 'https://github.com/MatrixAI/Polykey',
          },
          {
            label: 'Polykey CLI',
            to: 'https://github.com/MatrixAI/Polykey-CLI',
          },
          {
            label: 'Polykey Desktop',
            to: 'https://github.com/MatrixAI/Polykey-Desktop',
          },
          {
            label: 'Polykey Mobile',
            to: 'https://github.com/MatrixAI/Polykey-Mobile',
          },
        ],
      },
      {
        title: 'Company',
        items: [
          {
            label: 'Matrix AI',
            to: 'https://matrix.ai',
          },
          {
            label: 'About Us',
            to: 'https://matrix.ai/about',
          },
          {
            label: 'Terms of Service',
            to: 'https://polykey.com/terms-of-service',
            autoAddBaseUrl: false,
            target: '_self',
          },
          {
            label: 'Privacy Policy',
            to: 'https://polykey.com/privacy-policy',
            autoAddBaseUrl: false,
            target: '_self',
          },
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} Matrix AI`,
  },
  prism: {
    theme: lightCodeTheme,
    darkTheme: darkCodeTheme,
    additionalLanguages: ['shell-session'],
  },
};

const config: Config = {
  title: 'Polykey Network Dashboard',
  tagline: 'View Polykey Network Activity',
  url: 'https://testnet.polykey.com',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  // Generate `index.html` for each markdown file for pretty URLs
  trailingSlash: undefined,
  favicon: 'images/polykey-favicon.png',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  staticDirectories: ['static'],
  plugins: [pluginPages, pluginThemeClassic, pluginClientRedirects],
  themeConfig,
};

export default config;
