// src/components/AlarmList.tsx
import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { fetchDevices } from "../services/api";
import type { Alarm, Device } from "../services/api";
import { useTranslation } from 'react-i18next';

interface AlarmListProps {
  alarms: Alarm[];
  /** 详情页才会传：点击确认时回调 */
  onAcknowledge?: (id: number) => void;
  /** 详情页传当前设备ID，便于“确认”按钮定位到正确设备 */
  deviceId?: number;
}

const AlarmList: React.FC<AlarmListProps> = ({
  alarms,
  onAcknowledge,
  deviceId,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 设备名 → 设备ID 映射，用于全局告警页中“前往确认”
  const [nameToIdMap, setNameToIdMap] = useState<Record<string, number>>({});
  const [loadingDevices, setLoadingDevices] = useState(false);

  useEffect(() => {
    if (deviceId == null) {
      setLoadingDevices(true);
      fetchDevices()
        .then((devs: Device[]) => {
          const map: Record<string, number> = {};
          devs.forEach(d => { map[d.name] = d.id; });
          setNameToIdMap(map);
        })
        .finally(() => setLoadingDevices(false));
    }
  }, [deviceId]);

  const columns = [
    { title: t('time'), dataIndex: "timestamp", key: "ts" },
    {
      title: t('device'),
      dataIndex: "deviceName",
      key: "device",
      render: (deviceName: string) => {
        if (deviceName.startsWith('堆垛机')) {
          const id = deviceName.substring('堆垛机'.length).trim();
          return `${t('stacker')} ${id}`;
        }
        return deviceName;
      },
    },
    {
      title: t('content'),
      dataIndex: "message",
      key: "msg",
      render: (message: string) => t(message),
    },
    {
      title: t('level'),
      dataIndex: "level",
      key: "lvl",
      render: (lvl: Alarm["level"]) => {
        const map = {
          critical: { color: "red", text: t('critical') },
          warning:  { color: "orange", text: t('warning') },
          info:     { color: "blue", text: t('info') },
        } as const;
        const { color, text } = map[lvl];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: t('status'),
      dataIndex: "status",
      key: "st",
      render: (st: Alarm["status"]) =>
        st === "active" ? t('unconfirmed') : t('confirmed'),
    },
    {
      title: t('operation'),
      key: "act",
      render: (_: any, record: Alarm) => {
        if (record.status === "active") {
          if (deviceId != null && onAcknowledge) {
            return (
              <Button
                type="link"
                onClick={() => onAcknowledge(record.id)}
              >
                {t('confirm')}
              </Button>
            );
          }
          if (loadingDevices) {
            return <Spin size="small" />;
          }
          const targetId = nameToIdMap[record.deviceName];
          return (
            <Button
              type="link"
              disabled={!targetId}
              onClick={() => {
                if (targetId) navigate(`/devices/${targetId}`);
              }}
            >
              {t('goToConfirm')}
            </Button>
          );
        }

        const targetId = deviceId != null
          ? deviceId
          : nameToIdMap[record.deviceName];

        return (
          <Button
            type="link"
            disabled={!targetId}
            onClick={() => {
              if (targetId) navigate(`/faults/${targetId}`);
            }}
          >
            {t('confirmedViewRecord')}
          </Button>
        );
      },
    },
  ];

  return (
    <Table
      dataSource={alarms}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
};

export default AlarmList;