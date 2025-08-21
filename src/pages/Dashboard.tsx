// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Row,
  Col,
  Button,
  DatePicker,
  Space,
  message,
} from "antd";
import { ReloadOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import DeviceCard from "../components/DeviceCard";
import AlarmList from "../components/AlarmList";
import type { Alarm } from "../services/api";
import {
  fetchDevices,
  fetchAlarms,
  acknowledgeAlarm,
} from "../services/api";
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import MapPanel from "../components/MapPanel"; // 导入 MapPanel


const Dashboard: React.FC = () => {
  const { t } = useTranslation(); // 使用 useTranslation hook
  const [devices, setDevices] = useState<any[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const navigate = useNavigate();

  const faultyDevices = devices.filter((dev: any) => {
    const isOffline = dev.status === "offline";
    const hasActiveAlarms = dev.currentAlarms?.some((a: any) => a.status === "active");
    return isOffline || hasActiveAlarms;
  });
  // 加载设备与告警
  useEffect(() => {
    fetchDevices().then(setDevices);
    fetchAlarms().then(setAlarms);
  }, []);

  const reloadData = () => {
    fetchDevices().then(setDevices);
    fetchAlarms().then(setAlarms);
    message.success(t('message.dataRefreshed')); // 使用翻译键
  };

  const handleAck = (id: number) => {
    acknowledgeAlarm(id).then(() => {
      setAlarms((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: "ack" } : a))
      );
      message.success(t('message.alarmAcknowledged')); // 使用翻译键
    });
  };

  // 顶部按钮组
  const ToolBar = () => (
    <Row justify="space-between" style={{ marginBottom: 16 }}>
      <Space>
        <Button icon={<ReloadOutlined />} onClick={reloadData}>
          {t('refresh')} {/* 使用翻译键 */}
        </Button>
        <DatePicker.RangePicker />
      </Space>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => message.info(t('message.noNewFeatures'))} // 使用翻译键
      >
        {t('addDevice')} {/* 使用翻译键 */}
      </Button>
    </Row>
  );

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>{t('home')}</Breadcrumb.Item> {/* 使用翻译键 */}
        <Breadcrumb.Item>{t('dashboard')}</Breadcrumb.Item> {/* 使用翻译键 */}
      </Breadcrumb>

      <ToolBar />

      {/* 故障设备地图 */}
      <h3 style={{ marginTop: 16 }}>{t('deviceDistributionMap')}</h3> {/* 使用翻译键 */}
      <MapPanel devices={devices} /> {/* 添加 MapPanel 组件并传入 devices */}

      <Row gutter={[16, 16]}>
        {devices.map((dev) => (
          <Col key={dev.id} span={6}>
            <DeviceCard
              name={dev.name} // 设备名称是数据，不翻译
              status={dev.status}
              location={dev.location} // location是数据，DeviceCard内部会翻译“位置：”前缀
              onClick={() => navigate(`/devices/${dev.id}`)}
            />
          </Col>
        ))}
      </Row>

      {/* 可选：首页快捷告警 */}
      <h3 style={{ marginTop: 32 }}>{t('dashboardTodayAlarmOverview')}</h3> {/* 使用翻译键 */}
      <AlarmList alarms={alarms} onAcknowledge={handleAck} />
    </>
  );
};

export default Dashboard;