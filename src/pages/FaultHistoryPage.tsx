// src/pages/FaultHistoryPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Table, Spin, message, Tag } from 'antd';
import type { Alarm } from "../services/api";
import { fetchAlarms } from "../services/api";
import { useTranslation } from 'react-i18next';

const FaultHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const { deviceId } = useParams<{ deviceId: string }>();
  const id = Number(deviceId);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlarms(id)
      .then(data => {
        // 只展示已确认的历史
        setAlarms(data.filter(a => a.status === 'ack'));
      })
      .catch(err => message.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spin style={{ display:'block', margin:'50px auto' }} />;

  return (
    <>
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item><Link to="/">{t('home')}</Link></Breadcrumb.Item> {/* Use translation */}
        <Breadcrumb.Item>
          <Link to={`/devices/${id}`}>{t('deviceDetails')}</Link> {/* Use translation */}
        </Breadcrumb.Item>
        <Breadcrumb.Item>{t('faultHistory')}</Breadcrumb.Item> {/* Use translation */}
      </Breadcrumb>

      <Table
        dataSource={alarms}
        rowKey="id"
        pagination={false}
        columns={[
          { title: t('time'),    dataIndex: "timestamp", key: "ts" }, // Use translation
          { title: t('content'),    dataIndex: "message",   key: "msg", render: (message: string) => t(message) }, // Use translation
          {
            title: t('level'), // Use translation
            dataIndex: "level",
            key: "lvl",
            render: (lvl: Alarm["level"]) => {
              const map = {
                critical: { color: "red",    text: t('critical') }, // Use translation
                warning:  { color: "orange", text: t('warning') }, // Use translation
                info:     { color: "blue",   text: t('info') }, // Use translation
              } as const;
              const { color, text } = map[lvl];
              return <Tag color={color}>{text}</Tag>;
            },
          },
        ]}
      />
    </>
  );
};

export default FaultHistoryPage;
