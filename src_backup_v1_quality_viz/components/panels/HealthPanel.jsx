import React, { useState, useMemo } from 'react';
import { Card, Radio, Button, Alert, Message } from '@arco-design/web-react';
import { Stethoscope, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HEALTH_V1 } from '../../mock/data';
import { SectionTitle, MetricPill, HeatGrid } from '../common';
import { cn } from '../../utils';

export const HealthPanel = ({ datasetId, openModal, setActive }) => {
  const [ver, setVer] = useState('v1');

  const healthData = useMemo(() => {
    if (ver === 'v1') return HEALTH_V1;
    // Mock V2 data (improved quality)
    return {
      ...HEALTH_V1,
      summary: HEALTH_V1.summary.map((s) => ({ ...s, value: s.value * 0.1 })),
      drift: HEALTH_V1.drift.map((d) => ({ ...d, psi: d.psi * 0.5 })),
      missingHeat: {
        ...HEALTH_V1.missingHeat,
        matrix: HEALTH_V1.missingHeat.matrix.map((row) => row.map((v) => v * 0.1)),
      },
    };
  }, [ver]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SectionTitle icon={Stethoscope} title="数据体检报告" />
        <div className="flex items-center gap-4 bg-white p-1.5 rounded-lg border shadow-sm">
          <span className="text-sm font-medium ml-2">对比版本：</span>
          <Radio.Group type="button" value={ver} onChange={setVer} size="small">
            <Radio value="v1">原始数据 (v1)</Radio>
            <Radio value="v2">清洗后 (v2)</Radio>
          </Radio.Group>
        </div>
      </div>

      {ver === 'v1' ? (
        <Alert
          type="warning"
          showIcon
          icon={<AlertTriangle />}
          title="发现严重质量问题"
          content="检测到 3 列缺失率 > 5%，2 列存在数据漂移风险，建议立即执行清洗。"
          action={
            <Button size="small" status="warning" onClick={() => setActive('clean')}>
              去清洗 <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          }
        />
      ) : (
        <Alert
          type="success"
          showIcon
          icon={<CheckCircle />}
          title="数据质量良好"
          content="各项指标均在正常范围内，可直接用于模型训练。"
        />
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {healthData.summary.map((item, i) => (
          <MetricPill
            key={i}
            label={item.name}
            value={
              <span>
                {typeof item.value === 'number' ? item.value.toFixed(item.unit === '%' ? 1 : 0) : item.value}
                <span className="text-xs font-normal ml-1 text-muted-foreground">{item.unit}</span>
              </span>
            }
            sub={item.hint}
            active={ver === 'v1' && item.value > (item.unit === '%' ? 5 : 10)}
            onClick={() => openModal(`${item.name}详情`, <div>{item.hint} 详细分布图表（Mock）</div>)}
          />
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="缺失值热力图 (Missing Heatmap)" className="rounded-xl shadow-sm">
          <div className="h-64 flex flex-col gap-2">
            <div className="flex-1">
              <HeatGrid data={healthData.missingHeat.matrix} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-2">
              <span>Fields (X)</span>
              <span>Groups (Y)</span>
            </div>
          </div>
        </Card>

        <Card title="数据漂移趋势 (PSI)" className="rounded-xl shadow-sm">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthData.drift}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#999', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(val) => [val, 'PSI']}
                />
                <Line
                  type="monotone"
                  dataKey="psi"
                  stroke={ver === 'v1' ? '#f53f3f' : '#00b42a'}
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
