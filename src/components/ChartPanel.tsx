// src/components/ChartPanel.tsx
import React from "react";
// 修改: 使用 recharts 画线图
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

interface DataPoint {
  timestamp: string;
  value: number;
}

interface ChartPanelProps {
  data: DataPoint[];
}

const ChartPanel: React.FC<ChartPanelProps> = ({ data }) => {
  const { t } = useTranslation(); // 使用 useTranslation hook

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        {/* 修改: 格式化 X 轴时间 */}
        {/* 显式声明 label 是 string */}
        <XAxis dataKey="timestamp" tickFormatter={(label: string) => label.slice(11, 19)} />

        <YAxis />
        {/* 修改: Tooltip 标签格式 */}
        {/* labelFormatter 的参数是当前数据点的标签（时间戳），t 是翻译函数 */}
        <Tooltip labelFormatter={(label: string) => `${t('time')}: ${label}`} /> {/* 翻译“时间: ”，并正确显示时间戳 */}
        <Line type="monotone" dataKey="value" stroke="#1890ff" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartPanel;
