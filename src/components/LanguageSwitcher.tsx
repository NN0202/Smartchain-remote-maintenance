// src/components/LanguageSwitcher.tsx
import React from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleMenuClick = (e: any) => {
    i18n.changeLanguage(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="zh">中文</Menu.Item>
      <Menu.Item key="en">English</Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button>
        {i18n.language === 'zh' ? '中文' : 'English'} <DownOutlined />
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;