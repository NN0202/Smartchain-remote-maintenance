import axios from 'axios';
import {
  mockDevices,
  mockAlarms,
  Device,
  Alarm,
} from '../mock/mockData';

import {
  mockChatHistory,
  mockChatResponses,
  mockSearchResults,
} from '../mock/mockData';
import type { ChatMessage, SearchResults } from '../mock/mockData';
// 暂时先不走axios
// // src/services/api.ts
// import axios from "axios";

// // 修改: 设置基础 URL
// const API = axios.create({ baseURL: "/api", timeout: 5000 });

// // 修改: 获取设备列表
// export const fetchDevices = async () => {
//   const { data } = await API.get("/devices");
//   return data;
// };

// // 修改: 获取单设备历史数据
// export const fetchDeviceHistory = async (deviceId: number, range?: any) => {
//   const params: any = {};
//   if (range?.length === 2) {
//     params.start = range[0].toISOString();
//     params.end = range[1].toISOString();
//   }
//   const { data } = await API.get(`/devices/${deviceId}/history`, { params });
//   return data;
// };

// // 修改: 获取告警列表
// export const fetchAlarms = async (deviceId?: number) => {
//   const params = deviceId ? { device_id: deviceId } : {};
//   const { data } = await API.get("/alarms", { params });
//   return data;
// };

// // 修改: 确认告警
// export const acknowledgeAlarm = async (alarmId: number) => {
//   await API.post(`/alarms/${alarmId}/ack`);
// };
/**
 * 临时 Mock 方案 —— 前端独立开发时使用，
 * 等后端就绪后可将下面的 Promise.resolve(...) 
 * 部分替换回真实的 axios 调用
 */
// src/services/api.ts

/**
 * 临时 Mock 方案 —— 前端独立开发时使用，
 * 等后端就绪后可将下面的 Promise.resolve(...) 
 * 部分替换回真实的 axios 调用
 */

// —— 如果要接入真实后端，可取消下面这行注释并安装 axios
// import axios from 'axios';

// 以下是mock方案废稿

// import type { Device, Alarm } from '../mock/mockData';
// import { mockDevices, mockAlarms } from '../mock/mockData';

// // ———— 创建一个 axios 实例（真实接入时启用）
// // export const API = axios.create({
// //   baseURL: 'http://localhost:8000/api',  // 后端地址
// //   timeout: 5000,
// // });

// /**
//  * 获取设备列表
//  */
// export async function fetchDevices(): Promise<Device[]> {
//   // —— 真后端接口写法：
//   // return API.get<Device[]>('/devices').then(res => res.data);

//   // —— Mock 时直接返回静态数组
//   return Promise.resolve(mockDevices);
// }

// /**
//  * 获取单台设备详情（包含基础信息 + history + currentAlarms）
//  */
// export async function fetchDeviceDetail(id: number): Promise<Device> {
//   // —— 真后端接口写法：
//   // return API.get<Device>(`/devices/${id}`).then(res => res.data);

//   // —— Mock 逻辑：先找设备基本信息
//   const dev = mockDevices.find(d => d.id === id);
//   if (!dev) {
//     return Promise.reject(new Error('Device not found'));
//   }

//   // 构造假历史趋势
//   const history = [
//     { timestamp: '2025-05-28T09:00:00', value: 22 },
//     { timestamp: '2025-05-28T10:00:00', value: 24 },
//     { timestamp: '2025-05-28T11:00:00', value: 26 },
//   ];

//   // 构造该设备的当前告警
//   const currentAlarms = mockAlarms.filter(a => a.deviceName === dev.name);

//   return Promise.resolve({
//     ...dev,
//     history,
//     currentAlarms,
//   });
// }

// /**
//  * 获取告警列表，可选按设备过滤
//  */
// export async function fetchAlarms(deviceId?: number): Promise<Alarm[]> {
//   // —— 真后端接口写法：
//   // return API.get<Alarm[]>('/alarms', { params: { device_id: deviceId } })
//   //           .then(res => res.data);

//   // —— Mock 逻辑：按需过滤
//   if (deviceId != null) {
//     // 简单示例：告警的 deviceName 包含设备 ID 即视为该设备的告警
//     return Promise.resolve(
//       mockAlarms.filter(a => a.deviceName.includes(String(deviceId)))
//     );
//   }
//   return Promise.resolve(mockAlarms);
// }

