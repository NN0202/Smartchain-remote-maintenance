// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, Input, Avatar, Switch, Space } from "antd";
import {
  DashboardOutlined,
  ExclamationCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Dashboard from "./pages/Dashboard";
import AlarmPage from "./pages/AlarmPage";
import DevicePage from "./pages/DevicePage";
import FaultHistoryPage from "./pages/FaultHistoryPage";
// 确保导入 SearchResults 和 NotFound，如果它们是你的应用的一部分
// import { SearchResults } from "./pages/SearchResults";
// import { NotFound } from "./pages/NotFound";
import MapPage from "./pages/MapPage"; // 导入 MapPage

import { NotificationBell } from "./components/NotificationBell";
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation
import "./App.css";

const { Header, Sider, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(); // 使用 useTranslation hook

  const toggleTheme = (checked: boolean) => {
    setDarkMode(checked);
    document.body.setAttribute("data-theme", checked ? "dark" : "light");
  };

  // 根据当前路径高亮菜单
  const selectedKey = location.pathname.startsWith("/alarms")
    ? "alarms"
    : location.pathname.startsWith("/map") // 添加对 /map 路径的判断
    ? "map" // 如果是 /map 路径，则选中 'map' 菜单项
    : "dashboard";

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme={darkMode ? "dark" : "light"}
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
        }}
      >
        <div className="logo" style={{ padding: 16, textAlign: "center" }}>
          <img src="/logo512.png" alt="logo" style={{ maxWidth: 32 }} />
          {/* 修改应用名称为翻译键 */}
          {!collapsed && <h1 style={{ color: "#fff", margin: 8 }}>{t('appName')}</h1>}
        </div>
        <Menu
          theme={darkMode ? "dark" : "light"}
          mode="inline"
          selectedKeys={[selectedKey]}
        >
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined />}
            onClick={() => navigate("/")}
          >
            {/* 修改仪表盘为翻译键 */}
            {t('dashboard')}
          </Menu.Item>
          <Menu.Item
            key="alarms"
            icon={<ExclamationCircleOutlined />}
            onClick={() => navigate("/alarms")}
          >
            {/* 修改告警管理为翻译键 */}
            {t('alarmManagement')}
          </Menu.Item>
          <Menu.Item
            key="map" // 添加地图菜单项
            icon={<DashboardOutlined />} // 可以选择合适的图标
            onClick={() => navigate("/map")} // 点击跳转到地图页面
          >
            {t('map')} {/* 使用翻译键 'map' */}
          </Menu.Item>
          <Menu.Item
            key="toggle"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          >
            {/* 修改展开/收起为翻译键 */}
            {collapsed ? t('expand') : t('collapse')}
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Header className="app-header" style={{ padding: "0 24px", background: "#fff" }}>
          <div style={{ float: "left" }}>
            <Input.Search
              placeholder={t('searchPlaceholder')} // 翻译搜索占位符
              style={{ width: 240 }}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onSearch={val => console.log("search", val)}
            />
          </div>
          <div style={{ float: "right" }}>
            <Space size="middle">
              <LanguageSwitcher />
              <NotificationBell />
              <Switch
                checked={darkMode}
                checkedChildren="🌙"
                unCheckedChildren="☀️"
                onChange={toggleTheme}
              />
              <Avatar icon={<UserOutlined />} />
            </Space>
          </div>
        </Header>

        <Content className="app-content" style={{ padding: 24 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alarms" element={<AlarmPage />} />
            <Route path="/devices/:deviceId" element={<DevicePage />} />
            <Route path="/faults/:deviceId" element={<FaultHistoryPage />} />
            <Route path="/map" element={<MapPage />} /> {/* 添加地图路由 */}
            {/* 确保这些路由存在，如果需要的话 */}
            {/* <Route path="/search" element={<SearchResults />} /> */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          {t('footerText')} {/* 翻译页脚文本 */}
        </Footer>
      </Layout>
    </Layout>
  );
};

const App: React.FC = () => (
  <BrowserRouter>
    <AppLayout />
  </BrowserRouter>
);

export default App;