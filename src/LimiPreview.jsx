import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Database,
  Stethoscope,
  Sparkles,
  Wand2,
  ListTodo,
  BarChart3,
  ScanSearch,
  Rocket,
  ShieldCheck,
  Timer,
  Layers,
  FileText,
  Bell,
  Code,
  X,
  Check,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

// 注意：本页面所有数据均为 Mock，仅用于演示“平台形态/页面结构/可视化证据链”。

const NAV = [
  { key: "datasets", name: "数据集导入", icon: Database },
  { key: "health", name: "数据质量评估", icon: Stethoscope },
  { key: "clean", name: "清洗方案", icon: Wand2 },
  { key: "features", name: "特征工厂", icon: Sparkles },
  { key: "tasks", name: "任务", icon: ListTodo },
  { key: "results", name: "结果", icon: BarChart3 },
  { key: "explain", name: "解释", icon: ScanSearch },
  { key: "deliver", name: "交付", icon: Rocket },
  { key: "compare", name: "对比证明", icon: ShieldCheck },
];

const SCENES = [
  {
    id: "gov_incident",
    name: "城市应急工单：超时风险 + 处置时长 + 派单建议",
    tag: "ToG",
  },
  {
    id: "mfg_yield",
    name: "制造产线：良率预测 + 停机风险 + 根因解释",
    tag: "ToB",
  },
  {
    id: "crm_churn",
    name: "客户经营：流失预测 + 干预策略（反事实）",
    tag: "ToB",
  },
];

const MOCK_DATASETS = [
  {
    id: "incident_wide_v1",
    name: "incident_wide.csv",
    version: "v1（含脏数据）",
    rows: 200000,
    cols: 92,
    timeRange: "2025-10-01 ~ 2025-12-15",
    owner: "指挥中心",
    qualityScore: 68,
  },
  {
    id: "incident_wide_v2",
    name: "incident_wide.csv",
    version: "v2（清洗后）",
    rows: 196842,
    cols: 92,
    timeRange: "2025-10-01 ~ 2025-12-15",
    owner: "指挥中心",
    qualityScore: 86,
  },
];

const MOCK_SCHEMA = [
  { k: "incident_id", t: "ID", desc: "工单主键" },
  { k: "report_time", t: "时间", desc: "报案/接入时间" },
  { k: "region_id", t: "类别", desc: "区域编码" },
  { k: "event_type_code", t: "类别", desc: "事件类型" },
  { k: "severity", t: "数值", desc: "严重等级 1-5" },
  { k: "distance_km", t: "数值", desc: "到场距离（公里）" },
  { k: "active_units", t: "数值", desc: "当前可用力量" },
  { k: "queue_len", t: "数值", desc: "排队长度" },
  { k: "resolve_minutes", t: "目标Y（回归）", desc: "处置时长（分钟）" },
  { k: "is_overdue_30m", t: "目标Y（分类）", desc: "是否超时（30分钟）" },
];

// v1 / v2 的体检数据：只用于展示点击后的“可见变化”
const HEALTH_V1 = {
  summary: [
    { name: "缺失率", value: 7.8, unit: "%", hint: "distance_km / arrive_minutes" },
    { name: "异常值", value: 1.4, unit: "%", hint: "resolve_minutes=0 或 >600" },
    { name: "重复率", value: 0.9, unit: "%", hint: "同一 incident_id 重复" },
    { name: "口径不一致", value: 12, unit: "项", hint: "A01/a01/TRAFFIC_ACC" },
  ],
  drift: [
    { day: "11/20", psi: 0.03 },
    { day: "11/27", psi: 0.06 },
    { day: "12/04", psi: 0.11 },
    { day: "12/11", psi: 0.18 },
    { day: "12/15", psi: 0.22 },
  ],
  missingHeat: {
    fields: [
      "distance_km",
      "arrive_minutes",
      "event_type_code",
      "active_units",
      "queue_len",
      "resolve_minutes",
    ],
    groups: ["R01", "R02", "R03", "R04", "R05", "R06"],
    matrix: [
      [0.05, 0.07, 0.12, 0.03, 0.08, 0.18],
      [0.02, 0.05, 0.09, 0.02, 0.04, 0.11],
      [0.10, 0.13, 0.21, 0.07, 0.14, 0.26],
      [0.01, 0.02, 0.04, 0.01, 0.02, 0.05],
      [0.03, 0.06, 0.08, 0.03, 0.07, 0.09],
      [0.00, 0.01, 0.02, 0.00, 0.01, 0.03],
    ],
  },
  inconsistencies: [
    {
      id: "INC-001",
      field: "event_type_code",
      examples: ["A01", "a01", "TRAFFIC_ACC", "交通事故"],
      impact: "同类事件统计口径不一致，导致分组误差放大",
    },
    {
      id: "INC-002",
      field: "source",
      examples: ["110", "Hotline", "热线"],
      impact: "渠道维度无法对齐，影响队列/派单策略",
    },
  ],
};

const HEALTH_V2 = {
  summary: [
    { name: "缺失率", value: 0.6, unit: "%", hint: "缺失已填补/补采集" },
    { name: "异常值", value: 0.3, unit: "%", hint: "异常截断/修正" },
    { name: "重复率", value: 0.0, unit: "%", hint: "主键去重完成" },
    { name: "口径不一致", value: 2, unit: "项", hint: "码表映射已覆盖大部分" },
  ],
  drift: [
    { day: "11/20", psi: 0.02 },
    { day: "11/27", psi: 0.04 },
    { day: "12/04", psi: 0.08 },
    { day: "12/11", psi: 0.12 },
    { day: "12/15", psi: 0.15 },
  ],
  missingHeat: {
    fields: HEALTH_V1.missingHeat.fields,
    groups: HEALTH_V1.missingHeat.groups,
    matrix: HEALTH_V1.missingHeat.matrix.map((row) => row.map((v) => Math.max(0, v - 0.07))),
  },
  inconsistencies: HEALTH_V1.inconsistencies,
};

const MOCK_CLEAN_RULES = [
  {
    id: "R-001",
    name: "口径映射：event_type_code 统一到标准码表",
    type: "映射",
    before: "A01/a01/TRAFFIC_ACC/交通事故",
    after: "A01",
    risk: "低",
  },
  {
    id: "R-002",
    name: "缺失填补：distance_km 用分区中位数 + 天气修正",
    type: "填补",
    before: "缺失 7.8%",
    after: "缺失 0.3%",
    risk: "中",
  },
  {
    id: "R-003",
    name: "异常截断：resolve_minutes 限制到 [5, 600]",
    type: "异常",
    before: "异常 1.4%",
    after: "异常 0.2%",
    risk: "中",
  },
  {
    id: "R-004",
    name: "重复合并：同 incident_id 保留最新 close_time",
    type: "去重",
    before: "重复 0.9%",
    after: "重复 0.0%",
    risk: "低",
  },
];

const MOCK_FEATURES_BASE = [
  { name: "queue_len", importance: 0.22, stability: 0.88, relation: "正相关（队列越长越容易超时）" },
  { name: "active_units", importance: 0.18, stability: 0.81, relation: "负相关（力量越多越不超时）" },
  { name: "distance_km", importance: 0.14, stability: 0.74, relation: "正相关（距离越远越易超时）" },
  { name: "severity", importance: 0.12, stability: 0.79, relation: "正相关（严重度越高越易超时）" },
  { name: "weather", importance: 0.09, stability: 0.66, relation: "恶劣天气提高到场/处置时长" },
  { name: "history_7d_incidents", importance: 0.07, stability: 0.71, relation: "正相关（热点区域更拥堵）" },
];

const MOCK_RUNS_BASE = [
  {
    id: "run-A",
    taskName: "超时风险分类",
    taskType: "分类",
    target: "is_overdue_30m",
    status: "已完成",
    durationSec: 18,
    metrics: { AUC: 0.91, F1: 0.78 },
    version: "data:v2 · seed:42 · mode:快",
  },
  {
    id: "run-B",
    taskName: "处置时长预测",
    taskType: "回归",
    target: "resolve_minutes",
    status: "已完成",
    durationSec: 21,
    metrics: { RMSE: 18.4, MAPE: 0.13 },
    version: "data:v2 · seed:42 · mode:快",
  },
  {
    id: "run-C",
    taskName: "到场时长缺失填补",
    taskType: "填补",
    target: "arrive_minutes",
    status: "已完成",
    durationSec: 9,
    metrics: { MAE: 3.9, R2: 0.86 },
    version: "data:v2 · seed:42 · mode:快",
  },
];

