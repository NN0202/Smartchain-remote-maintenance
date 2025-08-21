// src/pages/DevicePage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Spin,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
} from 'antd';
import {
  fetchDeviceDetail,
  fetchDeviceHistory,
  fetchAlarms,
  acknowledgeAlarm,
} from '../services/api';
import type { Device, Alarm } from '../services/api';
import AlarmList from '../components/AlarmList';
import SensorTabs from '../components/SensorTabs';
import Stacker3DViewer from '../components/Stacker3DViewer';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const DevicePage: React.FC = () => {
  const { t } = useTranslation();
  const { deviceId } = useParams<{ deviceId: string }>();
  const id = Number(deviceId);
  const navigate = useNavigate();

  const [device, setDevice] = useState<Device | null>(null);
  const [history, setHistory] = useState<{ timestamp: string; value: number }[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [repaired, setRepaired] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!deviceId || isNaN(id)) {
      message.error(t('devicePage.invalidDeviceId'));
      return;
    }

    setLoading(true);
    Promise.all([
      fetchDeviceDetail(id),
      fetchDeviceHistory(id),
      fetchAlarms(id),
    ])
      .then(([dev, hist, als]) => {
        setDevice(dev);
        setHistory(hist);
        setAlarms(als);

        const saved = localStorage.getItem(`repaired_${id}`) === 'true';
        const hasActive = als.some(a => a.status === 'active');
        if (hasActive) {
          localStorage.removeItem(`repaired_${id}`);
          setRepaired(false);
        } else {
          setRepaired(saved);
        }
      })
      .finally(() => setLoading(false));
  }, [id, deviceId, t]);

  if (loading) {
    return <Spin style={{ display: 'block', margin: '50px auto' }} />;
  }

  if (!device) {
    return <div>{t('devicePage.deviceNotFound')}</div>;
  }

  const activeCount = alarms.filter(a => a.status === 'active').length;

  const handleAcknowledge = (alarmId: number) => {
    acknowledgeAlarm(alarmId)
      .then(() => fetchAlarms(id))
      .then(setAlarms)
      .then(() => message.success(t('message.alarmAcknowledged')));
  };

  const handleRepair = () => {
    if (activeCount > 0) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
      return;
    }
    setRepaired(true);
    localStorage.setItem(`repaired_${id}`, 'true');
    message.success(t('message.repairConfirmed'));
  };

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><Link to="/">{t('home')}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{device.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title={t('devicePage.onlineDuration')} value={12.3} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title={t('devicePage.todayAlarms')} value={activeCount} />
          </Card>
        </Col>
      </Row>

      {/* 🚀 3D 模型放在传感器数据可视化之前，并只显示设备名 */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>
          {device?.name}
        </Title>
        <Stacker3DViewer />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>{t('devicePage.sensorDataVisualization')}</Title>
        <SensorTabs deviceId={id} />
      </Card>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>{t('devicePage.currentAlarms')}</Title>
        <AlarmList
          alarms={alarms}
          deviceId={id}
          onAcknowledge={handleAcknowledge}
        />
      </Card>

      {toastVisible && (
        <div
          onClick={() => setToastVisible(false)}
          style={{
            position: 'fixed',
            top: '50%',
            left: 'calc(50% + 100px)',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: 6,
            fontSize: 18,
            cursor: 'pointer',
            zIndex: 2000,
            maxWidth: '80%',
            textAlign: 'center',
          }}
        >
          {t('devicePage.pleaseConfirmFaults')}
        </div>
      )}

      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        {!repaired ? (
          <Button type="primary" onClick={handleRepair}>
            {t('confirmRepair')}
          </Button>
        ) : (
          <Button onClick={() => navigate(`/faults/${id}`)}>
            {t('viewRecords')}
          </Button>
        )}
      </div>
    </>
  );
};

export default DevicePage;
