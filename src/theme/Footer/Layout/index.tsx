import type { Props } from '@theme/Footer/Layout';
import clsx from 'clsx';
import React from 'react';
import styles from './footer.module.css';

export default function FooterLayout({ links, copyright }: Props): JSX.Element {
  return (
    <footer className={clsx('footer footer--dark', styles.footer)}>
      <div className="container">
        <div className="row">
          {links}
          <div className={clsx('col col--4', styles.col, styles.slogan)}>
            {copyright}
          </div>

          <div
            className={clsx('col col--2 col--offset-1', styles.footer__logo)}
          >
            <img src="/images/polykey-logotype-light-light.svg" alt="" />
          </div>
        </div>
      </div>
    </footer>
  );
}