const MOCK_GROUP_ERROR = {
  rows: ["R01", "R02", "R03", "R04", "R05", "R06"],
  cols: ["A01", "A03", "B12", "B99"],
  matrix: [
    [0.18, 0.12, 0.14, 0.29],
    [0.15, 0.11, 0.16, 0.32],
    [0.22, 0.18, 0.19, 0.41],
    [0.09, 0.08, 0.10, 0.21],
    [0.25, 0.19, 0.24, 0.45],
    [0.12, 0.10, 0.11, 0.28],
  ],
};

const MOCK_CONFIDENCE = [
  { bin: "0-0.1", count: 2200 },
  { bin: "0.1-0.2", count: 5100 },
  { bin: "0.2-0.3", count: 8600 },
  { bin: "0.3-0.4", count: 12900 },
  { bin: "0.4-0.5", count: 16800 },
  { bin: "0.5-0.6", count: 15200 },
  { bin: "0.6-0.7", count: 10100 },
  { bin: "0.7-0.8", count: 6400 },
  { bin: "0.8-0.9", count: 3100 },
  { bin: "0.9-1.0", count: 900 },
];

const MOCK_THRESHOLD = [
  { th: 0.1, benefit: 12, precision: 0.42, recall: 0.91 },
  { th: 0.2, benefit: 18, precision: 0.51, recall: 0.84 },
  { th: 0.3, benefit: 24, precision: 0.58, recall: 0.76 },
  { th: 0.4, benefit: 29, precision: 0.65, recall: 0.66 },
  { th: 0.5, benefit: 31, precision: 0.70, recall: 0.58 },
  { th: 0.6, benefit: 30, precision: 0.74, recall: 0.49 },
  { th: 0.7, benefit: 27, precision: 0.78, recall: 0.39 },
];

const MOCK_COMPARE = [
  {
    name: "XGBoost",
    time: "训练+调参：2-6小时（视规模）",
    metric: "AUC≈0.90（需迭代）",
    explain: "可做 SHAP，但需额外工程拼装",
    repro: "依赖代码与环境，产品侧不一定固化",
    delivery: "需二次封装服务/监控/告警",
    badge: "训练/参数驱动",
  },
  {
    name: "AutoGluon",
    time: "训练+集成：30-120分钟（视预算）",
    metric: "AUC≈0.91（训练预算敏感）",
    explain: "取决于底座模型/解释组件",
    repro: "需固化训练配置与版本",
    delivery: "需工程化落地",
    badge: "AutoML/集成",
  },
  {
    name: "通用LLM",
    time: "秒级输出（但口径不稳）",
    metric: "难以稳定给出同口径结构化评测",
    explain: "擅长解释文字，但缺少阈值/收益闭环",
    repro: "同问多次可能不同",
    delivery: "更像对话入口，结构化服务需重做",
    badge: "语言/文本推理",
  },
  {
    name: "LimiX",
    time: "推理：秒~分钟级（模式可切换）",
    metric: "AUC≈0.91 + 分组误差/阈值收益一屏看完",
    explain: "全局/分群/单案/反事实固定结构",
    repro: "Run 固化数据版本/种子/配置快照",
    delivery: "报告+API+订阅告警一键交付",
    badge: "工作流/可交付",
    highlight: true,
  },
];

function cn(...args) {
  return args.filter(Boolean).join(" ");
}

