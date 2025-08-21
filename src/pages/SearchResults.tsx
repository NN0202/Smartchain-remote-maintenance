// src/pages/SearchResults.tsx
import React, { useEffect, useState } from 'react';
import { List, Spin } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchSearchResults, fetchDevices } from '../services/api';
import type { Alarm, Device } from '../mock/mockData';
import { useTranslation } from 'react-i18next'; 

export const SearchResults: React.FC = () => {
  const { t } = useTranslation(); 
  const [results, setResults] = useState<{ devices: Device[]; alarms: Alarm[] }>({
    devices: [],
    alarms: [],
  });
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get('q') || '';

  useEffect(() => {
    setLoading(true);
    // 先拉全量设备，再搜索
    fetchDevices().then(devs => {
      setAllDevices(devs);
      fetchSearchResults(keyword).then(res => {
        setResults(res);
        setLoading(false);
      });
    });
  }, [keyword]);

  if (loading) return <Spin />;

  return (
    <div>
      <h2>{t('searchResults.devices')}</h2> {/* 使用翻译键 */}
      <List
        dataSource={results.devices}
        renderItem={dev => (
          <List.Item
            onClick={() => navigate(`/devices/${dev.id}`)}
            style={{ cursor: 'pointer' }}
          >
            [{dev.name}] {dev.location}
          </List.Item>
        )}
      />

      <h2>{t('searchResults.alarms')}</h2> {/* 使用翻译键 */}
      <List
        dataSource={results.alarms}
        renderItem={alarm => {
          // 同样要从 allDevices 找到 id
          const dev = allDevices.find(d => d.name === alarm.deviceName);
          const devId = dev?.id;
          return (
            <List.Item
              onClick={() => {
                if (devId != null) {
                  navigate(`/devices/${devId}`);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              [{alarm.deviceName}] {alarm.message}
            </List.Item>
          );
        }}
      />
    </div>
  );
};

