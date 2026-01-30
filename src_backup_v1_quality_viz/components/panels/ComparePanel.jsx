import React from 'react';
import { Card, Grid, Button, Table, Typography, Message } from '@arco-design/web-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Download } from 'lucide-react';
import { SectionTitle } from '../common';
import { MOCK_COMPARE } from '../../mock/data';

const { Row, Col } = Grid;

export const ComparePanel = ({ notify, openModal }) => {

  const exportCompare = () => {
    notify("对比报告已生成", "已生成同口径对比报告（Mock）");
    openModal(
      "对比报告预览（Mock）",
      <div className="space-y-4">
        <div className="text-sm text-gray-500">对比维度：工作量 / 稳定性 / 复现性 / 解释性 / 交付完整度</div>
        <div className="p-3 rounded-lg bg-gray-50 text-xs text-gray-500 border border-gray-200">
          提示：这里的数值为演示占位，真实版本应接入同一套评测流水线产出。
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border bg-white shadow-sm">
            <div className="font-bold text-gray-800 mb-1">XGBoost</div>
            <div className="text-sm text-gray-600">强在可控/可解释，但训练与工程成本高</div>
          </div>
          <div className="p-4 rounded-xl border bg-white shadow-sm">
            <div className="font-bold text-gray-800 mb-1">AutoGluon</div>
            <div className="text-sm text-gray-600">强在自动化，但仍需训练预算与环境固化</div>
          </div>
          <div className="p-4 rounded-xl border bg-white shadow-sm">
            <div className="font-bold text-gray-800 mb-1">通用 LLM</div>
            <div className="text-sm text-gray-600">强在表达与交互，但结构化指标与复现不稳</div>
          </div>
          <div className="p-4 rounded-xl border bg-blue-50 border-blue-100 shadow-sm">
            <div className="font-bold text-blue-700 mb-1">LimiX (本方案)</div>
            <div className="text-sm text-blue-600">强在“流水线产品化 + 可交付链路”，兼顾效果与效率</div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
            <Button type="primary" icon={<Download />} onClick={() => Message.success("对比报告已下载（Mock）")}>
                下载对比报告
            </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="方案对比 (Benchmark)" description="LimiX 与主流方案的多维度对比" />
        <Button onClick={exportCompare}>生成对比报告</Button>
      </div>

      <Row gutter={24}>
        {/* Radar Chart */}
        <Col span={12}>
          <Card className="h-full rounded-xl shadow-sm border-none" title="多维能力雷达图">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={MOCK_RADAR}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                  
                  <Radar name="LimiX" dataKey="LimiX" stroke="rgb(var(--primary-6))" fill="rgb(var(--primary-6))" fillOpacity={0.4} />
                  <Radar name="XGBoost" dataKey="XGBoost" stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.2} />
                  <Radar name="LLM" dataKey="LLM" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                  
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* Detailed Comparison */}
        <Col span={12}>
          <Card className="h-full rounded-xl shadow-sm border-none" title="详细评估">
             <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                        <div className="font-semibold text-gray-800">交付效率 (Time-to-Value)</div>
                        <div className="text-sm text-gray-500 mt-1">LimiX 提供了端到端的流水线，从数据清洗到服务化部署一站式完成，比传统手动胶水代码快 3-5 倍。</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">2</div>
                    <div>
                        <div className="font-semibold text-gray-800">可解释性与合规性</div>
                        <div className="text-sm text-gray-500 mt-1">内置 SHAP 归因与反事实模拟，不仅给分，更给理由，满足政务/金融场景的审计要求。</div>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">3</div>
                    <div>
                        <div className="font-semibold text-gray-800">稳定性与运维</div>
                        <div className="text-sm text-gray-500 mt-1">集成 Drift 检测与健康度监控，解决模型上线后“静默失败”的痛点。</div>
                    </div>
                </div>
             </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