function formatNum(n) {
  if (typeof n !== "number") return String(n);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function nowTimeStr() {
  const d = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function HeatGrid({ rows, cols, matrix, minLabel = "低", maxLabel = "高" }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <div className="mt-2 overflow-auto">
        <div className="min-w-[680px]">
          <div className="grid" style={{ gridTemplateColumns: `160px repeat(${cols.length}, minmax(90px, 1fr))` }}>
            <div className="text-xs text-muted-foreground py-2">维度</div>
            {cols.map((c) => (
              <div key={c} className="text-xs text-muted-foreground py-2 text-center">
                {c}
              </div>
            ))}
            {rows.map((r, i) => (
              <React.Fragment key={r}>
                <div className="text-sm py-3 pr-2 flex items-center gap-2">
                  <span className="font-medium">{r}</span>
                </div>
                {cols.map((c, j) => {
                  const v = matrix[i]?.[j] ?? 0;
                  const alpha = Math.min(1, Math.max(0.08, v));
                  return (
                    <div key={`${r}-${c}`} className="py-2 flex items-center justify-center">
                      <div
                        className="h-9 w-20 rounded-xl border shadow-sm"
                        style={{ background: `rgba(59, 130, 246, ${alpha})` }}
                        title={`${r} / ${c}：${(v * 100).toFixed(1)}%`}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPill({ label, value, unit, hint }) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardDescription className="text-xs">{label}</CardDescription>
        <CardTitle className="text-2xl">
          {value}
          <span className="text-sm text-muted-foreground">{unit}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}

function VerticalStepper({ step }) {
  const steps = ["导入", "体检", "清洗", "特征", "推理", "结果", "解释", "交付"];
  return (
    <div className="hidden md:flex flex-col w-12 shrink-0 sticky top-[76px] self-start items-center">
      {steps.map((s, i) => {
        const active = i <= step;
        const isLast = i === steps.length - 1;
        return (
          <div key={s} className="flex flex-col items-center">
            <div
              className={cn(
                "h-7 w-7 rounded-full border flex items-center justify-center text-[10px] font-bold z-10 transition-colors duration-300",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-transparent"
              )}
            >
              {i + 1}
            </div>
            <div
              className={cn(
                "text-[10px] mt-1 mb-1 font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s}
            </div>
            {!isLast && (
              <div
                className={cn(
                  "w-0.5 h-6",
                  active ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TopBar({ sceneId, setSceneId, quickMode, setQuickMode, datasetId, setDatasetId }) {
  const scene = SCENES.find((s) => s.id === sceneId);
  const dataset = MOCK_DATASETS.find((d) => d.id === datasetId);

  return (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold">LimiX 流水线演示</div>
            <div className="text-xs text-muted-foreground">平台形态：从数据到决策的流水线（可视化证据链）</div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Card className="rounded-2xl">
            <CardContent className="p-3 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-xl">
                场景
              </Badge>
              <select className="text-sm bg-transparent outline-none" value={sceneId} onChange={(e) => setSceneId(e.target.value)}>
                {SCENES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <Badge className="rounded-xl" variant="outline">
                {scene?.tag}
              </Badge>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardContent className="p-3 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-xl">
                数据版本
              </Badge>
              <select className="text-sm bg-transparent outline-none" value={datasetId} onChange={(e) => setDatasetId(e.target.value)}>
                {MOCK_DATASETS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · {d.version}
                  </option>
                ))}
              </select>
              <Badge className="rounded-xl" variant="outline">
                体检分 {dataset?.qualityScore}
              </Badge>
            </CardContent>
          </Card>


        </div>
      </div>
    </div>
  );
}

function SideNav({ active, setActive }) {
  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="md:sticky md:top-[90px] max-h-[calc(100vh-100px)] overflow-y-auto">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">演示导航</CardTitle>
            <CardDescription className="text-xs">每一屏都要给“证据”</CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <div className="grid gap-1">
              {NAV.map((n, index) => {
                const Icon = n.icon;
                const on = n.key === active;
                return (
                  <button
                    key={n.key}
                    onClick={() => {
                      setActive(n.key);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left border",
                      on ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    )}
                  >
                    <div className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold border shrink-0",
                        on ? "border-primary-foreground/30 bg-primary-foreground/20 text-primary-foreground" : "border-muted-foreground/30 bg-muted text-muted-foreground"
                    )}>
                        {index + 1}
                    </div>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{n.name}</span>
                    {n.key === "compare" && (
                      <Badge className="rounded-xl" variant={on ? "secondary" : "outline"}>
                        必看
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>

            <Separator className="my-3" />

            <div className="text-xs text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>目标：把“模型”讲成“产品流水线”</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span>所有数据/指标均为 Mock，可替换为真实 Run 入库结果</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, desc, right }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2">
        {Icon ? (
          <div className="mt-1 h-9 w-9 rounded-2xl bg-muted flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
        <div>
          <div className="text-lg font-semibold">{title}</div>
          {desc ? <div className="text-sm text-muted-foreground mt-1">{desc}</div> : null}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

function ToastStack({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] flex flex-col gap-2 w-[360px] max-w-[92vw]">
      {toasts.map((t) => (
        <div key={t.id} className="rounded-2xl border bg-background shadow-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold">{t.title}</div>
              {t.desc ? <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{t.desc}</div> : null}
            </div>
            <button
              className="h-8 w-8 rounded-xl hover:bg-muted flex items-center justify-center"
              onClick={() => dismiss(t.id)}
              aria-label="关闭"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 p-4 flex items-center justify-center">
        <Card className="rounded-2xl w-full max-w-3xl shadow-xl">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs">Mock 弹窗：演示点击后的“可见反馈”</CardDescription>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={onClose}>
                关闭
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}

function DatasetsPanel({ datasetId, setDatasetId, notify, openModal }) {
  const dataset = MOCK_DATASETS.find((d) => d.id === datasetId);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Database}
        title="数据集（导入）"
        desc="把数据变成资产：版本、字段、范围、责任人"
        right={
          <div className="flex items-center gap-2">
            <Button
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "上传 CSV（Mock）",
                  <div className="space-y-3">
                    <div className="text-sm">这里演示“上传动作有反馈”。真实实现可对接对象存储/数据湖。</div>
                    <div className="p-3 rounded-2xl bg-muted text-xs">
                      已模拟上传：incident_wide.csv（200K 行 / 92 列） → 生成数据版本 data:v1
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="rounded-2xl" onClick={() => notify("上传完成", "已生成 data:v1（Mock）")}>确认</Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => notify("已取消", "未做更改")}>取消</Button>
                    </div>
                  </div>
                )
              }
            >
              上传 CSV
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "连接数据库（Mock）",
                  <div className="space-y-3">
                    <div className="text-sm">这里演示“连接动作”。真实实现可对接 MySQL/PostgreSQL/ClickHouse 等。</div>
                    <div className="p-3 rounded-2xl bg-muted text-xs font-mono">jdbc:postgresql://host:5432/db</div>
                    <div className="flex items-center gap-2">
                      <Button className="rounded-2xl" onClick={() => notify("连接成功", "已创建数据源 data-source:pg01（Mock）")}>测试连接</Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => notify("已保存", "数据源信息已保存（Mock）")}>保存</Button>
                    </div>
                  </div>
                )
              }
            >
              连接库
            </Button>
          </div>
        }
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">当前选择</CardTitle>
          <CardDescription className="text-xs">演示建议：用 v1 先体检，再一键清洗生成 v2</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">数据集</div>
              <div className="mt-1 font-semibold">{dataset?.name} · {dataset?.version}</div>
              <div className="mt-2 text-xs text-muted-foreground">责任方：{dataset?.owner}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">规模</div>
              <div className="mt-1 font-semibold">{formatNum(dataset?.rows)} 行 · {dataset?.cols} 列</div>
              <div className="mt-2 text-xs text-muted-foreground">时间范围：{dataset?.timeRange}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">数据可用性（体检分）</div>
                <div className="text-xl font-bold text-primary">{dataset?.qualityScore}</div>
              </div>
              <div className="mt-2">
                <Progress value={dataset?.qualityScore ?? 0} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">建议阈值：≥80 才进入对外交付</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">字段字典（节选）</CardTitle>
          <CardDescription className="text-xs">领导看得懂：每个字段是“能做什么决策”</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">字段</th>
                  <th className="py-2">类型</th>
                  <th className="py-2">说明</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_SCHEMA.map((s) => (
                  <tr key={s.k} className="border-t">
                    <td className="py-2 font-mono">{s.k}</td>
                    <td className="py-2">
                      <Badge variant="outline" className="rounded-xl">
                        {s.t}
                      </Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">{s.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">演示小技巧（导演提示）</CardTitle>
          <CardDescription className="text-xs">把“导入”变成“可交付链路的第一步”</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <ul className="list-disc pl-5 space-y-1">
            <li>先选 v1（带脏数据）→ 进入【数据体检】让问题可视化。</li>
            <li>再一键生成清洗规则 → 预览变更 → 应用后生成 v2（体检分提升）。</li>
            <li>每一屏右上角都能用“对比证明墙”收口：同数据同口径，谁更省事、谁更稳。</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function HealthPanel({ datasetId, notify, openModal, setActive }) {
  const base = datasetId === "incident_wide_v2" ? HEALTH_V2 : HEALTH_V1;
  const [health, setHealth] = useState(base);
  const [running, setRunning] = useState(false);
  const [lastRunAt, setLastRunAt] = useState(null);
  const [resolved, setResolved] = useState(() => new Set());

  useEffect(() => {
    setHealth(datasetId === "incident_wide_v2" ? HEALTH_V2 : HEALTH_V1);
    setResolved(new Set());
    setLastRunAt(null);
  }, [datasetId]);

  const doCheck = () => {
    setRunning(true);
    notify("体检启动", "正在扫描缺失/异常/重复/口径/漂移（Mock）…");
    setTimeout(() => {
      setRunning(false);
      setLastRunAt(nowTimeStr());
      // 轻微抖动一下数值，让“点击有变化”可见
      setHealth((prev) => {
        const jitter = (v, amp) => Math.max(0, Number((v + (Math.random() * 2 - 1) * amp).toFixed(2)));
        return {
          ...prev,
          summary: prev.summary.map((m) => {
            if (m.name === "口径不一致") return m;
            return { ...m, value: jitter(m.value, m.name === "缺失率" ? 0.25 : 0.12) };
          }),
        };
      });
      notify("体检完成", `已生成体检报告（${datasetId.includes("v2") ? "v2" : "v1"}）。你可以继续生成清洗方案。`);
    }, 900);
  };

  const toggleResolve = (id, field) => {
    setResolved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        notify("已撤销映射", `${field} 恢复为“需治理”（Mock）`);
      } else {
        next.add(id);
        notify("映射完成", `${field} 已按标准码表统一（Mock）`);
      }
      return next;
    });
  };

  const inconsistencyCount = useMemo(() => {
    const baseCount = health.summary.find((x) => x.name === "口径不一致")?.value ?? 0;
    return Math.max(0, baseCount - resolved.size * 5);
  }, [health.summary, resolved.size]);

  const summaryView = useMemo(() => {
    return health.summary.map((m) => (m.name === "口径不一致" ? { ...m, value: inconsistencyCount } : m));
  }, [health.summary, inconsistencyCount]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Stethoscope}
        title="数据体检（信任建立的第一屏）"
        desc="让业务先看到：数据靠谱不靠谱、问题在哪里、怎么修。"
        right={
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl" onClick={doCheck} disabled={running}>
              {running ? "体检中…" : "一键体检"}
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "体检报告（Mock）",
                  <div className="space-y-3">
                    <div className="text-sm">这份报告要回答两句话：数据哪里烂？烂到什么程度？</div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-muted text-sm">
                        <div className="text-xs text-muted-foreground">本次体检时间</div>
                        <div className="mt-1 font-semibold">{lastRunAt ? lastRunAt : "尚未运行"}</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-muted text-sm">
                        <div className="text-xs text-muted-foreground">建议下一步</div>
                        <div className="mt-1">生成清洗策略 → 预览变更 → 应用生成新版本</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button className="rounded-2xl" onClick={() => setActive("clean")}>去生成清洗方案</Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => notify("已复制", "报告链接已复制（Mock）")}>复制链接</Button>
                    </div>
                  </div>
                )
              }
            >
              查看报告
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={datasetId === "incident_wide_v2" ? "secondary" : "outline"}>
          当前数据：{datasetId === "incident_wide_v2" ? "v2（清洗后）" : "v1（含脏数据）"}
        </Badge>
        <Badge className="rounded-xl" variant="outline">
          最近体检：{lastRunAt ? lastRunAt : "未运行"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-4 gap-3">
        {summaryView.map((m) => (
          <MetricPill key={m.name} label={m.name} value={m.value} unit={m.unit} hint={m.hint} />
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">缺失热力图（字段 × 区域）</CardTitle>
          <CardDescription className="text-xs">回答问题：哪个区/哪个字段最不靠谱？下一步：生成填补或补采集建议。</CardDescription>
        </CardHeader>
        <CardContent>
          <HeatGrid rows={health.missingHeat.fields} cols={health.missingHeat.groups} matrix={health.missingHeat.matrix} minLabel="缺失少" maxLabel="缺失多" />
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => {
                notify("已生成建议", "已为 Top 缺失字段生成“填补/补采集”建议（Mock）");
                setActive("clean");
              }}
            >
              生成治理建议
            </Button>
            <Badge variant="outline" className="rounded-xl">
              Mock
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">口径一致性（Top 问题）</CardTitle>
            <CardDescription className="text-xs">回答问题：为什么统计对不上？下一步：一键映射标准码表。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {health.inconsistencies.map((it) => {
              const done = resolved.has(it.id);
              return (
                <div key={it.id} className="p-3 rounded-2xl border">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{it.field}</div>
                    <Badge variant={done ? "secondary" : "outline"} className="rounded-xl">
                      {done ? "已映射" : "需治理"}
                    </Badge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">示例：{it.examples.join(" / ")}</div>
                  <div className="mt-2 text-sm">影响：{it.impact}</div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button size="sm" className="rounded-xl" onClick={() => toggleResolve(it.id, it.field)}>
                      {done ? "撤销映射" : "一键映射"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl"
                      onClick={() =>
                        openModal(
                          "映射预览（Mock）",
                          <div className="space-y-3">
                            <div className="text-sm">字段：{it.field}</div>
                            <div className="p-3 rounded-2xl bg-muted text-xs">示例映射：{it.examples.join(" → ")} → 标准码</div>
                            <div className="p-3 rounded-2xl border text-sm">影响范围（Mock）：覆盖 68% 历史值；剩余 32% 进入人工核对队列</div>
                            <div className="flex items-center gap-2">
                              <Button className="rounded-2xl" onClick={() => toggleResolve(it.id, it.field)}>
                                应用映射
                              </Button>
                              <Button variant="outline" className="rounded-2xl" onClick={() => notify("已取消", "未做更改")}>取消</Button>
                            </div>
                          </div>
                        )
                      }
                    >
                      预览
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">漂移预警（PSI 示例）</CardTitle>
            <CardDescription className="text-xs">回答问题：最近两周是不是变了？下一步：重评估/调阈值/补数据。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={health.drift} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="psi" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="rounded-xl">
                提示
              </Badge>
              <div className="text-sm text-muted-foreground">PSI &gt; 0.2 时建议进入“更准模式”并重新评估分组误差。</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  notify("已创建漂移告警", "当 PSI>0.2 时自动提醒并触发重评估（Mock）");
                }}
              >
                订阅漂移告警
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  notify("已生成动作清单", "建议：补数据/调阈值/分区策略（Mock）");
                  setActive("results");
                }}
              >
                去结果页看影响
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（现场一句话）</CardTitle>
          <CardDescription className="text-xs">让观众在 5 秒内明白“我们不是模型，是治理+决策流水线”。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“先不建模。先把数据风险摊开：缺失在哪、口径哪里乱、漂移有没有发生。治理做成按钮级能力，才敢谈上线。”</div>
        </CardContent>
      </Card>
    </div>
  );
}

function CleanPanel({ datasetId, setDatasetId, notify, openModal }) {
  const [generated, setGenerated] = useState(false);
  const [applying, setApplying] = useState(false);
  const [ruleState, setRuleState] = useState(() => {
    const o = {};
    MOCK_CLEAN_RULES.forEach((r) => {
      o[r.id] = { list: "none", lastDryRun: null };
    });
    return o;
  });

  useEffect(() => {
    setGenerated(false);
    setApplying(false);
    setRuleState(() => {
      const o = {};
      MOCK_CLEAN_RULES.forEach((r) => {
        o[r.id] = { list: "none", lastDryRun: null };
      });
      return o;
    });
  }, [datasetId]);

  const genStrategy = () => {
    setGenerated(true);
    notify("已生成清洗策略", "已根据体检结果生成规则清单（Mock）。下一步：预览变更或单条试跑。")
  };

  const previewDiff = () => {
    openModal(
      "预览变更（Mock）",
      <div className="space-y-3">
        <div className="text-sm">这一步要回答：改了什么？影响多少行？风险是什么？</div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">预计影响行数</div>
            <div className="mt-1 font-semibold">~ {formatNum(36842)} 行</div>
          </div>
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">缺失率变化</div>
            <div className="mt-1 font-semibold">7.8% → 0.3%</div>
          </div>
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">风险项</div>
            <div className="mt-1 font-semibold">2 项（需抽检）</div>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-muted text-sm">
          示例：event_type_code 口径统一将减少分组误差；resolve_minutes 截断会影响极端样本，建议抽检 200 条。
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl" onClick={() => notify("已创建抽检任务", "已抽样 200 条加入审核队列（Mock）")}>创建抽检</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => notify("已导出", "变更预览已导出为报告片段（Mock）")}>导出预览</Button>
        </div>
      </div>
    );
  };

  const applyToV2 = () => {
    setApplying(true);
    notify("开始应用清洗", "正在生成新数据版本 v2（Mock）…");
    setTimeout(() => {
      setApplying(false);
      setDatasetId("incident_wide_v2");
      notify("清洗完成", "已生成 v2（清洗后）。下一步：去任务页跑多任务 Run。")
    }, 1100);
  };

  const dryRun = (rid) => {
    const affected = Math.round(2000 + Math.random() * 8000);
    const warn = Math.random() > 0.72;
    setRuleState((prev) => ({
      ...prev,
      [rid]: {
        ...prev[rid],
        lastDryRun: { time: nowTimeStr(), affected, warn },
      },
    }));
    notify("单条试跑完成", warn ? `规则 ${rid} 影响 ~${affected} 行，建议抽检（Mock）` : `规则 ${rid} 影响 ~${affected} 行（Mock）`);
  };

  const toggleList = (rid) => {
    setRuleState((prev) => {
      const cur = prev[rid]?.list ?? "none";
      const next = cur === "none" ? "white" : cur === "white" ? "black" : "none";
      const label = next === "white" ? "白名单" : next === "black" ? "黑名单" : "取消名单";
      notify("规则标注已更新", `规则 ${rid} → ${label}（Mock）`);
      return { ...prev, [rid]: { ...prev[rid], list: next } };
    });
  };

  const canApply = generated && datasetId === "incident_wide_v1";

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Wand2}
        title="清洗方案（可预览、可回滚）"
        desc="把自动化变成“可审计的变更”：规则列表 + 前后对比 + 生成新版本"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button className="rounded-2xl" onClick={genStrategy}>
              自动生成清洗策略
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={previewDiff} disabled={!generated}>
              预览变更
            </Button>
            <Button className="rounded-2xl" onClick={applyToV2} disabled={!canApply || applying}>
              {applying ? "生成中…" : datasetId === "incident_wide_v2" ? "已是 v2" : "应用生成 v2"}
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={datasetId === "incident_wide_v2" ? "secondary" : "outline"}>
          当前数据：{datasetId === "incident_wide_v2" ? "v2（清洗后）" : "v1（含脏数据）"}
        </Badge>
        <Badge className="rounded-xl" variant={generated ? "secondary" : "outline"}>
          策略状态：{generated ? "已生成" : "未生成"}
        </Badge>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">规则清单（Mock）</CardTitle>
          <CardDescription className="text-xs">回答问题：做了哪些变更？风险是什么？下一步：应用到新版本。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_CLEAN_RULES.map((r) => {
            const st = ruleState[r.id] || { list: "none", lastDryRun: null };
            return (
              <div key={r.id} className="p-4 rounded-2xl border">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-xl" variant="outline">
                      {r.id}
                    </Badge>
                    <div className="font-semibold">{r.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-xl" variant="secondary">
                      {r.type}
                    </Badge>
                    <Badge className="rounded-xl" variant={r.risk === "低" ? "outline" : "destructive"}>
                      风险：{r.risk}
                    </Badge>
                    {st.list !== "none" && (
                      <Badge className="rounded-xl" variant={st.list === "white" ? "secondary" : "destructive"}>
                        {st.list === "white" ? "白名单" : "黑名单"}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid md:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-2xl bg-muted">
                    <div className="text-xs text-muted-foreground">应用前</div>
                    <div className="mt-1">{r.before}</div>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted">
                    <div className="text-xs text-muted-foreground">应用后</div>
                    <div className="mt-1">{r.after}</div>
                  </div>
                </div>

                {st.lastDryRun ? (
                  <div className={cn("mt-3 p-3 rounded-2xl border text-sm", st.lastDryRun.warn ? "border-destructive/50" : "") }>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="text-xs text-muted-foreground">最近试跑：{st.lastDryRun.time}</div>
                      <Badge className="rounded-xl" variant={st.lastDryRun.warn ? "destructive" : "secondary"}>
                        影响 ~{formatNum(st.lastDryRun.affected)} 行
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {st.lastDryRun.warn ? "建议：抽检样本 & 确认业务口径（Mock）" : "建议：可进入整体应用（Mock）"}
                    </div>
                  </div>
                ) : null}

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <Button size="sm" className="rounded-xl" onClick={() => dryRun(r.id)} disabled={!generated}>
                    单条试跑
                  </Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toggleList(r.id)} disabled={!generated}>
                    加入白名单/黑名单
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() =>
                      openModal(
                        "变更回滚点（Mock）",
                        <div className="space-y-3">
                          <div className="text-sm">每次应用都会生成新版本：data:v2，并保存回滚点。</div>
                          <div className="p-3 rounded-2xl bg-muted text-xs font-mono">rollback_to: data:v1</div>
                          <Button className="rounded-2xl" onClick={() => notify("已创建回滚点", "回滚点已保存（Mock）")}>确认</Button>
                        </div>
                      )
                    }
                  >
                    查看回滚点
                  </Button>
                </div>

                {!generated ? (
                  <div className="mt-3 text-xs text-muted-foreground">提示：先点右上角【自动生成清洗策略】再操作。</div>
                ) : null}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（让人敢用）</CardTitle>
          <CardDescription className="text-xs">“预览 + 回滚”是信任的关键，不然自动化会被否掉。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“我们不靠拍脑袋清洗。每条规则都有变更预览、影响范围、风险等级。应用后生成新数据版本，随时可回滚。”</div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeaturesPanel({ notify, openModal }) {
  const [generated, setGenerated] = useState(false);
  const [stabilityDone, setStabilityDone] = useState(false);
  const [templated, setTemplated] = useState(() => new Set());

  const features = useMemo(() => {
    if (!generated) return MOCK_FEATURES_BASE;
    // 生成后：轻微调整，模拟“特征工厂跑过一遍”
    return MOCK_FEATURES_BASE.map((f) => ({
      ...f,
      importance: clamp01(f.importance + (Math.random() * 0.02 - 0.01)),
      stability: clamp01(f.stability + (Math.random() * 0.03 - 0.01)),
    }));
  }, [generated]);

  const doGenerate = () => {
    setGenerated(true);
    notify("特征已生成", "已自动生成/选择特征集合（Mock）。下一步：做稳定性评估与沉淀模板。")
  };

  const doStability = () => {
    setStabilityDone(true);
    notify("稳定性评估完成", "已输出特征稳定性与漂移敏感度（Mock）。")
  };

  const toggleTemplate = (name) => {
    setTemplated((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
        notify("已取消模板", `${name} 已从模板移除（Mock）`);
      } else {
        next.add(name);
        notify("已固定模板", `${name} 已固定为“可复用特征模板”（Mock）`);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Sparkles}
        title="特征工厂（把“特征工程”产品化）"
        desc="回答问题：哪些因素真的驱动结果？这些因素稳定吗？能沉淀为模板吗？"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button className="rounded-2xl" onClick={doGenerate}>
              一键生成特征
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={doStability} disabled={!generated}>
              稳定性评估
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "特征模板库（Mock）",
                  <div className="space-y-3">
                    <div className="text-sm">这里演示“沉淀资产”：把特征组合固化为可复用模板。</div>
                    <div className="p-3 rounded-2xl border text-sm">
                      已固定模板数量：<span className="font-semibold">{templated.size}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-muted text-xs">模板示例：{Array.from(templated).slice(0, 6).join("、") || "暂无"}</div>
                    <div className="flex items-center gap-2">
                      <Button className="rounded-2xl" onClick={() => notify("已发布", "模板已发布为组织级资产（Mock）")}>发布模板</Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => notify("已导出", "模板定义已导出（Mock）")}>导出定义</Button>
                    </div>
                  </div>
                )
              }
            >
              打开模板库
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={generated ? "secondary" : "outline"}>
          生成状态：{generated ? "已生成" : "未生成"}
        </Badge>
        <Badge className="rounded-xl" variant={stabilityDone ? "secondary" : "outline"}>
          稳定性：{stabilityDone ? "已评估" : "未评估"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {features.map((f) => (
          <Card key={f.name} className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-mono flex items-center justify-between">
                <span>{f.name}</span>
                {templated.has(f.name) ? (
                  <Badge className="rounded-xl" variant="secondary">
                    模板
                  </Badge>
                ) : null}
              </CardTitle>
              <CardDescription className="text-xs">{f.relation}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>重要性</span>
                  <span>{(f.importance * 100).toFixed(0)}%</span>
                </div>
                <Progress value={f.importance * 100} />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>稳定性</span>
                  <span>{(f.stability * 100).toFixed(0)}%</span>
                </div>
                <Progress value={f.stability * 100} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button size="sm" className="rounded-xl" onClick={() => toggleTemplate(f.name)} disabled={!generated}>
                  固定为模板
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    openModal(
                      "分群差异（Mock）",
                      <div className="space-y-3">
                        <div className="text-sm">特征：<span className="font-mono">{f.name}</span></div>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="p-3 rounded-2xl border">
                            <div className="text-xs text-muted-foreground">R05（热点区）</div>
                            <div className="mt-1 text-sm">贡献更高：+{(f.importance * 1.15).toFixed(2)}</div>
                            <div className="mt-1 text-xs text-muted-foreground">建议：高峰期策略增强</div>
                          </div>
                          <div className="p-3 rounded-2xl border">
                            <div className="text-xs text-muted-foreground">R02（距离型）</div>
                            <div className="mt-1 text-sm">贡献更稳定：{(f.stability * 1.05).toFixed(2)}</div>
                            <div className="mt-1 text-xs text-muted-foreground">建议：驻点优化优先</div>
                          </div>
                        </div>
                        <Button className="rounded-2xl" onClick={() => notify("已生成策略草案", "分区策略草案已生成（Mock）")}>生成分区策略</Button>
                      </div>
                    )
                  }
                  disabled={!generated}
                >
                  查看分群差异
                </Button>
              </div>
              {!generated ? <div className="text-xs text-muted-foreground">提示：先点右上角【一键生成特征】。</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（把“特征”说成人话）</CardTitle>
          <CardDescription className="text-xs">让不懂代码的人也能听懂：特征=影响决策的杠杆。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“特征不是工程细节，是管理杠杆。我们把‘队列长度、可用力量、距离、天气’这些因素的影响强度和稳定性做成卡片，让你知道该优先改哪一个。”</div>
        </CardContent>
      </Card>
    </div>
  );
}

function TasksPanel({ quickMode, runs, setRuns, notify }) {
  const [name, setName] = useState("超时风险分类");
  const [type, setType] = useState("分类");
  const [target, setTarget] = useState("is_overdue_30m");
  const [running, setRunning] = useState(false);

  const runOne = () => {
    setRunning(true);
    notify("任务运行中", "正在生成 Run（Mock）…");
    const start = Date.now();
    setTimeout(() => {
      const sec = Math.max(6, Math.round((Date.now() - start) / 1000) + (quickMode ? 6 : 18));
      const newRun = {
        id: `run-${Math.random().toString(16).slice(2, 7)}`,
        taskName: name,
        taskType: type,
        target,
        status: "已完成",
        durationSec: sec,
        metrics:
          type === "分类"
            ? { AUC: quickMode ? 0.905 : 0.918, F1: quickMode ? 0.775 : 0.792 }
            : type === "回归"
            ? { RMSE: quickMode ? 19.2 : 18.0, MAPE: quickMode ? 0.14 : 0.12 }
            : type === "填补"
            ? { MAE: quickMode ? 4.2 : 3.7, R2: quickMode ? 0.83 : 0.87 }
            : { PR_AUC: quickMode ? 0.41 : 0.46, TopK: "Top 1%" },
        version: `data:v2 · seed:42 · mode:${quickMode ? "快" : "准"}`,
      };
      setRuns([newRun, ...runs]);
      setRunning(false);
      notify("Run 已生成", `${name}（${type}）已完成：耗时 ${sec}s（Mock）`);
    }, quickMode ? 700 : 1200);
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={ListTodo}
        title="任务（多任务同接口：分类/回归/填补/异常）"
        desc="演示关键：同一份数据，一次选择，多任务跑通。"
        right={
          <Button className="rounded-2xl" onClick={runOne} disabled={running}>
            {running ? "运行中…" : "运行"}
          </Button>
        }
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">新建任务（Mock）</CardTitle>
          <CardDescription className="text-xs">回答问题：我要预测什么？任务类型是什么？下一步：一键运行生成 Run。</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">任务名称</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl mt-2" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">任务类型</div>
            <select
              className="w-full rounded-2xl border bg-transparent px-3 py-2 mt-2 text-sm"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                if (e.target.value === "分类") setTarget("is_overdue_30m");
                if (e.target.value === "回归") setTarget("resolve_minutes");
                if (e.target.value === "填补") setTarget("arrive_minutes");
                if (e.target.value === "异常") setTarget("resolve_minutes");
              }}
            >
              <option>分类</option>
              <option>回归</option>
              <option>填补</option>
              <option>异常</option>
            </select>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">目标字段（Y 或待填补字段）</div>
            <Input value={target} onChange={(e) => setTarget(e.target.value)} className="rounded-2xl mt-2 font-mono" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Run 列表</CardTitle>
          <CardDescription className="text-xs">每个 Run 都固化“数据版本 / 种子 / 模式”，可复现。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">任务</th>
                  <th className="py-2">类型</th>
                  <th className="py-2">目标</th>
                  <th className="py-2">指标</th>
                  <th className="py-2">耗时</th>
                  <th className="py-2">复现信息</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 font-semibold">{r.taskName}</td>
                    <td className="py-2">
                      <Badge className="rounded-xl" variant="outline">
                        {r.taskType}
                      </Badge>
                    </td>
                    <td className="py-2 font-mono">{r.target}</td>
                    <td className="py-2 text-muted-foreground">
                      {Object.entries(r.metrics)
                        .map(([k, v]) => `${k}:${typeof v === "number" ? v.toFixed(3) : v}`)
                        .join(" · ")}
                    </td>
                    <td className="py-2">
                      <Badge className="rounded-xl" variant="secondary">
                        {r.durationSec}s
                      </Badge>
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">{r.version}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => notify("已导出", "Run 列表已导出为报告片段（Mock）")}
            >
              导出 Run 列表
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => notify("已创建看板", "已创建“Run 追踪看板”（Mock）")}
            >
              创建看板
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（对比收口）</CardTitle>
          <CardDescription className="text-xs">把争论变成证据：同数据同口径，看工作量与稳定性。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">
            “这里同一份数据，我们一键跑通分类、回归、填补。传统做法往往要分任务建模、反复调参；LLM 能讲道理但难给同口径指标与阈值收益闭环。我们把这些输出固定在同一张结果页里。”
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsPanel({ notify, openModal }) {
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
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">阈值</div>
            <div className="mt-1 font-semibold">{selectedTh}</div>
          </div>
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">收益（Mock）</div>
            <div className="mt-1 font-semibold">{MOCK_THRESHOLD.find((x) => x.th === selectedTh)?.benefit ?? "-"}</div>
          </div>
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">绑定动作</div>
            <div className="mt-1 font-semibold">派单 + 抄送 + 复核</div>
          </div>
        </div>
        <div className="p-3 rounded-2xl bg-muted text-sm">上线后建议：按区域分组监控误差；漂移 PSI&gt;0.2 时自动触发重评估。</div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl" onClick={() => notify("已生成", "已生成上线检查清单（Mock）")}>生成上线清单</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => notify("已回滚", "阈值策略已回滚到上一版本（Mock）")}>回滚</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={BarChart3}
        title="结果页（高精度/高性能必须“证据化”）"
        desc="指标总览 + 分组误差 + 置信度 + 阈值收益曲线（业务能做决策）"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge className="rounded-xl" variant={published ? "secondary" : "outline"}>
              策略：{published ? "已发布" : "未发布"}
            </Badge>
            <Button className="rounded-2xl" onClick={publish}>
              一键发布阈值策略
            </Button>
          </div>
        }
      />

      <div className="grid md:grid-cols-4 gap-3">
        <MetricPill label="分类 AUC" value={0.91} unit="" hint="同口径可复现" />
        <MetricPill label="分类 F1" value={0.78} unit="" hint="阈值可调" />
        <MetricPill label="回归 RMSE" value={18.4} unit="min" hint="分组误差可追" />
        <MetricPill label="端到端耗时" value={"~20"} unit="s" hint="模式可切换" />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">分组误差热力图（区域 × 事件类型）</CardTitle>
          <CardDescription className="text-xs">回答问题：哪里最不准？下一步：补数据/调阈值/进入更准模式。</CardDescription>
        </CardHeader>
        <CardContent>
          <HeatGrid rows={MOCK_GROUP_ERROR.rows} cols={MOCK_GROUP_ERROR.cols} matrix={MOCK_GROUP_ERROR.matrix} minLabel="误差小" maxLabel="误差大" />
          <div className="mt-3 flex items-center gap-2">
            <Button
              size="sm"
              className="rounded-xl"
              onClick={() => notify("已生成纠偏清单", "已为 Top 误差格子生成补数据/调阈值建议（Mock）")}
            >
              生成纠偏清单
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl"
              onClick={() => notify("已创建工单", "已创建“分组误差治理”工单（Mock）")}
            >
              创建治理工单
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">置信度分布（可转人工复核队列）</CardTitle>
            <CardDescription className="text-xs">回答问题：哪些结果不确定？下一步：建立复核工单。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CONFIDENCE} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bin" hide />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Badge className="rounded-xl" variant="secondary">
                建议
              </Badge>
              <div className="text-sm text-muted-foreground">置信度 &lt; 0.2 的样本进入人工复核队列。</div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" className="rounded-xl" onClick={() => notify("复核队列已创建", "低置信度样本已自动入队（Mock）")}>一键创建复核队列</Button>
              <Button size="sm" variant="outline" className="rounded-xl" onClick={() => notify("已生成规则", "复核SOP已生成（Mock）")}>生成复核SOP</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">阈值-收益曲线（把指标翻译成钱/时间）</CardTitle>
            <CardDescription className="text-xs">回答问题：阈值设多少最划算？下一步：发布阈值策略。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="rounded-xl">选择阈值</Badge>
              <select
                className="text-sm bg-transparent outline-none border rounded-2xl px-3 py-2"
                value={selectedTh}
                onChange={(e) => setSelectedTh(Number(e.target.value))}
              >
                {MOCK_THRESHOLD.map((x) => (
                  <option key={x.th} value={x.th}>
                    {x.th}（收益 {x.benefit}）
                  </option>
                ))}
              </select>
              <Badge variant="outline" className="rounded-xl">推荐：{best.th}</Badge>
            </div>

            <div className="h-56 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_THRESHOLD} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="th" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="benefit" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="precision" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="recall" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Button size="sm" className="rounded-xl" onClick={publish}>
                发布当前阈值
              </Button>
              <Button size="sm" variant="outline" className="rounded-xl" onClick={() => notify("已导出", "阈值-收益曲线已导出为报告片段（Mock）")}>导出曲线</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（别说AUC，说决策）</CardTitle>
          <CardDescription className="text-xs">让观众感觉“爽”的关键：把结果变成动作。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“业务不关心 AUC 是多少，关心阈值设在 0.4 时能减少多少超时、节省多少人力。我们把阈值—收益曲线直接放在结果页，让决策闭环。”</div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExplainPanel({ notify, openModal }) {
  const [units, setUnits] = useState(10);
  const [dist, setDist] = useState(8);
  const [queue, setQueue] = useState(25);

  const risk = useMemo(() => {
    const base = 0.25 + queue * 0.01 + dist * 0.02 - units * 0.015;
    return Math.min(0.98, Math.max(0.02, base));
  }, [units, dist, queue]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={ScanSearch}
        title="解释专区（让不懂代码的人秒懂价值）"
        desc="固定结构：全局 → 分群 → 单案 → 反事实（改一个变量，结果怎么变）"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "解释汇总（Mock）",
                  <div className="space-y-3">
                    <div className="text-sm">这份汇总要回答：为什么？改什么？改了会不会好？</div>
                    <div className="p-3 rounded-2xl bg-muted text-sm">全局：queue_len / active_units 主导；分群：R05 与 R02 原因不同；反事实：加力量可显著降低风险。</div>
                    <div className="flex items-center gap-2">
                      <Button className="rounded-2xl" onClick={() => notify("已导出", "解释汇总已导出为PPT片段（Mock）")}>导出PPT片段</Button>
                      <Button variant="outline" className="rounded-2xl" onClick={() => notify("已复制", "解释链接已复制（Mock）")}>复制链接</Button>
                    </div>
                  </div>
                )
              }
            >
              一键汇总
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="global">
        <TabsList className="rounded-2xl">
          <TabsTrigger value="global" className="rounded-xl">
            全局解释
          </TabsTrigger>
          <TabsTrigger value="segment" className="rounded-xl">
            分群解释
          </TabsTrigger>
          <TabsTrigger value="local" className="rounded-xl">
            单案解释
          </TabsTrigger>
          <TabsTrigger value="cf" className="rounded-xl">
            反事实模拟
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Top 影响因子（全局）</CardTitle>
              <CardDescription className="text-xs">回答问题：总体上为什么超时？下一步：生成治理建议。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[...MOCK_FEATURES_BASE].sort((a, b) => b.importance - a.importance)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="importance" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" className="rounded-xl" onClick={() => notify("已生成治理建议", "已生成治理建议清单（Mock）")}>生成治理建议（PPT）</Button>
                <Badge variant="outline" className="rounded-xl">Mock</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segment" className="mt-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">分群差异（区域/事件类型）</CardTitle>
              <CardDescription className="text-xs">回答问题：同样超时，不同区域原因一样吗？下一步：生成分区策略模板。</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border">
                <div className="font-semibold">R05：高风险主因</div>
                <div className="mt-2 text-sm text-muted-foreground">队列长 + 可用力量不足 + 新类型 B99 增多</div>
                <div className="mt-3">
                  <Badge variant="secondary" className="rounded-xl">建议动作</Badge>
                  <div className="mt-2 text-sm">高峰时段增派力量；对 B99 走升级SOP；阈值提高到 0.45。</div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" className="rounded-xl" onClick={() => notify("策略已保存", "R05 分区策略已保存为模板（Mock）")}>保存为模板</Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => notify("已派发", "已派发给指挥中心（Mock）")}>派发建议</Button>
                </div>
              </div>
              <div className="p-4 rounded-2xl border">
                <div className="font-semibold">R02：高风险主因</div>
                <div className="mt-2 text-sm text-muted-foreground">距离远 + 恶劣天气影响到场</div>
                <div className="mt-3">
                  <Badge variant="secondary" className="rounded-xl">建议动作</Badge>
                  <div className="mt-2 text-sm">优化驻点布局；雨雾天阈值下调到 0.35；建立低置信度复核队列。</div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" className="rounded-xl" onClick={() => notify("策略已保存", "R02 分区策略已保存为模板（Mock）")}>保存为模板</Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => notify("已派发", "已派发给运维班组（Mock）")}>派发建议</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="local" className="mt-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">单案解释（这单为什么高风险）</CardTitle>
              <CardDescription className="text-xs">回答问题：我敢不敢按这个建议派单？下一步：推荐处置动作。</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-4 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">incident_id：I000010</div>
                  <Badge variant="destructive" className="rounded-xl">高风险</Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">模型判定：超时概率 0.82（置信度 0.74）</div>
                <Separator className="my-3" />
                <div className="text-sm">
                  <div className="font-semibold">Top 3 原因</div>
                  <ul className="list-decimal pl-5 mt-2 space-y-1">
                    <li>active_units=3（力量不足，影响 -0.21）</li>
                    <li>queue_len=55（队列拥堵，影响 +0.18）</li>
                    <li>distance_km=32（距离远，影响 +0.12）</li>
                  </ul>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" className="rounded-xl" onClick={() => notify("已推荐派单动作", "建议：改派更近单位 + 增派力量（Mock）")}>推荐派单动作</Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => notify("已加入复核", "该工单已加入复核队列（Mock）")}>加入复核</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cf" className="mt-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">反事实模拟（改一个变量，结果怎么变）</CardTitle>
              <CardDescription className="text-xs">回答问题：多派一个队伍有用吗？下一步：形成派单策略。</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl border space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>可用力量 active_units</span>
                    <span className="font-mono">{units}</span>
                  </div>
                  <input type="range" min={1} max={30} value={units} onChange={(e) => setUnits(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>距离 distance_km</span>
                    <span className="font-mono">{dist}</span>
                  </div>
                  <input type="range" min={0} max={40} value={dist} onChange={(e) => setDist(Number(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span>队列 queue_len</span>
                    <span className="font-mono">{queue}</span>
                  </div>
                  <input type="range" min={0} max={80} value={queue} onChange={(e) => setQueue(Number(e.target.value))} className="w-full" />
                </div>
              </div>

              <div className="p-4 rounded-2xl border">
                <div className="flex items-center justify-between">
                  <div className="font-semibold">输出（Mock）</div>
                  <Badge className="rounded-xl" variant={risk > 0.6 ? "destructive" : "secondary"}>风险 {risk.toFixed(2)}</Badge>
                </div>
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground">建议动作</div>
                  <div className="mt-2 text-sm">
                    {risk > 0.6 ? "建议：增加力量或改派更近单位；阈值策略=高优先级派单" : "建议：正常派单；进入低置信度队列的概率较低"}
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-2">
                  <Button size="sm" className="rounded-xl" onClick={() => notify("已保存策略模板", "反事实策略已保存（Mock）")}>保存为策略模板</Button>
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => notify("已导出", "反事实结果已导出为报告片段（Mock）")}>导出报告片段</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（解释的“爽点”）</CardTitle>
          <CardDescription className="text-xs">别停在“重要性”，要走到“我怎么改”。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“解释不是一张图，而是决策动作：全局告诉你该治理什么；分群告诉你不同区打法不同；单案告诉你这单为什么；反事实告诉你改一个变量会不会变好。”</div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeliverPanel({ notify, openModal }) {
  const [subscribed, setSubscribed] = useState(false);

  const exportReport = () => {
    notify("报告已生成", "已生成业务可签字的报告（Mock）");
    openModal(
      "报告预览（Mock）",
      <div className="space-y-3">
        <div className="p-3 rounded-2xl border text-sm">
          <div className="font-semibold">本期关键结论</div>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
            <li>超时风险 Top 区域：R05</li>
            <li>阈值建议：0.40（收益最大）</li>
            <li>主要驱动因素：queue_len / active_units</li>
            <li>治理建议：口径统一 + 驻点优化</li>
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <Button className="rounded-2xl" onClick={() => notify("已下载", "报告已下载（Mock）")}>下载 PDF</Button>
          <Button variant="outline" className="rounded-2xl" onClick={() => notify("已分享", "报告链接已分享（Mock）")}>分享链接</Button>
        </div>
      </div>
    );
  };

  const genAPI = () => {
    notify("API 已生成", "已生成推理服务接口与示例（Mock）");
    openModal(
      "API 预览（Mock）",
      <div className="space-y-3">
        <div className="text-xs text-muted-foreground">Endpoint</div>
        <div className="font-mono text-xs p-2 rounded-xl bg-muted overflow-auto">POST /api/v1/predict/overdue</div>
        <div className="text-xs text-muted-foreground">示例调用</div>
        <pre className="text-xs p-2 rounded-xl bg-muted overflow-auto">{`curl -X POST /api/v1/predict/overdue \
  -H "Authorization: Bearer DEMO_TOKEN" \
  -d '{"incident_id":"I000010","region_id":"R06","event_type_code":"B99","distance_km":32,"active_units":3,"queue_len":55}'`}</pre>
        <Button className="rounded-2xl" onClick={() => notify("Token 已复制", "DEMO_TOKEN 已复制（Mock）")}>复制 Token</Button>
      </div>
    );
  };

  const subscribe = () => {
    setSubscribed(true);
    notify("订阅已开启", "风险≥0.40 时将触发派单/抄送/复核（Mock）")
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Rocket}
        title="交付（决定它是不是“值钱的产品”）"
        desc="报告 / API / 订阅告警：把一次 Run 变成可上线的服务"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button className="rounded-2xl" onClick={exportReport}>
              <FileText className="h-4 w-4 mr-2" />导出报告
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={genAPI}>
              <Code className="h-4 w-4 mr-2" />生成 API
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={subscribe}>
              <Bell className="h-4 w-4 mr-2" />订阅告警
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={subscribed ? "secondary" : "outline"}>
          告警订阅：{subscribed ? "已开启" : "未开启"}
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">报告（业务可签字）</CardTitle>
            <CardDescription className="text-xs">把指标、阈值、解释、建议汇总成可流转文档。</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>本期超时风险 Top 区域：R05</li>
              <li>阈值建议：0.40（收益最大）</li>
              <li>主要驱动因素：queue_len / active_units</li>
              <li>治理建议：口径统一 + 驻点优化</li>
            </ul>
            <div className="mt-3">
              <Button size="sm" className="rounded-xl" onClick={exportReport}>预览报告</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">API（系统可接入）</CardTitle>
            <CardDescription className="text-xs">把推理变成标准服务接口。</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="text-xs text-muted-foreground">Endpoint</div>
            <div className="mt-1 font-mono text-xs p-2 rounded-xl bg-muted">POST /api/v1/predict/overdue</div>
            <div className="mt-3">
              <Button size="sm" className="rounded-xl" onClick={genAPI}>查看 API 示例</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">订阅告警（运营闭环）</CardTitle>
            <CardDescription className="text-xs">把阈值策略变成日常运营。</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <ul className="list-disc pl-5 space-y-1">
              <li>触发条件：风险 ≥ 0.40</li>
              <li>分组：按 region_id / shift</li>
              <li>动作：派单 + 抄送指挥长</li>
              <li>兜底：低置信度进入人工复核队列</li>
            </ul>
            <div className="mt-3">
              <Button size="sm" className="rounded-xl" onClick={subscribe}>开启订阅</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（交付收口）</CardTitle>
          <CardDescription className="text-xs">把“demo”变成“值钱的产品”。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“如果只停在结果页，它还是个实验。我们把它一键变成报告、API、告警订阅，这才是能落地、能卖、能规模化的产品形态。”</div>
        </CardContent>
      </Card>
    </div>
  );
}

function ComparePanel({ notify, openModal }) {
  const exportCompare = () => {
    notify("对比报告已生成", "已生成同口径对比报告（Mock）")
    openModal(
      "对比报告预览（Mock）",
      <div className="space-y-3">
        <div className="text-sm">对比维度：工作量 / 稳定性 / 复现性 / 解释性 / 交付完整度</div>
        <div className="p-3 rounded-2xl bg-muted text-xs">提示：这里的数值为演示占位，真实版本应接入同一套评测流水线产出。</div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl border text-sm">XGBoost：强在可控/可解释，但训练与工程成本高</div>
          <div className="p-3 rounded-2xl border text-sm">AutoGluon：强在自动化，但仍需训练预算与环境固化</div>
          <div className="p-3 rounded-2xl border text-sm">通用LLM：强在表达与交互，但结构化指标与复现不稳</div>
          <div className="p-3 rounded-2xl border text-sm">LimiX：强在“流水线产品化 + 可交付链路”</div>
        </div>
        <Button className="rounded-2xl" onClick={() => notify("已下载", "对比报告已下载（Mock）")}>下载对比报告</Button>
      </div>
    )
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={ShieldCheck}
        title="对比证明墙（同数据同口径，终结争论）"
        desc="对比维度：工作量/门槛/稳定性/复现性/解释性/迭代成本/落地链路完整度"
      />

      <div className="grid md:grid-cols-2 gap-3">
        {MOCK_COMPARE.map((c) => (
          <Card key={c.name} className={cn("rounded-2xl", c.highlight ? "border-2" : "")}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{c.name}</span>
                <Badge className="rounded-xl" variant={c.highlight ? "default" : "outline"}>
                  {c.badge}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs">一句话：{c.name === "LimiX" ? "卖的是流水线产品" : "更多是方法/组件"}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Timer className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">耗时：</span>
                  {c.time}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BarChart3 className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">指标：</span>
                  {c.metric}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ScanSearch className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">解释：</span>
                  {c.explain}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">复现：</span>
                  {c.repro}
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Rocket className="h-4 w-4 mt-0.5" />
                <div>
                  <span className="text-muted-foreground">交付：</span>
                  {c.delivery}
                </div>
              </div>
              <div className="pt-2 flex items-center gap-2 flex-wrap">
                <Button size="sm" className="rounded-xl" onClick={exportCompare}>导出对比报告</Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => notify("已打开评测", "已打开同口径评测详情（Mock）")}
                >
                  查看同口径评测
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">导演话术（投资人收口一句话）</CardTitle>
          <CardDescription className="text-xs">少形容词，多证据。</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed">
          <div className="p-3 rounded-2xl bg-muted">“我们不卖一个更强的算法，我们卖一条把结构化数据稳定变成‘可解释决策与可交付服务’的流水线产品。对比卡里你看到的是：工作量更低、复现更强、交付更完整。”</div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Button className="rounded-2xl" onClick={exportCompare}>一键导出全量对比</Button>
        <Button variant="outline" className="rounded-2xl" onClick={() => notify("已复制", "对比墙链接已复制（Mock）")}>复制链接</Button>
      </div>
    </div>
  );
}

export default function LimixDemoMockPreview() {
  const [active, setActive] = useState("datasets");
  const [sceneId, setSceneId] = useState("gov_incident");
  const [quickMode, setQuickMode] = useState(true);
  const [datasetId, setDatasetId] = useState("incident_wide_v1");
  const [runs, setRuns] = useState(MOCK_RUNS_BASE);

  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({ open: false, title: "", content: null });

  const notify = (title, desc = "") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
    setToasts((prev) => [{ id, title, desc }, ...prev].slice(0, 4));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const openModal = (title, content) => setModal({ open: true, title, content });
  const closeModal = () => setModal({ open: false, title: "", content: null });

  // 模拟：当切换到“更准模式”时，已存在 Run 的复现信息会变化（仅演示）
  useEffect(() => {
    setRuns((prev) =>
      prev.map((r) => ({
        ...r,
        version: r.version.replace(/mode:(快|准)/, `mode:${quickMode ? "快" : "准"}`),
      }))
    );
  }, [quickMode]);

  const stepIndex = useMemo(() => {
    const map = {
      datasets: 0,
      health: 1,
      clean: 2,
      features: 3,
      tasks: 4,
      results: 5,
      explain: 6,
      deliver: 7,
      compare: 7,
    };
    return map[active] ?? 0;
  }, [active]);

  return (
    <div className="min-h-screen bg-background">
      <TopBar sceneId={sceneId} setSceneId={setSceneId} quickMode={quickMode} setQuickMode={setQuickMode} datasetId={datasetId} setDatasetId={setDatasetId} />

      <Modal open={modal.open} title={modal.title} onClose={closeModal}>
        {modal.content}
      </Modal>

      <ToastStack toasts={toasts} dismiss={dismissToast} />

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="mt-0 flex flex-col md:flex-row gap-4">
          <SideNav active={active} setActive={setActive} />

          <div className="flex-1">
            <div className="space-y-4">
              {active === "datasets" && <DatasetsPanel datasetId={datasetId} setDatasetId={setDatasetId} notify={notify} openModal={openModal} />}
              {active === "health" && <HealthPanel datasetId={datasetId} notify={notify} openModal={openModal} setActive={setActive} />}
              {active === "clean" && <CleanPanel datasetId={datasetId} setDatasetId={setDatasetId} notify={notify} openModal={openModal} />}
              {active === "features" && <FeaturesPanel notify={notify} openModal={openModal} />}
              {active === "tasks" && <TasksPanel quickMode={quickMode} runs={runs} setRuns={setRuns} notify={notify} />}
              {active === "results" && <ResultsPanel notify={notify} openModal={openModal} />}
              {active === "explain" && <ExplainPanel notify={notify} openModal={openModal} />}
              {active === "deliver" && <DeliverPanel notify={notify} openModal={openModal} />}
              {active === "compare" && <ComparePanel notify={notify} openModal={openModal} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
