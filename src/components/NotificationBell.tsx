// src/components/NotificationBell.tsx
import React, { useState, useEffect } from 'react';
import { Badge, Drawer, List, Spin, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { fetchAlarms, fetchDevices } from '../services/api';
import type { Alarm, Device } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

export const NotificationBell: React.FC = () => {
  const { t } = useTranslation(); // 使用 useTranslation hook
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  // 同时拿告警和设备列表，用于 name->id 映射
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchDevices(), fetchAlarms()])
      .then(([devs, als]) => {
        setDevices(devs);
        setAlarms(als);
      })
      .catch(err => {
        // 确保模板字符串和 t() 函数的正确使用
        message.error(t('message.loadAlarmOrDeviceFailed', { message: err.message }));
      })
      .finally(() => setLoading(false));
  }, []);

  const unread = alarms.filter(a => a.status === 'active').length;

  // 根据 deviceName 找到真实 id
  const getDeviceId = (deviceName: string): number | null => {
    const dev = devices.find(d => d.name === deviceName);
    return dev ? dev.id : null;
  };

  const openDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  const onAlarmClick = (alarm: Alarm) => {
    const id = getDeviceId(alarm.deviceName);
    if (id == null) {
      // 确保模板字符串和 t() 函数的正确使用
      message.warning(t('message.deviceNotFoundCannotNavigate', { deviceName: alarm.deviceName }));
      return;
    }
    // 关闭 Drawer 并导航
    setVisible(false);
    navigate(`/devices/${id}`);
  };

  return (
    <>
      <Badge count={unread} overflowCount={99}>
        <BellOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openDrawer}
        />
      </Badge>

      <Drawer
        title={t('alarmInfo')}
        placement="right"
        onClose={closeDrawer}
        visible={visible}
        width={360}
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
        ) : alarms.length > 0 ? (
          <List
            dataSource={alarms}
            renderItem={alarm => (
              <List.Item
                key={alarm.id}
                style={{ cursor: 'pointer' }}
                onClick={() => onAlarmClick(alarm)}
              >
                [{alarm.deviceName}] {alarm.message}
              </List.Item>
            )}
          />
        ) : (
          <div>{t('noAlarms')}</div> 
        )}
      </Drawer>
    </>
  );
};
