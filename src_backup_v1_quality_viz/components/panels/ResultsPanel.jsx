import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Badge, Select, Message } from '@arco-design/web-react';
import { BarChart3, ShieldCheck, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_THRESHOLD, MOCK_GROUP_ERROR, MOCK_CONFIDENCE } from '../../mock/data';
import { SectionTitle, MetricPill, HeatGrid } from '../common';

const { Option } = Select;

export const ResultsPanel = ({ notify, openModal }) => {
  const [published, setPublished] = useState(false);
  const [selectedTh, setSelectedTh] = useState(0.4);

  const best = useMemo(() => {
    return MOCK_THRESHOLD.reduce((a, b) => (b.benefit > a.benefit ? b : a), MOCK_THRESHOLD[0]);
  }, []);

  useEffect(() => {
    setSelectedTh(best.th);
  }, [best.th]);

  const publish = () => {
    setPublished(true);
    notify("阈值策略已发布", `已发布阈值 ${selectedTh}，并绑定收益曲线（Mock）`);
    openModal(
      "阈值策略详情（Mock）",
      <div className="space-y-3">
        <div className="grid md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border bg-gray-50">
            <div className="text-xs text-gray-500">阈值</div>
            <div className="mt-1 font-semibold text-lg">{selectedTh}</div>
          </div>
          <div className="p-3 rounded-xl border bg-gray-50">
            <div className="text-xs text-gray-500">收益（Mock）</div>
            <div className="mt-1 font-semibold text-lg">{MOCK_THRESHOLD.find((x) => x.th === selectedTh)?.benefit ?? "-"}</div>
          </div>
          <div className="p-3 rounded-xl border bg-gray-50">
            <div className="text-xs text-gray-500">绑定动作</div>
            <div className="mt-1 font-semibold text-lg">派单 + 抄送 + 复核</div>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-sm">上线后建议：按区域分组监控误差；漂移 PSI&gt;0.2 时自动触发重评估。</div>
        <div className="flex items-center gap-2 mt-4">
          <Button type="primary" onClick={() => notify("已生成", "已生成上线检查清单（Mock）")}>生成上线清单</Button>
          <Button onClick={() => notify("已回滚", "阈值策略已回滚到上一版本（Mock）")}>回滚</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <SectionTitle
          icon={BarChart3}
          title="结果页（高精度/高性能必须“证据化”）"
        />
        <div className="flex items-center gap-2">
          <Tag color={published ? "green" : "gray"}>
            策略：{published ? "已发布" : "未发布"}
          </Tag>
          <Button type="primary" onClick={publish}>
            一键发布阈值策略
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <MetricPill label="分类 AUC" value={0.91} unit="" sub="同口径可复现" />
        <MetricPill label="分类 F1" value={0.78} unit="" sub="阈值可调" />
        <MetricPill label="回归 RMSE" value={18.4} unit="min" sub="分组误差可追" />
        <MetricPill label="端到端耗时" value={"~20"} unit="s" sub="模式可切换" />
      </div>

      <Card className="rounded-xl shadow-sm" title="分组误差热力图（区域 × 事件类型）">
        <div className="h-64 flex flex-col gap-2">
           <HeatGrid data={MOCK_GROUP_ERROR.matrix} />
           <div className="flex justify-between text-xs text-gray-400 px-2 mt-2">
              <span>{MOCK_GROUP_ERROR.cols.join(" / ")} (X)</span>
              <span>{MOCK_GROUP_ERROR.rows.join(" / ")} (Y)</span>
           </div>
        </div>
        <div className="mt-4 pt-4 border-t flex gap-2">
            <Button size="small" type="primary" status="warning" onClick={() => notify("已生成纠偏清单", "已为 Top 误差格子生成补数据/调阈值建议（Mock）")}>生成纠偏清单</Button>
            <Button size="small" onClick={() => notify("已创建工单", "已创建“分组误差治理”工单（Mock）")}>创建治理工单</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl shadow-sm" title="置信度分布（可转人工复核队列）">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CONFIDENCE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="bin" hide />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#165DFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
               <CheckCircle className="w-4 h-4 text-green-600" />
               建议：置信度 &lt; 0.2 的样本进入人工复核队列。
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="small" type="primary" onClick={() => notify("复核队列已创建", "低置信度样本已自动入队（Mock）")}>一键创建复核队列</Button>
              <Button size="small" onClick={() => notify("已生成规则", "复核SOP已生成（Mock）")}>生成复核SOP</Button>
            </div>
        </Card>

        <Card className="rounded-xl shadow-sm" title="阈值-收益曲线（把指标翻译成钱/时间）">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium">选择阈值</span>
              <Select
                value={selectedTh}
                onChange={setSelectedTh}
                style={{ width: 200 }}
              >
                {MOCK_THRESHOLD.map((x) => (
                  <Option key={x.th} value={x.th}>
                    {x.th}（收益 {x.benefit}）
                  </Option>
                ))}
              </Select>
              <Badge status="success" text={`推荐：${best.th}`} />
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_THRESHOLD} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="th" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8 }} />
                  <Line type="monotone" dataKey="benefit" stroke="#165DFF" strokeWidth={3} dot={{r:4}} name="收益" />
                  <Line type="monotone" dataKey="precision" stroke="#00B42A" strokeWidth={2} dot={{r:3}} name="准确率" />
                  <Line type="monotone" dataKey="recall" stroke="#F53F3F" strokeWidth={2} dot={{r:3}} name="召回率" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="small" type="primary" onClick={publish}>发布当前阈值</Button>
              <Button size="small" onClick={() => notify("已导出", "阈值-收益曲线已导出为报告片段（Mock）")}>导出曲线</Button>
            </div>
        </Card>
      </div>
    </div>
  );
};

// Helper component for Tag if not imported from arco
function Tag({ children, color }) {
    return <span className={`px-2 py-0.5 rounded text-xs bg-${color}-100 text-${color}-700 border border-${color}-200`}>{children}</span>
}
