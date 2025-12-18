// Mock Data for LimiX Demo

export const NAV_ITEMS = [
  { key: "datasets", name: "数据集", icon: "Database" },
  { key: "health", name: "数据体检", icon: "Stethoscope" },
  { key: "clean", name: "清洗方案", icon: "Wand2" },
  { key: "features", name: "特征工厂", icon: "Sparkles" },
  { key: "tasks", name: "任务", icon: "ListTodo" },
  { key: "results", name: "结果", icon: "BarChart3" },
  { key: "explain", name: "解释", icon: "ScanSearch" },
  { key: "deliver", name: "交付", icon: "Rocket" },
  { key: "compare", name: "对比证明", icon: "ShieldCheck" },
];

export const SCENES = [
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

export const MOCK_DATASETS = [
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

export const MOCK_SCHEMA = [
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
export const HEALTH_V1 = {
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

export const HEALTH_V2 = {
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

export const MOCK_CLEAN_RULES = [
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

export const MOCK_FEATURES_BASE = [
  { name: "queue_len", importance: 0.22, stability: 0.88, relation: "正相关（队列越长越容易超时）" },
  { name: "active_units", importance: 0.18, stability: 0.81, relation: "负相关（力量越多越不超时）" },
  { name: "distance_km", importance: 0.14, stability: 0.74, relation: "正相关（距离越远越易超时）" },
  { name: "severity", importance: 0.12, stability: 0.79, relation: "正相关（严重度越高越易超时）" },
  { name: "weather", importance: 0.09, stability: 0.66, relation: "恶劣天气提高到场/处置时长" },
  { name: "history_7d_incidents", importance: 0.07, stability: 0.71, relation: "正相关（热点区域更拥堵）" },
];

export const MOCK_RUNS_BASE = [
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

export const MOCK_GROUP_ERROR = {
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

export const MOCK_CONFIDENCE = [
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

export const MOCK_THRESHOLD = [
  { th: 0.1, benefit: 12, precision: 0.42, recall: 0.91 },
  { th: 0.2, benefit: 18, precision: 0.51, recall: 0.84 },
  { th: 0.3, benefit: 24, precision: 0.58, recall: 0.76 },
  { th: 0.4, benefit: 29, precision: 0.65, recall: 0.66 },
  { th: 0.5, benefit: 31, precision: 0.70, recall: 0.58 },
  { th: 0.6, benefit: 30, precision: 0.74, recall: 0.49 },
  { th: 0.7, benefit: 27, precision: 0.78, recall: 0.39 },
];

export const MOCK_COMPARE = [
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

export const MOCK_SHAP = [
  { feature: "queue_len", value: 0.18 },
  { feature: "distance_km", value: 0.12 },
  { feature: "active_units", value: -0.21 },
  { feature: "severity", value: 0.05 },
  { feature: "weather", value: 0.03 },
  { feature: "history_7d", value: 0.02 },
];

export const MOCK_RADAR = [
  { metric: "交付效率", LimiX: 9, XGBoost: 5, LLM: 8 },
  { metric: "可解释性", LimiX: 9, XGBoost: 7, LLM: 6 },
  { metric: "稳定性", LimiX: 8, XGBoost: 8, LLM: 4 },
  { metric: "复现性", LimiX: 9, XGBoost: 6, LLM: 3 },
  { metric: "工作量(低)", LimiX: 8, XGBoost: 4, LLM: 9 }, // Higher is better (less work)
];
