import React, { useState } from 'react';
import { Card, Button, Steps, Modal, Table, Tag, Message } from '@arco-design/web-react';
import { Wand2, Play, Plus, Eye, ArrowRight, Trash2, AlertTriangle } from 'lucide-react';
import { SectionTitle } from '../common';

const Step = Steps.Step;

export const CleanPanel = ({ setActive }) => {
  const [strategies, setStrategies] = useState([
    { id: 1, name: "缺失值填充", method: "MICE (多重插补)", status: "ready" },
    { id: 2, name: "异常值处理", method: "Isolation Forest", status: "ready" },
    { id: 3, name: "数据标准化", method: "Z-Score", status: "ready" },
  ]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const runClean = () => {
    const loading = Message.loading("正在执行清洗策略...", 0);
    setTimeout(() => {
      loading.close();
      Message.success("清洗完成，生成数据集 v2");
      setStrategies(s => s.map(i => ({ ...i, status: "done" })));
    }, 1500);
  };

  const previewData = [
    { key: 1, col: "distance_km", raw: "NaN", clean: "12.5 (imputed)", diff: "填充" },
    { key: 2, col: "resolve_minutes", raw: "9999", clean: "45 (capped)", diff: "盖帽" },
    { key: 3, col: "severity", raw: "high", clean: "3 (mapped)", diff: "映射" },
    { key: 4, col: "region_id", raw: "null", clean: "R01 (mode)", diff: "填充" },
  ];

  const columns = [
    { title: '字段', dataIndex: 'col' },
    { title: '原始值', dataIndex: 'raw', render: t => <span className="text-red-500 line-through">{t}</span> },
    { title: '清洗后', dataIndex: 'clean', render: t => <span className="text-green-600 font-medium">{t}</span> },
    { title: '操作', dataIndex: 'diff', render: t => <Tag color="blue">{t}</Tag> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <SectionTitle icon={Wand2} title="清洗方案配置" />
        <div className="flex gap-2">
          <Button icon={<Plus />} onClick={() => Message.info("添加策略 (Mock)")}>添加策略</Button>
          <Button icon={<Eye />} onClick={() => setPreviewOpen(true)}>预览效果</Button>
          <Button type="primary" icon={<Play />} onClick={runClean}>执行清洗</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 rounded-xl shadow-sm" title="清洗流水线 (DAG)">
          <div className="p-4 bg-gray-50 rounded-lg min-h-[300px] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
             <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
                {Array(36).fill(0).map((_,i) => <div key={i} className="border-r border-b border-gray-400" />)}
             </div>
             
             <div className="flex flex-col gap-6 w-full max-w-md z-10">
               <div className="bg-white p-3 rounded-xl border shadow-sm text-center font-mono text-sm text-gray-500">Input: incident_wide_v1</div>
               {strategies.map((s, i) => (
                 <div key={s.id} className="relative group">
                   <div className={`bg-white p-4 rounded-xl border-l-4 shadow-sm flex justify-between items-center transition-all ${s.status === 'done' ? 'border-l-green-500 shadow-green-100' : 'border-l-blue-500'}`}>
                     <div>
                       <div className="font-bold text-gray-800">{s.name}</div>
                       <div className="text-xs text-gray-500 mt-1 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{s.method}</div>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="mini" shape="circle" icon={<Eye />} />
                        <Button size="mini" shape="circle" status="danger" icon={<Trash2 />} />
                     </div>
                   </div>
                   {i < strategies.length - 1 && (
                     <div className="absolute left-1/2 -bottom-6 w-0.5 h-6 bg-gray-300 -ml-px" />
                   )}
                 </div>
               ))}
               <div className="bg-white p-3 rounded-xl border shadow-sm text-center font-mono text-sm text-gray-500">Output: incident_wide_v2</div>
             </div>
          </div>
        </Card>

        <Card className="rounded-xl shadow-sm" title="智能推荐">
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="font-medium text-blue-800 mb-1 flex items-center gap-2">
                <Wand2 className="w-4 h-4" /> 推荐策略
              </div>
              <p className="text-xs text-blue-600 mb-3">检测到 "resolve_minutes" 存在长尾分布，建议使用 Box-Cox 变换。</p>
              <Button size="mini" type="primary" onClick={() => {
                setStrategies([...strategies, { id: 4, name: "分布变换", method: "Box-Cox", status: "ready" }]);
                Message.success("已应用推荐策略");
              }}>应用</Button>
            </div>
            
             <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="font-medium text-orange-800 mb-1 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> 潜在风险
              </div>
              <p className="text-xs text-orange-600">删除 5% 的行可能会导致样本偏差，建议使用加权。</p>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        title="清洗效果预览 (Sample)"
        visible={previewOpen}
        onOk={() => setPreviewOpen(false)}
        onCancel={() => setPreviewOpen(false)}
        style={{ width: 700 }}
      >
        <Table columns={columns} data={previewData} pagination={false} rowKey="key" />
        <div className="mt-4 text-right text-xs text-gray-500">预览基于前 1000 行采样数据计算</div>
      </Modal>
    </div>
  );
};
