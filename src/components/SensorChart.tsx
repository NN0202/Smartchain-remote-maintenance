// src/components/SensorChart.tsx
import React, { useEffect, useState } from 'react';
import { Card, Spin } from 'antd';
import ChartPanel from './ChartPanel';
import {
  fetchTemperatureData,
  fetchVibrationData,
  fetchTensionData,
  fetchDisplacementData,
  fetchAngleData,
  fetchCurrentVoltageData,
  SensorReading,
} from '../services/api';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

interface SensorChartProps {
  deviceId: number;
  sensorKey:
    | 'temperature'
    | 'vibration'
    | 'tension'
    | 'displacement'
    | 'angle'
    | 'electrical';
  title: string; // 这个 title 应该已经是从 SensorTabs 传递过来的翻译后的文本
}

const SensorChart: React.FC<SensorChartProps> = ({
  deviceId,
  sensorKey,
  title, // title 已经从 SensorTabs 翻译过来，这里直接使用
}) => {
  const { t } = useTranslation(); // 使用 useTranslation hook
  const [readings, setReadings] = useState<Record<string, SensorReading[]>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let data: SensorReading[] = [];
      switch (sensorKey) {
        case 'temperature':
          data = await fetchTemperatureData(deviceId);
          break;
        case 'vibration':
          data = await fetchVibrationData(deviceId);
          break;
        case 'tension':
          data = await fetchTensionData(deviceId);
          break;
        case 'displacement':
          data = await fetchDisplacementData(deviceId);
          break;
        case 'angle':
          data = await fetchAngleData(deviceId);
          break;
        case 'electrical':
          data = await fetchCurrentVoltageData(deviceId);
          break;
      }
      // 按 location 分组
      const map: Record<string, SensorReading[]> = {};
      data.forEach(r => {
        if (!map[r.location]) map[r.location] = [];
        map[r.location].push(r);
      });
      setReadings(map);
      setLoading(false);
    };
    load();
  }, [deviceId, sensorKey]);

  return (
    <Card title={title} style={{ marginBottom: 24 }}>
      {loading ? (
        <Spin tip={t('loading')} />
      ) : (
        Object.entries(readings).map(([location, series]) => (
          <div key={location} style={{ marginBottom: 32 }}>
            <h4>{t('locationName', { location: t(`location.${location}`) })}</h4>


            <ChartPanel
              data={series.map(r => ({
                timestamp: r.timestamp,
                value: r.value,
              }))}
            />
          </div>
        ))
      )}
    </Card>
  );
};
export default SensorChart;