// /**
//  * 确认/关闭一个告警
//  */
// export async function acknowledgeAlarm(alarmId: number): Promise<{ msg: string }> {
//   // —— 真后端接口写法：
//   // return API.post(`/alarms/${alarmId}/ack`).then(res => res.data);

//   // —— Mock 逻辑：不做真实修改，直接返回成功
//   console.log(`Mock ack alarm ${alarmId}`);
//   return Promise.resolve({ msg: 'Alarm acknowledged (mock)' });
// }

//mock方案不废的稿子
// src/services/api.ts


// Agent API 配置
const DIFY_BACKEND_API_KEY = 'app-Svgovfj1N3y2Jp5wmGQZTlEA'; // 从 dify 获取
const DIFY_AGENT_CHAT_ENDPOINT = 'https://api.dify.ai/v1/chat-messages';
// 导出类型，页面才能 import type { Alarm } from "../services/api";
export type { Device, Alarm };
/**
 * 传感器读数结构
 */
export interface SensorReading {
  /** 传感器位置（如“轴承”） */
  location: string;
  /** 时间戳 ISO 字符串 */
  timestamp: string;
  /** 读数值 */
  value: number;
}

/**
 * 模拟网络延迟
 */
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * 获取设备列表
 */
export async function fetchDevices(): Promise<Device[]> {
  await delay(300);
  return mockDevices;
}

/**
 * 获取单设备历史数据
 */
export async function fetchDeviceHistory(
  deviceId: number,
  range?: [Date, Date]
): Promise<{ timestamp: string; value: number }[]> {
  await delay(300);
  const dev = mockDevices.find(d => d.id === deviceId);
  if (!dev) {
    return Promise.reject(new Error(`设备 ${deviceId} 未找到`));
  }
  if (dev.history && dev.history.length) {
    return dev.history;
  }
  const now = Date.now();
  const history = Array.from({ length: 20 }).map((_, idx) => ({
    timestamp: new Date(now - (19 - idx) * 60 * 1000).toISOString(),
    value: Math.round(20 + Math.random() * 80),
  }));
  dev.history = history;
  return history;
}

/**
 * 获取单台设备的详细信息
 */
export async function fetchDeviceDetail(deviceId: number): Promise<Device> {
  await delay(200);
  const dev = mockDevices.find(d => d.id === deviceId);
  if (!dev) {
    return Promise.reject(new Error(`设备 ${deviceId} 未找到`));
  }
  const [history, currentAlarms] = await Promise.all([
    fetchDeviceHistory(deviceId),
    fetchAlarms(deviceId),
  ]);
  return {
    ...dev,
    history,
    currentAlarms,
  };
}

/**
 * 获取告警列表
 */
export async function fetchAlarms(deviceId?: number): Promise<Alarm[]> {
  await delay(200);
  if (deviceId != null) {
    const dev = mockDevices.find(d => d.id === deviceId);
    if (!dev) {
      return Promise.reject(new Error(`设备 ${deviceId} 未找到`));
    }
    return mockAlarms.filter(a => a.deviceName === dev.name);
  }
  return mockAlarms;
}

/**
 * 确认（ACK）告警
 */
export async function acknowledgeAlarm(alarmId: number): Promise<void> {
  await delay(200);
  const idx = mockAlarms.findIndex(a => a.id === alarmId);
  if (idx === -1) {
    return Promise.reject(new Error(`告警 ${alarmId} 未找到`));
  }
  mockAlarms[idx].status = 'ack';
}

/**
 * 拉取该设备的历史对话
 */
export async function fetchChatHistory(deviceId: number): Promise<ChatMessage[]> {
  await delay(200);
  return mockChatHistory[deviceId] || [];
}



/**
 * 搜索接口：返回匹配的设备和告警
 */
export async function fetchSearchResults(query: string): Promise<SearchResults> {
  await delay(300);
  const lower = query.toLowerCase();
  const devices = mockSearchResults.devices.filter(
    d =>
      d.name.toLowerCase().includes(lower) ||
      d.location.toLowerCase().includes(lower)
  );
  const alarms = mockSearchResults.alarms.filter(
    a =>
      a.message.toLowerCase().includes(lower) ||
      a.deviceName.toLowerCase().includes(lower)
  );
  return { devices, alarms };
}

/* ————— 以下是新增的“传感器数据”接口 ————— */

