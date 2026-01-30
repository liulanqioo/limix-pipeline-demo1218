import React, { useState } from 'react';
import { Card, Switch, Table, Tag, Button, Message, Tooltip } from '@arco-design/web-react';
import { Sparkles, Brain, Code, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { SectionTitle } from '../common';

export const FeaturesPanel = ({ openModal }) => {
  const [autoFe, setAutoFe] = useState(true);

  const importanceData = [
    { name: "distance_km", value: 0.85, type: "原始" },
    { name: "active_units", value: 0.72, type: "原始" },
    { name: "severity", value: 0.65, type: "原始" },
    { name: "dist_per_unit", value: 0.92, type: "衍生" },
    { name: "hour_sin", value: 0.58, type: "衍生" },
    { name: "region_risk", value: 0.78, type: "衍生" },
  ];

  const newFeatures = [
    { name: "dist_per_unit", formula: "distance_km / (active_units + 1)", gain: "+12%" },
    { name: "hour_sin", formula: "sin(2 * pi * hour / 24)", gain: "+5%" },
    { name: "region_risk_avg", formula: "groupby(region).mean(severity)", gain: "+8%" },
    { name: "is_peak_hours", formula: "hour in [8,9,18,19]", gain: "+3%" },
  ];

  const columns = [
    { title: '特征名', dataIndex: 'name', render: t => <span className="font-mono font-bold text-primary">{t}</span> },
    { title: '计算公式', dataIndex: 'formula', render: t => <code className="bg-gray-100 px-2 py-1 rounded text-xs">{t}</code> },
    { title: '信息增益', dataIndex: 'gain', render: t => <Tag color="green">{t}</Tag> },
    { title: '操作', key: 'op', render: () => <Button size="mini" type="text">编辑</Button> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <SectionTitle icon={Sparkles} title="特征工程工厂" />
        <div className="flex items-center gap-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 p-2 rounded-xl border border-violet-100">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-800">AutoFE (LimiX AI)</span>
          </div>
          <Switch checked={autoFe} onChange={(v) => {
            setAutoFe(v);
            Message.info(v ? "已开启自动特征生成" : "已切换为手动模式");
          }} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm" title="特征重要性排行 (Top Features)">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={importanceData} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11 }} />
                <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: 8 }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {importanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.type === '衍生' ? '#722ED1' : '#165DFF'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 justify-center mt-2 text-xs">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-primary rounded-sm"></div> 原始特征</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-600 rounded-sm"></div> AI 衍生特征</div>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm" title={
          <div className="flex justify-between items-center">
            <span>新特征建议</span>
            <Tag color="purple"><Zap className="w-3 h-3 mr-1" /> AI 推荐</Tag>
          </div>
        }>
          <Table columns={columns} data={newFeatures} pagination={false} rowKey="name" size="small" />
          <div className="mt-4 pt-4 border-t text-center">
             <Button type="outline" onClick={() => openModal("特征详情", <div>特征相关性矩阵图（Mock）</div>)}>查看相关性矩阵</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
