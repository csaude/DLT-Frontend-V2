import React from 'react';
import {useTranslation} from 'react-i18next';
import {DateTime} from 'luxon';
import {version} from '../../../../package.json';
import './index.css'

const Footer = () => {
  const [t] = useTranslation();

  return (
    <div className='apply-z-index-1'>
    <footer className="main-footer">
      <strong>
        <span>Copyright © {DateTime.now().toFormat('y')} </span>
        <a href="https://www.dreams.co.mz" target="_blank" rel="DREAMS">
          DREAMS
        </a>
      </strong>
      <div className="float-right d-none d-sm-inline-block">
        <b>{t('footer.version')}</b>
        <span>&nbsp;{version}</span>
      </div>
    </footer>
    </div>
  );
};

export default Footer;
