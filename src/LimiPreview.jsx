import React, { useMemo, useState, useEffect, useRef } from "react";
import { Select, Tag, Checkbox } from "@arco-design/web-react";
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
  Upload,
  Activity,
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
  Legend,
  Cell,
  LabelList,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
} from "recharts";

// 注意：本页面所有数据均为 Mock，仅用于演示“平台形态/页面结构/可视化证据链”。

const NAV = [
  { key: "datasets", name: "数据资产", icon: Database },
  { key: "health", name: "数据评估", icon: Stethoscope },
  { key: "clean", name: "数据清洗", icon: Wand2 },
  { key: "tasks", name: "推理任务", icon: ListTodo },
  { key: "results", name: "推理结果", icon: BarChart3 },
  { key: "explain", name: "因果解释", icon: ScanSearch },
  // { key: "deliver", name: "交付", icon: Rocket },
  { key: "compare", name: "对比分析", icon: ShieldCheck },
];

const SCENES = [
  {
    id: "sd_price",
    name: "山东省日前电价预测",
    tag: "ToB",
  },
  {
    id: "sd_high_price_clf",
    name: "山东省搏高价分类预测",
    tag: "ToB",
  },
  {
    id: "sx_price",
    name: "山西省日前电价预测",
    tag: "ToB",
  },
  {
    id: "hebei_price",
    name: "河北省日前电价预测",
    tag: "ToB",
  },
  {
    id: "henan_price",
    name: "河南省日前电价预测",
    tag: "ToB",
  },
  {
    id: "hubei_price",
    name: "湖北省日前电价预测",
    tag: "ToB",
  },
  {
    id: "hunan_price",
    name: "湖南省日前电价预测",
    tag: "ToB",
  },
];

const MOCK_DATASETS = [
  {
    id: "test_+5_v1",
    sceneId: "sd_price",
    name: "test_+5_V1-待去重待补全.numbers",
    version: "v1（含脏数据）",
    rows: 15340,
    cols: 17,
    timeRange: "2025-08-01 ~ 2026-01-01",
    owner: "市场部",
    qualityScore: 62,
  },
  {
    id: "test_+5_v2",
    sceneId: "sd_price",
    name: "test_+5_V2-清洗后.csv",
    version: "v2（清洗后）",
    rows: 15300,
    cols: 17,
    timeRange: "2025-08-01 ~ 2026-01-01",
    owner: "市场部",
    qualityScore: 88,
  },
  {
    id: "test_clf_v1",
    sceneId: "sd_high_price_clf",
    name: "test_分类_V1.csv",
    version: "v1（含脏数据）",
    rows: 749,
    cols: 17,
    timeRange: "2025-08-01 ~ 2025-09-01",
    owner: "市场部",
    qualityScore: 58,
  },
];

const MOCK_SCHEMA = [
  { k: "Time", t: "时间", desc: "时间戳" },
  { k: "非市场化核电总加_日前", t: "数值", desc: "非市场化核电" },
  { k: "竞价空间_日前", t: "数值", desc: "竞价空间" },
  { k: "风力发电_日前", t: "数值", desc: "风电" },
  { k: "联络线计划_日前", t: "数值", desc: "外送计划" },
  { k: "光伏发电_日前", t: "数值", desc: "光伏" },
  { k: "新能源总加_日前", t: "数值", desc: "新能源总和" },
  { k: "省调负荷_日前", t: "数值", desc: "省调负荷" },
  { k: "全网负荷_日前", t: "数值", desc: "全网负荷" },
  { k: "现货出清电价-日前_D-2", t: "数值", desc: "D-2日前电价" },
  { k: "现货出清电价-实时_D-2", t: "数值", desc: "D-2实时电价" },
  { k: "实时-日前偏差值_D-2", t: "数值", desc: "D-2价差" },
  { k: "label", t: "目标Y（回归）", desc: "电价预测" },
  { k: "实时-日前偏差值_D-2_label", t: "数值", desc: "D-2价差标签" },
  { k: "实时-日前偏差值_D-3_label", t: "数值", desc: "D-3价差标签" },
  { k: "现货出清电价-日前_D-3", t: "数值", desc: "D-3日前电价" },
  { k: "现货出清电价-实时_D-3", t: "数值", desc: "D-3实时电价" }
];

const MOCK_SCHEMA_CLF = [
  { k: "Time", t: "时间", desc: "时间戳" },
  { k: "非市场化核电总加_日前", t: "数值", desc: "非市场化核电" },
  { k: "竞价空间_日前", t: "数值", desc: "竞价空间" },
  { k: "风力发电_日前", t: "数值", desc: "风电" },
  { k: "联络线计划_日前", t: "数值", desc: "外送计划" },
  { k: "光伏发电_日前", t: "数值", desc: "光伏" },
  { k: "新能源总加_日前", t: "数值", desc: "新能源总和" },
  { k: "省调负荷_日前", t: "数值", desc: "省调负荷" },
  { k: "全网负荷_日前", t: "数值", desc: "全网负荷" },
  { k: "现货出清电价-日前_D-2", t: "数值", desc: "D-2日前电价" },
  { k: "现货出清电价-实时_D-2", t: "数值", desc: "D-2实时电价" },
  { k: "实时-日前偏差值_D-2", t: "数值", desc: "D-2价差" },
  { k: "label", t: "分类目标", desc: "高电价分类" },
  { k: "实时-日前偏差值_D-2_label", t: "数值", desc: "D-2价差标签" },
  { k: "实时-日前偏差值_D-3_label", t: "数值", desc: "D-3价差标签" },
  { k: "现货出清电价-日前_D-3", t: "数值", desc: "D-3日前电价" },
  { k: "现货出清电价-实时_D-3", t: "数值", desc: "D-3实时电价" },
];

const MOCK_ROWS_CLF = Array.from({ length: 31 * 24 }, (_, i) => {
  const dayOffset = Math.floor(i / 24);
  const hour = i % 24;
  const date = new Date("2025/11/16");
  date.setDate(date.getDate() + dayOffset);
  
  // Pattern based on user specific dates
  // High: 11-18, 19, 20, 24, 25, 26, 28, 29, 12-04, 05, 07, 11, 12, 14, 15
  // Others: 0
  const dailyPattern = [
    null, // 11-16
    0, // 11-17
    1, // 11-18
    1, // 11-19
    1, // 11-20
    0, // 11-21
    0, // 11-22
    0, // 11-23
    1, // 11-24
    1, // 11-25
    1, // 11-26
    0, // 11-27
    1, // 11-28
    1, // 11-29
    0, // 11-30
    0, // 12-01
    0, // 12-02
    0, // 12-03
    1, // 12-04
    1, // 12-05
    0, // 12-06
    1, // 12-07
    0, // 12-08
    0, // 12-09
    0, // 12-10
    1, // 12-11
    1, // 12-12
    0, // 12-13
    1, // 12-14
    1, // 12-15
    0, // 12-16
  ];
  
  // Safety check for pattern index
  const patternIndex = dayOffset % dailyPattern.length;
  const patternVal = dailyPattern[patternIndex];
  
  const isHighDay = patternVal === 1;
  const isNullDay = patternVal === null || patternVal === undefined;

  // Logic to determine if it's high price based on hour (mimicking CSV)
  // High price hours: 2-6, 15-18. Only applies if it's a High Price Day.
  const isHighHour = !isNullDay && isHighDay && ((hour >= 2 && hour <= 6) || (hour >= 15 && hour <= 18));
  const label = isNullDay ? "null" : (isHighHour ? "1" : "0");

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const timeStr = `${date.getFullYear()}/${month}/${day} ${hour.toString().padStart(2, '0')}:00`;

  // Default random data generation
  return {
    Time: timeStr,
    "非市场化核电总加_日前": (1620 + Math.random() * 10).toFixed(0),
    "竞价空间_日前": (30000 + Math.random() * 30000).toFixed(2),
    "风力发电_日前": (2000 + Math.random() * 4000).toFixed(2),
    "联络线计划_日前": (20000 + Math.random() * 8000).toFixed(2),
    "光伏发电_日前": hour > 6 && hour < 18 ? (5000 + Math.random() * 10000).toFixed(2) : "0",
    "新能源总加_日前": (8000 + Math.random() * 10000).toFixed(2),
    "省调负荷_日前": (70000 + Math.random() * 20000).toFixed(2),
    "全网负荷_日前": (80000 + Math.random() * 30000).toFixed(2),
    "现货出清电价-日前_D-2": (300 + Math.random() * 200).toFixed(2),
    "现货出清电价-实时_D-2": (300 + Math.random() * 200).toFixed(2),
    "实时-日前偏差值_D-2": (Math.random() * 100 - 50).toFixed(2),
    label: label,
    "实时-日前偏差值_D-2_label": label,
    "实时-日前偏差值_D-3_label": Math.random() > 0.5 ? "1" : "0",
    "现货出清电价-日前_D-3": (300 + Math.random() * 200).toFixed(2),
    "现货出清电价-实时_D-3": (300 + Math.random() * 200).toFixed(2),
  };
});

const MOCK_PREVIEW_ROWS_CLF_V1 = [
  {
      Time: "2025/8/1 00:00",
      "非市场化核电总加_日前": "",
      "竞价空间_日前": "53203.885",
      "风力发电_日前": "5011.7275",
      "联络线计划_日前": "20427.25",
      "光伏发电_日前": "0",
      "新能源总加_日前": "5011.7275",
      "省调负荷_日前": "80263.8625",
      "全网负荷_日前": "86613.8825",
      "现货出清电价-日前_D-2": "403.5",
      "现货出清电价-实时_D-2": "424.66",
      "实时-日前偏差值_D-2": "21.16",
      label: "0",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "1",
      "现货出清电价-日前_D-3": "406.21",
      "现货出清电价-实时_D-3": "417.02"
  },
  {
      Time: "2025/8/1 01:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "53395.1975",
      "风力发电_日前": "4460.07",
      "联络线计划_日前": "20522.25",
      "光伏发电_日前": "0",
      "新能源总加_日前": "",
      "省调负荷_日前": "79998.5175",
      "全网负荷_日前": "86348.54000000001",
      "现货出清电价-日前_D-2": "414.4",
      "现货出清电价-实时_D-2": "431.09",
      "实时-日前偏差值_D-2": "16.69",
      label: "0",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "0",
      "现货出清电价-日前_D-3": "414.52",
      "现货出清电价-实时_D-3": "411.48"
  },
  {
      Time: "2025/8/1 02:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "50437.715000000004",
      "风力发电_日前": "4122.835",
      "联络线计划_日前": "20738.5",
      "光伏发电_日前": "0",
      "新能源总加_日前": "4122.835",
      "省调负荷_日前": "76920.05",
      "全网负荷_日前": "83270.07",
      "现货出清电价-日前_D-2": "400.6",
      "现货出清电价-实时_D-2": "407.37",
      "实时-日前偏差值_D-2": "6.77",
      label: "1",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "1",
      "现货出清电价-日前_D-3": "396.3",
      "现货出清电价-实时_D-3": "400.48"
  },
  {
      Time: "2025/8/1 02:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "50437.715000000004",
      "风力发电_日前": "4122.835",
      "联络线计划_日前": "20738.5",
      "光伏发电_日前": "0",
      "新能源总加_日前": "4122.835",
      "省调负荷_日前": "76920.05",
      "全网负荷_日前": "83270.07",
      "现货出清电价-日前_D-2": "400.6",
      "现货出清电价-实时_D-2": "407.37",
      "实时-日前偏差值_D-2": "6.77",
      label: "1",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "1",
      "现货出清电价-日前_D-3": "396.3",
      "现货出清电价-实时_D-3": "400.48"
  },
  {
      Time: "2025/8/1 03:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "",
      "风力发电_日前": "3980.1625",
      "联络线计划_日前": "20658.75",
      "光伏发电_日前": "0",
      "新能源总加_日前": "3980.1625",
      "省调负荷_日前": "74993.04000000001",
      "全网负荷_日前": "81343.0675",
      "现货出清电价-日前_D-2": "389.05",
      "现货出清电价-实时_D-2": "392.83",
      "实时-日前偏差值_D-2": "3.78",
      label: "1",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "1",
      "现货出清电价-日前_D-3": "380.42",
      "现货出清电价-实时_D-3": "392.13"
  },
  {
      Time: "2025/8/1 04:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "47934.735",
      "风力发电_日前": "3978.3375",
      "联络线计划_日前": "20784.25",
      "光伏发电_日前": "7.45",
      "新能源总加_日前": "3985.7875",
      "省调负荷_日前": "",
      "全网负荷_日前": "80686.1325",
      "现货出清电价-日前_D-2": "384.61",
      "现货出清电价-实时_D-2": "387.03",
      "实时-日前偏差值_D-2": "2.42",
      label: "1",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "1",
      "现货出清电价-日前_D-3": "375.14",
      "现货出清电价-实时_D-3": "381.88"
  },
  {
      Time: "2025/8/1 05:00",
      "非市场化核电总加_日前": "",
      "竞价空间_日前": "47211.455",
      "风力发电_日前": "",
      "联络线计划_日前": "21663.5",
      "光伏发电_日前": "402.92499999999995",
      "新能源总加_日前": "4417.35",
      "省调负荷_日前": "74913.305",
      "全网负荷_日前": "81894.16",
      "现货出清电价-日前_D-2": "374.01",
      "现货出清电价-实时_D-2": "377.89",
      "实时-日前偏差值_D-2": "3.88",
      label: "1",
      "实时-日前偏差值_D-2_label": "1",
      "实时-日前偏差值_D-3_label": "0",
      "现货出清电价-日前_D-3": "381.56",
      "现货出清电价-实时_D-3": "379.62"
  },
  {
      Time: "2025/8/1 06:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "42958.845",
      "风力发电_日前": "3991.175",
      "联络线计划_日前": "22795.25",
      "光伏发电_日前": "2348.4825",
      "新能源总加_日前": "6339.6575",
      "省调负荷_日前": "73714.7525",
      "全网负荷_日前": "83636.8625",
      "现货出清电价-日前_D-2": "334.39",
      "现货出清电价-实时_D-2": "334.12",
      "实时-日前偏差值_D-2": "-0.27",
      label: "1",
      "实时-日前偏差值_D-2_label": "0",
      "实时-日前偏差值_D-3_label": "0",
      "现货出清电价-日前_D-3": "344",
      "现货出清电价-实时_D-3": "333"
  },
  {
      Time: "2025/8/1 06:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "42958.845",
      "风力发电_日前": "3991.175",
      "联络线计划_日前": "22795.25",
      "光伏发电_日前": "2348.4825",
      "新能源总加_日前": "6339.6575",
      "省调负荷_日前": "73714.7525",
      "全网负荷_日前": "83636.8625",
      "现货出清电价-日前_D-2": "334.39",
      "现货出清电价-实时_D-2": "334.12",
      "实时-日前偏差值_D-2": "-0.27",
      label: "1",
      "实时-日前偏差值_D-2_label": "0",
      "实时-日前偏差值_D-3_label": "0",
      "现货出清电价-日前_D-3": "344",
      "现货出清电价-实时_D-3": "333"
  },
  {
      Time: "2025/8/1 07:00",
      "非市场化核电总加_日前": "1621",
      "竞价空间_日前": "38885.0225",
      "风力发电_日前": "3930.8900000000003",
      "联络线计划_日前": "24184.25",
      "光伏发电_日前": "5625.3525",
      "新能源总加_日前": "9556.2425",
      "省调负荷_日前": "74246.515",
      "全网负荷_日前": "",
      "现货出清电价-日前_D-2": "258.79",
      "现货出清电价-实时_D-2": "233.11",
      "实时-日前偏差值_D-2": "-25.68",
      label: "0",
      "实时-日前偏差值_D-2_label": "0",
      "实时-日前偏差值_D-3_label": "0",
      "现货出清电价-日前_D-3": "303.82",
      "现货出清电价-实时_D-3": "271.31"
  }
];

