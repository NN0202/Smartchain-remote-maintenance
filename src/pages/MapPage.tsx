// src/pages/MapPage.tsx
import React from "react";
import { useLocation } from "react-router-dom";
import { Breadcrumb } from 'antd'; // 导入 Breadcrumb 组件
import MapPanel from "../components/MapPanel";
import { mockDevices } from "../mock/mockData";
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

const MapPage: React.FC = () => {
  const location = useLocation();
  const highlightId = location.state?.deviceId;
  const { t } = useTranslation(); // 使用 useTranslation hook

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>{t('home')}</Breadcrumb.Item> {/* 翻译“首页” */}
        <Breadcrumb.Item>{t('mapOverview')}</Breadcrumb.Item> {/* 翻译“地图总览” */}
      </Breadcrumb>
      
      <div style={{ /* 如果需要，这里可以添加样式 */ }}>
        <MapPanel
          devices={mockDevices}
          highlightId={highlightId}
        />
      </div>
    </>
  );
};

export default MapPage;