/**
 * 获取温度类传感器数据
 * （真实后端请使用 GET /api/devices/:id/sensors/temperature）
 */
export async function fetchTemperatureData(deviceId: number): Promise<SensorReading[]> {
  await delay(300);
  const locations = ['轴承', '减速箱', '行走轮轴承', '电控箱'];
  const now = Date.now();
  const readings: SensorReading[] = [];
  locations.forEach(loc => {
    for (let i = 0; i < 20; i++) {
      readings.push({
        location: loc,
        timestamp: new Date(now - (19 - i) * 60 * 1000).toISOString(),
        value: parseFloat((20 + Math.random() * 60).toFixed(1)), // 20~80°C
      });
    }
  });
  return readings;
}

/**
 * 获取振动类传感器数据
 * （真实后端请使用 GET /api/devices/:id/sensors/vibration）
 */
export async function fetchVibrationData(deviceId: number): Promise<SensorReading[]> {
  await delay(300);
  const locations = ['电机壳体', '减速机箱体', '导向轮支架'];
  const now = Date.now();
  const readings: SensorReading[] = [];
  locations.forEach(loc => {
    for (let i = 0; i < 20; i++) {
      readings.push({
        location: loc,
        timestamp: new Date(now - (19 - i) * 60 * 1000).toISOString(),
        value: parseFloat((Math.random() * 5).toFixed(2)), // 0~5 m/s²
      });
    }
  });
  return readings;
}

/**
 * 获取张力类传感器数据
 * （真实后端请使用 GET /api/devices/:id/sensors/tension）
 */
export async function fetchTensionData(deviceId: number): Promise<SensorReading[]> {
  await delay(300);
  const locations = ['钢丝绳端', '张紧轮', '货叉链条'];
  const now = Date.now();
  const readings: SensorReading[] = [];
  locations.forEach(loc => {
    for (let i = 0; i < 20; i++) {
      readings.push({
        location: loc,
        timestamp: new Date(now - (19 - i) * 60 * 1000).toISOString(),
        value: parseFloat((100 + Math.random() * 400).toFixed(1)), // 100~500 N
      });
    }
  });
  return readings;
}

/**
 * 获取位移类传感器数据
 * （真实后端请使用 GET /api/devices/:id/sensors/displacement）
 */
export async function fetchDisplacementData(deviceId: number): Promise<SensorReading[]> {
  await delay(300);
  const locations = ['立柱挠曲', '货叉行程', '行程端定位'];
  const now = Date.now();
  const readings: SensorReading[] = [];
  locations.forEach(loc => {
    for (let i = 0; i < 20; i++) {
      readings.push({
        location: loc,
        timestamp: new Date(now - (19 - i) * 60 * 1000).toISOString(),
        value: parseFloat((Math.random() * 50).toFixed(2)), // 0~50 mm
      });
    }
  });
  return readings;
}

/**
 * 获取角度类传感器数据
 * （真实后端请使用 GET /api/devices/:id/sensors/angle）
 */
export async function fetchAngleData(deviceId: number): Promise<SensorReading[]> {
  await delay(300);
  const locations = ['立柱倾斜', '货叉水平'];
  const now = Date.now();
  const readings: SensorReading[] = [];
  locations.forEach(loc => {
    for (let i = 0; i < 20; i++) {
      readings.push({
        location: loc,
        timestamp: new Date(now - (19 - i) * 60 * 1000).toISOString(),
        value: parseFloat((Math.random() * 4 - 2).toFixed(2)), // -2~2 度
      });
    }
  });
  return readings;
}

/**
 * 获取电流/电压类传感器数据
 * （真实后端请使用 GET /api/devices/:id/sensors/electrical）
 */
export async function fetchCurrentVoltageData(deviceId: number): Promise<SensorReading[]> {
  await delay(300);
  const locations = ['电机回路电流', 'UPS 电压'];
  const now = Date.now();
  const readings: SensorReading[] = [];
  locations.forEach(loc => {
    for (let i = 0; i < 20; i++) {
      readings.push({
        location: loc,
        timestamp: new Date(now - (19 - i) * 60 * 1000).toISOString(),
        value:
          loc.includes('电流')
            ? parseFloat((Math.random() * 10).toFixed(2)) // 0~10 A
            : parseFloat((24 + Math.random() * 24).toFixed(1)), // 24~48 V
      });
    }
  });
  return readings;
}


