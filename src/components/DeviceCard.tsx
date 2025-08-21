// src/components/DeviceCard.tsx
import React from "react";
import { Card, Tag } from "antd";
import { useTranslation } from 'react-i18next';

export interface DeviceCardProps {
  name: string;
  status: string;
  location?: string;
  onClick?: () => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ name, status, location, onClick }) => {
  const { t } = useTranslation();

  const statusText = status === "online" ? t('deviceStatusOnline') : (status === "fault" ? t('deviceStatusFault') : t('deviceStatusOffline'));

  const getTranslatedDeviceName = (deviceName: string) => {
    if (deviceName.startsWith("堆垛机")) {
      return `${t('stacker')}${deviceName.substring("堆垛机".length)}`;
    }
    return deviceName;
  };

  // 翻译 location 的值
  const translatedLocation = location ? t(location) : t('unknown'); // 尝试翻译location的值

  const displayedName = getTranslatedDeviceName(name);

  return (
    <Card
      hoverable
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <h3>{displayedName}</h3>
      {/* 使用翻译后的 location 值 */}
      <p>{t('deviceLocation', { location: translatedLocation })}</p>
      <Tag color={status === "online" ? "green" : status === "fault" ? "red" : "grey"}>
        {statusText}
      </Tag>
    </Card>
  );
};

export default DeviceCard;