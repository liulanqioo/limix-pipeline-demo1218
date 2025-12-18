import React from 'react';
import { Select, Switch, Tag, Typography, Avatar } from '@arco-design/web-react';
import { Database, Activity, Zap } from 'lucide-react';
import { SCENES, MOCK_DATASETS } from '../../mock/data';

const { Option } = Select;
const { Text } = Typography;

export const TopBar = ({ sceneId, setSceneId, quickMode, setQuickMode, datasetId, setDatasetId }) => {
  return (
    <div className="bg-white border-b sticky top-0 z-50 px-4 py-3 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="text-white h-5 w-5" />
          </div>
          <div className="font-bold text-lg hidden md:block">LimiX Demo</div>
        </div>
        <div className="h-6 w-px bg-border mx-2" />
        
        <Select
          value={sceneId}
          onChange={setSceneId}
          style={{ width: 280 }}
          triggerProps={{
            autoAlignPopupWidth: false,
            autoAlignPopupMinWidth: true,
            position: 'bl',
          }}
        >
          {SCENES.map((s) => (
            <Option key={s.id} value={s.id}>
              <div className="flex flex-col py-1">
                <span className="font-medium">{s.name.split("：")[0]}</span>
                <span className="text-xs text-gray-500 truncate">{s.name.split("：")[1]}</span>
              </div>
            </Option>
          ))}
        </Select>

        <Select
          value={datasetId}
          onChange={setDatasetId}
          style={{ width: 200 }}
          prefix={<Database className="h-4 w-4 text-gray-500" />}
        >
          {MOCK_DATASETS.map((d) => (
            <Option key={d.id} value={d.id}>
              {d.name} ({d.version})
            </Option>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border">
          <Zap className={`h-4 w-4 ${quickMode ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`} />
          <span className="text-sm font-medium">极速模式</span>
          <Switch checked={quickMode} onChange={setQuickMode} size="small" />
        </div>
        <div className="flex items-center gap-2">
          <Avatar size={32} style={{ backgroundColor: '#165DFF' }}>D</Avatar>
          <div className="hidden md:flex flex-col text-xs">
            <span className="font-medium">Demo User</span>
            <span className="text-gray-500">Data Scientist</span>
          </div>
        </div>
      </div>
    </div>
  );
};
