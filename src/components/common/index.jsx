import React from 'react';
import { Card, Progress, Typography } from '@arco-design/web-react';
import { cn } from '../../utils';

export const MetricPill = ({ label, value, sub, active = false, onClick }) => (
  <Card
    className={cn(
      "cursor-pointer transition-all hover:shadow-md",
      active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:bg-muted/50"
    )}
    onClick={onClick}
    bodyStyle={{ padding: '12px' }}
  >
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-2xl font-bold my-1 text-foreground">{value}</div>
    {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
  </Card>
);

export const SectionTitle = ({ icon: Icon, title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
    </div>
    {action}
  </div>
);

export const HeatGrid = ({ data = [] }) => {
  // Mock implementation for demo if data is missing
  const gridData = data.length ? data : Array(5).fill(0).map(() => Array(7).fill(0).map(() => Math.random()));
  
  return (
    <div className="grid grid-cols-7 gap-1">
      {gridData.map((row, i) => (
        row.map((val, j) => (
          <div
            key={`${i}-${j}`}
            className="aspect-square rounded-sm transition-all hover:scale-110"
            style={{
              backgroundColor: `hsl(var(--primary) / ${0.1 + val * 0.9})`,
              opacity: 0.8 + val * 0.2
            }}
            title={`Value: ${val.toFixed(2)}`}
          />
        ))
      ))}
    </div>
  );
};

export const Stepper = ({ step }) => {
  const steps = ["数据接入", "数据体检", "数据清洗", "特征工程", "任务配置", "模型训练", "结果评估", "解释分析", "交付部署"];
  return (
    <div className="relative">
      <div className="flex justify-between mb-2 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className={cn("text-xs font-medium transition-colors whitespace-nowrap px-1", i <= step ? "text-primary" : "text-muted-foreground")}>
            {s}
          </div>
        ))}
      </div>
      <Progress percent={(step / (steps.length - 1)) * 100} showText={false} size="small" status="active" />
    </div>
  );
};
