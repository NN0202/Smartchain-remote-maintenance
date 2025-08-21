// src/mock/mockData.ts

/**
 * 设备类型
 */
export interface Device {
    id: number;
    name: string;
    status: 'online' | 'offline';
    location: string;
    info?: {
      model: string;
      ip: string;
    };
    history?: { timestamp: string; value: number }[];
    currentAlarms?: Alarm[];
    lat?: number;
    lng?: number;
  }
  
  /**
   * 告警类型
   */
  export interface Alarm {
    id: number;
    deviceName: string;
    message: string;
    level: 'info' | 'warning' | 'critical';
    timestamp: string;
    status: 'active' | 'ack';
  }
  
  /**
   * 聊天对话
   */
  export interface ChatMessage {
    from: 'user' | 'ai';
    text: string;
  }
  
  /**
   * 搜索结果
   */
  export interface SearchResults {
    devices: Device[];
    alarms: Alarm[];
  }
  
  // ====== mock 设备列表 ======
  export const mockDevices: Device[] = [
    {
      id: 1,
      name: '堆垛机 A01',
      status: 'online',
      location: '库区1',
      info: { model: 'X100', ip: '192.168.0.1' },
      history: [],
      currentAlarms: [],
      lat: 40.670,
      lng: -73.940,
    },
    {
      id: 2,
      name: '堆垛机 A02',
      status: 'offline',
      location: '库区2',
      info: { model: 'X100', ip: '192.168.0.2' },
      history: [],
      currentAlarms: [],
      lat: 34.110,
      lng: -118.410,
    },
    {
      id: 3,
      name: '堆垛机 B01',
      status: 'online',
      location: '库区3',
      info: { model: 'X200', ip: '192.168.0.3' },
      history: [],
      currentAlarms: [],
      lat: 41.840,
      lng: -87.680,
    },
    {
      id: 4,
      name: '堆垛机 B02',
      status: 'offline',
      location: '库区4',
      info: { model: 'X200', ip: '192.168.0.4' },
      history: [],
      currentAlarms: [],
      lat: 29.770,
      lng: -95.390,
    },
    {
      id: 5,
      name: '堆垛机 C01',
      status: 'online',
      location: '库区5',
      info: { model: 'X300', ip: '192.168.0.5' },
      history: [],
      currentAlarms: [],
      lat: 	40.010,
      lng: 	-75.130,
    },
  ];
  
  // ====== mock 告警列表 ======
  export const mockAlarms: Alarm[] = [
    {
      id: 101,
      deviceName: '堆垛机 A01',
      message: '温度高于阈值',
      level: 'critical',
      timestamp: '2025-07-16T10:15:00',
      status: 'active',
    },
    {
      id: 102,
      deviceName: '堆垛机 B01',
      message: '电量低于20%',
      level: 'warning',
      timestamp: '2025-07-16T11:00:00',
      status: 'ack',
    },
    {
      id: 103,
      deviceName: '堆垛机 C01',
      message: '网络连接中断',
      level: 'info',
      timestamp: '2025-07-16T11:30:00',
      status: 'active',
    },
    {
      id: 104,
      deviceName: '堆垛机 A01',
      message: '运行速度异常',
      level: 'warning',
      timestamp: '2025-07-16T12:00:00',
      status: 'active',
    },
    {
      id: 105,
      deviceName: '堆垛机 B02',
      message: '传感器故障',
      level: 'critical',
      timestamp: '2025-07-16T12:30:00',
      status: 'ack',
    },
  ];
  
  // ====== mock 对话记录 ======
  export const mockChatHistory: Record<number, ChatMessage[]> = {
    1: [{ from: 'ai', text: '您好，A01 有什么可以帮您？' }],
    2: [{ from: 'ai', text: 'A02 离线，请检查网络连接。' }],
    3: [{ from: 'ai', text: 'B01 状态正常，温度在安全范围内。' }],
    // 其余设备可按需补充
  };
  
  // ====== mock AI 回复 ======
  export const mockChatResponses: Record<number, string[]> = {
    1: ['请检查轴承温度是否升高。', '建议先执行一次振动分析。'],
    2: ['设备离线，无法执行远程诊断。'],
    3: ['所有参数正常，无需担心。', '建议定期润滑传动部件。'],
    4: ['请重启传感器模块。', '检查传感器接口是否松动。'],
    5: ['网络已恢复，可继续操作。'],
  };
  
  // ====== mock 搜索结果 ======
  export const mockSearchResults: SearchResults = {
    devices: mockDevices,
    alarms: mockAlarms,
  };
  
  