// v1 / v2 的体检数据：只用于展示点击后的“可见变化”
const HEALTH_V1 = {
  summary: [
    { name: "缺失率", value: 5.2, unit: "%" },
    { name: "异常值", value: 2.1, unit: "%" },
    { name: "重复率", value: 1.5, unit: "%" },
    { name: "口径不一致", value: 4, unit: "项" },
  ],
  drift: [
    { day: "05/01", psi: 0.04 },
    { day: "05/08", psi: 0.07 },
    { day: "05/15", psi: 0.12 },
    { day: "05/22", psi: 0.19 },
    { day: "05/29", psi: 0.25 },
  ],
  missingHeat: {
    fields: [
      "风力发电_日前",
      "光伏发电_日前",
      "全网负荷_日前",
      "联络线计划_日前",
      "竞价空间_日前",
      "现货出清电价-日前_D-2",
    ],
    groups: ["G1", "G2", "G3", "G4", "G5", "G6"],
    matrix: [
      [0.08, 0.10, 0.05, 0.02, 0.06, 0.12],
      [0.03, 0.06, 0.04, 0.01, 0.03, 0.08],
      [0.12, 0.15, 0.09, 0.05, 0.11, 0.20],
      [0.01, 0.02, 0.01, 0.00, 0.01, 0.03],
      [0.04, 0.07, 0.03, 0.02, 0.05, 0.09],
      [0.00, 0.01, 0.00, 0.00, 0.01, 0.02],
    ],
  },
  inconsistencies: [
    {
      id: "INC-001",
      field: "单位",
      examples: ["MW", "kW", "兆瓦"],
      impact: "功率单位不统一，数值差异1000倍",
    },
    {
      id: "INC-002",
      field: "Time",
      examples: ["2023/1/1", "2023-01-01"],
      impact: "时间格式不统一，影响时序对齐",
    },
  ],
};

const HEALTH_CLF = {
  summary: [
    { name: "缺失率", value: 5.2, unit: "%" },
    { name: "异常值", value: 2.1, unit: "%" },
    { name: "重复率", value: 1.5, unit: "%" },
    { name: "口径不一致", value: 4, unit: "项" },
  ],
  drift: HEALTH_V1.drift,
  missingHeat: HEALTH_V1.missingHeat,
  inconsistencies: HEALTH_V1.inconsistencies,
};

const HEALTH_V2 = {
  summary: [
    { name: "缺失率", value: 0.0, unit: "%", hint: "已使用线性插值填补" },
    { name: "异常值", value: 0.1, unit: "%", hint: "已修正极值" },
    { name: "重复率", value: 0.0, unit: "%", hint: "去重完成" },
    { name: "口径不一致", value: 0, unit: "项", hint: "统一归一化" },
  ],
  drift: [
    { day: "05/01", psi: 0.01 },
    { day: "05/08", psi: 0.02 },
    { day: "05/15", psi: 0.05 },
    { day: "05/22", psi: 0.08 },
    { day: "05/29", psi: 0.10 },
  ],
  missingHeat: {
    fields: HEALTH_V1.missingHeat.fields,
    groups: HEALTH_V1.missingHeat.groups,
    matrix: HEALTH_V1.missingHeat.matrix.map((row) => row.map((v) => Math.max(0, v - 0.1))),
  },
  inconsistencies: [],
};

const MOCK_CLEAN_RULES = [
  {
    id: "R-001",
    name: "去重：基于 Time 字段保留最新",
    type: "去重",
    before: "重复 1.5%",
    after: "重复 0.0%",
    risk: "低",
  },
  {
    id: "R-002",
    name: "单位换算：统一功率单位为 MW",
    type: "映射",
    before: "kW/MW 混杂",
    after: "全量 MW",
    risk: "低",
  },
  {
    id: "R-003",
    name: "异常处理：负荷 < 0 修正为 0",
    type: "异常",
    before: "异常 2.1%",
    after: "异常 0.1%",
    risk: "中",
  },
  {
    id: "R-004",
    name: "缺失填补：光伏发电_日前 线性插值",
    type: "填补",
    before: "缺失 5.2%",
    after: "缺失 0.0%",
    risk: "中",
  },
];

const MOCK_FEATURES_BASE = [
  { name: "全网负荷_日前", importance: 0.35, stability: 0.92, relation: "正相关（负荷高电价高）" },
  { name: "新能源总加_日前", importance: 0.28, stability: 0.85, relation: "负相关（新能源多电价低）" },
  { name: "现货出清电价-日前_D-2", importance: 0.15, stability: 0.78, relation: "正相关（历史电价趋势）" },
  { name: "竞价空间_日前", importance: 0.12, stability: 0.82, relation: "负相关（空间大竞争激烈）" },
  { name: "联络线计划_日前", importance: 0.06, stability: 0.70, relation: "正相关（外送增加推高电价）" },
  { name: "非市场化核电总加_日前", importance: 0.04, stability: 0.95, relation: "负相关（基荷稳定）" },
];

const MOCK_RUNS_BASE = [
  {
    id: "run-A",
    taskName: "日前电价预测_XGB",
    taskType: "回归",
    target: "label",
    status: "已完成",
    durationSec: 45,
    metrics: { RMSE: 15.2, MAPE: 0.08 },
    version: "data:v2 · seed:42 · mode:精",
    createTime: "2025-12-25 10:00:00",
    finishTime: "2025-12-25 10:00:45",
  },
  {
    id: "run-B",
    taskName: "日前电价预测_LGBM",
    taskType: "回归",
    target: "label",
    status: "已完成",
    durationSec: 32,
    metrics: { RMSE: 16.5, MAPE: 0.09 },
    version: "data:v2 · seed:42 · mode:快",
    createTime: "2025-12-25 10:05:00",
    finishTime: "2025-12-25 10:05:32",
  },
  {
    id: "run-D",
    taskName: "日前电价预测_AutoGluon",
    taskType: "回归",
    target: "label",
    status: "运行中",
    durationSec: 0,
    metrics: {},
    version: "data:v2 · seed:42 · mode:精",
    createTime: "2025-12-25 10:10:00",
    finishTime: "-",
  },
  {
    id: "run-E",
    taskName: "日前电价预测_Limix",
    taskType: "回归",
    target: "label",
    status: "排队中",
    durationSec: 0,
    metrics: {},
    version: "data:v2 · seed:42 · mode:精",
    createTime: "2025-12-25 10:12:00",
    finishTime: "-",
  },
  {
    id: "run-F",
    taskName: "日前电价预测_CNN",
    taskType: "回归",
    target: "label",
    status: "失败",
    durationSec: 12,
    metrics: {},
    version: "data:v2 · seed:42 · mode:精",
    createTime: "2025-12-25 09:50:00",
    finishTime: "2025-12-25 09:50:12",
  },
  {
    id: "run-G",
    taskName: "日前电价预测_Old",
    taskType: "回归",
    target: "label",
    status: "已归档",
    durationSec: 50,
    metrics: { RMSE: 18.2, MAPE: 0.12 },
    version: "data:v1 · seed:42 · mode:快",
    createTime: "2025-12-24 15:00:00",
    finishTime: "2025-12-24 15:00:50",
  },
  {
    id: "run-C",
    taskName: "缺失值填补_RF",
    taskType: "填补",
    target: "光伏发电_日前",
    status: "已完成",
    durationSec: 28,
    metrics: { MAE: 5.4, R2: 0.92 },
    version: "data:v1 · seed:42 · mode:快",
    createTime: "2025-12-25 09:00:00",
    finishTime: "2025-12-25 09:00:28",
  },
];

const MOCK_PREVIEW_STATS = {
  "Time": { unique: 744, missing: "0.0%" },
  "非市场化核电总加_日前": { unique: 32, missing: "0.0%" },
  "竞价空间_日前": { unique: 742, missing: "0.3%" },
  "风力发电_日前": { unique: 742, missing: "0.4%" },
  "联络线计划_日前": { unique: 331, missing: "0.0%" },
  "光伏发电_日前": { unique: 495, missing: "0.1%" },
  "新能源总加_日前": { unique: 742, missing: "0.3%" },
  "省调负荷_日前": { unique: 744, missing: "0.0%" },
  "全网负荷_日前": { unique: 717, missing: "3.2%" },
  "现货出清电价-日前_D-2": { unique: 735, missing: "0.0%" },
  "现货出清电价-实时_D-2": { unique: 736, missing: "0.0%" },
  "实时-日前偏差值_D-2": { unique: 715, missing: "0.0%" },
  "label": { unique: 2, missing: "0.0%" },
  "实时-日前偏差值_D-2_label": { unique: 2, missing: "0.0%" },
  "实时-日前偏差值_D-3_label": { unique: 2, missing: "0.0%" },
  "现货出清电价-日前_D-3": { unique: 737, missing: "0.0%" },
  "现货出清电价-实时_D-3": { unique: 734, missing: "0.0%" }
};

