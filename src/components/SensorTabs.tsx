// src/components/SensorTabs.tsx
import React from 'react';
import { Tabs } from 'antd';
import SensorChart from './SensorChart';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

const { TabPane } = Tabs;

interface SensorTabsProps {
  deviceId: number;
}

const SensorTabs: React.FC<SensorTabsProps> = ({ deviceId }) => {
  const { t } = useTranslation(); // 使用 useTranslation hook

  // 将 sensorTabs 定义移到组件内部，以便使用 t() 进行翻译
  const sensorTabs = [
    { key: 'temperature', label: t('sensorTabs.temperatureSensor') },
    { key: 'vibration', label: t('sensorTabs.vibrationMonitoring') },
    { key: 'tension', label: t('sensorTabs.forceMonitoring') }, // 修改为力学监测
    { key: 'displacement', label: t('sensorTabs.displacementSensor') },
    { key: 'angle', label: t('sensorTabs.angleSensor') },
    { key: 'electrical', label: t('sensorTabs.currentVoltage') },
  ];

  return (
    <Tabs defaultActiveKey="temperature">
      {sensorTabs.map(item => (
        <TabPane tab={item.label} key={item.key}>
          <SensorChart
            deviceId={deviceId}
            sensorKey={item.key as any}
            title={item.label} // SensorChart 的 title 属性也使用翻译后的 label
          />
        </TabPane>
      ))}
    </Tabs>
  );
};

export default SensorTabs; 