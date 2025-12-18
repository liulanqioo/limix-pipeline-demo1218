import React, { useState } from 'react';
import { Card, Button, Table, Tag, Progress, Select, Message, Badge } from '@arco-design/web-react';
import { ListTodo, Play, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { SectionTitle } from '../common';
import { nowTimeStr } from '../../utils';

const { Option } = Select;

export const TasksPanel = ({ quickMode, runs, setRuns }) => {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const startRun = () => {
    setRunning(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunning(false);
          const newRun = {
            id: `run-${Date.now().toString().slice(-4)}`,
            taskName: "新训练任务 (Mock)",
            taskType: "分类",
            target: "is_overdue_30m",
            status: "已完成",
            durationSec: quickMode ? 12 : 45,
            metrics: { AUC: 0.92, F1: 0.81 },
            version: `data:v2 · ${nowTimeStr()}`,
          };
          setRuns([newRun, ...runs]);
          Message.success("训练任务完成！");
          return 100;
        }
        return prev + (quickMode ? 20 : 5);
      });
    }, 500);
  };

  const columns = [
    { title: '任务ID', dataIndex: 'id', render: t => <span className="font-mono text-gray-500">{t}</span> },
    { title: '任务名称', dataIndex: 'taskName', render: t => <span className="font-medium">{t}</span> },
    { title: '类型', dataIndex: 'taskType', render: t => <Tag color={t === '分类' ? 'blue' : 'orange'}>{t}</Tag> },
    { title: '目标', dataIndex: 'target', render: t => <code className="bg-gray-100 px-1 rounded">{t}</code> },
    { title: '状态', dataIndex: 'status', render: t => t === '已完成' ? <Badge status="success" text={t} /> : <Badge status="processing" text={t} /> },
    { title: '耗时', dataIndex: 'durationSec', render: t => `${t}s` },
    { title: '核心指标', dataIndex: 'metrics', render: t => (
        <div className="flex gap-2">
          {Object.entries(t).map(([k, v]) => (
            <Tag key={k} color="arcoblue" bordered>{k}: {v}</Tag>
          ))}
        </div>
      ) 
    },
    { title: '版本', dataIndex: 'version', className: 'text-xs text-gray-400' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <SectionTitle icon={ListTodo} title="任务配置与训练" />
        <Button type="primary" icon={<Play />} loading={running} onClick={startRun}>
          {running ? `训练中 ${progress}%` : "新建并运行任务"}
        </Button>
      </div>

      {running && (
        <Card className="rounded-xl shadow-sm border-blue-100 bg-blue-50/50 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span>正在训练模型: Gradient Boosting (LightGBM)...</span>
                <span>{progress}%</span>
              </div>
              <Progress percent={progress} showText={false} status="active" />
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 rounded-xl shadow-sm" title="快速配置">
          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-medium">任务类型</div>
              <Select defaultValue="classification" className="w-full">
                <Option value="classification">分类 (Classification)</Option>
                <Option value="regression">回归 (Regression)</Option>
              </Select>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">目标列 (Label)</div>
              <Select defaultValue="is_overdue_30m" className="w-full">
                <Option value="is_overdue_30m">is_overdue_30m</Option>
                <Option value="resolve_minutes">resolve_minutes</Option>
              </Select>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium">评估指标</div>
              <Select mode="multiple" defaultValue={['AUC', 'F1']} className="w-full">
                <Option value="AUC">AUC</Option>
                <Option value="F1">F1-Score</Option>
                <Option value="RMSE">RMSE</Option>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 rounded-xl shadow-sm" title="任务队列 (Runs)">
          <Table columns={columns} data={runs} pagination={{ pageSize: 5 }} rowKey="id" />
        </Card>
      </div>
    </div>
  );
};
