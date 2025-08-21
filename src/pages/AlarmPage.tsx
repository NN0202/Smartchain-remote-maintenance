// src/pages/AlarmPage.tsx
import React, { useEffect, useState } from "react";
import { Breadcrumb, message } from "antd";
import AlarmList from "../components/AlarmList";
import type { Alarm } from "../services/api";
import { fetchAlarms, acknowledgeAlarm } from "../services/api";
import { useTranslation } from 'react-i18next'; 
const AlarmPage: React.FC = () => {
  const { t } = useTranslation(); 
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  // 初次加载和刷新告警列表
  useEffect(() => {
    fetchAlarms().then(setAlarms);
  }, []);

  // 确认告警回调
  const handleAck = (id: number) => {
    acknowledgeAlarm(id)
      .then(() => {
        // Update status to acknowledged
        setAlarms(prev =>
          prev.map(a => (a.id === id ? { ...a, status: "ack" } : a))
        );
        message.success(t('message.alarmAcknowledged')); // Use translation
      })
      .catch(err => {
        message.error(t('message.acknowledgementFailed', { message: err.message })); // Use translation
      });
  };

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>{t('home')}</Breadcrumb.Item> {/* Use translation */}
        <Breadcrumb.Item>{t('alarmManagement')}</Breadcrumb.Item> {/* Use translation */}
      </Breadcrumb>
      <AlarmList alarms={alarms} onAcknowledge={handleAck} />
    </>
  );
};

export default AlarmPage;
