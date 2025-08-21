// src/components/MapPanel.tsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import redIconUrl from '../assets/marker-icon-red.png';
import yellowIconUrl from '../assets/marker-icon-yellow.png';
import greenIconUrl from '../assets/marker-icon-green.png';
import greyIconUrl from '../assets/marker-icon-grey.png';
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { mockAlarms } from '../mock/mockData';
const redIcon = new L.Icon({ iconUrl: redIconUrl, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const yellowIcon = new L.Icon({ iconUrl: yellowIconUrl, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const greenIcon = new L.Icon({ iconUrl: greenIconUrl, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const greyIcon = new L.Icon({ iconUrl: greyIconUrl, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });



function getDeviceAlarmLevel(deviceName: string) {
  // 找到该设备的所有 active 告警
  const alarms = mockAlarms.filter(a => a.deviceName === deviceName && a.status === 'active');
  if (alarms.some(a => a.level === 'critical')) return 'critical';
  if (alarms.some(a => a.level === 'warning')) return 'warning';
  if (alarms.some(a => a.level === 'info')) return 'info';
  return null;
}
// ✅ 手动设置默认marker
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Device {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
  location: string;
  status: string;
}

interface Props {
  devices: Device[];
  highlightId?: number;
}

const MapPanel: React.FC<Props> = ({ devices, highlightId }) => {
  // 默认中心点设为美洲中部 (美国堪萨斯城附近坐标)
  const defaultCenter: [number, number] = [39.8283, -98.5795]; 
  // 如果有设备数据，使用第一个设备的位置，否则使用美洲中心
  const center = devices.length && devices[0].lat && devices[0].lng
    ? [devices[0].lat, devices[0].lng]
    : defaultCenter;
  return (
    <div style={{ height: "500px", width: "100%" }}>
      <MapContainer
        center={center as [number, number]}
        zoom={4}  // 适当放大以更好展示美洲
        minZoom={2}  // 最小缩放级别
        maxZoom={18}  // 最大缩放级别
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        {/* 修改为简化地图 */}
        <TileLayer
          attribution="" // 可移除attribution避免显示不必要信息
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
        />
        
        {devices
          .filter((dev) => dev.lat !== undefined && dev.lng !== undefined)
          .map((dev) => {
            const alarmLevel = getDeviceAlarmLevel(dev.name);
            let icon = greenIcon;
            //if (dev.status === 'offline') {
            //  icon = greyIcon;
            //} else 
            if (alarmLevel === 'critical') {
              icon = redIcon;
            } else if (alarmLevel === 'warning') {
              icon = yellowIcon;
            } else if (alarmLevel === 'info') {
              icon = greenIcon;
            }
            return (
              <Marker
                key={dev.id}
                position={[dev.lat as number, dev.lng as number]}
                icon={icon}
              >
                <Popup>
                  <b style={{ color: dev.id === highlightId ? "red" : "black" }}>
                    {dev.name}
                  </b>
                  <br />
                  状态: {dev.status}
                  <br />
                  位置: {dev.location}
                </Popup>
              </Marker>
            );
          })
        }
      </MapContainer>
    </div>
  );
};

export default MapPanel;