const MOCK_PREVIEW_ROWS = [
  { "Time": "2025-08-01 00:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 53203.89, "风力发电_日前": 5011.73, "联络线计划_日前": 20427.25, "光伏发电_日前": 0.0, "新能源总加_日前": 5011.73, "省调负荷_日前": 80263.86, "全网负荷_日前": 86613.88, "现货出清电价-日前_D-2": 403.5, "现货出清电价-实时_D-2": 424.66, "实时-日前偏差值_D-2": 21.16, "label": 0, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 406.21, "现货出清电价-实时_D-3": 417.02 },
  { "Time": "2025-08-01 01:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 53395.20, "风力发电_日前": 4460.07, "联络线计划_日前": 20522.25, "光伏发电_日前": 0.0, "新能源总加_日前": 4460.07, "省调负荷_日前": 79998.52, "全网负荷_日前": 86348.54, "现货出清电价-日前_D-2": 414.4, "现货出清电价-实时_D-2": 431.09, "实时-日前偏差值_D-2": 16.69, "label": 0, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 414.52, "现货出清电价-实时_D-3": 411.48 },
  { "Time": "2025-08-01 02:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 50437.72, "风力发电_日前": "NaN", "联络线计划_日前": 20738.50, "光伏发电_日前": 0.0, "新能源总加_日前": "NaN", "省调负荷_日前": 76920.05, "全网负荷_日前": 83270.07, "现货出清电价-日前_D-2": 400.6, "现货出清电价-实时_D-2": 407.37, "实时-日前偏差值_D-2": 6.77, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 396.3, "现货出清电价-实时_D-3": 400.48 },
  { "Time": "2025-08-01 03:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 48733.13, "风力发电_日前": 3980.16, "联络线计划_日前": 20658.75, "光伏发电_日前": 0.0, "新能源总加_日前": 3980.16, "省调负荷_日前": 74993.04, "全网负荷_日前": 81343.07, "现货出清电价-日前_D-2": 389.05, "现货出清电价-实时_D-2": 392.83, "实时-日前偏差值_D-2": 3.78, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 380.42, "现货出清电价-实时_D-3": 392.13 },
  { "Time": "2025-08-01 04:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": "NaN", "风力发电_日前": 3978.34, "联络线计划_日前": 20784.25, "光伏发电_日前": 7.45, "新能源总加_日前": 3985.79, "省调负荷_日前": 74325.77, "全网负荷_日前": 80686.13, "现货出清电价-日前_D-2": 384.61, "现货出清电价-实时_D-2": 387.03, "实时-日前偏差值_D-2": 2.42, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 375.14, "现货出清电价-实时_D-3": 381.88 },
  { "Time": "2025-08-01 05:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 47211.46, "风力发电_日前": 4014.43, "联络线计划_日前": "NaN", "光伏发电_日前": 402.92, "新能源总加_日前": 4417.35, "省调负荷_日前": 74913.31, "全网负荷_日前": 81894.16, "现货出清电价-日前_D-2": 374.01, "现货出清电价-实时_D-2": 377.89, "实时-日前偏差值_D-2": 3.88, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 381.56, "现货出清电价-实时_D-3": 379.62 },
  { "Time": "2025-08-01 06:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 42958.85, "风力发电_日前": 3991.18, "联络线计划_日前": 22795.25, "光伏发电_日前": 2348.48, "新能源总加_日前": 6339.66, "省调负荷_日前": 73714.75, "全网负荷_日前": 83636.86, "现货出清电价-日前_D-2": 334.39, "现货出清电价-实时_D-2": 334.12, "实时-日前偏差值_D-2": -0.27, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 344.0, "现货出清电价-实时_D-3": 333.0 },
  { "Time": "2025-08-01 07:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 38885.02, "风力发电_日前": "NaN", "联络线计划_日前": 24184.25, "光伏发电_日前": 5625.35, "新能源总加_日前": "NaN", "省调负荷_日前": 74246.52, "全网负荷_日前": 89337.36, "现货出清电价-日前_D-2": 258.79, "现货出清电价-实时_D-2": 233.11, "实时-日前偏差值_D-2": -25.68, "label": 0, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 303.82, "现货出清电价-实时_D-3": 271.31 },
  { "Time": "2025-08-01 08:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 36436.63, "风力发电_日前": 4031.55, "联络线计划_日前": 27113.00, "光伏发电_日前": 9219.23, "新能源总加_日前": 13250.77, "省调负荷_日前": 78421.40, "全网负荷_日前": 99211.68, "现货出清电价-日前_D-2": 155.76, "现货出清电价-实时_D-2": 133.78, "实时-日前偏差值_D-2": -21.98, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 282.08, "现货出清电价-实时_D-3": 216.36 },
  { "Time": "2025-08-01 09:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 33976.67, "风力发电_日前": 4347.66, "联络线计划_日前": 28220.75, "光伏发电_日前": 12157.95, "新能源总加_日前": 16505.60, "省调负荷_日前": 80324.02, "全网负荷_日前": 102211.68, "现货出清电价-日前_D-2": 155.76, "现货出清电价-实时_D-2": 133.78, "实时-日前偏差值_D-2": -21.98, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 282.08, "现货出清电价-实时_D-3": 216.36 },
];

const MOCK_PREVIEW_ROWS_V2 = [
  { "Time": "2025-08-01 00:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 53203.89, "风力发电_日前": 5011.73, "联络线计划_日前": 20427.25, "光伏发电_日前": 0.0, "新能源总加_日前": 5011.73, "省调负荷_日前": 80263.86, "全网负荷_日前": 86613.88, "现货出清电价-日前_D-2": 403.5, "现货出清电价-实时_D-2": 424.66, "实时-日前偏差值_D-2": 21.16, "label": 0, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 406.21, "现货出清电价-实时_D-3": 417.02 },
  { "Time": "2025-08-01 01:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 53395.20, "风力发电_日前": 4460.07, "联络线计划_日前": 20522.25, "光伏发电_日前": 0.0, "新能源总加_日前": 4460.07, "省调负荷_日前": 79998.52, "全网负荷_日前": 86348.54, "现货出清电价-日前_D-2": 414.4, "现货出清电价-实时_D-2": 431.09, "实时-日前偏差值_D-2": 16.69, "label": 0, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 414.52, "现货出清电价-实时_D-3": 411.48 },
  { "Time": "2025-08-01 02:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 50437.72, "风力发电_日前": 4220.12, "联络线计划_日前": 20738.50, "光伏发电_日前": 0.0, "新能源总加_日前": 4220.12, "省调负荷_日前": 76920.05, "全网负荷_日前": 83270.07, "现货出清电价-日前_D-2": 400.6, "现货出清电价-实时_D-2": 407.37, "实时-日前偏差值_D-2": 6.77, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 396.3, "现货出清电价-实时_D-3": 400.48 },
  { "Time": "2025-08-01 03:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 48733.13, "风力发电_日前": 3980.16, "联络线计划_日前": 20658.75, "光伏发电_日前": 0.0, "新能源总加_日前": 3980.16, "省调负荷_日前": 74993.04, "全网负荷_日前": 81343.07, "现货出清电价-日前_D-2": 389.05, "现货出清电价-实时_D-2": 392.83, "实时-日前偏差值_D-2": 3.78, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 380.42, "现货出清电价-实时_D-3": 392.13 },
  { "Time": "2025-08-01 04:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 47972.30, "风力发电_日前": 3978.34, "联络线计划_日前": 20784.25, "光伏发电_日前": 7.45, "新能源总加_日前": 3985.79, "省调负荷_日前": 74325.77, "全网负荷_日前": 80686.13, "现货出清电价-日前_D-2": 384.61, "现货出清电价-实时_D-2": 387.03, "实时-日前偏差值_D-2": 2.42, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 375.14, "现货出清电价-实时_D-3": 381.88 },
  { "Time": "2025-08-01 05:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 47211.46, "风力发电_日前": 4014.43, "联络线计划_日前": 21790.00, "光伏发电_日前": 402.92, "新能源总加_日前": 4417.35, "省调负荷_日前": 74913.31, "全网负荷_日前": 81894.16, "现货出清电价-日前_D-2": 374.01, "现货出清电价-实时_D-2": 377.89, "实时-日前偏差值_D-2": 3.88, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 381.56, "现货出清电价-实时_D-3": 379.62 },
  { "Time": "2025-08-01 06:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 42958.85, "风力发电_日前": 3991.18, "联络线计划_日前": 22795.25, "光伏发电_日前": 2348.48, "新能源总加_日前": 6339.66, "省调负荷_日前": 73714.75, "全网负荷_日前": 83636.86, "现货出清电价-日前_D-2": 334.39, "现货出清电价-实时_D-2": 334.12, "实时-日前偏差值_D-2": -0.27, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 344.0, "现货出清电价-实时_D-3": 333.0 },
  { "Time": "2025-08-01 07:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 38885.02, "风力发电_日前": 4011.37, "联络线计划_日前": 24184.25, "光伏发电_日前": 5625.35, "新能源总加_日前": 9636.72, "省调负荷_日前": 74246.52, "全网负荷_日前": 89337.36, "现货出清电价-日前_D-2": 258.79, "现货出清电价-实时_D-2": 233.11, "实时-日前偏差值_D-2": -25.68, "label": 0, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 303.82, "现货出清电价-实时_D-3": 271.31 },
  { "Time": "2025-08-01 08:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 36436.63, "风力发电_日前": 4031.55, "联络线计划_日前": 27113.00, "光伏发电_日前": 9219.23, "新能源总加_日前": 13250.77, "省调负荷_日前": 78421.40, "全网负荷_日前": 99211.68, "现货出清电价-日前_D-2": 155.76, "现货出清电价-实时_D-2": 133.78, "实时-日前偏差值_D-2": -21.98, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 282.08, "现货出清电价-实时_D-3": 216.36 },
  { "Time": "2025-08-01 09:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 33976.67, "风力发电_日前": 4347.66, "联络线计划_日前": 28220.75, "光伏发电_日前": 12157.95, "新能源总加_日前": 16505.60, "省调负荷_日前": 80324.02, "全网负荷_日前": 102211.68, "现货出清电价-日前_D-2": 155.76, "现货出清电价-实时_D-2": 133.78, "实时-日前偏差值_D-2": -21.98, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 282.08, "现货出清电价-实时_D-3": 216.36 },
];

const MOCK_PRICE_PREDICTION = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i + 1);
  const base = 350 + Math.sin(i / 5) * 50;
  const random = (Math.random() - 0.5) * 30;
  const pred = Math.round(base + random);
  // Confidence interval width varies: grows slightly with time + random fluctuation
  const interval = 15 + (i * 0.8) + Math.random() * 10;
  
  return {
    date: `${date.getMonth() + 1}/${date.getDate()}`,
    actual: null, // Future data has no actual
    pred: pred,
    upper: Math.round(pred + interval),
    lower: Math.round(pred - interval),
  };
});

const MOCK_GROUP_ERROR = {
  rows: ["负荷_低", "负荷_中", "负荷_高", "风电_大", "光伏_大", "极端天气"],
  cols: ["MAPE", "RMSE", "MAE", "R2"],
  matrix: [
    [0.02, 12.5, 8.2, 0.95],
    [0.03, 15.1, 10.4, 0.92],
    [0.05, 22.8, 18.1, 0.88],
    [0.08, 35.2, 28.5, 0.81],
    [0.06, 28.4, 22.3, 0.85],
    [0.12, 45.6, 38.9, 0.76],
  ],
};

const MOCK_CONFIDENCE = [
  { bin: "-100~-50", count: 120 },
  { bin: "-50~-20", count: 850 },
  { bin: "-20~-10", count: 2100 },
  { bin: "-10~0", count: 4500 },
  { bin: "0~10", count: 4800 },
  { bin: "10~20", count: 2300 },
  { bin: "20~50", count: 900 },
  { bin: "50~100", count: 150 },
];

const MOCK_THRESHOLD = [
  { th: 10, benefit: 120000, precision: 0.42, recall: 0.95 },
  { th: 20, benefit: 180000, precision: 0.51, recall: 0.88 },
  { th: 30, benefit: 240000, precision: 0.58, recall: 0.79 },
  { th: 40, benefit: 290000, precision: 0.65, recall: 0.68 },
  { th: 50, benefit: 310000, precision: 0.70, recall: 0.55 },
  { th: 60, benefit: 300000, precision: 0.74, recall: 0.42 },
  { th: 70, benefit: 270000, precision: 0.78, recall: 0.31 },
];

const MOCK_COMPARE = [
  {
    name: "AutoGluon",
    time: "训练+集成：30-120分钟（视预算）",
    metric: "MAPE≈3.5%（训练预算敏感）",
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
    metric: "MAPE≈3.2% + 分组误差/阈值收益一屏看完",
    explain: "全局/分群/单案/反事实固定结构",
    repro: "Run 固化数据版本/种子/配置快照",
    delivery: "报告+API+订阅告警一键交付",
    badge: "工作流/可交付",
    highlight: true,
  },
];

const MOCK_MODEL_COMPARISON = Array.from({ length: 30 }, (_, i) => {
  // Generate dates from September 1st to September 30th
  const date = new Date(2023, 8, i + 1); 
  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
  
  // Weekly seasonality: lower prices on weekends (Sat=6, Sun=0)
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const weekendDip = isWeekend ? -80 : 0;
  
  // Monthly trend: slowly rising
  const trend = Math.sin(i / 5) * 30;
  
  // Base Price ~380 元/MWh
  // Random fluctuation for "real-world" feel
  const basePrice = 380 + trend + weekendDip + (Math.random() - 0.5) * 60;
  
  // Ensure price is positive
  const truth = Math.max(100, Math.round(basePrice));
  
  return {
    date: dateStr,
    truth: truth,
    limix: Math.round(truth + (Math.random() - 0.5) * 20), // LimiX: High accuracy
    autogluon: Math.round(truth * 1.05 + (isWeekend ? 50 : -20) + (Math.random() - 0.5) * 60), // AutoGluon: Bias on weekends
    llm: Math.round(truth * 0.8 + 100 + (Math.random() - 0.5) * 80), // LLM: High variance
  };
});

const MOCK_CLF_COMPARISON_POINTS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 10, 16 + i);
  // Normalize date to timestamp
  const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  
  // Truth pattern
  const pattern = [null,0,1,1,1,0,0,0,1,1,1,0,1,1,0,0,0,0,1,1,0,1,0,0,0,1,1,0,1,1];
  const truth = pattern[i % pattern.length];
  
  // LimiX: Matches truth almost perfectly
  // Introduce 1 error
  const limix = (i === 15) ? (truth === 1 ? 0 : 1) : truth;
  
  // AutoGluon: Some errors
  // Error at index 5, 12, 20
  let ag = truth;
  if ([5, 12, 20, 25].includes(i)) ag = truth === 1 ? 0 : 1;
  
  // LLM: More errors
  // Error at 3, 7, 10, 15, 18, 22, 28
  let llm = truth;
  if ([3, 7, 10, 15, 18, 22, 28].includes(i)) llm = truth === 1 ? 0 : 1;

  // Handle nulls (if truth is null, all should be null for that day to keep consistent empty column)
  if (truth === null) {
      return {
          timestamp,
          truth: null,
          limix: null,
          autogluon: null,
          llm: null
      };
  }

  // We need flat structure for ScatterPlot with categories
  // But we can just use 3 series
  return {
    timestamp,
    truth,
    limix,
    autogluon: ag,
    llm
  };
});

const MOCK_ROC_DATA = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.02, tpr: 0.03 },
  { fpr: 0.05, tpr: 0.08 },
  { fpr: 0.1, tpr: 0.12 },
  { fpr: 0.15, tpr: 0.18 },
  { fpr: 0.2, tpr: 0.25 },
  { fpr: 0.25, tpr: 0.30 },
  { fpr: 0.3, tpr: 0.35 },
  { fpr: 0.35, tpr: 0.38 },
  { fpr: 0.4, tpr: 0.48 },
  { fpr: 0.42, tpr: 0.55 },
  { fpr: 0.45, tpr: 0.60 },
  { fpr: 0.48, tpr: 0.63 },
  { fpr: 0.5, tpr: 0.65 },
  { fpr: 0.55, tpr: 0.72 },
  { fpr: 0.6, tpr: 0.78 },
  { fpr: 0.65, tpr: 0.79 },
  { fpr: 0.7, tpr: 0.82 },
  { fpr: 0.75, tpr: 0.88 },
  { fpr: 0.8, tpr: 0.92 },
  { fpr: 0.85, tpr: 0.94 },
  { fpr: 0.9, tpr: 0.96 },
  { fpr: 0.95, tpr: 0.98 },
  { fpr: 1, tpr: 1 },
].map(p => ({ ...p, random: p.fpr }));

const MOCK_PR_DATA = [
  { recall: 0, precision: 1.0 },
  { recall: 0.005, precision: 0.60 },
  { recall: 0.01, precision: 0.75 },
  { recall: 0.02, precision: 0.65 },
  { recall: 0.03, precision: 0.78 },
  { recall: 0.04, precision: 0.55 },
  { recall: 0.05, precision: 0.58 },
  { recall: 0.06, precision: 0.55 },
  { recall: 0.08, precision: 0.56 },
  { recall: 0.10, precision: 0.59 },
  { recall: 0.12, precision: 0.50 },
  { recall: 0.13, precision: 0.42 },
  { recall: 0.15, precision: 0.41 },
  { recall: 0.18, precision: 0.43 },
  { recall: 0.2, precision: 0.42 },
  { recall: 0.25, precision: 0.41 },
  { recall: 0.3, precision: 0.40 },
  { recall: 0.35, precision: 0.40 },
  { recall: 0.4, precision: 0.41 },
  { recall: 0.5, precision: 0.42 },
  { recall: 0.6, precision: 0.43 },
  { recall: 0.7, precision: 0.42 },
  { recall: 0.75, precision: 0.41 },
  { recall: 0.8, precision: 0.39 },
  { recall: 0.9, precision: 0.38 },
  { recall: 1.0, precision: 0.36 },
].map(p => ({ ...p, baseline: 0.356 }));

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
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

const MOCK_INFLUENCE_FACTORS = [
  "非市场化核电总加_日前",
  "竞价空间_日前",
  "风力发电_日前",
  "联络线计划_日前",
  "光伏发电_日前",
  "新能源总加_日前",
  "省调负荷_日前",
  "全网负荷_日前",
  "现货出清电价-日前_D-2",
  "现货出清电价-实时_D-2",
  "实时-日前偏差值_D-2",
  "实时-日前偏差值_D-2_label",
  "实时-日前偏差值_D-3_label",
  "现货出清电价-日前_D-3",
  "现货出清电价-实时_D-3"
];

const MOCK_INFLUENCE_SCORES = [
  { name: "现货出清电价-实时_D-3", value: 75.6 },
  { name: "现货出清电价-日前_D-3", value: 44.8 },
  { name: "实时-日前偏差值_D-3_label", value: 105.1 },
  { name: "实时-日前偏差值_D-2_label", value: 125.9 },
  { name: "实时-日前偏差值_D-2", value: 19.8 },
  { name: "现货出清电价-实时_D-2", value: 83.8 },
  { name: "现货出清电价-日前_D-2", value: 0.1 },
  { name: "全网负荷_日前", value: 27.9 },
  { name: "省调负荷_日前", value: -144.0 },
  { name: "新能源总加_日前", value: -74.5 },
  { name: "光伏发电_日前", value: 47.3 },
  { name: "联络线计划_日前", value: -81.8 },
  { name: "风力发电_日前", value: -61.1 },
  { name: "竞价空间_日前", value: -49.8 },
  { name: "非市场化核电总加_日前", value: 82.4 }
];

const MOCK_HEATMAP_DATES = Array.from({ length: 31 }, (_, i) => {
  const d = i + 1;
  return `2025-08-${d < 10 ? '0' + d : d}`;
});

// Simulate the vertical bands seen in the image
// 0: Red, 1: Blue/Mix, 2: Blue/Mix, 3: Blue/Mix, 4: Red/Mix, 5: Red, 6: Blue, 7: Blue, 8: Mix, 9: Mix, 10: Red, 11: Red, 12: Red, 13: Mix, 14: Mix, 15: Red
const MOCK_HEATMAP_MATRIX = MOCK_HEATMAP_DATES.map((date, rIndex) => {
  return MOCK_INFLUENCE_FACTORS.map((factor, cIndex) => {
    // Base pattern based on column index to create vertical bands
    let base = 0;
    const noise = (Math.random() - 0.5) * 1.0; // Random noise -0.5 to 0.5
    
    if (cIndex === 0) base = 1.5; // Strong Red
    else if (cIndex === 1) base = -0.5;
    else if (cIndex === 2) base = -0.8;
    else if (cIndex === 3) base = -0.3;
    else if (cIndex === 4) base = 0.5;
    else if (cIndex === 5) base = 1.2; // Strong Red
    else if (cIndex === 6) base = -1.5; // Strong Blue
    else if (cIndex === 7) base = -1.2; // Strong Blue
    else if (cIndex === 8) base = 0.2;
    else if (cIndex === 9) base = -0.2;
    else if (cIndex === 10) base = 1.6; // Strong Red
    else if (cIndex === 11) base = 1.4; // Strong Red
    else if (cIndex === 12) base = 1.3; // Strong Red
    else if (cIndex === 13) base = 0.4;
    else if (cIndex === 14) base = 0.3;
    else if (cIndex === 15) base = 1.5; // Strong Red
    else base = (Math.random() - 0.5) * 2;

    // Add some row-based variation (some days are hotter/colder)
    const timeTrend = Math.sin(rIndex / 5) * 0.5; 
    
    return Math.max(-2, Math.min(2, base + noise + timeTrend));
  });
});

function DivergingHeatGrid({ rows, cols, matrix }) {
  // Helper to get color from value -2 to 2
  const getColor = (v) => {
    // -2 (Blue #0d47a1) -> 0 (White #ffffff) -> 2 (Red #b71c1c)
    if (v < 0) {
      // Blue scale
      const ratio = Math.min(1, Math.abs(v) / 2);
      // Interpolate white to blue
      // White: 255, 255, 255
      // Blue: 13, 71, 161
      const r = Math.round(255 + (13 - 255) * ratio);
      const g = Math.round(255 + (71 - 255) * ratio);
      const b = Math.round(255 + (161 - 255) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Red scale
      const ratio = Math.min(1, v / 2);
      // Interpolate white to red
      // White: 255, 255, 255
      // Red: 183, 28, 28
      const r = Math.round(255 + (183 - 255) * ratio);
      const g = Math.round(255 + (28 - 255) * ratio);
      const b = Math.round(255 + (28 - 255) * ratio);
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <div className="w-full relative">
      <div className="flex items-start">
        {/* Main Heatmap Area */}
        <div className="flex-1">
          <div className="w-full pr-4">
            <div className="grid" style={{ gridTemplateColumns: `80px repeat(${cols.length}, 1fr)` }}>
              {/* Data Rows */}
              {rows.map((r, i) => (
                <React.Fragment key={r}>
                  {/* Y-axis Label */}
                  <div className="text-[10px] h-3 flex items-center justify-end pr-2 text-muted-foreground font-mono leading-none">
                    {r}
                  </div>
                  {/* Cells */}
                  {cols.map((c, j) => {
                    const v = matrix[i]?.[j] ?? 0;
                    return (
                      <div 
                        key={`${r}-${c}`} 
                        className="h-3 w-full"
                        style={{ backgroundColor: getColor(v) }}
                        title={`${r} / ${c}: ${v.toFixed(2)}`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Footer Row (X-axis Labels) */}
              <div className="text-[10px] text-muted-foreground font-bold flex items-start pt-2 justify-end pr-2"></div>
              {cols.map((c) => (
                <div key={c} className="h-24 flex items-start justify-center pt-2 overflow-visible relative">
                   <div className="absolute top-2 left-1/2 text-[9px] text-muted-foreground whitespace-nowrap origin-top-left rotate-45 w-4">
                     {c}
                   </div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm font-bold pl-[80px]">影响因子</div>
          </div>
        </div>

        {/* Color Scale Legend */}
        <div className="w-16 flex flex-col items-center ml-0 sticky right-0 top-0 pt-0">
           <div className="text-[10px] font-bold mb-1">2.0</div>
           <div className="w-4 h-64 rounded-full" style={{
             background: 'linear-gradient(to bottom, #b71c1c, #ffffff, #0d47a1)'
           }}></div>
           <div className="text-[10px] font-bold mt-1">-2.0</div>
        </div>
      </div>
    </div>
  );
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
    <Card className="rounded-2xl border-slate-200/60 shadow-sm bg-white/50 hover:shadow-md hover:border-blue-200 hover:bg-white transition-all duration-300">
      <CardHeader className="p-3">
        <CardDescription className="text-xs">{label}</CardDescription>
        <CardTitle className="text-xl mt-0.5">
          {value}
          <span className="text-sm text-muted-foreground ml-1">{unit}</span>
        </CardTitle>
      </CardHeader>
      {hint && (
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-xs text-muted-foreground">{hint}</div>
        </CardContent>
      )}
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

function TopBar({ sceneId, setSceneId, quickMode, setQuickMode, datasetId, setDatasetId, datasets }) {
  const scene = SCENES.find((s) => s.id === sceneId);

  // 过滤当前场景下的数据集
  const filteredDatasets = useMemo(() => {
    return datasets.filter(d => d.sceneId === sceneId);
  }, [sceneId, datasets]);

  const dataset = datasets.find((d) => d.id === datasetId);

  // 切换场景时，自动选中第一个数据集
  useEffect(() => {
    if (filteredDatasets.length > 0) {
      const currentInFiltered = filteredDatasets.find(d => d.id === datasetId);
      if (!currentInFiltered) {
        setDatasetId(filteredDatasets[0].id);
      }
    } else {
      setDatasetId(null);
    }
  }, [sceneId, filteredDatasets, datasetId, setDatasetId]);

  return (
    <div className="z-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center">
            <img src="/logo.png?v=3" alt="LimiX Logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-10">LimiX通用数据分析平台</div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {/* 场景选择 */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-300 group">
            <div className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-lg mr-1 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              场景
            </div>
            <Select
              value={sceneId}
              onChange={setSceneId}
              bordered={false}
              triggerProps={{
                autoAlignPopupWidth: false,
                autoAlignPopupMinWidth: true,
                position: "bl",
              }}
              style={{ width: 220, color: '#334155', fontWeight: 500 }}
            >
              {SCENES.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
            <div className="ml-1">
               <Tag color="arcoblue" size="small" className="rounded-md">{scene?.tag}</Tag>
            </div>
          </div>

          {/* 数据版本选择 */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-300 group">
            <div className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded-lg mr-1 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              数据版本
            </div>
             <Select
              value={datasetId}
              onChange={setDatasetId}
              bordered={false}
              disabled={filteredDatasets.length === 0}
              triggerProps={{
                autoAlignPopupWidth: false,
                autoAlignPopupMinWidth: true,
                position: "bl",
              }}
              style={{ width: 280, color: '#334155', fontWeight: 500 }}
            >
              {filteredDatasets.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.name} · {d.version}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideNav({ active, setActive }) {
  return (
    <div className="w-full md:w-64 shrink-0 md:h-full">
      <div className="h-full overflow-y-auto pb-4">
        <Card className="rounded-2xl border-blue-100/50 shadow-xl shadow-blue-500/5 bg-white/80 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-blue-500/10">
          <CardHeader className="pb-3 border-b border-blue-50/50 bg-gradient-to-r from-blue-50/30 to-transparent">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">操作导航</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-1">
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
                    "group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left transition-all duration-300 border",
                    on
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/30 scale-[1.02] z-10"
                      : "bg-transparent text-slate-600 border-transparent hover:bg-blue-50/50 hover:text-blue-700 hover:pl-4"
                  )}
                >
                  {on && (
                    <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity" />
                  )}

                  <div
                    className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold border transition-all duration-300",
                      on
                        ? "border-white/20 bg-white/20 text-white shadow-inner backdrop-blur-sm"
                        : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-blue-200 group-hover:text-blue-600 group-hover:bg-white"
                    )}
                  >
                    {index + 1}
                  </div>
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-300", on ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
                  <span className="flex-1 font-medium tracking-wide">{n.name}</span>
                </button>
              );
            })}
            


          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, desc, right }) {
  return (
    <div className={`flex justify-between gap-3 ${desc ? "items-start" : "items-center"}`}>
      <div className={`flex gap-2 ${desc ? "items-start" : "items-center"}`}>
        {Icon ? (
          <div className={`${desc ? "mt-1" : ""} h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100`}>
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
                <CardDescription className="text-xs"></CardDescription>
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

function DatasetsPanel({ datasetId, setDatasetId, notify, openModal, datasets, setDatasets, sceneId }) {
  const dataset = datasets.find((d) => d.id === datasetId);
  const isClf = sceneId === "sd_high_price_clf";
  const activeSchema = isClf ? MOCK_SCHEMA_CLF : MOCK_SCHEMA;

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Database}
        title="数据资产"
        right={
          <div className="flex items-center gap-2">
            <Button
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "数据上传",
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">数据集名称 <span className="text-red-500">*</span></label>
                      <Input placeholder="请输入数据集名称" className="rounded-xl" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">文件上传</label>
                      <div className="border-2 border-dashed border-slate-200 rounded-xl h-40 flex flex-col items-center justify-center gap-3 text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 text-slate-400" />
                        <div className="text-sm">拖拽文件到此处，或点击选择文件</div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                      <Button variant="outline" className="rounded-xl" onClick={() => notify("已取消", "未做更改")}>取消</Button>
                      <Button className="rounded-xl" onClick={() => {
                        const newId = `custom_${Date.now()}_v1`;
                        const newDataset = {
                            id: newId,
                            sceneId: sceneId,
                            name: `custom_upload_${newId.slice(-4)}.csv`,
                            version: "v1（初始）",
                            rows: Math.floor(Math.random() * 5000) + 10000,
                            cols: 17,
                            timeRange: "2025-08-01 ~ 2026-01-01",
                            owner: "当前用户",
                            qualityScore: Math.floor(Math.random() * 40) + 40,
                        };
                        setDatasets(prev => [...prev, newDataset]);
                        setDatasetId(newId);
                        notify("上传完成", `已上传 ${newDataset.name} 并自动选中`);
                      }}>
                        <Upload className="h-4 w-4 mr-2" />
                        开始上传
                      </Button>
                    </div>
                  </div>
                )
              }
            >
              上传数据集
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() =>
                openModal(
                  "连接数据库",
                  <div className="space-y-3">
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
          <CardTitle className="text-base">当前数据集信息</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center h-7 text-xs text-muted-foreground">数据集</div>
              <div className="mt-2 font-semibold">{dataset?.name} · {dataset?.version}</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardContent className="p-4">
              <div className="flex items-center h-7 text-xs text-muted-foreground">规模</div>
              <div className="mt-2 font-semibold">{formatNum(dataset?.rows)} 行 · {dataset?.cols} 列</div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">字段字典（节选）</CardTitle>
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
                {activeSchema.map((s) => (
                  <tr key={s.k} className="border-t">
                    <td className="py-2 font-mono">{s.k}</td>
                    <td className="py-2 text-muted-foreground">
                      {s.t}
                    </td>
                    <td className="py-2 text-muted-foreground">{s.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

function HealthPanel({ datasetId, notify, openModal, setActive }) {
  const isV2 = datasetId === "test_+5_v2" || (datasetId && datasetId.endsWith("v2"));
  const isClf = datasetId && datasetId.startsWith("test_clf");
  const base = isV2 ? HEALTH_V2 : (isClf ? HEALTH_CLF : HEALTH_V1);
  const [health, setHealth] = useState(base);
  const [running, setRunning] = useState(false);
  const [lastRunAt, setLastRunAt] = useState(null);
  const [resolved, setResolved] = useState(() => new Set());

  const activeSchema = isClf ? MOCK_SCHEMA_CLF : MOCK_SCHEMA;
  const activeRows = isClf ? MOCK_PREVIEW_ROWS_CLF_V1 : (isV2 ? MOCK_PREVIEW_ROWS_V2.slice(0, 10) : MOCK_PREVIEW_ROWS.slice(0, 10));

  useEffect(() => {
    const isV2 = datasetId === "test_+5_v2" || (datasetId && datasetId.endsWith("v2"));
    const isClf = datasetId && datasetId.startsWith("test_clf");
    setHealth(isV2 ? HEALTH_V2 : (isClf ? HEALTH_CLF : HEALTH_V1));
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
        title="数据评估"
        right={
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl" onClick={doCheck} disabled={running}>
              {running ? "体检中…" : "一键体检"}
            </Button>
            <Button
              variant="outline"
              className="rounded-2xl"
              onClick={() => {
                 notify("已生成建议", "已为 Top 缺失字段生成“填补/补采集”建议（Mock）");
                 setActive("clean");
               }}
             >
               准备清洗
             </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={isV2 ? "secondary" : "outline"}>
          当前数据：{isV2 ? "v2（清洗后）" : "v1（含脏数据）"}
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
          <CardTitle className="text-base">数据表预览（前 10 行）</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left min-w-[60px] align-bottom bg-muted/30 first:rounded-tl-xl first:rounded-bl-xl">
                    <div className="flex flex-col gap-2 pb-1">
                      <div className="h-5"></div>
                      <div className="font-semibold text-slate-700 whitespace-nowrap">序号</div>
                    </div>
                  </th>
                  {activeSchema.slice(0, 10).map((col) => {
                    const stats = MOCK_PREVIEW_STATS[col.k] || { unique: "-", missing: "0%" };
                    const missingRate = parseFloat(stats.missing);
                    const hasMissing = missingRate > 0;
                    return (
                      <th key={col.k} className="p-2 text-left min-w-[140px] align-bottom bg-muted/30 last:rounded-tr-xl last:rounded-br-xl">
                        <div className="flex flex-col gap-2 pb-1">
                          <div className="flex gap-1 flex-wrap">
                            {hasMissing && (
                              <Badge 
                                variant="destructive" 
                                className="rounded-md px-1 py-0 text-[10px] h-5"
                              >
                                缺失: {stats.missing}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="rounded-md px-1 py-0 text-[10px] h-5 bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 border">
                              唯一值: {stats.unique}
                            </Badge>
                          </div>
                          <div className="font-semibold text-slate-700 whitespace-nowrap">{col.k}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {activeRows.map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
                    {activeSchema.slice(0, 10).map((col) => {
                      const val = row[col.k];
                      const isNaN = val === "NaN" || val === null || val === undefined || val === "";
                      return (
                        <td key={col.k} className="p-3">
                          {isNaN ? (
                            <span className="text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded text-xs">NaN</span>
                          ) : (
                            <span className="text-slate-600 font-mono text-xs">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          

        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">口径一致性</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-3">
            {health.inconsistencies.map((it) => {
              const done = resolved.has(it.id);
              return (
                <div key={it.id} className="p-3 rounded-2xl border">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{it.field}</div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">示例：{it.examples.join(" / ")}</div>
                  <div className="mt-2 text-sm">影响：{it.impact}</div>
                </div>
              );
            })}
          </CardContent>
        </Card>


      </div>


    </div>
  );
}

function CleanPanel({ datasetId, setDatasetId, notify, openModal, datasets, setDatasets }) {
  const [generated, setGenerated] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasCleaned, setHasCleaned] = useState(false);
  const cleaningRef = useRef(false);

  const [ruleState, setRuleState] = useState(() => {
    const o = {};
    MOCK_CLEAN_RULES.forEach((r) => {
      o[r.id] = { list: "none", lastDryRun: null };
    });
    return o;
  });

  useEffect(() => {
    // setGenerated(false); // Removed as per user request to skip strategy generation step
    setApplying(false);
    
    // Only reset hasCleaned if the datasetId change was NOT caused by our cleaning process
    if (cleaningRef.current) {
      cleaningRef.current = false;
    } else {
      setHasCleaned(false);
    }

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
      "预览变更",
      <div className="space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">预计影响行数</div>
            <div className="mt-1 font-semibold">{formatNum(36842)} 行</div>
          </div>
          <div className="p-3 rounded-2xl border">
            <div className="text-xs text-muted-foreground">缺失率变化</div>
            <div className="mt-1 font-semibold">7.8% → 0.3%</div>
          </div>
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
      
      const current = datasets.find(d => d.id === datasetId);
      let newId = "test_+5_v2";
      if (current) {
         if (current.id === "test_+5_v1") {
             // Keep default behavior for default dataset
             newId = "test_+5_v2";
             setDatasetId(newId);
         } else {
             // Generate V2 for custom datasets
             // Prevent double v2 suffix if already v2
             const baseId = current.id.endsWith('_v2') ? current.id.slice(0, -3) : current.id.replace(/_v1$/, '');
             newId = baseId + '_v2';
             
             const existing = datasets.find(d => d.id === newId);
             if (!existing) {
                const newDataset = {
                    ...current,
                    id: newId,
                    name: current.name.replace(/V1.*$/, 'V2-清洗后.csv'), 
                    version: "v2（清洗后）",
                    qualityScore: 88 + Math.floor(Math.random() * 10),
                };
                // Fallback name if regex didn't match
                if (newDataset.name === current.name) {
                    newDataset.name = current.name + "_cleaned";
                }
                setDatasets(prev => [...prev, newDataset]);
             }
             setDatasetId(newId);
         }
      } else {
          setDatasetId("test_+5_v2");
      }
      
      notify("清洗完成", "已生成 v2（清洗后）。下一步：去任务页跑多任务 Run。")
      cleaningRef.current = true;
      setHasCleaned(true);
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

  const isV2 = datasetId === "test_+5_v2" || (datasetId && datasetId.endsWith("v2"));
  const canApply = generated && !isV2;

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Wand2}
        title="数据清洗"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button className="rounded-2xl" onClick={applyToV2} disabled={!generated || applying || hasCleaned}>
              {applying ? "清洗中…" : hasCleaned ? "已清洗" : "一键清洗"}
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={isV2 ? "secondary" : "outline"}>
          当前数据：{isV2 ? "v2（清洗后）" : "v1（含脏数据）"}
        </Badge>
        {/* <Badge className="rounded-xl" variant={generated ? "secondary" : "outline"}>
          策略状态：{generated ? "已生成" : "未生成"}
        </Badge> */}
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">规则清单</CardTitle>
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
                        影响 {formatNum(st.lastDryRun.affected)} 行
                      </Badge>
                    </div>
                    {st.lastDryRun.warn && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        建议：抽检样本 & 确认业务口径（Mock）
                      </div>
                    )}
                  </div>
                ) : null}




              </div>
            );
          })}
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


    </div>
  );
}

function TasksPanel({ quickMode, runs, setRuns, notify, sceneId, datasetId, setDatasetId, datasets }) {
  const [name, setName] = useState("电价预测");
  const [type, setType] = useState("时序预测");
  const [target, setTarget] = useState("label");
  const [running, setRunning] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedModels, setSelectedModels] = useState(["limix", "autogluon", "deepseek"]);
  const [timeColumn, setTimeColumn] = useState("");

  const models = [
    {
      id: "limix",
      name: "Limix",
      badges: [
        { text: "数据大模型", variant: "secondary" }
      ],
      desc: "limix自研结构化数据大模型，支持多种任务",
      meta: "大小: 78.9MB   支持任务: classification, regression, forecasting",
      tags: []
    },
    {
      id: "autogluon",
      name: "AutoGluon",
      badges: [
        { text: "机器学习", variant: "secondary" }
      ],
      desc: "强大的自动化机器学习框架，自动训练和组合多个模型",
      meta: "大小: 150MB   支持任务: classification, regression, forecasting",
      tags: []
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      badges: [
        { text: "大语言模型", variant: "secondary" }
      ],
      desc: "深度求索新一代大模型，具备强大的逻辑推理与代码能力",
      meta: "大小: 671B   支持任务: reasoning, extraction",
      tags: []
    }
  ];

  const currentDataset = datasets?.find(d => d.id === datasetId);

  const columns = useMemo(() => {
    return sceneId === "sd_high_price_clf" 
      ? MOCK_SCHEMA_CLF.map(c => c.k) 
      : MOCK_SCHEMA.map(c => c.k);
  }, [sceneId]);

  useEffect(() => {
    setSelectedFeatures(columns);
    if (columns.length > 0) {
      setTimeColumn(columns[0]);
    }
  }, [columns]);

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
            : (type === "回归" || type === "时序预测")
            ? { RMSE: quickMode ? 19.2 : 18.0, MAPE: quickMode ? 0.14 : 0.12 }
            : type === "填补"
            ? { MAE: quickMode ? 4.2 : 3.7, R2: quickMode ? 0.83 : 0.87 }
            : { PR_AUC: quickMode ? 0.41 : 0.46, TopK: "Top 1%" },
        version: `data:v2 · seed:42 · mode:${quickMode ? "快" : "准"}`,
        createTime: nowTimeStr(),
        finishTime: nowTimeStr(),
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
        title="推理任务"
      />

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base">新建任务</CardTitle>
          <Button className="rounded-2xl" onClick={runOne} disabled={running}>
            {running ? "运行中…" : "运行"}
          </Button>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground">任务名称</div>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl mt-2 h-8" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">任务类型</div>
            <select
              className="w-full rounded-2xl border border-input bg-background px-3 h-8 mt-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setTarget("label");
              }}
            >
              <option>时序预测</option>
              <option>分类</option>
              <option>回归</option>
            </select>
          </div>
          <div>
             <div className="text-xs text-muted-foreground">当前数据版本</div>
             <div className="w-full rounded-2xl border border-input bg-slate-50 px-3 h-8 mt-2 text-sm font-mono text-muted-foreground flex items-center">
               {currentDataset ? currentDataset.version : ""}
             </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">目标字段（Y 或待填补字段）</div>
            <select
              className="w-full rounded-2xl border border-input bg-background px-3 h-8 mt-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            >
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
          {type === "时序预测" && (
            <div>
              <div className="text-xs text-muted-foreground">时间列</div>
              <select
                className="w-full rounded-2xl border border-input bg-background px-3 h-8 mt-2 text-sm font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={timeColumn}
                onChange={(e) => setTimeColumn(e.target.value)}
              >
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="md:col-span-3 mt-2">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-muted-foreground">特征字段（可选）</div>
                <div className="flex items-center gap-2">
                    <Checkbox 
                        checked={selectedFeatures.length === columns.length} 
                        indeterminate={selectedFeatures.length > 0 && selectedFeatures.length < columns.length}
                        onChange={(checked) => setSelectedFeatures(checked ? columns : [])}
                    >
                        <span className="text-xs text-muted-foreground">全选 / 清空</span>
                    </Checkbox>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-xl p-3 bg-slate-50/50 max-h-[150px] overflow-y-auto">
                {columns.map(col => (
                    <div key={col} className="flex items-center gap-2">
                        <Checkbox 
                            checked={selectedFeatures.includes(col)} 
                            onChange={(checked) => {
                                if (checked) {
                                    setSelectedFeatures(prev => [...prev, col]);
                                } else {
                                    setSelectedFeatures(prev => prev.filter(c => c !== col));
                                }
                            }}
                        >
                            <span className="text-sm font-mono truncate" title={col}>{col}</span>
                        </Checkbox>
                    </div>
                ))}
            </div>
          </div>
          <div className="md:col-span-3 mt-6">
             <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4" />
                <span className="font-semibold text-base">模型选择</span>
             </div>
             <div className="text-xs text-muted-foreground mb-3">
                <span className="text-red-500 mr-1">*</span>
                选择多个模型进行并行运行和对比
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {models.map((model) => (
                  <div key={model.id} className="border rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{model.name}</span>
                        {model.badges.map((badge, idx) => (
                          <Badge key={idx} variant={badge.variant} className="rounded-md">
                            {badge.text}
                          </Badge>
                        ))}
                      </div>
                      <Checkbox 
                        checked={selectedModels.includes(model.id)}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedModels(prev => [...prev, model.id]);
                          } else {
                            setSelectedModels(prev => prev.filter(id => id !== model.id));
                          }
                        }}
                      />
                    </div>
                    <div className="text-sm text-slate-600 mb-2">
                      {model.desc}
                    </div>
                    <div className="flex gap-2">
                      {model.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">任务列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="py-2">任务名称</th>
                  <th className="py-2">任务ID</th>
                  <th className="py-2">任务类型</th>
                  <th className="py-2">运行状态</th>
                  <th className="py-2">数据集</th>
                  <th className="py-2">创建时间</th>
                  <th className="py-2">完成时间</th>
                </tr>
              </thead>
              <tbody>
                {runs.filter(r => r.taskName !== "缺失值填补_RF").map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2 font-semibold">{r.taskName}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">{r.id}</td>
                    <td className="py-2">
                      <Badge className="rounded-xl" variant="outline">
                        {r.taskType}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <Badge 
                        className={`rounded-xl ${
                          r.status === "已完成" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" :
                          r.status === "运行中" ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" :
                          r.status === "排队中" ? "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100" :
                          r.status === "失败" ? "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" :
                          "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100"
                        }`} 
                        variant="outline"
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td className="py-2 font-mono">
                      {r.version.includes("v2") ? "v2 (清洗后)" : "v1 (含脏数据)"}
                    </td>
                    <td className="py-2 font-mono text-sm text-muted-foreground">{r.createTime}</td>
                    <td className="py-2 font-mono text-sm text-muted-foreground">{r.finishTime || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


    </div>
  );
}

function CustomizedDot(props) {
  const { cx, cy, payload, shape } = props;
  if (shape === "cross") {
    // Red X
    return (
      <svg x={cx - 5} y={cy - 5} width="10" height="10" viewBox="0 0 10 10">
        <line x1="2" y1="2" x2="8" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
        <line x1="8" y1="2" x2="2" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  } else if (shape === "circle") {
    // Green Filled Circle
    return (
      <circle cx={cx} cy={cy} r="5" fill="#589e5d" /> 
    );
  }
  return null;
}

function ScatterPlot({ data }) {
  // Transform hourly data to daily summary for the chart
  const chartData = useMemo(() => {
    if (!data) return [];
    
    // Group by date and determine if the day is "High Price" (1) or not (0)
    const dailyMap = new Map();
    
    data.forEach(row => {
        // Extract MM-DD from Time string "YYYY/M/D HH:mm:00"
        const datePart = row.Time.split(' ')[0]; // "2025/11/16"
        const d = new Date(datePart);
        
        // Use timestamp for sorting and plotting
        // Normalize to midnight to ensure all points for the same day align
        const timestamp = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        
        if (!dailyMap.has(timestamp)) {
            dailyMap.set(timestamp, null);
        }
        
        if (row.label === "1") {
            dailyMap.set(timestamp, 1);
        } else if (row.label === "0") {
            // Only set to 0 if it's currently null (don't downgrade 1 to 0)
            if (dailyMap.get(timestamp) !== 1) {
                dailyMap.set(timestamp, 0);
            }
        }
    });
    
    // Convert to array (no sort needed if we let Recharts handle the number axis, but sorting helps debugging)
    return Array.from(dailyMap.entries())
      .map(([timestamp, value]) => ({ timestamp, value }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  const formatDate = (timestamp) => {
      const d = new Date(timestamp);
      return `${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
  };

  const xDomain = useMemo(() => {
    if (!chartData || chartData.length === 0) return ['dataMin', 'dataMax'];
    const timestamps = chartData.map(d => d.timestamp);
    return [Math.min(...timestamps), Math.max(...timestamps)];
  }, [chartData]);

  const xTicks = useMemo(() => {
    if (!chartData || chartData.length === 0) return undefined;
    // Filter timestamps where the date is an even number (e.g., 2, 4, 16, 18...)
    return chartData
      .map(d => d.timestamp)
      .filter(ts => new Date(ts).getDate() % 2 === 0);
  }, [chartData]);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#e2e8f0" />
          {/* Custom Horizontal Grid Lines for Y=0 and Y=1 */}
          <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
          <ReferenceLine y={1} stroke="#cbd5e1" strokeDasharray="3 3" />
          
          <XAxis 
            dataKey="timestamp" 
            type="number" 
            domain={xDomain}
            ticks={xTicks}
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: "#334155" }}  
            tickLine={false} 
            axisLine={{ stroke: "#64748b" }} 
            interval={0} 
            angle={-45}
            textAnchor="end"
            height={60}
            label={{ value: "日期", position: "insideBottom", offset: -5, fontSize: 12, fill: "#334155" }}
          />
          <YAxis 
            dataKey="value" 
            type="number" 
            domain={[-0.5, 1.5]} 
            ticks={[0, 1]} 
            tickFormatter={(tick) => tick === 0 ? "不可搏高价 (0)" : "可搏高价 (1)"} 
            tick={{ fontSize: 11, fill: "#334155" }} 
            tickLine={false} 
            axisLine={{ stroke: "#64748b" }} 
            width={100} 
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }} 
            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
            labelFormatter={formatDate}
            formatter={(value) => [value === 0 ? "不可搏高价" : "可搏高价", "分类结果"]}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ right: 0, paddingLeft: "10px" }}
            content={(props) => {
                return (
                    <div className="flex flex-col gap-2 border p-2 rounded-lg bg-white/80 shadow-sm text-xs">
                        <div className="flex items-center gap-2">
                            <svg width="12" height="12" viewBox="0 0 10 10">
                                <line x1="2" y1="2" x2="8" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                                <line x1="8" y1="2" x2="2" y2="8" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-slate-700">不可搏高价 (0)</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-3 h-3 rounded-full bg-[#589e5d]"></div>
                             <span className="text-slate-700">可搏高价 (1)</span>
                        </div>
                    </div>
                )
            }}
          />
          <Scatter name="不可搏高价" data={chartData.filter(item => item.value === 0)} fill="#ef4444" shape={<CustomizedDot shape="cross" />} />
          <Scatter name="可搏高价" data={chartData.filter(item => item.value === 1)} fill="#589e5d" shape={<CustomizedDot shape="circle" />} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

function ResultsPanel({ notify, openModal, sceneId }) {
  // const [published, setPublished] = useState(false);
  const [selectedTh, setSelectedTh] = useState(0.4);

  const best = useMemo(() => {
    return MOCK_THRESHOLD.reduce((a, b) => (b.benefit > a.benefit ? b : a), MOCK_THRESHOLD[0]);
  }, []);

  useEffect(() => {
    setSelectedTh(best.th);
  }, [best.th]);

  /* const publish = () => {
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
  }; */

  const availableRuns = useMemo(() => {
    if (sceneId === "sd_high_price_clf") {
      return [{
        id: "run-CLF-001",
        taskName: "搏高价分类预测_XGB",
        taskType: "分类",
        target: "label",
        status: "已完成",
        version: "data:v2 · seed:42 · mode:精",
        createTime: "2025-12-25 10:30:00",
        finishTime: "2025-12-25 10:30:45",
      }];
    }
    return MOCK_RUNS_BASE;
  }, [sceneId]);

  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    if (availableRuns.length > 0) {
      setSelectedRunId(availableRuns[0].id);
    }
  }, [availableRuns]);

  const currentRun = useMemo(() => {
    return availableRuns.find(r => r.id === selectedRunId) || availableRuns[0];
  }, [availableRuns, selectedRunId]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={BarChart3}
        title="推理结果"
        
        /* right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Badge className="rounded-xl" variant={published ? "secondary" : "outline"}>
              策略：{published ? "已发布" : "未发布"}
            </Badge>
            <Button className="rounded-2xl" onClick={publish}>
              一键发布阈值策略
            </Button>
          </div>
        } */
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">任务名称</div>
              <select 
                className="w-full mt-0.5 rounded-xl border border-input bg-background px-2 py-1 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedRunId || ""}
                onChange={(e) => setSelectedRunId(e.target.value)}
              >
                {availableRuns.map(run => (
                  <option key={run.id} value={run.id}>{run.taskName}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">任务ID</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">任务类型</div>
              <div className="mt-0.5">
                <Badge variant="outline" className="rounded-xl">{currentRun.taskType}</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">运行状态</div>
              <div className="mt-0.5">
                <Badge variant="outline" className="rounded-xl bg-green-100 text-green-800 border-green-200">{currentRun.status}</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">数据版本</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.version.split(' · ')[0]}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">创建时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.createTime}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">完成时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.finishTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>



      <div className="grid md:grid-cols-4 gap-3">
        {sceneId === "sd_high_price_clf" ? (
          <>
            <MetricPill label="分类 AUC" value={0.5922} unit="" />
            <MetricPill label="acc" value={0.6451} unit="" />
            <MetricPill label="f1" value={0.0149} unit="" />
          </>
        ) : (
          <>
            <MetricPill label="MSE (均方误差)" value={6.59} unit="" />
            <MetricPill label="RMSE (均方根误差)" value={2.57} unit="" />
            <MetricPill label="MAE (平均绝对误差)" value={2.26} unit="" />
          </>
        )}
        <MetricPill label="推理耗时" value={11} unit="s" />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">
            {sceneId === "sd_high_price_clf" ? "未来 30 天高价概率预测" : "未来 30 天日前电价预测趋势"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {sceneId === "sd_high_price_clf" ? (
              <ScatterPlot data={MOCK_ROWS_CLF} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_PRICE_PREDICTION} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                    minTickGap={30}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                    unit="元" 
                    width={35} 
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pred"
                    name="预测电价"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="upper"
                    name="置信上限"
                    stroke="#93c5fd"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="lower"
                    name="置信下限"
                    stroke="#93c5fd"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

        </CardContent>
      </Card>

      {sceneId === "sd_high_price_clf" && <div className="grid md:grid-cols-2 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">ROC曲线与AUC值</CardTitle>
            <CardDescription className="text-xs">回答问题：模型区分正负样本的能力如何？AUC=0.593</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_ROC_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    type="number"
                    dataKey="fpr" 
                    domain={[0, 1]}
                    label={{ value: '假正例率 (FPR)', position: 'insideBottom', offset: -10, fontSize: 12, fill: "#64748b" }} 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={[0, 1]}
                    label={{ value: '真正例率 (TPR)', angle: -90, position: 'insideLeft', fontSize: 12, fill: "#64748b" }} 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="plainline" />
                  <Line type="linear" dataKey="tpr" name="ROC曲线 (AUC = 0.593)" stroke="#f97316" strokeWidth={2} dot={false} />
                  <Line type="linear" dataKey="random" name="随机猜测" stroke="#1e40af" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Precision-Recall 曲线</CardTitle>
            <CardDescription className="text-xs">回答问题：在不同召回率下的精确率表现。</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_PR_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    type="number"
                    dataKey="recall" 
                    domain={[0, 1]}
                    label={{ value: '召回率 (Recall)', position: 'insideBottom', offset: -10, fontSize: 12, fill: "#64748b" }} 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    domain={[0, 1]}
                    label={{ value: '精确率 (Precision)', angle: -90, position: 'insideLeft', fontSize: 12, fill: "#64748b" }} 
                    tick={{ fontSize: 11, fill: "#64748b" }} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="plainline" />
                  <Line type="linear" dataKey="precision" name="PR曲线" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="linear" dataKey="baseline" name="随机猜测 (比例=0.356)" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>}


    </div>
  );
}

function ExplainPanel({ notify, openModal, sceneId }) {
  const availableRuns = useMemo(() => {
    if (sceneId === "sd_high_price_clf") {
      return [{
        id: "run-CLF-001",
        taskName: "搏高价分类预测_XGB",
        taskType: "分类",
        target: "label",
        status: "已完成",
        version: "data:v2 · seed:42 · mode:精",
        createTime: "2025-12-25 10:30:00",
        finishTime: "2025-12-25 10:30:45",
      }];
    }
    return MOCK_RUNS_BASE;
  }, [sceneId]);

  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    if (availableRuns.length > 0) {
      setSelectedRunId(availableRuns[0].id);
    }
  }, [availableRuns]);

  const currentRun = useMemo(() => {
    return availableRuns.find(r => r.id === selectedRunId) || availableRuns[0];
  }, [availableRuns, selectedRunId]);

  // Feature Selection State
  const [selectedFactors, setSelectedFactors] = useState(MOCK_INFLUENCE_FACTORS);
  const [activeFactors, setActiveFactors] = useState(MOCK_INFLUENCE_FACTORS);
  
  // Row Selection State
  const [startRow, setStartRow] = useState(2);
  const [endRow, setEndRow] = useState(31);
  const [activeRowRange, setActiveRowRange] = useState([2, 31]);

  const handleGenerate = () => {
    if (selectedFactors.length === 0) {
      notify("请至少选择一个特征", "特征列表不能为空");
      return;
    }
    const start = parseInt(startRow);
    const end = parseInt(endRow);
    if (isNaN(start) || isNaN(end)) {
        notify("输入错误", "行号必须为数字");
        return;
    }
    if (start < 2) {
        notify("范围错误", "起始行必须 >= 2");
        return;
    }
    if (end > 31) {
        notify("范围错误", "结束行必须 <= 31");
        return;
    }
    if (start > end) {
        notify("范围错误", "起始行不能大于结束行");
        return;
    }

    setActiveFactors(selectedFactors);
    setActiveRowRange([start, end]);
    notify("分析已更新", `已根据选择的 ${selectedFactors.length} 个特征和行范围 ${start}-${end} 重新生成图表`);
  };

  const activeDates = useMemo(() => {
    return MOCK_HEATMAP_DATES.slice(activeRowRange[0] - 1, activeRowRange[1]);
  }, [activeRowRange]);

  const activeMatrix = useMemo(() => {
    const indices = activeFactors.map(f => MOCK_INFLUENCE_FACTORS.indexOf(f));
    const rowsFiltered = MOCK_HEATMAP_MATRIX.slice(activeRowRange[0] - 1, activeRowRange[1]);
    return rowsFiltered.map(row => indices.map(i => row[i]));
  }, [activeFactors, activeRowRange]);

  const activeScores = useMemo(() => {
    // Sort by absolute value to keep the chart meaningful
    return MOCK_INFLUENCE_SCORES
      .filter(s => activeFactors.includes(s.name))
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [activeFactors]);

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={ScanSearch}
        title="因果解释"
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">任务名称</div>
              <select 
                className="w-full mt-0.5 rounded-xl border border-input bg-background px-2 py-1 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedRunId || ""}
                onChange={(e) => setSelectedRunId(e.target.value)}
              >
                {availableRuns.map(run => (
                  <option key={run.id} value={run.id}>{run.taskName}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">任务ID</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">任务类型</div>
              <div className="mt-0.5">
                <Badge variant="outline" className="rounded-xl">{currentRun.taskType}</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">运行状态</div>
              <div className="mt-0.5">
                <Badge variant="outline" className="rounded-xl bg-green-100 text-green-800 border-green-200">{currentRun.status}</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">数据版本</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.version.split(' · ')[0]}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">创建时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.createTime}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">完成时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.finishTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Selection Panel */}
      <Card className="rounded-2xl border-blue-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            特征归因分析配置
          </CardTitle>
          <CardDescription className="text-xs">
            自定义选择特征字段，生成定制化的影响因子热力图与分数对比。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center gap-4 text-sm">
             <div className="shrink-0 font-medium text-slate-700">预测目标列：</div>
             <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-mono text-xs border border-slate-200">
               {currentRun.target === "label" ? "label (不可搏 0 / 可搏 1)" : currentRun.target}
             </div>
           </div>

           <div className="flex items-center gap-4 text-sm">
             <div className="shrink-0 font-medium text-slate-700">样本行范围：</div>
             <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">第</span>
                    <Input 
                        type="number" 
                        min={2} 
                        max={31} 
                        value={startRow} 
                        onChange={(e) => setStartRow(e.target.value)}
                        className="w-16 h-8 text-xs text-center"
                    />
                    <span className="text-xs text-muted-foreground">行</span>
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">第</span>
                    <Input 
                        type="number" 
                        min={2} 
                        max={31} 
                        value={endRow} 
                        onChange={(e) => setEndRow(e.target.value)}
                        className="w-16 h-8 text-xs text-center"
                    />
                    <span className="text-xs text-muted-foreground">行</span>
                </div>
                <div className="text-xs text-muted-foreground ml-2">(范围: 2 - 31)</div>
             </div>
           </div>
           
           <div className="space-y-2">
             <div className="flex items-center justify-between">
                <div className="font-medium text-sm text-slate-700">特征选择 ({selectedFactors.length}/{MOCK_INFLUENCE_FACTORS.length})：</div>
                <div className="space-x-2">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-slate-500"
                        onClick={() => setSelectedFactors(MOCK_INFLUENCE_FACTORS)}
                    >
                        全选
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs text-slate-500"
                        onClick={() => setSelectedFactors([])}
                    >
                        清空
                    </Button>
                </div>
             </div>
             <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50">
               <Checkbox.Group 
                 value={selectedFactors} 
                 onChange={setSelectedFactors} 
                 className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
               >
                 {MOCK_INFLUENCE_FACTORS.map(f => (
                    <Checkbox key={f} value={f} className="text-xs">
                        <span className="text-xs text-slate-600 truncate block max-w-[140px]" title={f}>{f}</span>
                    </Checkbox>
                 ))}
               </Checkbox.Group>
             </div>
           </div>
           
           <div className="flex justify-end pt-2">
             <Button onClick={handleGenerate} className="rounded-xl shadow-lg shadow-blue-500/20 px-6">
               <Sparkles className="w-4 h-4 mr-2" />
               生成分析图表
             </Button>
           </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">Top 影响因子（全局）</CardTitle>
              {/* <CardDescription className="text-xs">回答问题：总体上为什么超时？下一步：生成治理建议。</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Chart 1: Heatmap */}
              <div>
                <div className="mb-4 font-semibold text-base text-center">电力市场影响因子热力图</div>
                {activeFactors.length > 0 ? (
                    <div className="border rounded-xl p-4 bg-slate-50 overflow-hidden">
                        <DivergingHeatGrid rows={activeDates} cols={activeFactors} matrix={activeMatrix} />
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
                        请选择特征以生成热力图
                    </div>
                )}
              </div>

              {/* Chart 2: Horizontal Bar Chart */}
              <div>
                <div className="mb-4 font-semibold text-base text-center">各影响因子影响分数对比</div>
                {activeFactors.length > 0 ? (
                    <div className="h-[600px] border rounded-xl py-4 pr-4 pl-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                        layout="vertical"
                        data={activeScores}
                        margin={{ top: 5, right: 50, left: 0, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                        <XAxis type="number" domain={[-200, 200]} />
                        <YAxis dataKey="name" type="category" width={230} tick={{fontSize: 11}} interval={0} tickMargin={10} />
                        <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        />
                        <Bar dataKey="value" name="影响分数">
                            {activeScores.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} />
                            ))}
                            <LabelList dataKey="value" position="right" fontSize={10} formatter={(v) => v.toFixed(1)} />
                        </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
                        请选择特征以生成对比图
                    </div>
                )}
              </div>


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


    </div>
  );
}

function ComparePanel({ notify, openModal, sceneId }) {
  const isClf = sceneId === "sd_high_price_clf";
  
  const availableRuns = useMemo(() => {
    if (sceneId === "sd_high_price_clf") {
      return [{
        id: "run-CLF-001",
        taskName: "搏高价分类预测_XGB",
        taskType: "分类",
        target: "label",
        status: "已完成",
        version: "data:v2 · seed:42 · mode:精",
        createTime: "2025-12-25 10:30:00",
        finishTime: "2025-12-25 10:30:45",
      }];
    }
    return MOCK_RUNS_BASE;
  }, [sceneId]);

  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    if (availableRuns.length > 0) {
      setSelectedRunId(availableRuns[0].id);
    }
  }, [availableRuns]);

  const currentRun = useMemo(() => {
    return availableRuns.find(r => r.id === selectedRunId) || availableRuns[0];
  }, [availableRuns, selectedRunId]);
  
  const exportCompare = () => {
    notify("对比报告已生成", "已生成同口径对比报告（Mock）")
    openModal(
      "对比报告预览（Mock）",
      <div className="space-y-3">
        <div className="text-sm">对比维度：工作量 / 稳定性 / 复现性 / 解释性 / 交付完整度</div>
        <div className="p-3 rounded-2xl bg-muted text-xs">提示：这里的数值为演示占位，真实版本应接入同一套评测流水线产出。</div>
        <div className="grid md:grid-cols-2 gap-3">
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
        title="对比分析"
      />

      <Card className="rounded-2xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">任务名称</div>
              <select 
                className="w-full mt-0.5 rounded-xl border border-input bg-background px-2 py-1 text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={selectedRunId || ""}
                onChange={(e) => setSelectedRunId(e.target.value)}
              >
                {availableRuns.map(run => (
                  <option key={run.id} value={run.id}>{run.taskName}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">任务ID</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">任务类型</div>
              <div className="mt-0.5">
                <Badge variant="outline" className="rounded-xl">{currentRun.taskType}</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">运行状态</div>
              <div className="mt-0.5">
                <Badge variant="outline" className="rounded-xl bg-green-100 text-green-800 border-green-200">{currentRun.status}</Badge>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">数据版本</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.version.split(' · ')[0]}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">创建时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.createTime}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">完成时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.finishTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">LimiX vs AutoGluon</CardTitle>
            <CardDescription className="text-xs">
              {isClf 
                ? "AutoGluon 在部分峰值预测上存在偏差，推理耗时较长。" 
                : "AutoGluon 在部分峰值预测上存在偏差，推理耗时较长。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">LimiX 推理耗时：11s</Badge>
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200">AutoGluon 推理耗时：28s</Badge>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {isClf ? (
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      type="number" 
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(ts) => {
                          const d = new Date(ts);
                          return `${d.getMonth()+1}-${d.getDate()}`;
                      }}
                      tick={{ fontSize: 10, fill: "#64748b" }} 
                      tickLine={false} 
                      axisLine={{ stroke: "#64748b" }} 
                      interval={0}
                      ticks={MOCK_CLF_COMPARISON_POINTS.filter((p, i) => i % 5 === 0).map(p => p.timestamp)}
                    />
                    <YAxis 
                      dataKey="y"
                      type="number" 
                      domain={[-0.5, 2.5]} 
                      ticks={[0, 1, 2]} 
                      tickFormatter={(val) => val === 2 ? "真实值" : val === 1 ? "LimiX" : "AutoGluon"}
                      tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }} 
                      tickLine={false} 
                      axisLine={{ stroke: "#64748b" }} 
                      width={70} 
                    />
                    <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        labelFormatter={(ts) => {
                            const d = new Date(ts);
                            return `${d.getMonth()+1}-${d.getDate()}`;
                        }}
                        formatter={(value, name) => [value === 1 ? "可搏 (1)" : "不可搏 (0)", name]}
                    />
                    <Legend 
                        verticalAlign="top" 
                        height={36} 
                        content={(props) => (
                            <div className="flex justify-center gap-4 text-xs mb-2">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#589e5d]"></div>可搏 (1)</div>
                                <div className="flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="#ef4444" strokeWidth="2" /><line x1="8" y1="2" x2="2" y2="8" stroke="#ef4444" strokeWidth="2" /></svg>不可搏 (0)</div>
                            </div>
                        )}
                    />
                    {/* Truth Row (Y=2) */}
                    <Scatter name="真实值" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.truth, y: 2 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                    
                    {/* LimiX Row (Y=1) */}
                    <Scatter name="LimiX" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.limix, y: 1 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                    
                    {/* AutoGluon Row (Y=0) */}
                    <Scatter name="AutoGluon" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.autogluon, y: 0 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                  </ScatterChart>
                ) : (
                  <LineChart data={MOCK_MODEL_COMPARISON} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: "#64748b" }} 
                      tickLine={false} 
                      axisLine={false} 
                      interval={4}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "#64748b" }} 
                      tickLine={false} 
                      axisLine={false} 
                      width={40}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                      formatter={(value) => [`${value} 元/MWh`, ""]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}/>
                    
                    <Line type="monotone" dataKey="truth" name="真实值" stroke="#334155" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="limix" name="LimiX" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="autogluon" name="AutoGluon" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            {isClf && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="border border-slate-200 p-2 font-medium text-slate-600">模型</th>
                      <th className="border border-slate-200 p-2 font-medium text-slate-600">auc</th>
                      <th className="border border-slate-200 p-2 font-medium text-slate-600">acc</th>
                      <th className="border border-slate-200 p-2 font-medium text-slate-600">f1</th>
                      <th className="border border-slate-200 p-2 font-medium text-slate-600">recall</th>
                      <th className="border border-slate-200 p-2 font-medium text-slate-600">precision</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700">AutoGluon</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.5379</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.5954</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.2641</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.2038</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.375</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-200 p-2 font-medium text-slate-700">LimiX</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.5922</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.6451</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.0149</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.0075</td>
                      <td className="border border-slate-200 p-2 text-slate-600">0.6666</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">LimiX vs DeepSeek</CardTitle>
            <CardDescription className="text-xs">
              {isClf 
                ? "DeepSeek 在回归任务上稳定性较弱，难以捕捉细节。" 
                : "DeepSeek 在回归任务上稳定性较弱，难以捕捉细节。"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">LimiX 推理耗时：11s</Badge>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">DeepSeek 推理耗时：39s</Badge>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {isClf ? (
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="timestamp" 
                      type="number" 
                      domain={['dataMin', 'dataMax']}
                      tickFormatter={(ts) => {
                          const d = new Date(ts);
                          return `${d.getMonth()+1}-${d.getDate()}`;
                      }}
                      tick={{ fontSize: 10, fill: "#64748b" }} 
                      tickLine={false} 
                      axisLine={{ stroke: "#64748b" }} 
                      interval={0}
                      ticks={MOCK_CLF_COMPARISON_POINTS.filter((p, i) => i % 3 === 0).map(p => p.timestamp)}
                    />
                    <YAxis 
                      dataKey="y"
                      type="number" 
                      domain={[-0.5, 2.5]} 
                      ticks={[0, 1, 2]} 
                      tickFormatter={(val) => val === 2 ? "真实值" : val === 1 ? "LimiX" : "DeepSeek"}
                      tick={{ fontSize: 11, fill: "#334155", fontWeight: 500 }} 
                      tickLine={false} 
                      axisLine={{ stroke: "#64748b" }} 
                      width={70} 
                    />
                    <Tooltip 
                        cursor={{ strokeDasharray: '3 3' }} 
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        labelFormatter={(ts) => {
                            const d = new Date(ts);
                            return `${d.getMonth()+1}-${d.getDate()}`;
                        }}
                        formatter={(value, name) => [value === 1 ? "可搏 (1)" : "不可搏 (0)", name]}
                    />
                    <Legend 
                        verticalAlign="top" 
                        height={36} 
                        content={(props) => (
                            <div className="flex justify-center gap-4 text-xs mb-2">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#589e5d]"></div>可搏 (1)</div>
                                <div className="flex items-center gap-1"><svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="2" x2="8" y2="8" stroke="#ef4444" strokeWidth="2" /><line x1="8" y1="2" x2="2" y2="8" stroke="#ef4444" strokeWidth="2" /></svg>不可搏 (0)</div>
                            </div>
                        )}
                    />
                    {/* Truth Row (Y=2) */}
                    <Scatter name="真实值" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.truth, y: 2 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                    
                    {/* LimiX Row (Y=1) */}
                    <Scatter name="LimiX" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.limix, y: 1 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                    
                    {/* LLM Row (Y=0) */}
                    <Scatter name="DeepSeek" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.llm, y: 0 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                  </ScatterChart>
                ) : (
                  <LineChart data={MOCK_MODEL_COMPARISON} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10, fill: "#64748b" }} 
                      tickLine={false} 
                      axisLine={false} 
                      interval={4}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: "#64748b" }} 
                      tickLine={false} 
                      axisLine={false} 
                      width={40}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                      formatter={(value) => [`${value} 元/MWh`, ""]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}/>
                    
                    <Line type="monotone" dataKey="truth" name="真实值" stroke="#334155" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    <Line type="monotone" dataKey="limix" name="LimiX" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    <Line type="monotone" dataKey="llm" name="DeepSeek" stroke="#a855f7" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>






    </div>
  );
}

export default function LimixDemoMockPreview() {
  const [active, setActive] = useState("datasets");
  const [sceneId, setSceneId] = useState("sd_price");
  const [quickMode, setQuickMode] = useState(true);
  const [datasetId, setDatasetId] = useState("test_+5_v1");
  const [datasets, setDatasets] = useState(MOCK_DATASETS); // Initialize with mock data
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
      tasks: 3,
      results: 4,
      explain: 5,
      deliver: 6,
      compare: 6,
    };
    return map[active] ?? 0;
  }, [active]);

  return (
    <div className="h-screen flex flex-col bg-slate-50/50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      {/* Tech Background Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px), radial-gradient(#3b82f6 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px'
      }}></div>
      
      <TopBar sceneId={sceneId} setSceneId={setSceneId} quickMode={quickMode} setQuickMode={setQuickMode} datasetId={datasetId} setDatasetId={setDatasetId} datasets={datasets} />

      <Modal open={modal.open} title={modal.title} onClose={closeModal}>
        {modal.content}
      </Modal>

      <ToastStack toasts={toasts} dismiss={dismissToast} />

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 h-full flex flex-col md:flex-row gap-4">
          <SideNav active={active} setActive={setActive} />

          <div className="flex-1 h-full overflow-y-auto pr-1">
            <div className="space-y-4 pb-8">
              {active === "datasets" && <DatasetsPanel datasetId={datasetId} setDatasetId={setDatasetId} notify={notify} openModal={openModal} datasets={datasets} setDatasets={setDatasets} sceneId={sceneId} />}
              {active === "health" && <HealthPanel key={datasetId} datasetId={datasetId} notify={notify} openModal={openModal} setActive={setActive} />}
              {active === "clean" && <CleanPanel datasetId={datasetId} setDatasetId={setDatasetId} notify={notify} openModal={openModal} datasets={datasets} setDatasets={setDatasets} />}
              {active === "tasks" && <TasksPanel quickMode={quickMode} runs={runs} setRuns={setRuns} notify={notify} sceneId={sceneId} datasetId={datasetId} setDatasetId={setDatasetId} datasets={datasets} />}
              {active === "results" && <ResultsPanel notify={notify} openModal={openModal} sceneId={sceneId} />}
              {active === "explain" && <ExplainPanel notify={notify} openModal={openModal} sceneId={sceneId} />}
              {/* {active === "deliver" && <DeliverPanel notify={notify} openModal={openModal} />} */}
              {active === "compare" && <ComparePanel notify={notify} openModal={openModal} sceneId={sceneId} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
