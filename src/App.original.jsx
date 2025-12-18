import React, { useState } from 'react';
import { Layout, Message, Modal } from '@arco-design/web-react';
import { TopBar, SideNav } from './components/layout';
import {
  DatasetsPanel,
  HealthPanel,
  CleanPanel,
  FeaturesPanel,
  TasksPanel,
  ResultsPanel,
  ExplainPanel,
  DeliverPanel,
  ComparePanel
} from './components/panels';

// Mock Data
import { MOCK_RUNS_BASE } from './mock/data';

const { Content, Sider, Header } = Layout;

function App() {
  const [active, setActive] = useState("datasets");
  const [sceneId, setSceneId] = useState("gov_incident");
  const [quickMode, setQuickMode] = useState(true);
  const [datasetId, setDatasetId] = useState("incident_wide_v1");
  const [runs, setRuns] = useState(MOCK_RUNS_BASE);

  // Global Notification Wrapper (Adapter for Panels)
  const notify = (title, desc = "") => {
    Message.info({
      icon: <span />, // Optional: hide default icon if needed, or use default
      content: (
        <div className="flex flex-col items-start">
          <span className="font-bold">{title}</span>
          {desc && <span className="text-xs text-gray-500 mt-1">{desc}</span>}
        </div>
      ),
      position: 'top',
      showIcon: true,
    });
  };

  // Global Modal Wrapper (Adapter for Panels)
  const openModal = (title, content) => {
    Modal.info({
      title: title,
      content: content,
      style: { width: 600 },
      okText: "关闭",
      hideCancel: true,
    });
  };

  const renderContent = () => {
    const props = {
      notify,
      openModal,
      datasetId,
      setDatasetId,
      runs,
      setRuns
    };

    switch (active) {
      case "datasets": return <DatasetsPanel {...props} />;
      case "health": return <HealthPanel {...props} />;
      case "clean": return <CleanPanel {...props} />;
      case "features": return <FeaturesPanel {...props} />;
      case "tasks": return <TasksPanel {...props} />;
      case "results": return <ResultsPanel {...props} />;
      case "explain": return <ExplainPanel {...props} />;
      case "deliver": return <DeliverPanel {...props} />;
      case "compare": return <ComparePanel {...props} />;
      default: return <DatasetsPanel {...props} />;
    }
  };

  return (
    <Layout className="h-screen w-full bg-gray-50 overflow-hidden">
      <Header className="bg-white border-b border-gray-200 z-10 px-4 h-16 flex items-center shadow-sm">
        <TopBar
          sceneId={sceneId}
          setSceneId={setSceneId}
          quickMode={quickMode}
          setQuickMode={setQuickMode}
          datasetId={datasetId}
          setDatasetId={setDatasetId}
        />
      </Header>
      
      <Layout className="flex-1 overflow-hidden">
        <Sider 
          width={240} 
          className="bg-white border-r border-gray-200 h-full"
          collapsed={false}
        >
          <SideNav active={active} setActive={setActive} />
        </Sider>
        
        <Content className="p-6 overflow-y-auto h-full scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
