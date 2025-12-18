import React, { useState, useMemo } from 'react';
import { Slider, Card, Grid, Typography, Tag, Progress } from '@arco-design/web-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SectionTitle } from '../common';
import { MOCK_SHAP } from '../../mock/data';
import { cn, clamp01 } from '../../utils';

const { Row, Col } = Grid;
const { Text } = Typography;

export const ExplainPanel = ({ notify, openModal }) => {
  const [units, setUnits] = useState(10);
  const [dist, setDist] = useState(8);
  const [queue, setQueue] = useState(25);

  const risk = useMemo(() => {
    // 简单的模拟公式：
    // 基准 0.25
    // 队列越长风险越高 (+ queue * 0.01)
    // 距离越远风险越高 (+ dist * 0.02)
    // 运力越多风险越低 (- units * 0.015)
    const base = 0.25 + queue * 0.01 + dist * 0.02 - units * 0.015;
    return clamp01(base);
  }, [units, dist, queue]);

  const getRiskColor = (r) => {
    if (r < 0.3) return 'rgb(var(--success-6))'; // Green
    if (r < 0.7) return 'rgb(var(--warning-6))'; // Orange
    return 'rgb(var(--danger-6))';  // Red
  };

  const riskPercent = (risk * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="模型解释 & 归因" description="SHAP 归因分析与反事实模拟" />
      </div>

      <Row gutter={24}>
        {/* SHAP Chart */}
        <Col span={12}>
          <Card className="h-full rounded-xl shadow-sm border-none" title="局部归因 (SHAP)">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_SHAP} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="feature" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const v = payload[0].value;
                        return (
                          <div className="bg-white p-2 border rounded shadow text-xs">
                            {payload[0].payload.feature}: <span className="font-bold">{v > 0 ? '+' : ''}{v}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                    {MOCK_SHAP.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? 'rgb(var(--danger-6))' : 'rgb(var(--success-6))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              * 红色表示推高风险，绿色表示降低风险。当前 Case 主要受 queue_len 影响。
            </div>
          </Card>
        </Col>

        {/* Counterfactual Simulation */}
        <Col span={12}>
          <Card className="h-full rounded-xl shadow-sm border-none" title="反事实模拟 (Counterfactual)">
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">模拟预测风险</div>
                  <div className="text-2xl font-bold mt-1" style={{ color: getRiskColor(risk) }}>
                    {riskPercent}%
                  </div>
                </div>
                <div className="w-24">
                   <Progress 
                    percent={risk * 100} 
                    showText={false} 
                    color={getRiskColor(risk)}
                    size="small"
                   />
                </div>
              </div>

              <div className="space-y-4">
                {/* Sliders */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Active Units (运力)</span>
                    <span className="font-mono text-gray-500">{units}</span>
                  </div>
                  <Slider
                    min={0} max={50} step={1}
                    value={units}
                    onChange={setUnits}
                    marks={{ 0: '0', 50: '50' }}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Distance (公里)</span>
                    <span className="font-mono text-gray-500">{dist} km</span>
                  </div>
                  <Slider
                    min={0} max={20} step={0.5}
                    value={dist}
                    onChange={setDist}
                    marks={{ 0: '0', 20: '20' }}
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Queue Len (排队)</span>
                    <span className="font-mono text-gray-500">{queue}</span>
                  </div>
                  <Slider
                    min={0} max={100} step={1}
                    value={queue}
                    onChange={setQueue}
                    marks={{ 0: '0', 100: '100' }}
                  />
                </div>
              </div>
              
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                拖动滑块可实时模拟特征变化对模型打分的影响，用于辅助人工复核。
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
