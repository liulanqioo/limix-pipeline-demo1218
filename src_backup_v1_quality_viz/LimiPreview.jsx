import React, { useMemo, useState, useEffect, useRef } from "react";
import { Select, Tag, Checkbox, Slider } from "@arco-design/web-react";
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
  Compass,
  Download,
  Settings,
  FastForward,
} from "lucide-react";
import { CausalPilotPanel } from "./components/panels";
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
  ReferenceArea,
  Label,
} from "recharts";
import { UMAP } from "umap-js";

const CustomScoreBarLabel = (props) => {
  const { x, y, width, height, value } = props;
  const offset = 8;
  return (
    <text
      x={value >= 0 ? x + width + offset : x - offset}
      y={y + height / 2}
      fill="#64748b"
      textAnchor={value >= 0 ? 'start' : 'end'}
      dominantBaseline="middle"
      fontSize={10}
      fontWeight={500}
    >
      {value.toFixed(2)}
    </text>
  );
};

import { REAL_MACHINE_DATA, REAL_PRICE_DATA, REAL_CLF_DATA } from './data/real_data';
import { NEW_MACHINE_DATA } from './data/new_machine_data';


import { MACHINE_HEATMAP_FACTORS, MACHINE_HEATMAP_DATA } from './data/machine_heatmap_data';
import { AIR_HEATMAP_FACTORS, AIR_HEATMAP_DATA } from './data/air_heatmap_data';

// 注意：本页面所有数据均为 Mock，仅用于演示“平台形态/页面结构/可视化证据链”。

const NAV = [
  { key: "datasets", name: "数据资产", icon: Database },
  { key: "health", name: "数据评估", icon: Stethoscope },
  { key: "clean", name: "数据治理", icon: Wand2 },
  { key: "tasks", name: "推理分析", icon: ListTodo },
  { key: "explain", name: "因果解释", icon: ScanSearch },
  { key: "pilot", name: "推演决策", icon: Compass },
  { key: "report", name: "导出报告", icon: FileText },
];

const SCENES = [
  {
    id: "machine_predictive_maintenance_clf",
    name: "机器预测性维护分类",
    tag: "ToB",
  },
  {
    id: "air_quality_prediction",
    name: "空气质量预测",
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



const MOCK_PREVIEW_ROWS_MACHINE = [
  { UDI: 2033, "Product ID": "L49212", Type: "L", "Air temperature [K]": 298.8, "Process temperature [K]": 308.5, "Rotational speed [rpm]": 1444, "Torque [Nm]": 42.2, "Tool wear [min]": 83, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 6018, "Product ID": "L53197", Type: "L", "Air temperature [K]": 300.8, "Process temperature [K]": null, "Rotational speed [rpm]": 1398, "Torque [Nm]": 38.2, "Tool wear [min]": 50, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 3343, "Product ID": "L50522", Type: "L", "Air temperature [K]": 301.5, "Process temperature [K]": 310.8, "Rotational speed [rpm]": 9999, "Torque [Nm]": 52.4, "Tool wear [min]": 165, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 461, "Product ID": "H29874", Type: "H", "Air temperature [K]": 297.3, "Process temperature [K]": 308.6, "Rotational speed [rpm]": 1431, "Torque [Nm]": null, "Tool wear [min]": 109, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 9376, "Product ID": "H38789", Type: "H", "Air temperature [K]": 297.7, "Process temperature [K]": 308.4, "Rotational speed [rpm]": 1288, "Torque [Nm]": 49.5, "Tool wear [min]": 91, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 9398, "Product ID": "M24257", Type: "M", "Air temperature [K]": 297.7, "Process temperature [K]": 308.2, "Rotational speed [rpm]": 1370, "Torque [Nm]": 53.4, "Tool wear [min]": 162, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 4774, "Product ID": "L51953", Type: "L", "Air temperature [K]": null, "Process temperature [K]": 312.0, "Rotational speed [rpm]": 1391, "Torque [Nm]": 50.3, "Tool wear [min]": 101, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 935, "Product ID": "M15794", Type: "M", "Air temperature [K]": 295.5, "Process temperature [K]": 306.0, "Rotational speed [rpm]": 1326, "Torque [Nm]": 50.8, "Tool wear [min]": 18, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 581, "Product ID": "M15440", Type: "M", "Air temperature [K]": 297.8, "Process temperature [K]": 309.8, "Rotational speed [rpm]": 1798, "Torque [Nm]": 25.5, "Tool wear [min]": 203, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 4241, "Product ID": "L51420", Type: "L", "Air temperature [K]": 302.4, "Process temperature [K]": 311.1, "Rotational speed [rpm]": 1905, "Torque [Nm]": 20.9, "Tool wear [min]": 77, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
];

const MOCK_PREVIEW_ROWS_MACHINE_TEST = [
  { UDI: 8466, "Product ID": "M23325", Type: "M", "Air temperature [K]": 298.7, "Process temperature [K]": 309.8, "Rotational speed [rpm]": 1475, "Torque [Nm]": 40.5, "Tool wear [min]": 59, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 4805, "Product ID": "L51984", Type: "L", "Air temperature [K]": 303.7, "Process temperature [K]": 312.6, "Rotational speed [rpm]": 1621, "Torque [Nm]": 38.8, "Tool wear [min]": 182, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 2859, "Product ID": "L50038", Type: "L", "Air temperature [K]": 300.5, "Process temperature [K]": 309.3, "Rotational speed [rpm]": 1417, "Torque [Nm]": 51.5, "Tool wear [min]": 231, "Machine failure": 1, TWF: 0, HDF: 0, PWF: 0, OSF: 1, RNF: 0 },
  { UDI: 4220, "Product ID": "L51399", Type: "L", "Air temperature [K]": 301.9, "Process temperature [K]": 310.7, "Rotational speed [rpm]": 1717, "Torque [Nm]": 26.8, "Tool wear [min]": 27, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 4482, "Product ID": "M19341", Type: "M", "Air temperature [K]": 302.6, "Process temperature [K]": 310.4, "Rotational speed [rpm]": 1544, "Torque [Nm]": 35.1, "Tool wear [min]": 25, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 1476, "Product ID": "M16335", Type: "M", "Air temperature [K]": 298.4, "Process temperature [K]": 309.5, "Rotational speed [rpm]": 1519, "Torque [Nm]": 35.4, "Tool wear [min]": 133, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 2810, "Product ID": "L49989", Type: "L", "Air temperature [K]": 299.9, "Process temperature [K]": 309.2, "Rotational speed [rpm]": 1598, "Torque [Nm]": 34.6, "Tool wear [min]": 111, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 5814, "Product ID": "L52993", Type: "L", "Air temperature [K]": 301.2, "Process temperature [K]": 311.0, "Rotational speed [rpm]": 1761, "Torque [Nm]": 29.1, "Tool wear [min]": 195, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 908, "Product ID": "M15767", Type: "M", "Air temperature [K]": 295.6, "Process temperature [K]": 306.1, "Rotational speed [rpm]": 1669, "Torque [Nm]": 29.0, "Tool wear [min]": 161, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 1771, "Product ID": "H31184", Type: "H", "Air temperature [K]": 298.4, "Process temperature [K]": 307.9, "Rotational speed [rpm]": 1605, "Torque [Nm]": 31.0, "Tool wear [min]": 18, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
];

const MOCK_PREVIEW_ROWS_AIR = [
  { "Time": "2024-03-10 18:00:00", "CO(GT)": 2.6, "PT08.S1(CO)": 1360.0, "NMHC(GT)": 150, "C6H6(GT)": 11.881723488680304, "PT08.S2(NMHC)": 1045.5, "NOx(GT)": 166, "PT08.S3(NOx)": 1056.25, "NO2(GT)": 113, "PT08.S4(NO2)": 1692.0, "PT08.S5(O3)": 1267.5, "T": 13.599999904633, "RH": 48.875000953674, "AH": 0.7577538251293606 },
  { "Time": "2024-03-10 19:00:00", "CO(GT)": 2.0, "PT08.S1(CO)": null, "NMHC(GT)": 112, "C6H6(GT)": 9.397164889581603, "PT08.S2(NMHC)": 954.75, "NOx(GT)": 103, "PT08.S3(NOx)": 1173.75, "NO2(GT)": 92, "PT08.S4(NO2)": 1558.75, "PT08.S5(O3)": 972.25, "T": 13.299999952316, "RH": 47.699999809265, "AH": 0.7254874492424674 },
  { "Time": "2024-03-10 20:00:00", "CO(GT)": 2.2, "PT08.S1(CO)": 1402.0, "NMHC(GT)": 9999, "C6H6(GT)": 8.997816871326798, "PT08.S2(NMHC)": 939.25, "NOx(GT)": 131, "PT08.S3(NOx)": 1140.0, "NO2(GT)": 114, "PT08.S4(NO2)": 1554.5, "PT08.S5(O3)": 1074.0, "T": 11.900000095367, "RH": 53.97500038147, "AH": 0.7502390673981953 },
  { "Time": "2024-03-10 21:00:00", "CO(GT)": null, "PT08.S1(CO)": 1375.5, "NMHC(GT)": 80, "C6H6(GT)": 9.228796421407274, "PT08.S2(NMHC)": 948.25, "NOx(GT)": 172, "PT08.S3(NOx)": 1092.0, "NO2(GT)": 122, "PT08.S4(NO2)": 1583.75, "PT08.S5(O3)": 1203.25, "T": 11.0, "RH": null, "AH": 0.7867125330859253 },
  { "Time": "2024-03-10 22:00:00", "CO(GT)": 1.6, "PT08.S1(CO)": 1272.25, "NMHC(GT)": 51, "C6H6(GT)": 6.518223669074141, "PT08.S2(NMHC)": 835.5, "NOx(GT)": 131, "PT08.S3(NOx)": 1205.0, "NO2(GT)": 116, "PT08.S4(NO2)": 1490.0, "PT08.S5(O3)": 1110.0, "T": 11.150000095367, "RH": 59.575000762939, "AH": 0.7887942318667593 },
  { "Time": "2024-03-10 23:00:00", "CO(GT)": 1.2, "PT08.S1(CO)": 1197.0, "NMHC(GT)": 38, "C6H6(GT)": 4.741012362478748, "PT08.S2(NMHC)": 750.25, "NOx(GT)": 89, "PT08.S3(NOx)": 1336.5, "NO2(GT)": 96, "PT08.S4(NO2)": 1393.0, "PT08.S5(O3)": 949.25, "T": 11.175000190735, "RH": 59.175000190735, "AH": 0.7847716643397448 },
  { "Time": "2024-03-11 00:00:00", "CO(GT)": 1.2, "PT08.S1(CO)": 1185.0, "NMHC(GT)": 31, "C6H6(GT)": 3.624399189797516, "PT08.S2(NMHC)": 689.5, "NOx(GT)": 62, "PT08.S3(NOx)": 1461.75, "NO2(GT)": 77, "PT08.S4(NO2)": 1332.75, "PT08.S5(O3)": 732.5, "T": 11.324999809265, "RH": 56.77499961853, "AH": 0.7603119392843289 },
  { "Time": "2024-03-11 01:00:00", "CO(GT)": 1.0, "PT08.S1(CO)": 1136.25, "NMHC(GT)": 31, "C6H6(GT)": 3.3266769916607997, "PT08.S2(NMHC)": 672.0, "NOx(GT)": 62, "PT08.S3(NOx)": 1453.25, "NO2(GT)": 76, "PT08.S4(NO2)": 1332.75, "PT08.S5(O3)": 729.5, "T": 10.674999952316, "RH": 60.0, "AH": 0.7702384578230451 },
  { "Time": "2024-03-11 02:00:00", "CO(GT)": 0.9, "PT08.S1(CO)": 1094.0, "NMHC(GT)": 24, "C6H6(GT)": 2.3394161950867094, "PT08.S2(NMHC)": 608.5, "NOx(GT)": 45, "PT08.S3(NOx)": 1579.0, "NO2(GT)": 60, "PT08.S4(NO2)": 1276.0, "PT08.S5(O3)": 619.5, "T": 10.650000095367, "RH": 59.674999237061, "AH": 0.7648187256861201 },
  { "Time": "2024-03-11 03:00:00", "CO(GT)": 0.6, "PT08.S1(CO)": 1009.75, "NMHC(GT)": 19, "C6H6(GT)": 1.6966582576513223, "PT08.S2(NMHC)": 560.75, "NOx(GT)": -200, "PT08.S3(NOx)": 1705.0, "NO2(GT)": -200, "PT08.S4(NO2)": 1234.75, "PT08.S5(O3)": 501.25, "T": 10.250000238419, "RH": 60.200000762939, "AH": 0.7516571648306898 }
];

// 清洗后的空气质量预览数据 - 不含缺失值和异常值
const MOCK_PREVIEW_ROWS_AIR_CLEANED = [
  { "Time": "2024-03-10 18:00:00", "CO(GT)": 2.6, "PT08.S1(CO)": 1360.0, "NMHC(GT)": 150, "C6H6(GT)": 11.881723488680304, "PT08.S2(NMHC)": 1045.5, "NOx(GT)": 166, "PT08.S3(NOx)": 1056.25, "NO2(GT)": 113, "PT08.S4(NO2)": 1692.0, "PT08.S5(O3)": 1267.5, "T": 13.599999904633, "RH": 48.875000953674, "AH": 0.7577538251293606 },
  { "Time": "2024-03-10 19:00:00", "CO(GT)": 2.0, "PT08.S1(CO)": 1292.25, "NMHC(GT)": 112, "C6H6(GT)": 9.397164889581603, "PT08.S2(NMHC)": 954.75, "NOx(GT)": 103, "PT08.S3(NOx)": 1173.75, "NO2(GT)": 92, "PT08.S4(NO2)": 1558.75, "PT08.S5(O3)": 972.25, "T": 13.299999952316, "RH": 47.699999809265, "AH": 0.7254874492424674 },
  { "Time": "2024-03-10 20:00:00", "CO(GT)": 2.2, "PT08.S1(CO)": 1402.0, "NMHC(GT)": 88, "C6H6(GT)": 8.997816871326798, "PT08.S2(NMHC)": 939.25, "NOx(GT)": 131, "PT08.S3(NOx)": 1140.0, "NO2(GT)": 114, "PT08.S4(NO2)": 1554.5, "PT08.S5(O3)": 1074.0, "T": 11.900000095367, "RH": 53.97500038147, "AH": 0.7502390673981953 },
  { "Time": "2024-03-10 21:00:00", "CO(GT)": 2.2, "PT08.S1(CO)": 1375.5, "NMHC(GT)": 80, "C6H6(GT)": 9.228796421407274, "PT08.S2(NMHC)": 948.25, "NOx(GT)": 172, "PT08.S3(NOx)": 1092.0, "NO2(GT)": 122, "PT08.S4(NO2)": 1583.75, "PT08.S5(O3)": 1203.25, "T": 11.0, "RH": 60.0, "AH": 0.7867125330859253 },
  { "Time": "2024-03-10 22:00:00", "CO(GT)": 1.6, "PT08.S1(CO)": 1272.25, "NMHC(GT)": 51, "C6H6(GT)": 6.518223669074141, "PT08.S2(NMHC)": 835.5, "NOx(GT)": 131, "PT08.S3(NOx)": 1205.0, "NO2(GT)": 116, "PT08.S4(NO2)": 1490.0, "PT08.S5(O3)": 1110.0, "T": 11.150000095367, "RH": 59.575000762939, "AH": 0.7887942318667593 },
  { "Time": "2024-03-10 23:00:00", "CO(GT)": 1.2, "PT08.S1(CO)": 1197.0, "NMHC(GT)": 38, "C6H6(GT)": 4.741012362478748, "PT08.S2(NMHC)": 750.25, "NOx(GT)": 89, "PT08.S3(NOx)": 1336.5, "NO2(GT)": 96, "PT08.S4(NO2)": 1393.0, "PT08.S5(O3)": 949.25, "T": 11.175000190735, "RH": 59.175000190735, "AH": 0.7847716643397448 },
  { "Time": "2024-03-11 00:00:00", "CO(GT)": 1.2, "PT08.S1(CO)": 1185.0, "NMHC(GT)": 31, "C6H6(GT)": 3.624399189797516, "PT08.S2(NMHC)": 689.5, "NOx(GT)": 62, "PT08.S3(NOx)": 1461.75, "NO2(GT)": 77, "PT08.S4(NO2)": 1332.75, "PT08.S5(O3)": 732.5, "T": 11.324999809265, "RH": 56.77499961853, "AH": 0.7603119392843289 },
  { "Time": "2024-03-11 01:00:00", "CO(GT)": 1.0, "PT08.S1(CO)": 1136.25, "NMHC(GT)": 31, "C6H6(GT)": 3.3266769916607997, "PT08.S2(NMHC)": 672.0, "NOx(GT)": 62, "PT08.S3(NOx)": 1453.25, "NO2(GT)": 76, "PT08.S4(NO2)": 1332.75, "PT08.S5(O3)": 729.5, "T": 10.674999952316, "RH": 60.0, "AH": 0.7702384578230451 },
  { "Time": "2024-03-11 02:00:00", "CO(GT)": 0.9, "PT08.S1(CO)": 1094.0, "NMHC(GT)": 24, "C6H6(GT)": 2.3394161950867094, "PT08.S2(NMHC)": 608.5, "NOx(GT)": 45, "PT08.S3(NOx)": 1579.0, "NO2(GT)": 60, "PT08.S4(NO2)": 1276.0, "PT08.S5(O3)": 619.5, "T": 10.650000095367, "RH": 59.674999237061, "AH": 0.7648187256861201 },
  { "Time": "2024-03-11 03:00:00", "CO(GT)": 0.6, "PT08.S1(CO)": 1009.75, "NMHC(GT)": 19, "C6H6(GT)": 1.6966582576513223, "PT08.S2(NMHC)": 560.75, "NOx(GT)": 75, "PT08.S3(NOx)": 1705.0, "NO2(GT)": 68, "PT08.S4(NO2)": 1234.75, "PT08.S5(O3)": 501.25, "T": 10.250000238419, "RH": 60.200000762939, "AH": 0.7516571648306898 }
];

// 清洗后的机器预览数据 - 不含缺失值和异常值
const MOCK_PREVIEW_ROWS_MACHINE_CLEANED = [
  { UDI: 2033, "Product ID": "L49212", Type: "L", "Air temperature [K]": 298.8, "Process temperature [K]": 308.5, "Rotational speed [rpm]": 1444, "Torque [Nm]": 45.7, "Tool wear [min]": 98, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 6018, "Product ID": "L53197", Type: "L", "Air temperature [K]": 300.8, "Process temperature [K]": 310.2, "Rotational speed [rpm]": 1398, "Torque [Nm]": 51.8, "Tool wear [min]": 115, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 3343, "Product ID": "L50522", Type: "L", "Air temperature [K]": 301.5, "Process temperature [K]": 310.8, "Rotational speed [rpm]": 1456, "Torque [Nm]": 38.2, "Tool wear [min]": 67, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 461, "Product ID": "H29874", Type: "H", "Air temperature [K]": 297.3, "Process temperature [K]": 308.6, "Rotational speed [rpm]": 1431, "Torque [Nm]": 42.5, "Tool wear [min]": 156, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 7523, "Product ID": "M47851", Type: "M", "Air temperature [K]": 299.1, "Process temperature [K]": 309.4, "Rotational speed [rpm]": 1512, "Torque [Nm]": 35.9, "Tool wear [min]": 89, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 892, "Product ID": "L45623", Type: "L", "Air temperature [K]": 302.2, "Process temperature [K]": 311.5, "Rotational speed [rpm]": 1389, "Torque [Nm]": 48.3, "Tool wear [min]": 134, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 4167, "Product ID": "M51234", Type: "M", "Air temperature [K]": 298.5, "Process temperature [K]": 308.9, "Rotational speed [rpm]": 1467, "Torque [Nm]": 41.2, "Tool wear [min]": 78, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 5891, "Product ID": "L52876", Type: "L", "Air temperature [K]": 300.3, "Process temperature [K]": 310.1, "Rotational speed [rpm]": 1423, "Torque [Nm]": 44.8, "Tool wear [min]": 102, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 1234, "Product ID": "H36547", Type: "H", "Air temperature [K]": 297.8, "Process temperature [K]": 308.2, "Rotational speed [rpm]": 1498, "Torque [Nm]": 37.6, "Tool wear [min]": 45, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 },
  { UDI: 3678, "Product ID": "M49876", Type: "M", "Air temperature [K]": 299.6, "Process temperature [K]": 309.8, "Rotational speed [rpm]": 1445, "Torque [Nm]": 43.1, "Tool wear [min]": 123, "Machine failure": 0, TWF: 0, HDF: 0, PWF: 0, OSF: 0, RNF: 0 }
];

const MOCK_PREVIEW_ROWS_AIR_TEST = [{ "Time": "2024-03-25 00:00", "CO(GT)": 1.3, "NMHC(GT)": 81, "C6H6(GT)": 4.486627508988761, "NOx(GT)": 80, "NO2(GT)": 89 }, { "Time": "2024-03-25 01:00", "CO(GT)": 1.0, "NMHC(GT)": 52, "C6H6(GT)": 2.514599021549308, "NOx(GT)": 42, "NO2(GT)": 58 }, { "Time": "2024-03-25 02:00", "CO(GT)": 0.7, "NMHC(GT)": 38, "C6H6(GT)": 1.7821586396135651, "NOx(GT)": 38, "NO2(GT)": 54 }, { "Time": "2024-03-25 03:00", "CO(GT)": 0.7, "NMHC(GT)": 35, "C6H6(GT)": 1.4218161094645745, "NOx(GT)": 28, "NO2(GT)": 41 }, { "Time": "2024-03-25 04:00", "CO(GT)": 0.5, "NMHC(GT)": 29, "C6H6(GT)": 0.9066972606578043, "NOx(GT)": 18, "NO2(GT)": 28 }, { "Time": "2024-03-25 05:00", "CO(GT)": 0.5, "NMHC(GT)": 21, "C6H6(GT)": 0.6160853557960174, "NOx(GT)": 12, "NO2(GT)": 20 }, { "Time": "2024-03-25 06:00", "CO(GT)": 0.6, "NMHC(GT)": 46, "C6H6(GT)": 1.442220421528291, "NOx(GT)": 43, "NO2(GT)": 51 }, { "Time": "2024-03-25 07:00", "CO(GT)": 1.1, "NMHC(GT)": 55, "C6H6(GT)": 3.755311504247508, "NOx(GT)": 84, "NO2(GT)": 82 }, { "Time": "2024-03-25 08:00", "CO(GT)": 2.7, "NMHC(GT)": 271, "C6H6(GT)": 11.57450718922684, "NOx(GT)": 184, "NO2(GT)": 112 }, { "Time": "2024-03-25 09:00", "CO(GT)": 3.5, "NMHC(GT)": 434, "C6H6(GT)": 17.831404955551463, "NOx(GT)": 202, "NO2(GT)": 119 }];

const MOCK_NOX_PREDICTION = [{ "date": "2024-03-25 00:00", "actual": 80, "pred": 80.57, "upper": 88.63, "lower": 72.51 }, { "date": "2024-03-25 01:00", "actual": 42, "pred": 40.65, "upper": 44.72, "lower": 36.59 }, { "date": "2024-03-25 02:00", "actual": 38, "pred": 39.48, "upper": 43.43, "lower": 35.53 }, { "date": "2024-03-25 03:00", "actual": 28, "pred": 26.77, "upper": 29.45, "lower": 24.09 }, { "date": "2024-03-25 04:00", "actual": 18, "pred": 17.52, "upper": 19.27, "lower": 15.77 }, { "date": "2024-03-25 05:00", "actual": 12, "pred": 11.62, "upper": 12.78, "lower": 10.46 }, { "date": "2024-03-25 06:00", "actual": 43, "pred": 41.39, "upper": 45.53, "lower": 37.25 }, { "date": "2024-03-25 07:00", "actual": 84, "pred": 80.52, "upper": 88.57, "lower": 72.47 }, { "date": "2024-03-25 08:00", "actual": 184, "pred": 184.32, "upper": 202.75, "lower": 165.89 }, { "date": "2024-03-25 09:00", "actual": 202, "pred": 198.25, "upper": 218.08, "lower": 178.43 }, { "date": "2024-03-25 10:00", "actual": 133, "pred": 129.98, "upper": 142.98, "lower": 116.98 }, { "date": "2024-03-25 11:00", "actual": 130, "pred": 124.0, "upper": 136.4, "lower": 111.6 }, { "date": "2024-03-25 12:00", "actual": 106, "pred": 107.17, "upper": 117.89, "lower": 96.45 }, { "date": "2024-03-25 13:00", "actual": 132, "pred": 129.48, "upper": 142.43, "lower": 116.53 }, { "date": "2024-03-25 14:00", "actual": 106, "pred": 109.61, "upper": 120.57, "lower": 98.65 }, { "date": "2024-03-25 15:00", "actual": 125, "pred": 130.04, "upper": 143.04, "lower": 117.04 }, { "date": "2024-03-25 16:00", "actual": 138, "pred": 139.77, "upper": 153.75, "lower": 125.79 }, { "date": "2024-03-25 17:00", "actual": 120, "pred": 120.78, "upper": 132.86, "lower": 108.7 }, { "date": "2024-03-25 18:00", "actual": 158, "pred": 160.79, "upper": 176.87, "lower": 144.71 }, { "date": "2024-03-25 19:00", "actual": 253, "pred": 244.41, "upper": 268.85, "lower": 219.97 }, { "date": "2024-03-25 20:00", "actual": 231, "pred": 242.5, "upper": 266.75, "lower": 218.25 }, { "date": "2024-03-25 21:00", "actual": 150, "pred": 148.01, "upper": 162.81, "lower": 133.21 }, { "date": "2024-03-25 22:00", "actual": 99, "pred": 99.81, "upper": 109.79, "lower": 89.83 }, { "date": "2024-03-25 23:00", "actual": 75, "pred": 74.0, "upper": 81.4, "lower": 66.6 }, { "date": "2024-03-26 00:00", "actual": 93, "pred": 90.8, "upper": 99.88, "lower": 81.72 }, { "date": "2024-03-26 01:00", "actual": 79, "pred": 78.81, "upper": 86.69, "lower": 70.93 }, { "date": "2024-03-26 02:00", "actual": 67, "pred": 69.99, "upper": 76.99, "lower": 62.99 }, { "date": "2024-03-26 03:00", "actual": 56, "pred": 58.15, "upper": 63.97, "lower": 52.34 }, { "date": "2024-03-26 04:00", "actual": 45, "pred": 47.24, "upper": 51.96, "lower": 42.52 }, { "date": "2024-03-26 05:00", "actual": 72, "pred": 72.52, "upper": 79.77, "lower": 65.27 }, { "date": "2024-03-26 06:00", "actual": 103, "pred": 100.36, "upper": 110.4, "lower": 90.32 }, { "date": "2024-03-26 07:00", "actual": 132, "pred": 128.71, "upper": 141.58, "lower": 115.84 }, { "date": "2024-03-26 08:00", "actual": 239, "pred": 228.96, "upper": 251.86, "lower": 206.06 }, { "date": "2024-03-26 09:00", "actual": 275, "pred": 288.39, "upper": 317.23, "lower": 259.55 }, { "date": "2024-03-26 10:00", "actual": 232, "pred": 234.93, "upper": 258.42, "lower": 211.44 }, { "date": "2024-03-26 11:00", "actual": 180, "pred": 186.87, "upper": 205.56, "lower": 168.18 }, { "date": "2024-03-26 12:00", "actual": 112, "pred": 116.78, "upper": 128.46, "lower": 105.1 }, { "date": "2024-03-26 13:00", "actual": 116, "pred": 116.85, "upper": 128.53, "lower": 105.16 }, { "date": "2024-03-26 14:00", "actual": 103, "pred": 104.28, "upper": 114.71, "lower": 93.85 }, { "date": "2024-03-26 15:00", "actual": 89, "pred": 93.09, "upper": 102.4, "lower": 83.78 }, { "date": "2024-03-26 16:00", "actual": 112, "pred": 110.65, "upper": 121.72, "lower": 99.59 }, { "date": "2024-03-26 17:00", "actual": 127, "pred": 130.71, "upper": 143.78, "lower": 117.64 }, { "date": "2024-03-26 18:00", "actual": 125, "pred": 119.98, "upper": 131.98, "lower": 107.98 }, { "date": "2024-03-26 19:00", "actual": 120, "pred": 123.81, "upper": 136.19, "lower": 111.43 }, { "date": "2024-03-26 20:00", "actual": 120, "pred": 118.95, "upper": 130.85, "lower": 107.06 }, { "date": "2024-03-26 21:00", "actual": 99, "pred": 100.37, "upper": 110.41, "lower": 90.33 }, { "date": "2024-03-26 22:00", "actual": 79, "pred": 80.05, "upper": 88.06, "lower": 72.05 }, { "date": "2024-03-26 23:00", "actual": 66, "pred": 64.95, "upper": 71.45, "lower": 58.46 }, { "date": "2024-03-27 00:00", "actual": 94, "pred": 96.17, "upper": 105.79, "lower": 86.55 }, { "date": "2024-03-27 01:00", "actual": 70, "pred": 71.99, "upper": 79.19, "lower": 64.79 }, { "date": "2024-03-27 02:00", "actual": 75, "pred": 74.33, "upper": 81.76, "lower": 66.9 }, { "date": "2024-03-27 03:00", "actual": 66, "pred": 62.94, "upper": 69.23, "lower": 56.65 }, { "date": "2024-03-27 04:00", "actual": 57, "pred": 55.07, "upper": 60.58, "lower": 49.56 }, { "date": "2024-03-27 05:00", "actual": 32, "pred": 32.81, "upper": 36.09, "lower": 29.53 }, { "date": "2024-03-27 06:00", "actual": 54, "pred": 55.79, "upper": 61.37, "lower": 50.21 }, { "date": "2024-03-27 07:00", "actual": 68, "pred": 66.14, "upper": 72.75, "lower": 59.53 }, { "date": "2024-03-27 08:00", "actual": 98, "pred": 99.37, "upper": 109.31, "lower": 89.43 }, { "date": "2024-03-27 09:00", "actual": 128, "pred": 131.23, "upper": 144.35, "lower": 118.11 }, { "date": "2024-03-27 10:00", "actual": 129, "pred": 122.79, "upper": 135.07, "lower": 110.51 }, { "date": "2024-03-27 11:00", "actual": 130, "pred": 131.48, "upper": 144.63, "lower": 118.33 }, { "date": "2024-03-27 12:00", "actual": 111, "pred": 105.71, "upper": 116.28, "lower": 95.14 }, { "date": "2024-03-27 13:00", "actual": 106, "pred": 108.94, "upper": 119.83, "lower": 98.05 }, { "date": "2024-03-27 14:00", "actual": 137, "pred": 132.49, "upper": 145.74, "lower": 119.24 }, { "date": "2024-03-27 15:00", "actual": 113, "pred": 113.44, "upper": 124.78, "lower": 102.1 }, { "date": "2024-03-27 16:00", "actual": 122, "pred": 120.09, "upper": 132.1, "lower": 108.08 }, { "date": "2024-03-27 17:00", "actual": 137, "pred": 133.97, "upper": 147.37, "lower": 120.57 }, { "date": "2024-03-27 18:00", "actual": 165, "pred": 163.02, "upper": 179.32, "lower": 146.72 }, { "date": "2024-03-27 19:00", "actual": 196, "pred": 196.19, "upper": 215.81, "lower": 176.57 }, { "date": "2024-03-27 20:00", "actual": 174, "pred": 177.01, "upper": 194.71, "lower": 159.31 }, { "date": "2024-03-27 21:00", "actual": 140, "pred": 133.13, "upper": 146.44, "lower": 119.82 }, { "date": "2024-03-27 22:00", "actual": 102, "pred": 103.79, "upper": 114.17, "lower": 93.41 }, { "date": "2024-03-27 23:00", "actual": 130, "pred": 128.07, "upper": 140.88, "lower": 115.26 }, { "date": "2024-03-28 00:00", "actual": 121, "pred": 120.06, "upper": 132.07, "lower": 108.05 }, { "date": "2024-03-28 01:00", "actual": 111, "pred": 109.54, "upper": 120.49, "lower": 98.59 }, { "date": "2024-03-28 02:00", "actual": 87, "pred": 84.19, "upper": 92.61, "lower": 75.77 }, { "date": "2024-03-28 03:00", "actual": 82, "pred": 83.91, "upper": 92.3, "lower": 75.52 }, { "date": "2024-03-28 04:00", "actual": 77, "pred": 78.22, "upper": 86.04, "lower": 70.4 }, { "date": "2024-03-28 05:00", "actual": 39, "pred": 40.25, "upper": 44.28, "lower": 36.23 }, { "date": "2024-03-28 06:00", "actual": 77, "pred": 80.47, "upper": 88.52, "lower": 72.42 }, { "date": "2024-03-28 07:00", "actual": 91, "pred": 89.25, "upper": 98.18, "lower": 80.33 }, { "date": "2024-03-28 08:00", "actual": 105, "pred": 103.19, "upper": 113.51, "lower": 92.87 }, { "date": "2024-03-28 09:00", "actual": 133, "pred": 136.34, "upper": 149.97, "lower": 122.71 }, { "date": "2024-03-28 10:00", "actual": 128, "pred": 134.38, "upper": 147.82, "lower": 120.94 }, { "date": "2024-03-28 11:00", "actual": 126, "pred": 120.37, "upper": 132.41, "lower": 108.33 }, { "date": "2024-03-28 12:00", "actual": 92, "pred": 90.52, "upper": 99.57, "lower": 81.47 }, { "date": "2024-03-28 13:00", "actual": 66, "pred": 65.56, "upper": 72.12, "lower": 59.0 }, { "date": "2024-03-28 14:00", "actual": 50, "pred": 50.9, "upper": 55.99, "lower": 45.81 }, { "date": "2024-03-28 15:00", "actual": 70, "pred": 71.99, "upper": 79.19, "lower": 64.79 }, { "date": "2024-03-28 16:00", "actual": 73, "pred": 76.35, "upper": 83.98, "lower": 68.72 }, { "date": "2024-03-28 17:00", "actual": 77, "pred": 75.84, "upper": 83.42, "lower": 68.26 }, { "date": "2024-03-28 18:00", "actual": 86, "pred": 85.68, "upper": 94.25, "lower": 77.11 }, { "date": "2024-03-28 19:00", "actual": 93, "pred": 94.21, "upper": 103.63, "lower": 84.79 }, { "date": "2024-03-28 20:00", "actual": 105, "pred": 106.65, "upper": 117.32, "lower": 95.99 }, { "date": "2024-03-28 21:00", "actual": 67, "pred": 68.58, "upper": 75.44, "lower": 61.72 }, { "date": "2024-03-28 22:00", "actual": 63, "pred": 66.14, "upper": 72.75, "lower": 59.53 }, { "date": "2024-03-28 23:00", "actual": 63, "pred": 62.69, "upper": 68.96, "lower": 56.42 }, { "date": "2024-03-29 00:00", "actual": 46, "pred": 46.52, "upper": 51.17, "lower": 41.87 }, { "date": "2024-03-29 01:00", "actual": 21, "pred": 20.75, "upper": 22.83, "lower": 18.68 }, { "date": "2024-03-29 02:00", "actual": 22, "pred": 22.7, "upper": 24.97, "lower": 20.43 }, { "date": "2024-03-29 03:00", "actual": 30, "pred": 31.2, "upper": 34.32, "lower": 28.08 }, { "date": "2024-03-29 04:00", "actual": 39, "pred": 39.8, "upper": 43.78, "lower": 35.82 }, { "date": "2024-03-29 05:00", "actual": 55, "pred": 54.99, "upper": 60.49, "lower": 49.49 }, { "date": "2024-03-29 06:00", "actual": 76, "pred": 74.76, "upper": 82.24, "lower": 67.28 }, { "date": "2024-03-29 07:00", "actual": 181, "pred": 189.7, "upper": 208.67, "lower": 170.73 }, { "date": "2024-03-29 08:00", "actual": 259, "pred": 262.9, "upper": 289.19, "lower": 236.61 }, { "date": "2024-03-29 09:00", "actual": 118, "pred": 116.54, "upper": 128.19, "lower": 104.89 }, { "date": "2024-03-29 10:00", "actual": 119, "pred": 122.37, "upper": 134.61, "lower": 110.13 }, { "date": "2024-03-29 11:00", "actual": 123, "pred": 122.75, "upper": 135.03, "lower": 110.48 }, { "date": "2024-03-29 12:00", "actual": 92, "pred": 94.33, "upper": 103.76, "lower": 84.9 }, { "date": "2024-03-29 13:00", "actual": 91, "pred": 89.21, "upper": 98.13, "lower": 80.29 }, { "date": "2024-03-29 14:00", "actual": 103, "pred": 99.37, "upper": 109.31, "lower": 89.43 }, { "date": "2024-03-29 15:00", "actual": 102, "pred": 100.91, "upper": 111.0, "lower": 90.82 }, { "date": "2024-03-29 16:00", "actual": 94, "pred": 93.44, "upper": 102.78, "lower": 84.1 }, { "date": "2024-03-29 17:00", "actual": 98, "pred": 95.66, "upper": 105.23, "lower": 86.09 }, { "date": "2024-03-29 18:00", "actual": 126, "pred": 128.57, "upper": 141.43, "lower": 115.71 }, { "date": "2024-03-29 19:00", "actual": 108, "pred": 107.88, "upper": 118.67, "lower": 97.09 }, { "date": "2024-03-29 20:00", "actual": 95, "pred": 92.14, "upper": 101.35, "lower": 82.93 }, { "date": "2024-03-29 21:00", "actual": 78, "pred": 74.83, "upper": 82.31, "lower": 67.35 }, { "date": "2024-03-29 22:00", "actual": 61, "pred": 63.37, "upper": 69.71, "lower": 57.03 }, { "date": "2024-03-29 23:00", "actual": 55, "pred": 55.29, "upper": 60.82, "lower": 49.76 }, { "date": "2024-03-30 00:00", "actual": 57, "pred": 58.94, "upper": 64.83, "lower": 53.05 }, { "date": "2024-03-30 01:00", "actual": 41, "pred": 41.86, "upper": 46.05, "lower": 37.67 }, { "date": "2024-03-30 02:00", "actual": 46, "pred": 44.67, "upper": 49.14, "lower": 40.2 }, { "date": "2024-03-30 03:00", "actual": 43, "pred": 43.4, "upper": 47.74, "lower": 39.06 }, { "date": "2024-03-30 04:00", "actual": 41, "pred": 39.62, "upper": 43.58, "lower": 35.66 }, { "date": "2024-03-30 05:00", "actual": 52, "pred": 50.5, "upper": 55.55, "lower": 45.45 }, { "date": "2024-03-30 06:00", "actual": 111, "pred": 111.39, "upper": 122.53, "lower": 100.25 }, { "date": "2024-03-30 07:00", "actual": 191, "pred": 186.44, "upper": 205.08, "lower": 167.8 }, { "date": "2024-03-30 08:00", "actual": 244, "pred": 249.35, "upper": 274.29, "lower": 224.41 }, { "date": "2024-03-30 09:00", "actual": 283, "pred": 272.12, "upper": 299.33, "lower": 244.91 }, { "date": "2024-03-30 10:00", "actual": 320, "pred": 305.19, "upper": 335.71, "lower": 274.67 }, { "date": "2024-03-30 11:00", "actual": 249, "pred": 241.91, "upper": 266.1, "lower": 217.72 }, { "date": "2024-03-30 12:00", "actual": 219, "pred": 210.71, "upper": 231.78, "lower": 189.64 }, { "date": "2024-03-30 13:00", "actual": 200, "pred": 198.44, "upper": 218.28, "lower": 178.6 }, { "date": "2024-03-30 14:00", "actual": 138, "pred": 133.79, "upper": 147.17, "lower": 120.41 }, { "date": "2024-03-30 15:00", "actual": 118, "pred": 122.69, "upper": 134.96, "lower": 110.42 }, { "date": "2024-03-30 16:00", "actual": 99, "pred": 101.44, "upper": 111.58, "lower": 91.3 }, { "date": "2024-03-30 17:00", "actual": 112, "pred": 114.94, "upper": 126.43, "lower": 103.45 }, { "date": "2024-03-30 18:00", "actual": 117, "pred": 117.3, "upper": 129.03, "lower": 105.57 }, { "date": "2024-03-30 19:00", "actual": 129, "pred": 131.02, "upper": 144.12, "lower": 117.92 }, { "date": "2024-03-30 20:00", "actual": 132, "pred": 137.9, "upper": 151.69, "lower": 124.11 }, { "date": "2024-03-30 21:00", "actual": 73, "pred": 75.64, "upper": 83.2, "lower": 68.08 }, { "date": "2024-03-30 22:00", "actual": 68, "pred": 71.06, "upper": 78.17, "lower": 63.95 }, { "date": "2024-03-30 23:00", "actual": 80, "pred": 78.01, "upper": 85.81, "lower": 70.21 }, { "date": "2024-03-31 00:00", "actual": 68, "pred": 65.17, "upper": 71.69, "lower": 58.65 }, { "date": "2024-03-31 01:00", "actual": 44, "pred": 43.61, "upper": 47.97, "lower": 39.25 }, { "date": "2024-03-31 02:00", "actual": 47, "pred": 49.01, "upper": 53.91, "lower": 44.11 }, { "date": "2024-03-31 03:00", "actual": 31, "pred": 31.99, "upper": 35.19, "lower": 28.79 }, { "date": "2024-03-31 04:00", "actual": 15, "pred": 14.84, "upper": 16.32, "lower": 13.36 }, { "date": "2024-03-31 05:00", "actual": 44, "pred": 43.84, "upper": 48.22, "lower": 39.46 }, { "date": "2024-03-31 06:00", "actual": 85, "pred": 88.48, "upper": 97.33, "lower": 79.63 }, { "date": "2024-03-31 07:00", "actual": 207, "pred": 208.14, "upper": 228.95, "lower": 187.33 }, { "date": "2024-03-31 08:00", "actual": 230, "pred": 240.41, "upper": 264.45, "lower": 216.37 }, { "date": "2024-03-31 09:00", "actual": 181, "pred": 179.24, "upper": 197.16, "lower": 161.32 }, { "date": "2024-03-31 10:00", "actual": 144, "pred": 144.47, "upper": 158.92, "lower": 130.02 }, { "date": "2024-03-31 11:00", "actual": 140, "pred": 143.6, "upper": 157.96, "lower": 129.24 }, { "date": "2024-03-31 12:00", "actual": 204, "pred": 207.67, "upper": 228.44, "lower": 186.9 }, { "date": "2024-03-31 13:00", "actual": 149, "pred": 148.13, "upper": 162.94, "lower": 133.32 }, { "date": "2024-03-31 14:00", "actual": 171, "pred": 166.74, "upper": 183.41, "lower": 150.07 }, { "date": "2024-03-31 15:00", "actual": 195, "pred": 194.7, "upper": 214.17, "lower": 175.23 }, { "date": "2024-03-31 16:00", "actual": 152, "pred": 145.92, "upper": 160.51, "lower": 131.33 }, { "date": "2024-03-31 17:00", "actual": 128, "pred": 134.05, "upper": 147.46, "lower": 120.65 }, { "date": "2024-03-31 18:00", "actual": 121, "pred": 117.03, "upper": 128.73, "lower": 105.33 }, { "date": "2024-03-31 19:00", "actual": 142, "pred": 144.97, "upper": 159.47, "lower": 130.47 }, { "date": "2024-03-31 20:00", "actual": 131, "pred": 134.88, "upper": 148.37, "lower": 121.39 }, { "date": "2024-03-31 21:00", "actual": 81, "pred": 84.39, "upper": 92.83, "lower": 75.95 }, { "date": "2024-03-31 22:00", "actual": 60, "pred": 57.17, "upper": 62.89, "lower": 51.45 }, { "date": "2024-03-31 23:00", "actual": 57, "pred": 55.6, "upper": 61.16, "lower": 50.04 }];

const MOCK_AIR_QUALITY_TRENDS = [{ "Time": "2024-03-25 00:00", "CO(GT)": 1.3, "NMHC(GT)": 81, "C6H6(GT)": 4.486627508988761, "NOx(GT)": 80, "NO2(GT)": 89 }, { "Time": "2024-03-25 01:00", "CO(GT)": 1.0, "NMHC(GT)": 52, "C6H6(GT)": 2.514599021549308, "NOx(GT)": 42, "NO2(GT)": 58 }, { "Time": "2024-03-25 02:00", "CO(GT)": 0.7, "NMHC(GT)": 38, "C6H6(GT)": 1.7821586396135651, "NOx(GT)": 38, "NO2(GT)": 54 }, { "Time": "2024-03-25 03:00", "CO(GT)": 0.7, "NMHC(GT)": 35, "C6H6(GT)": 1.4218161094645745, "NOx(GT)": 28, "NO2(GT)": 41 }, { "Time": "2024-03-25 04:00", "CO(GT)": 0.5, "NMHC(GT)": 29, "C6H6(GT)": 0.9066972606578043, "NOx(GT)": 18, "NO2(GT)": 28 }, { "Time": "2024-03-25 05:00", "CO(GT)": 0.5, "NMHC(GT)": 21, "C6H6(GT)": 0.6160853557960174, "NOx(GT)": 12, "NO2(GT)": 20 }, { "Time": "2024-03-25 06:00", "CO(GT)": 0.6, "NMHC(GT)": 46, "C6H6(GT)": 1.442220421528291, "NOx(GT)": 43, "NO2(GT)": 51 }, { "Time": "2024-03-25 07:00", "CO(GT)": 1.1, "NMHC(GT)": 55, "C6H6(GT)": 3.755311504247508, "NOx(GT)": 84, "NO2(GT)": 82 }, { "Time": "2024-03-25 08:00", "CO(GT)": 2.7, "NMHC(GT)": 271, "C6H6(GT)": 11.57450718922684, "NOx(GT)": 184, "NO2(GT)": 112 }, { "Time": "2024-03-25 09:00", "CO(GT)": 3.5, "NMHC(GT)": 434, "C6H6(GT)": 17.831404955551463, "NOx(GT)": 202, "NO2(GT)": 119 }, { "Time": "2024-03-25 10:00", "CO(GT)": 2.3, "NMHC(GT)": 300, "C6H6(GT)": 8.845219157196645, "NOx(GT)": 133, "NO2(GT)": 99 }, { "Time": "2024-03-25 11:00", "CO(GT)": 1.6, "NMHC(GT)": 116, "C6H6(GT)": 6.827184440761592, "NOx(GT)": 130, "NO2(GT)": 98 }, { "Time": "2024-03-25 12:00", "CO(GT)": 1.3, "NMHC(GT)": 95, "C6H6(GT)": 5.934730067801716, "NOx(GT)": 106, "NO2(GT)": 88 }, { "Time": "2024-03-25 13:00", "CO(GT)": 2.0, "NMHC(GT)": 211, "C6H6(GT)": 8.889611855025933, "NOx(GT)": 132, "NO2(GT)": 96 }, { "Time": "2024-03-25 14:00", "CO(GT)": 1.9, "NMHC(GT)": 168, "C6H6(GT)": 8.178484755708308, "NOx(GT)": 106, "NO2(GT)": 81 }, { "Time": "2024-03-25 15:00", "CO(GT)": 1.9, "NMHC(GT)": 154, "C6H6(GT)": 8.618412576532277, "NOx(GT)": 125, "NO2(GT)": 92 }, { "Time": "2024-03-25 16:00", "CO(GT)": 2.2, "NMHC(GT)": 267, "C6H6(GT)": 10.123793161712667, "NOx(GT)": 138, "NO2(GT)": 105 }, { "Time": "2024-03-25 17:00", "CO(GT)": 2.0, "NMHC(GT)": 143, "C6H6(GT)": 9.44271643902197, "NOx(GT)": 120, "NO2(GT)": 88 }, { "Time": "2024-03-25 18:00", "CO(GT)": 2.9, "NMHC(GT)": 374, "C6H6(GT)": 14.641827890596746, "NOx(GT)": 158, "NO2(GT)": 103 }, { "Time": "2024-03-25 19:00", "CO(GT)": 5.2, "NMHC(GT)": 797, "C6H6(GT)": 24.563483800808026, "NOx(GT)": 253, "NO2(GT)": 141 }, { "Time": "2024-03-25 20:00", "CO(GT)": 4.6, "NMHC(GT)": 698, "C6H6(GT)": 21.62703708737063, "NOx(GT)": 231, "NO2(GT)": 133 }, { "Time": "2024-03-25 21:00", "CO(GT)": 2.5, "NMHC(GT)": 234, "C6H6(GT)": 10.312426565086698, "NOx(GT)": 150, "NO2(GT)": 119 }, { "Time": "2024-03-25 22:00", "CO(GT)": 1.5, "NMHC(GT)": 104, "C6H6(GT)": 5.701585274620053, "NOx(GT)": 99, "NO2(GT)": 106 }, { "Time": "2024-03-25 23:00", "CO(GT)": 1.2, "NMHC(GT)": 67, "C6H6(GT)": 4.467671749279885, "NOx(GT)": 75, "NO2(GT)": 92 }, { "Time": "2024-03-26 00:00", "CO(GT)": 1.7, "NMHC(GT)": 88, "C6H6(GT)": 5.477599159348292, "NOx(GT)": 93, "NO2(GT)": 97 }, { "Time": "2024-03-26 01:00", "CO(GT)": 1.4, "NMHC(GT)": 79, "C6H6(GT)": 4.799437657555934, "NOx(GT)": 79, "NO2(GT)": 91 }, { "Time": "2024-03-26 02:00", "CO(GT)": 1.2, "NMHC(GT)": 61, "C6H6(GT)": 3.633065021681544, "NOx(GT)": 67, "NO2(GT)": 83 }, { "Time": "2024-03-26 03:00", "CO(GT)": 0.6, "NMHC(GT)": 43, "C6H6(GT)": 1.6997929461444818, "NOx(GT)": 56, "NO2(GT)": 71 }, { "Time": "2024-03-26 04:00", "CO(GT)": 0.7, "NMHC(GT)": 40, "C6H6(GT)": 2.246785504993861, "NOx(GT)": 45, "NO2(GT)": 59 }, { "Time": "2024-03-26 05:00", "CO(GT)": 0.8, "NMHC(GT)": 52, "C6H6(GT)": 3.0278593859425342, "NOx(GT)": 72, "NO2(GT)": 73 }, { "Time": "2024-03-26 06:00", "CO(GT)": 0.9, "NMHC(GT)": 64, "C6H6(GT)": 4.045717310202204, "NOx(GT)": 103, "NO2(GT)": 78 }, { "Time": "2024-03-26 07:00", "CO(GT)": 1.6, "NMHC(GT)": 88, "C6H6(GT)": 6.652292699030296, "NOx(GT)": 132, "NO2(GT)": 90 }, { "Time": "2024-03-26 08:00", "CO(GT)": 3.4, "NMHC(GT)": 375, "C6H6(GT)": 16.702495983514385, "NOx(GT)": 239, "NO2(GT)": 110 }, { "Time": "2024-03-26 09:00", "CO(GT)": 3.8, "NMHC(GT)": 592, "C6H6(GT)": 19.344005847031532, "NOx(GT)": 275, "NO2(GT)": 114 }, { "Time": "2024-03-26 10:00", "CO(GT)": 3.1, "NMHC(GT)": 357, "C6H6(GT)": 14.775598053926105, "NOx(GT)": 232, "NO2(GT)": 119 }, { "Time": "2024-03-26 11:00", "CO(GT)": 2.7, "NMHC(GT)": 296, "C6H6(GT)": 13.431043277829003, "NOx(GT)": 180, "NO2(GT)": 121 }, { "Time": "2024-03-26 12:00", "CO(GT)": 2.0, "NMHC(GT)": 181, "C6H6(GT)": 10.977346204363998, "NOx(GT)": 112, "NO2(GT)": 97 }, { "Time": "2024-03-26 13:00", "CO(GT)": 2.3, "NMHC(GT)": 211, "C6H6(GT)": 12.535803547771689, "NOx(GT)": 116, "NO2(GT)": 99 }, { "Time": "2024-03-26 14:00", "CO(GT)": 1.9, "NMHC(GT)": 199, "C6H6(GT)": 8.4189190812524, "NOx(GT)": 103, "NO2(GT)": 85 }, { "Time": "2024-03-26 15:00", "CO(GT)": 1.3, "NMHC(GT)": 81, "C6H6(GT)": 5.25237752206223, "NOx(GT)": 89, "NO2(GT)": 75 }, { "Time": "2024-03-26 16:00", "CO(GT)": 1.9, "NMHC(GT)": 143, "C6H6(GT)": 8.826222726457212, "NOx(GT)": 112, "NO2(GT)": 87 }, { "Time": "2024-03-26 17:00", "CO(GT)": 2.3, "NMHC(GT)": 247, "C6H6(GT)": 11.228614928035205, "NOx(GT)": 127, "NO2(GT)": 102 }, { "Time": "2024-03-26 18:00", "CO(GT)": 2.4, "NMHC(GT)": 239, "C6H6(GT)": 11.638524261032968, "NOx(GT)": 125, "NO2(GT)": 105 }, { "Time": "2024-03-26 19:00", "CO(GT)": 2.7, "NMHC(GT)": 267, "C6H6(GT)": 12.389162076428056, "NOx(GT)": 120, "NO2(GT)": 98 }, { "Time": "2024-03-26 20:00", "CO(GT)": 2.6, "NMHC(GT)": 261, "C6H6(GT)": 10.591313617363797, "NOx(GT)": 120, "NO2(GT)": 93 }, { "Time": "2024-03-26 21:00", "CO(GT)": 1.5, "NMHC(GT)": 97, "C6H6(GT)": 5.982908820688995, "NOx(GT)": 99, "NO2(GT)": 91 }, { "Time": "2024-03-26 22:00", "CO(GT)": 1.2, "NMHC(GT)": 66, "C6H6(GT)": 4.601079630929639, "NOx(GT)": 79, "NO2(GT)": 85 }, { "Time": "2024-03-26 23:00", "CO(GT)": 1.1, "NMHC(GT)": 60, "C6H6(GT)": 4.068437354625373, "NOx(GT)": 66, "NO2(GT)": 74 }, { "Time": "2024-03-27 00:00", "CO(GT)": 1.5, "NMHC(GT)": 77, "C6H6(GT)": 5.247305750259137, "NOx(GT)": 94, "NO2(GT)": 87 }, { "Time": "2024-03-27 01:00", "CO(GT)": 1.0, "NMHC(GT)": 57, "C6H6(GT)": 3.1860104697339593, "NOx(GT)": 70, "NO2(GT)": 79 }, { "Time": "2024-03-27 02:00", "CO(GT)": 1.2, "NMHC(GT)": 65, "C6H6(GT)": 4.462938156393024, "NOx(GT)": 75, "NO2(GT)": 78 }, { "Time": "2024-03-27 03:00", "CO(GT)": 1.1, "NMHC(GT)": 59, "C6H6(GT)": 3.790555459460099, "NOx(GT)": 66, "NO2(GT)": 70 }, { "Time": "2024-03-27 04:00", "CO(GT)": 1.0, "NMHC(GT)": 48, "C6H6(GT)": 3.7685115383177186, "NOx(GT)": 57, "NO2(GT)": 63 }, { "Time": "2024-03-27 05:00", "CO(GT)": 0.8, "NMHC(GT)": 27, "C6H6(GT)": 1.9220071328834474, "NOx(GT)": 32, "NO2(GT)": 48 }, { "Time": "2024-03-27 06:00", "CO(GT)": 0.9, "NMHC(GT)": 25, "C6H6(GT)": 2.4372931460201444, "NOx(GT)": 54, "NO2(GT)": 59 }, { "Time": "2024-03-27 07:00", "CO(GT)": 1.1, "NMHC(GT)": 42, "C6H6(GT)": 3.268441768671755, "NOx(GT)": 68, "NO2(GT)": 65 }, { "Time": "2024-03-27 08:00", "CO(GT)": 1.5, "NMHC(GT)": 78, "C6H6(GT)": 6.663517615555966, "NOx(GT)": 98, "NO2(GT)": 71 }, { "Time": "2024-03-27 09:00", "CO(GT)": 1.8, "NMHC(GT)": 128, "C6H6(GT)": 8.474825256908856, "NOx(GT)": 128, "NO2(GT)": 84 }, { "Time": "2024-03-27 10:00", "CO(GT)": 2.1, "NMHC(GT)": 184, "C6H6(GT)": 9.698220270852254, "NOx(GT)": 129, "NO2(GT)": 93 }, { "Time": "2024-03-27 11:00", "CO(GT)": 2.1, "NMHC(GT)": 156, "C6H6(GT)": 9.410170035043505, "NOx(GT)": 130, "NO2(GT)": 99 }, { "Time": "2024-03-27 12:00", "CO(GT)": 1.9, "NMHC(GT)": 176, "C6H6(GT)": 9.010583552600266, "NOx(GT)": 111, "NO2(GT)": 93 }, { "Time": "2024-03-27 13:00", "CO(GT)": 2.1, "NMHC(GT)": 232, "C6H6(GT)": 10.030033705078656, "NOx(GT)": 106, "NO2(GT)": 96 }, { "Time": "2024-03-27 14:00", "CO(GT)": 2.5, "NMHC(GT)": 305, "C6H6(GT)": 12.638889972455347, "NOx(GT)": 137, "NO2(GT)": 114 }, { "Time": "2024-03-27 15:00", "CO(GT)": 1.9, "NMHC(GT)": 150, "C6H6(GT)": 7.599353631659464, "NOx(GT)": 113, "NO2(GT)": 101 }, { "Time": "2024-03-27 16:00", "CO(GT)": 2.2, "NMHC(GT)": 188, "C6H6(GT)": 11.781322973571852, "NOx(GT)": 122, "NO2(GT)": 108 }, { "Time": "2024-03-27 17:00", "CO(GT)": 2.3, "NMHC(GT)": 221, "C6H6(GT)": 11.221602522216635, "NOx(GT)": 137, "NO2(GT)": 117 }, { "Time": "2024-03-27 18:00", "CO(GT)": 2.7, "NMHC(GT)": 219, "C6H6(GT)": 12.352616700065974, "NOx(GT)": 165, "NO2(GT)": 125 }, { "Time": "2024-03-27 19:00", "CO(GT)": 3.0, "NMHC(GT)": 306, "C6H6(GT)": 12.868432241320129, "NOx(GT)": 196, "NO2(GT)": 133 }, { "Time": "2024-03-27 20:00", "CO(GT)": 2.8, "NMHC(GT)": 270, "C6H6(GT)": 12.206895761540563, "NOx(GT)": 174, "NO2(GT)": 119 }, { "Time": "2024-03-27 21:00", "CO(GT)": 2.2, "NMHC(GT)": 231, "C6H6(GT)": 8.76933794439815, "NOx(GT)": 140, "NO2(GT)": 107 }, { "Time": "2024-03-27 22:00", "CO(GT)": 1.6, "NMHC(GT)": 125, "C6H6(GT)": 6.787523688906004, "NOx(GT)": 102, "NO2(GT)": 96 }, { "Time": "2024-03-27 23:00", "CO(GT)": 2.1, "NMHC(GT)": 122, "C6H6(GT)": 8.6058859089994, "NOx(GT)": 130, "NO2(GT)": 105 }, { "Time": "2024-03-28 00:00", "CO(GT)": 2.3, "NMHC(GT)": 161, "C6H6(GT)": 8.934099266185445, "NOx(GT)": 121, "NO2(GT)": 102 }, { "Time": "2024-03-28 01:00", "CO(GT)": 2.3, "NMHC(GT)": 101, "C6H6(GT)": 8.313749266595785, "NOx(GT)": 111, "NO2(GT)": 97 }, { "Time": "2024-03-28 02:00", "CO(GT)": 1.7, "NMHC(GT)": 95, "C6H6(GT)": 6.335782437222818, "NOx(GT)": 87, "NO2(GT)": 79 }, { "Time": "2024-03-28 03:00", "CO(GT)": 2.2, "NMHC(GT)": 129, "C6H6(GT)": 8.29524842051841, "NOx(GT)": 82, "NO2(GT)": 74 }, { "Time": "2024-03-28 04:00", "CO(GT)": 1.3, "NMHC(GT)": 96, "C6H6(GT)": 5.116173813476844, "NOx(GT)": 77, "NO2(GT)": 69 }, { "Time": "2024-03-28 05:00", "CO(GT)": 0.8, "NMHC(GT)": 54, "C6H6(GT)": 2.5966872968302512, "NOx(GT)": 39, "NO2(GT)": 52 }, { "Time": "2024-03-28 06:00", "CO(GT)": 1.1, "NMHC(GT)": 63, "C6H6(GT)": 3.602773223770146, "NOx(GT)": 77, "NO2(GT)": 62 }, { "Time": "2024-03-28 07:00", "CO(GT)": 1.4, "NMHC(GT)": 72, "C6H6(GT)": 3.64173967489039, "NOx(GT)": 91, "NO2(GT)": 69 }, { "Time": "2024-03-28 08:00", "CO(GT)": 1.3, "NMHC(GT)": 91, "C6H6(GT)": 4.682892421913301, "NOx(GT)": 105, "NO2(GT)": 75 }, { "Time": "2024-03-28 09:00", "CO(GT)": 1.9, "NMHC(GT)": 127, "C6H6(GT)": 7.534155226996669, "NOx(GT)": 133, "NO2(GT)": 83 }, { "Time": "2024-03-28 10:00", "CO(GT)": 2.3, "NMHC(GT)": 193, "C6H6(GT)": 8.965933937610119, "NOx(GT)": 128, "NO2(GT)": 94 }, { "Time": "2024-03-28 11:00", "CO(GT)": 2.3, "NMHC(GT)": 188, "C6H6(GT)": 9.468788047958288, "NOx(GT)": 126, "NO2(GT)": 96 }, { "Time": "2024-03-28 12:00", "CO(GT)": 1.8, "NMHC(GT)": 151, "C6H6(GT)": 7.694614864499808, "NOx(GT)": 92, "NO2(GT)": 86 }, { "Time": "2024-03-28 13:00", "CO(GT)": 1.4, "NMHC(GT)": 103, "C6H6(GT)": 5.664861806391042, "NOx(GT)": 66, "NO2(GT)": 72 }, { "Time": "2024-03-28 14:00", "CO(GT)": 1.0, "NMHC(GT)": 55, "C6H6(GT)": 3.803808114179806, "NOx(GT)": 50, "NO2(GT)": 53 }, { "Time": "2024-03-28 15:00", "CO(GT)": 1.4, "NMHC(GT)": 104, "C6H6(GT)": 4.804320198215755, "NOx(GT)": 70, "NO2(GT)": 65 }, { "Time": "2024-03-28 16:00", "CO(GT)": 1.3, "NMHC(GT)": 116, "C6H6(GT)": 4.303271193472167, "NOx(GT)": 73, "NO2(GT)": 70 }, { "Time": "2024-03-28 17:00", "CO(GT)": 1.3, "NMHC(GT)": 93, "C6H6(GT)": 4.050256979222614, "NOx(GT)": 77, "NO2(GT)": 75 }, { "Time": "2024-03-28 18:00", "CO(GT)": 1.4, "NMHC(GT)": 93, "C6H6(GT)": 4.653947132964057, "NOx(GT)": 86, "NO2(GT)": 86 }, { "Time": "2024-03-28 19:00", "CO(GT)": 1.9, "NMHC(GT)": 155, "C6H6(GT)": 6.237201055298119, "NOx(GT)": 93, "NO2(GT)": 94 }, { "Time": "2024-03-28 20:00", "CO(GT)": 1.8, "NMHC(GT)": 115, "C6H6(GT)": 5.508623133368252, "NOx(GT)": 105, "NO2(GT)": 103 }, { "Time": "2024-03-28 21:00", "CO(GT)": 1.1, "NMHC(GT)": 75, "C6H6(GT)": 3.2808838245676193, "NOx(GT)": 67, "NO2(GT)": 81 }, { "Time": "2024-03-28 22:00", "CO(GT)": 1.1, "NMHC(GT)": 65, "C6H6(GT)": 3.218875255436456, "NOx(GT)": 63, "NO2(GT)": 80 }, { "Time": "2024-03-28 23:00", "CO(GT)": 1.1, "NMHC(GT)": 57, "C6H6(GT)": 2.9322466012758994, "NOx(GT)": 63, "NO2(GT)": 77 }, { "Time": "2024-03-29 00:00", "CO(GT)": 0.9, "NMHC(GT)": 40, "C6H6(GT)": 2.183593389348636, "NOx(GT)": 46, "NO2(GT)": 58 }, { "Time": "2024-03-29 01:00", "CO(GT)": 0.6, "NMHC(GT)": 27, "C6H6(GT)": 1.2575500759428946, "NOx(GT)": 21, "NO2(GT)": 31 }, { "Time": "2024-03-29 02:00", "CO(GT)": 0.5, "NMHC(GT)": 23, "C6H6(GT)": 1.1019592524649573, "NOx(GT)": 22, "NO2(GT)": 38 }, { "Time": "2024-03-29 03:00", "CO(GT)": 0.7, "NMHC(GT)": 28, "C6H6(GT)": 1.2658352378612354, "NOx(GT)": 30, "NO2(GT)": 48 }, { "Time": "2024-03-29 04:00", "CO(GT)": 0.6, "NMHC(GT)": 21, "C6H6(GT)": 1.179554362055887, "NOx(GT)": 39, "NO2(GT)": 59 }, { "Time": "2024-03-29 05:00", "CO(GT)": 0.7, "NMHC(GT)": 33, "C6H6(GT)": 1.6779019605578074, "NOx(GT)": 55, "NO2(GT)": 70 }, { "Time": "2024-03-29 06:00", "CO(GT)": 0.9, "NMHC(GT)": 40, "C6H6(GT)": 2.8535704981423655, "NOx(GT)": 76, "NO2(GT)": 75 }, { "Time": "2024-03-29 07:00", "CO(GT)": 2.9, "NMHC(GT)": 279, "C6H6(GT)": 14.266927815926682, "NOx(GT)": 181, "NO2(GT)": 103 }, { "Time": "2024-03-29 08:00", "CO(GT)": 4.1, "NMHC(GT)": 743, "C6H6(GT)": 19.743714277046415, "NOx(GT)": 259, "NO2(GT)": 134 }, { "Time": "2024-03-29 09:00", "CO(GT)": 1.5, "NMHC(GT)": 147, "C6H6(GT)": 5.4518029314463465, "NOx(GT)": 118, "NO2(GT)": 98 }, { "Time": "2024-03-29 10:00", "CO(GT)": 1.5, "NMHC(GT)": 97, "C6H6(GT)": 5.596929682822607, "NOx(GT)": 119, "NO2(GT)": 97 }, { "Time": "2024-03-29 11:00", "CO(GT)": 1.5, "NMHC(GT)": 118, "C6H6(GT)": 5.807066327844245, "NOx(GT)": 123, "NO2(GT)": 98 }, { "Time": "2024-03-29 12:00", "CO(GT)": 1.4, "NMHC(GT)": 91, "C6H6(GT)": 5.4569580235554955, "NOx(GT)": 92, "NO2(GT)": 78 }, { "Time": "2024-03-29 13:00", "CO(GT)": 1.6, "NMHC(GT)": 146, "C6H6(GT)": 6.457164646441118, "NOx(GT)": 91, "NO2(GT)": 83 }, { "Time": "2024-03-29 14:00", "CO(GT)": 1.5, "NMHC(GT)": 139, "C6H6(GT)": 5.544912138895297, "NOx(GT)": 103, "NO2(GT)": 92 }, { "Time": "2024-03-29 15:00", "CO(GT)": 1.4, "NMHC(GT)": 155, "C6H6(GT)": 5.247305750259137, "NOx(GT)": 102, "NO2(GT)": 81 }, { "Time": "2024-03-29 16:00", "CO(GT)": 1.5, "NMHC(GT)": 128, "C6H6(GT)": 5.770054202900989, "NOx(GT)": 94, "NO2(GT)": 90 }, { "Time": "2024-03-29 17:00", "CO(GT)": 1.9, "NMHC(GT)": 166, "C6H6(GT)": 7.910799352772567, "NOx(GT)": 98, "NO2(GT)": 95 }, { "Time": "2024-03-29 18:00", "CO(GT)": 2.5, "NMHC(GT)": 299, "C6H6(GT)": 10.204454244911034, "NOx(GT)": 126, "NO2(GT)": 114 }, { "Time": "2024-03-29 19:00", "CO(GT)": 2.1, "NMHC(GT)": 163, "C6H6(GT)": 8.196874198144533, "NOx(GT)": 108, "NO2(GT)": 106 }, { "Time": "2024-03-29 20:00", "CO(GT)": 1.6, "NMHC(GT)": 154, "C6H6(GT)": 5.691082532681572, "NOx(GT)": 95, "NO2(GT)": 99 }, { "Time": "2024-03-29 21:00", "CO(GT)": 1.2, "NMHC(GT)": 80, "C6H6(GT)": 3.7993883716478276, "NOx(GT)": 78, "NO2(GT)": 90 }, { "Time": "2024-03-29 22:00", "CO(GT)": 1.1, "NMHC(GT)": 58, "C6H6(GT)": 3.977882954308811, "NOx(GT)": 61, "NO2(GT)": 82 }, { "Time": "2024-03-29 23:00", "CO(GT)": 1.0, "NMHC(GT)": 55, "C6H6(GT)": 2.8496606572459786, "NOx(GT)": 55, "NO2(GT)": 74 }, { "Time": "2024-03-30 00:00", "CO(GT)": 1.0, "NMHC(GT)": 33, "C6H6(GT)": 2.6495095616042814, "NOx(GT)": 57, "NO2(GT)": 76 }, { "Time": "2024-03-30 01:00", "CO(GT)": 0.7, "NMHC(GT)": 33, "C6H6(GT)": 1.804617397022203, "NOx(GT)": 41, "NO2(GT)": 66 }, { "Time": "2024-03-30 02:00", "CO(GT)": 0.7, "NMHC(GT)": 32, "C6H6(GT)": 1.7249591914596851, "NOx(GT)": 46, "NO2(GT)": 73 }, { "Time": "2024-03-30 03:00", "CO(GT)": 0.8, "NMHC(GT)": 25, "C6H6(GT)": 1.442220421528291, "NOx(GT)": 43, "NO2(GT)": 71 }, { "Time": "2024-03-30 04:00", "CO(GT)": 0.8, "NMHC(GT)": 29, "C6H6(GT)": 1.31322175102388, "NOx(GT)": 41, "NO2(GT)": 69 }, { "Time": "2024-03-30 05:00", "CO(GT)": 0.7, "NMHC(GT)": 26, "C6H6(GT)": 2.2857806756960337, "NOx(GT)": 52, "NO2(GT)": 71 }, { "Time": "2024-03-30 06:00", "CO(GT)": 1.1, "NMHC(GT)": 86, "C6H6(GT)": 5.313401621471466, "NOx(GT)": 111, "NO2(GT)": 98 }, { "Time": "2024-03-30 07:00", "CO(GT)": 2.6, "NMHC(GT)": 294, "C6H6(GT)": 13.378099027683405, "NOx(GT)": 191, "NO2(GT)": 115 }, { "Time": "2024-03-30 08:00", "CO(GT)": 4.0, "NMHC(GT)": 664, "C6H6(GT)": 23.81445830704887, "NOx(GT)": 244, "NO2(GT)": 130 }, { "Time": "2024-03-30 09:00", "CO(GT)": 4.2, "NMHC(GT)": 695, "C6H6(GT)": 21.488111149528635, "NOx(GT)": 283, "NO2(GT)": 150 }, { "Time": "2024-03-30 10:00", "CO(GT)": 4.7, "NMHC(GT)": 735, "C6H6(GT)": 20.981985953180125, "NOx(GT)": 320, "NO2(GT)": 159 }, { "Time": "2024-03-30 11:00", "CO(GT)": 3.9, "NMHC(GT)": 649, "C6H6(GT)": 18.381657068639182, "NOx(GT)": 249, "NO2(GT)": 146 }, { "Time": "2024-03-30 12:00", "CO(GT)": 3.7, "NMHC(GT)": 586, "C6H6(GT)": 18.94778792993442, "NOx(GT)": 219, "NO2(GT)": 138 }, { "Time": "2024-03-30 13:00", "CO(GT)": 3.4, "NMHC(GT)": 546, "C6H6(GT)": 17.10326171179337, "NOx(GT)": 200, "NO2(GT)": 128 }, { "Time": "2024-03-30 14:00", "CO(GT)": 2.2, "NMHC(GT)": 245, "C6H6(GT)": 10.373373792087863, "NOx(GT)": 138, "NO2(GT)": 97 }, { "Time": "2024-03-30 15:00", "CO(GT)": 1.9, "NMHC(GT)": 178, "C6H6(GT)": 7.953131497568524, "NOx(GT)": 118, "NO2(GT)": 91 }, { "Time": "2024-03-30 16:00", "CO(GT)": 1.6, "NMHC(GT)": 130, "C6H6(GT)": 6.166413663112407, "NOx(GT)": 99, "NO2(GT)": 81 }, { "Time": "2024-03-30 17:00", "CO(GT)": 2.1, "NMHC(GT)": 151, "C6H6(GT)": 9.731187323395478, "NOx(GT)": 112, "NO2(GT)": 99 }, { "Time": "2024-03-30 18:00", "CO(GT)": 2.2, "NMHC(GT)": 272, "C6H6(GT)": 9.593046413094703, "NOx(GT)": 117, "NO2(GT)": 101 }, { "Time": "2024-03-30 19:00", "CO(GT)": 2.7, "NMHC(GT)": 301, "C6H6(GT)": 11.924863429687202, "NOx(GT)": 129, "NO2(GT)": 106 }, { "Time": "2024-03-30 20:00", "CO(GT)": 2.4, "NMHC(GT)": 237, "C6H6(GT)": 8.706316634357416, "NOx(GT)": 132, "NO2(GT)": 102 }, { "Time": "2024-03-30 21:00", "CO(GT)": 1.3, "NMHC(GT)": 95, "C6H6(GT)": 4.653947132964057, "NOx(GT)": 73, "NO2(GT)": 84 }, { "Time": "2024-03-30 22:00", "CO(GT)": 1.2, "NMHC(GT)": 68, "C6H6(GT)": 3.830372555883701, "NOx(GT)": 68, "NO2(GT)": 81 }, { "Time": "2024-03-30 23:00", "CO(GT)": 1.5, "NMHC(GT)": 101, "C6H6(GT)": 4.678062894272762, "NOx(GT)": 80, "NO2(GT)": 91 }, { "Time": "2024-03-31 00:00", "CO(GT)": 1.3, "NMHC(GT)": 81, "C6H6(GT)": 3.8481259529430054, "NOx(GT)": 68, "NO2(GT)": 82 }, { "Time": "2024-03-31 01:00", "CO(GT)": 1.0, "NMHC(GT)": 50, "C6H6(GT)": 2.676090587829464, "NOx(GT)": 44, "NO2(GT)": 64 }, { "Time": "2024-03-31 02:00", "CO(GT)": 0.9, "NMHC(GT)": 66, "C6H6(GT)": 2.787414370831833, "NOx(GT)": 47, "NO2(GT)": 70 }, { "Time": "2024-03-31 03:00", "CO(GT)": 0.5, "NMHC(GT)": 22, "C6H6(GT)": 0.9724494566891972, "NOx(GT)": 31, "NO2(GT)": 48 }, { "Time": "2024-03-31 04:00", "CO(GT)": 0.5, "NMHC(GT)": 18, "C6H6(GT)": 0.7901587664876446, "NOx(GT)": 15, "NO2(GT)": 26 }, { "Time": "2024-03-31 05:00", "CO(GT)": 0.6, "NMHC(GT)": 31, "C6H6(GT)": 1.504175249891816, "NOx(GT)": 44, "NO2(GT)": 58 }, { "Time": "2024-03-31 06:00", "CO(GT)": 1.0, "NMHC(GT)": 57, "C6H6(GT)": 3.5210984059647115, "NOx(GT)": 85, "NO2(GT)": 93 }, { "Time": "2024-03-31 07:00", "CO(GT)": 3.1, "NMHC(GT)": 342, "C6H6(GT)": 15.621359219570662, "NOx(GT)": 207, "NO2(GT)": 110 }, { "Time": "2024-03-31 08:00", "CO(GT)": 4.1, "NMHC(GT)": 644, "C6H6(GT)": 19.9493542369401, "NOx(GT)": 230, "NO2(GT)": 115 }, { "Time": "2024-03-31 09:00", "CO(GT)": 2.2, "NMHC(GT)": 216, "C6H6(GT)": 8.599625488406302, "NOx(GT)": 181, "NO2(GT)": 125 }, { "Time": "2024-03-31 10:00", "CO(GT)": 1.7, "NMHC(GT)": 117, "C6H6(GT)": 6.540487668220774, "NOx(GT)": 144, "NO2(GT)": 118 }, { "Time": "2024-03-31 11:00", "CO(GT)": 1.9, "NMHC(GT)": 156, "C6H6(GT)": 7.682679548673003, "NOx(GT)": 140, "NO2(GT)": 109 }, { "Time": "2024-03-31 12:00", "CO(GT)": 2.9, "NMHC(GT)": 332, "C6H6(GT)": 11.30587461136357, "NOx(GT)": 204, "NO2(GT)": 123 }, { "Time": "2024-03-31 13:00", "CO(GT)": 2.2, "NMHC(GT)": 232, "C6H6(GT)": 9.125830725364114, "NOx(GT)": 149, "NO2(GT)": 114 }, { "Time": "2024-03-31 14:00", "CO(GT)": 2.6, "NMHC(GT)": 295, "C6H6(GT)": 11.235629201385404, "NOx(GT)": 171, "NO2(GT)": 114 }, { "Time": "2024-03-31 15:00", "CO(GT)": 3.1, "NMHC(GT)": 386, "C6H6(GT)": 13.484076653735869, "NOx(GT)": 195, "NO2(GT)": 119 }, { "Time": "2024-03-31 16:00", "CO(GT)": 2.3, "NMHC(GT)": 278, "C6H6(GT)": 10.050093703546924, "NOx(GT)": 152, "NO2(GT)": 111 }, { "Time": "2024-03-31 17:00", "CO(GT)": 2.4, "NMHC(GT)": 263, "C6H6(GT)": 11.319946086587374, "NOx(GT)": 128, "NO2(GT)": 103 }, { "Time": "2024-03-31 18:00", "CO(GT)": 2.8, "NMHC(GT)": 322, "C6H6(GT)": 11.752703849058946, "NOx(GT)": 121, "NO2(GT)": 103 }, { "Time": "2024-03-31 19:00", "CO(GT)": 2.7, "NMHC(GT)": 226, "C6H6(GT)": 11.524820242423965, "NOx(GT)": 142, "NO2(GT)": 107 }, { "Time": "2024-03-31 20:00", "CO(GT)": 2.3, "NMHC(GT)": 221, "C6H6(GT)": 9.345221010408595, "NOx(GT)": 131, "NO2(GT)": 105 }, { "Time": "2024-03-31 21:00", "CO(GT)": 1.5, "NMHC(GT)": 109, "C6H6(GT)": 5.467274438558492, "NOx(GT)": 81, "NO2(GT)": 91 }, { "Time": "2024-03-31 22:00", "CO(GT)": 1.4, "NMHC(GT)": 105, "C6H6(GT)": 5.101134317941586, "NOx(GT)": 60, "NO2(GT)": 79 }, { "Time": "2024-03-31 23:00", "CO(GT)": 1.2, "NMHC(GT)": 84, "C6H6(GT)": 4.804320198215755, "NOx(GT)": 57, "NO2(GT)": 79 }];

const MOCK_SCHEMA_AIR = [
  { k: "Time", t: "时间", desc: "时间" },
  { k: "CO(GT)", t: "数值", desc: "一氧化碳浓度" },
  { k: "PT08.S1(CO)", t: "数值", desc: "一氧化碳传感器(CO)" },
  { k: "NMHC(GT)", t: "数值", desc: "非甲烷烃浓度" },
  { k: "C6H6(GT)", t: "数值", desc: "苯浓度" },
  { k: "PT08.S2(NMHC)", t: "数值", desc: "非甲烷烃传感器(NMHC)" },
  { k: "NOx(GT)", t: "数值", desc: "氮氧化物浓度" },
  { k: "PT08.S3(NOx)", t: "数值", desc: "氮氧化物传感器(NOx)" },
  { k: "NO2(GT)", t: "数值", desc: "二氧化氮浓度" },
  { k: "PT08.S4(NO2)", t: "数值", desc: "二氧化氮传感器(NO2)" },
  { k: "PT08.S5(O3)", t: "数值", desc: "臭氧传感器(O3)" },
  { k: "T", t: "数值", desc: "温度" },
  { k: "RH", t: "数值", desc: "相对湿度" },
  { k: "AH", t: "数值", desc: "绝对湿度" }
];

const MOCK_SCHEMA_MACHINE = [
  { k: "UDI", t: "数值", desc: "唯一标识符" },
  { k: "Product ID", t: "文本", desc: "产品ID" },
  { k: "Type", t: "类别", desc: "产品类型(L/M/H)" },
  { k: "Air temperature [K]", t: "数值", desc: "空气温度" },
  { k: "Process temperature [K]", t: "数值", desc: "过程温度" },
  { k: "Rotational speed [rpm]", t: "数值", desc: "转速" },
  { k: "Torque [Nm]", t: "数值", desc: "扭矩" },
  { k: "Tool wear [min]", t: "数值", desc: "工具磨损" },
  { k: "Machine failure", t: "分类目标", desc: "机器故障(0/1)" },
  { k: "TWF", t: "分类目标", desc: "工具磨损故障" },
  { k: "HDF", t: "分类目标", desc: "热耗散故障" },
  { k: "PWF", t: "分类目标", desc: "功率故障" },
  { k: "OSF", t: "分类目标", desc: "过应力故障" },
  { k: "RNF", t: "分类目标", desc: "随机故障" },
];

const MOCK_DATASETS = [
  {
    id: "train_air_v1",
    sceneId: "air_quality_prediction",
    name: "空气质量预测训练集.xlsx",
    version: "v1（训练集）",
    rows: 342,
    cols: 15,
    timeRange: "2024-03-10 ~ 2024-03-24",
    owner: "环保部",
    qualityScore: 85,
    schema: MOCK_SCHEMA_AIR,
    previewData: MOCK_PREVIEW_ROWS_AIR
  },
  {
    id: "train_air_v2",
    sceneId: "air_quality_prediction",
    name: "空气质量预测训练集.xlsx_cleaned",
    version: "v2（清洗后）",
    rows: 342,
    cols: 15,
    timeRange: "2024-03-10 ~ 2024-03-24",
    owner: "环保部",
    qualityScore: 95,
    schema: MOCK_SCHEMA_AIR,
    previewData: MOCK_PREVIEW_ROWS_AIR_CLEANED
  },
  {
    id: "test_air_v1",
    sceneId: "air_quality_prediction",
    name: "空气质量预测测试集.xlsx",
    version: "v1（测试集）",
    rows: 168,
    cols: 14,
    timeRange: "2024-03-25 ~ 2024-03-31",
    owner: "环保部",
    qualityScore: 88,
    schema: MOCK_SCHEMA_AIR,
    previewData: MOCK_PREVIEW_ROWS_AIR_TEST
  },
  {
    id: "test_clf_v1",
    sceneId: "sd_high_price_clf",
    name: "test_分类.csv",
    version: "v1",
    rows: 749,
    cols: 17,
    timeRange: "2025-08-01 ~ 2025-09-01",
    owner: "市场部",
    qualityScore: 58,
  },
  {
    id: "test_machine_v1",
    sceneId: "machine_predictive_maintenance_clf",
    name: "机器预测性维护训练集.csv",
    version: "v1（训练集）",
    rows: 1440,
    cols: 14,
    timeRange: "-",
    owner: "生产部",
    qualityScore: 71,
    schema: MOCK_SCHEMA_MACHINE,
    previewData: MOCK_PREVIEW_ROWS_MACHINE
  },
  {
    id: "test_machine_test_v1",
    sceneId: "machine_predictive_maintenance_clf",
    name: "机器预测性维护测试集.csv",
    version: "v1（测试集）",
    rows: 672,
    cols: 14,
    timeRange: "-",
    owner: "生产部",
    qualityScore: 68,
    schema: MOCK_SCHEMA_MACHINE,
    previewData: MOCK_PREVIEW_ROWS_MACHINE_TEST
  },
  {
    id: "test_machine_v2",
    sceneId: "machine_predictive_maintenance_clf",
    name: "机器预测性维护训练集-清洗后.csv",
    version: "v2（清洗后）",
    rows: 8000,
    cols: 10,
    timeRange: "-",
    owner: "生产部",
    qualityScore: 92,
    schema: MOCK_SCHEMA_MACHINE,
    previewData: MOCK_PREVIEW_ROWS_MACHINE_CLEANED
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

const MOCK_ROWS_CLF = REAL_CLF_DATA;

const MOCK_PREVIEW_ROWS_CLF_V1 = [
  {
    Time: "2025/8/1 00:00",
    "非市场化核电总加_日前": "1621",
    "竞价空间_日前": "9999",
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
    "非市场化核电总加_日前": "",
    "竞价空间_日前": "53395.1975",
    "风力发电_日前": "4460.07",
    "联络线计划_日前": "20522.25",
    "光伏发电_日前": "0",
    "新能源总加_日前": "4460.07",
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
    "风力发电_日前": "",
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
    "竞价空间_日前": "48733.13",
    "风力发电_日前": "3980.1625",
    "联络线计划_日前": "20658.75",
    "光伏发电_日前": "0",
    "新能源总加_日前": "3980.1625",
    "省调负荷_日前": "",
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
    "省调负荷_日前": "74325.77",
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
    "非市场化核电总加_日前": "1621",
    "竞价空间_日前": "47211.455",
    "风力发电_日前": "4014.43",
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
    "全网负荷_日前": "89337.36",
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
    { name: "重复率", value: 1.2, unit: "%" },
    { name: "缺失率", value: 3.8, unit: "%" },
    { name: "异常值", value: 2.5, unit: "%" },
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
    { name: "重复率", value: 0.8, unit: "%" },
    { name: "缺失率", value: 2.1, unit: "%" },
    { name: "异常值", value: 1.6, unit: "%" },
    { name: "口径不一致", value: 4, unit: "项" },
  ],
  drift: HEALTH_V1.drift,
  missingHeat: HEALTH_V1.missingHeat,
  inconsistencies: HEALTH_V1.inconsistencies,
};

const HEALTH_V2 = {
  summary: [
    { name: "重复率", value: 0.0, unit: "%" },
    { name: "缺失率", value: 0.0, unit: "%" },
    { name: "异常值", value: 0.0, unit: "%" },
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
    id: "R-1",
    name: "数据去重",
    type: "去重",
    before: "",
    after: "",
    risk: "低",
  },
  {
    id: "R-2",
    name: "异常值处理",
    type: "异常",
    before: "",
    after: "",
    risk: "中",
  },
  {
    id: "R-3",
    name: "缺失值填补",
    type: "填补",
    before: "",
    after: "",
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
    taskName: "山西省日前电价预测_1",
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
    taskName: "山西省日前电价预测_2",
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
    taskName: "山西省日前电价预测_3",
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
    taskName: "山西省日前电价预测_4",
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
    taskName: "山西省日前电价预测_5",
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
    taskName: "山西省日前电价预测_6",
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
  {
    id: "run-Machine-01",
    taskName: "机器预测性维护分类_1",
    taskType: "分类",
    target: "Machine failure",
    status: "已完成",
    durationSec: 120,
    metrics: { AUC: 0.94, F1: 0.89, acc: 0.92 },
    version: "data:v2 · seed:42 · mode:精",
    createTime: "2025-12-25 11:00:00",
    finishTime: "2025-12-25 11:02:00",
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
  { "Time": "2025-08-01 03:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 48733.13, "风力发电_日前": 123456.78, "联络线计划_日前": 20658.75, "光伏发电_日前": 0.0, "新能源总加_日前": 3980.16, "省调负荷_日前": 74993.04, "全网负荷_日前": 81343.07, "现货出清电价-日前_D-2": 389.05, "现货出清电价-实时_D-2": 392.83, "实时-日前偏差值_D-2": 3.78, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 380.42, "现货出清电价-实时_D-3": 392.13 },
  { "Time": "2025-08-01 04:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": "NaN", "风力发电_日前": 3978.34, "联络线计划_日前": 20784.25, "光伏发电_日前": 7.45, "新能源总加_日前": 3985.79, "省调负荷_日前": 74325.77, "全网负荷_日前": 80686.13, "现货出清电价-日前_D-2": 384.61, "现货出清电价-实时_D-2": 387.03, "实时-日前偏差值_D-2": 2.42, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 1.0, "现货出清电价-日前_D-3": 375.14, "现货出清电价-实时_D-3": 381.88 },
  { "Time": "2025-08-01 05:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 47211.46, "风力发电_日前": 4014.43, "联络线计划_日前": 21663.50, "光伏发电_日前": 402.92, "新能源总加_日前": 4417.35, "省调负荷_日前": 74913.31, "全网负荷_日前": 81894.16, "现货出清电价-日前_D-2": 374.01, "现货出清电价-实时_D-2": 377.89, "实时-日前偏差值_D-2": 3.88, "label": 1, "实时-日前偏差值_D-2_label": 1, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 381.56, "现货出清电价-实时_D-3": 379.62 },
  { "Time": "2025-08-01 06:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 42958.85, "风力发电_日前": 3991.18, "联络线计划_日前": 22795.25, "光伏发电_日前": 2348.48, "新能源总加_日前": 6339.66, "省调负荷_日前": 73714.75, "全网负荷_日前": 83636.86, "现货出清电价-日前_D-2": 334.39, "现货出清电价-实时_D-2": 334.12, "实时-日前偏差值_D-2": -0.27, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 344.0, "现货出清电价-实时_D-3": 333.0 },
  { "Time": "2025-08-01 07:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 38885.02, "风力发电_日前": "NaN", "联络线计划_日前": 24184.25, "光伏发电_日前": 5625.35, "新能源总加_日前": "NaN", "省调负荷_日前": 74246.52, "全网负荷_日前": 89337.36, "现货出清电价-日前_D-2": 258.79, "现货出清电价-实时_D-2": 233.11, "实时-日前偏差值_D-2": -25.68, "label": 0, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 303.82, "现货出清电价-实时_D-3": 271.31 },
  { "Time": "2025-08-01 08:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 36436.63, "风力发电_日前": 4031.55, "联络线计划_日前": 27113.00, "光伏发电_日前": 9219.23, "新能源总加_日前": 13250.77, "省调负荷_日前": 78421.40, "全网负荷_日前": 99211.68, "现货出清电价-日前_D-2": 155.76, "现货出清电价-实时_D-2": 133.78, "实时-日前偏差值_D-2": -21.98, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 282.08, "现货出清电价-实时_D-3": 216.36 },
  { "Time": "2025-08-01 09:00", "非市场化核电总加_日前": 1621.0, "竞价空间_日前": 33976.67, "风力发电_日前": 4347.66, "联络线计划_日前": 28220.75, "光伏发电_日前": 12157.95, "新能源总加_日前": 16505.60, "省调负荷_日前": 80324.02, "全网负荷_日前": 102211.68, "现货出清电价-日前_D-2": 155.76, "现货出清电价-实时_D-2": 133.78, "实时-日前偏差值_D-2": -21.98, "label": 1, "实时-日前偏差值_D-2_label": 0, "实时-日前偏差值_D-3_label": 0.0, "现货出清电价-日前_D-3": 282.08, "现货出清电价-实时_D-3": 216.36 },
];



const MOCK_ROWS_PRICE_FULL = REAL_PRICE_DATA;

const MOCK_ROWS_MACHINE_FULL = REAL_MACHINE_DATA;

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

const MOCK_CONFUSION_MATRIX = {
  tp: 54,
  tn: 1907,
  fp: 25,
  fn: 14
};



function SimpleScatterPlot({ target = "Machine failure" }) {
  const data = useMemo(() => {
    const source = (typeof NEW_MACHINE_DATA !== 'undefined' && NEW_MACHINE_DATA.length > 0)
      ? NEW_MACHINE_DATA
      : [];

    return source.map((row, i) => {
      let actual = row[target];
      if (actual === undefined) {
        actual = row["Machine failure"] ?? row["label"] ?? 0;
      }
      return {
        index: i + 1,
        value: actual === 1 ? 1 : 0,
        actual: actual === 1 ? 1 : 0, // Ensure binary
      };
    });
  }, [target]);

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={-4} textAnchor="end" fill="#64748b" fontSize={12} fontWeight="500">
          {payload.value === 1 ? "Failure" : "Normal"}
        </text>
        <text x={0} y={0} dy={12} textAnchor="end" fill="#94a3b8" fontSize={11}>
          {payload.value === 1 ? "(1)" : "(0)"}
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-2">机器故障分类</h3>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              type="number"
              dataKey="index"
              tick={{ fontSize: 12, fill: "#64748b" }}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              type="number"
              dataKey="value"
              tick={<CustomYAxisTick />}
              tickLine={false}
              axisLine={false}
              ticks={[0, 1]}
              domain={[-0.5, 1.5]}
              width={70}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-3 border border-slate-100 rounded-lg shadow-xl text-xs">
                      <div className="font-bold text-slate-700 mb-1">样本 #{d.index}</div>
                      <div className={`font-medium ${d.value === 1 ? 'text-red-500' : 'text-blue-500'}`}>
                        {d.value === 1 ? "预测故障 (1)" : "预测正常 (0)"}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              height={40}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ top: -5, left: 30 }}
              formatter={(value) => <span className="text-xs text-slate-500 font-medium ml-1 mr-3">{value}</span>}
            />
            <Scatter name="预测正常 (0)" data={data.filter(d => d.actual === 0)} fill="#4f8aff" fillOpacity={0.8} shape={<circle r={2} />} />
            <Scatter name="预测故障 (1)" data={data.filter(d => d.actual === 1)} fill="#f76560" fillOpacity={0.8} shape={<circle r={2} />} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ClassificationVisuals({ target = "Machine failure" }) {
  const matrix = useMemo(() => {
    // Check if the target is one of the valid keys in NEW_MACHINE_DATA
    const validTargets = ["Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF"];

    if (validTargets.includes(target) && typeof NEW_MACHINE_DATA !== 'undefined' && NEW_MACHINE_DATA.length > 0) {
      let tp = 0, tn = 0, fp = 0, fn = 0;

      // Simple seeded random
      const pseudoRandom = (s) => {
        let t = s + 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };

      NEW_MACHINE_DATA.forEach((row, i) => {
        // Safely access the target property
        const actual = row[target] === 1 ? 1 : 0;

        // Simulate prediction:
        // For demonstration, we keep similar simulation logic but apply it to the specific target
        const r = pseudoRandom(i + 12345 + target.length); // varied seed per target
        let predicted = actual;

        if (actual === 1) {
          // 20% chance to miss (FN)
          if (r < 0.2) predicted = 0;
        } else {
          // 5% chance to false alarm (FP)
          if (r < 0.05) predicted = 1;
        }

        if (actual === 1 && predicted === 1) tp++;
        else if (actual === 0 && predicted === 0) tn++;
        else if (actual === 0 && predicted === 1) fp++;
        else if (actual === 1 && predicted === 0) fn++;
      });

      return { tp, tn, fp, fn };
    }

    // Fallback for other targets or mock data
    const seed = target.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return {
      tp: 50 + (seed % 20),
      tn: 1800 + (seed % 100),
      fp: 20 + (seed % 15),
      fn: 10 + (seed % 10)
    };
  }, [target]);



  return (
    <div className="w-full py-4 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      <div className="w-full h-full flex flex-col items-center bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">混淆矩阵</h3>

        <div className="relative flex items-center justify-center -ml-6 scale-90 sm:scale-100 flex-1">
          {/* Y-axis Label */}
          <div className="absolute -left-14 top-1/2 -translate-y-1/2 -rotate-90 text-sm font-medium text-slate-500 whitespace-nowrap">
            Actual Class
          </div>

          <div className="flex flex-col">
            {/* X-axis Label */}
            <div className="text-sm font-medium text-slate-500 text-center mb-2">
              Predicted Class
            </div>

            <div className="grid grid-cols-[auto_1fr_1fr] gap-3 items-center">
              {/* Column Headers */}
              <div /> {/* Empty top-left */}
              <div className="text-xs font-medium text-slate-500 text-center uppercase tracking-wider">Normal</div>
              <div className="text-xs font-medium text-slate-500 text-center uppercase tracking-wider">Failure</div>

              {/* Row 1 */}
              <div className="text-xs font-medium text-slate-500 flex items-center justify-end pr-2 uppercase tracking-wider h-24">Normal</div>
              <div className="w-32 h-24 bg-[#08306b] text-white flex items-center justify-center rounded-xl text-3xl font-bold shadow-sm ring-1 ring-black/5 relative group transition-all hover:scale-105 z-0 hover:z-10">
                {matrix.tn}
                <span className="absolute bottom-0 text-[10px] font-normal opacity-60">TN</span>
              </div>
              <div className="w-32 h-24 bg-white border border-slate-200 text-slate-700 flex items-center justify-center rounded-xl text-3xl font-bold shadow-sm relative group transition-all hover:scale-105 z-0 hover:z-10 hover:border-blue-300 hover:bg-blue-50">
                {matrix.fp}
                <span className="absolute bottom-0 text-[10px] font-normal opacity-40">FP</span>
              </div>

              {/* Row 2 */}
              <div className="text-xs font-medium text-slate-500 flex items-center justify-end pr-2 uppercase tracking-wider h-24">Failure</div>
              <div className="w-32 h-24 bg-white border border-slate-200 text-slate-700 flex items-center justify-center rounded-xl text-3xl font-bold shadow-sm relative group transition-all hover:scale-105 z-0 hover:z-10 hover:border-blue-300 hover:bg-blue-50">
                {matrix.fn}
                <span className="absolute bottom-0 text-[10px] font-normal opacity-40">FN</span>
              </div>
              <div className="w-32 h-24 bg-[#deebf7] text-slate-800 flex items-center justify-center rounded-xl text-3xl font-bold shadow-sm ring-1 ring-black/5 relative group transition-all hover:scale-105 z-0 hover:z-10">
                {matrix.tp}
                <span className="absolute bottom-0 text-[10px] font-normal opacity-60">TP</span>
              </div>
            </div>
          </div>
        </div>


      </div>

      <SimpleScatterPlot target={target} />
    </div>
  );
}

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
    name: "PatchTST",
    time: "训练+集成：30-120分钟（视预算）",
    metric: "MAPE≈3.5%（训练预算敏感）",
    explain: "取决于底座模型/解释组件",
    repro: "需固化训练配置与版本",
    delivery: "需工程化落地",
    badge: "Transformer/SOTA",
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
    patchtst: Math.round(truth * 1.05 + (isWeekend ? 50 : -20) + (Math.random() - 0.5) * 60), // PatchTST: Bias on weekends
    llm: Math.round(truth * 0.8 + 100 + (Math.random() - 0.5) * 80), // LLM: High variance
  };
});

const MOCK_CLF_COMPARISON_POINTS = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 10, 16 + i);
  // Normalize date to timestamp
  const timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  // Truth pattern
  const pattern = [null, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 1];
  const truth = pattern[i % pattern.length];

  // LimiX: Matches truth almost perfectly
  // Introduce 1 error
  const limix = (i === 15) ? (truth === 1 ? 0 : 1) : truth;

  // PatchTST: Some errors
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

const MOCK_MODEL_COMPARISON_AIR = (() => {
  const start = new Date("2024-03-25 00:00:00").getTime();
  const end = new Date("2024-03-31 23:00:00").getTime();
  const step = 3600 * 1000; // 1 hour
  const totalSteps = (end - start) / step + 1;

  // 1. Generate Truth Series first
  const truthSeries = [];
  for (let i = 0; i < totalSteps; i++) {
    const t = start + i * step;
    const d = new Date(t);
    const hour = d.getHours();
    const cycle = Math.sin((hour - 8) / 12 * Math.PI) * 0.5 + 0.5; // 0 to 1
    const base = 50 + cycle * 150; // 50 to 200
    const truth = Math.max(0, base + (Math.random() - 0.5) * 40);
    truthSeries.push({ t, truth });
  }

  // 2. Generate Model Predictions
  return truthSeries.map((item, i) => {
    const { t, truth } = item;
    const mean = 125;

    // LimiX: Lag + Underestimation ("delay" + "value not enough")
    // Use previous hour's truth to simulate delay
    const prevTruth = i > 0 ? truthSeries[i - 1].truth : truth;
    // Apply 0.9 factor to simulate "value not enough" (underestimation)
    const limix = prevTruth * 0.9 + (Math.random() - 0.5) * 20;

    // PatchTST: Simulate 3 error types
    let patchtst;
    if (i < totalSteps * 0.33) {
      // Phase 1: Trend correct but value wrong (Scale/Bias error)
      patchtst = truth * 1.3 + 30 + (Math.random() - 0.5) * 30;
    } else if (i < totalSteps * 0.66) {
      // Phase 2: Trend opposite (Inverse)
      patchtst = mean + (mean - truth) * 1.2 + (Math.random() - 0.5) * 30;
    } else {
      // Phase 3: Trend flat (Underfitting)
      patchtst = mean + (truth - mean) * 0.2 + (Math.random() - 0.5) * 20;
    }

    // DeepSeek: Simulate 3 error types (shifted phases)
    let llm;
    if (i < totalSteps * 0.33) {
      // Phase 1: Trend flat
      llm = mean + (truth - mean) * 0.15 + (Math.random() - 0.5) * 20;
    } else if (i < totalSteps * 0.66) {
      // Phase 2: Trend correct but value wrong (Underestimate)
      llm = truth * 0.6 - 20 + (Math.random() - 0.5) * 30;
    } else {
      // Phase 3: Trend opposite
      llm = mean + (mean - truth) * 0.8 + (Math.random() - 0.5) * 30;
    }

    return {
      date: t,
      truth: Math.max(0, truth),
      limix: Math.max(0, limix),
      patchtst: Math.max(0, patchtst),
      llm: Math.max(0, llm)
    };
  });
})();

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

function getRocData(target) {
  const seed = target.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  // Simulate a high-performance model (ROC curve hugs top-left corner)
  return MOCK_ROC_DATA.map(item => {
    if (item.fpr === 0) return { ...item, tpr: 0 };
    if (item.fpr === 1) return { ...item, tpr: 1 };

    // Base curve: steep rise
    // Using a power function: y = x^(1/k), k > 1 makes it convex (top-left)
    // Adjust k based on seed to give slight variety per target, but all "good"
    const k = 8 + (seed % 5);
    let baseTpr = Math.pow(item.fpr, 1 / k);

    // Add small smooth noise
    const noise = Math.sin(seed * item.fpr * 5) * 0.02;
    let newTpr = baseTpr + noise;

    // Ensure constraints
    newTpr = Math.max(item.fpr, Math.min(1, newTpr)); // Must be above diagonal
    if (item.fpr < 0.1 && newTpr < 0.5) newTpr = 0.5 + item.fpr * 2; // Boost early TPR

    return { ...item, tpr: newTpr };
  });
}

function getPrData(target) {
  const seed = target.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  // Simulate a high-performance model (PR curve stays high)
  return MOCK_PR_DATA.map(item => {
    if (item.recall === 0) return { ...item, precision: 1.0 };

    // High precision that drops slowly
    // Logic: Precision = 1 - (Recall)^k * factor
    const k = 3 + (seed % 3);
    let basePrec = 1 - Math.pow(item.recall, k) * 0.4; // Drops to ~0.6 at recall=1

    // Add small noise
    const noise = Math.cos(seed * item.recall * 8) * 0.03;
    let newPrec = basePrec + noise;

    newPrec = Math.max(0.5, Math.min(1, newPrec)); // Keep precision relatively high

    return { ...item, precision: newPrec };
  });
}

function cn(...args) {
  return args.filter(Boolean).join(" ");
}

function formatNum(n) {
  if (typeof n !== "number") return String(n);
  // if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  // if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return n.toLocaleString();
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

const MOCK_INFLUENCE_FACTORS_AIR = AIR_HEATMAP_FACTORS;

const MOCK_INFLUENCE_SCORES_AIR = [
  { name: "PT08.S3(NOx)", value: 1.7, desc: "氮氧化物传感器(NOx)" },
  { name: "NO2(GT)", value: 24.4, desc: "二氧化氮" },
  { name: "PT08.S4(NO2)", value: 53.4, desc: "二氧化氮传感器(NO2)" },
  { name: "C6H6(GT)", value: -37.3, desc: "苯" },
  { name: "PT08.S2(NMHC)", value: -40.9, desc: "非甲烷烃传感器(NMHC)" },
  { name: "PT08.S1(CO)", value: -50.3, desc: "一氧化碳传感器(CO)" },
  { name: "NMHC(GT)", value: -27, desc: "非甲烷烃" },
  { name: "CO(GT)", value: -0.1, desc: "一氧化碳" },
  { name: "PT08.S5(O3)", value: 27.9, desc: "臭氧传感器(O3)" },
  { name: "T", value: -77.3, desc: "温度" },
  { name: "RH", value: -77.8, desc: "相对湿度" },
  { name: "AH", value: -12.1, desc: "绝对湿度" }
];

const MOCK_FEATURE_META_AIR = {
  "PT08.S3(NOx)": { type: "number", range: [0, 2000] },
  "NO2(GT)": { type: "number", range: [0, 500] },
  "PT08.S4(NO2)": { type: "number", range: [0, 2000] },
  "CO(GT)": { type: "number", range: [0, 20] },
  "PT08.S1(CO)": { type: "number", range: [0, 2000] },
  "NMHC(GT)": { type: "number", range: [0, 1000] },
  "C6H6(GT)": { type: "number", range: [0, 100] },
  "PT08.S2(NMHC)": { type: "number", range: [0, 2000] },
  "PT08.S5(O3)": { type: "number", range: [0, 2000] },
  "T": { type: "number", range: [-20, 50] },
  "RH": { type: "number", range: [0, 100] },
  "AH": { type: "number", range: [0, 50] }
};

const MOCK_HEATMAP_DATES_AIR = Array.from({ length: AIR_HEATMAP_DATA.length }, (_, i) => {
  const d = new Date(2024, 2, 25, i); // Start from 2024-03-25 00:00
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`;
});

const MOCK_HEATMAP_MATRIX_AIR = AIR_HEATMAP_DATA;

const MOCK_INFLUENCE_FACTORS_MACHINE = MACHINE_HEATMAP_FACTORS;

const MOCK_INFLUENCE_SCORES_MACHINE = [
  { name: "Type", value: -155.4 },
  { name: "Rotational speed [rpm]", value: 128.6 },
  { name: "Process temperature [K]", value: -66.6 },
  { name: "Air temperature [K]", value: -51.4 },
  { name: "Tool wear [min]", value: -34.4 },
  { name: "Torque [Nm]", value: 29.0 },
  { name: "UDI", value: -28.4 }
];

const MOCK_FEATURE_META_MACHINE = {
  "UDI": { type: "number", range: [0, 10000] },
  "Type": { type: "category", options: ["L", "M", "H"] },
  "Air temperature [K]": { type: "number", range: [295, 305] },
  "Process temperature [K]": { type: "number", range: [305, 315] },
  "Rotational speed [rpm]": { type: "number", range: [1100, 2900] },
  "Torque [Nm]": { type: "number", range: [3, 80] },
  "Tool wear [min]": { type: "number", range: [0, 260] },
  "Machine failure": { type: "category", options: ["0", "1"] },
  "TWF": { type: "category", options: ["0", "1"] },
  "HDF": { type: "category", options: ["0", "1"] },
  "PWF": { type: "category", options: ["0", "1"] },
  "OSF": { type: "category", options: ["0", "1"] },
  "RNF": { type: "category", options: ["0", "1"] }
};

const MOCK_HEATMAP_DATES_MACHINE = Array.from({ length: MACHINE_HEATMAP_DATA.length }, (_, i) => `Sample #${i + 1}`);

const MOCK_HEATMAP_MATRIX_MACHINE = MACHINE_HEATMAP_DATA;



const MOCK_FEATURE_META = {
  "实时-日前偏差值_D-2_label": { type: "category", options: ["0 (偏差小)", "1 (偏差大)"] },
  "实时-日前偏差值_D-3_label": { type: "category", options: ["0 (偏差小)", "1 (偏差大)"] },
};

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

const FIELD_TRANSLATION_MAP = {
  "UDI": "唯一标识符",
  "Product ID": "产品ID",
  "Type": "类型",
  "Air temperature [K]": "空气温度 [K]",
  "Process temperature [K]": "过程温度 [K]",
  "Rotational speed [rpm]": "转速 [rpm]",
  "Torque [Nm]": "扭矩 [Nm]",
  "Tool wear [min]": "工具磨损 [min]",
  "Target": "目标",
  "Failure Type": "故障类型",
  "Machine failure": "机器故障",
  "TWF": "工具磨损故障",
  "HDF": "热耗散故障",
  "PWF": "功率故障",
  "OSF": "过应力故障",
  "RNF": "随机故障",
  "Date": "日期",
  "Time": "时间",
  "CO(GT)": "一氧化碳浓度",
  "PT08.S1(CO)": "传感器PT08.S1(CO)",
  "NMHC(GT)": "非甲烷烃浓度",
  "C6H6(GT)": "苯浓度",
  "PT08.S2(NMHC)": "传感器PT08.S2(NMHC)",
  "NOx(GT)": "氮氧化物浓度",
  "PT08.S3(NOx)": "传感器PT08.S3(NOx)",
  "NO2(GT)": "二氧化氮浓度",
  "PT08.S4(NO2)": "传感器PT08.S4(NO2)",
  "PT08.S5(O3)": "传感器PT08.S5(O3)",
  "T": "温度",
  "RH": "相对湿度",
  "AH": "绝对湿度"
};

const translateHeader = (key) => FIELD_TRANSLATION_MAP[key] || key;

const FIELD_NAME_MAP = {
  "CO(GT)": "一氧化碳",
  "PT08.S1(CO)": "一氧化碳传感器(CO)",
  "NMHC(GT)": "非甲烷烃",
  "C6H6(GT)": "苯",
  "PT08.S2(NMHC)": "非甲烷烃传感器(NMHC)",
  "NO2(GT)": "二氧化氮",
  "PT08.S4(NO2)": "二氧化氮传感器(NO2)",
  "PT08.S5(O3)": "臭氧传感器(O3)",
  "T": "温度",
  "RH": "相对湿度",
  "AH": "绝对湿度",
  "NOx(GT)": "氮氧化物",
  "PT08.S3(NOx)": "氮氧化物传感器(NOx)",

  // Machine Data
  "UDI": "唯一标识符",
  "Product ID": "产品ID",
  "Type": "类型",
  "Air temperature [K]": "空气温度 [K]",
  "Process temperature [K]": "过程温度 [K]",
  "Rotational speed [rpm]": "转速 [rpm]",
  "Torque [Nm]": "扭矩 [Nm]",
  "Tool wear [min]": "工具磨损 [min]",
  "Target": "目标",
  "Failure Type": "故障类型",
  "Machine failure": "机器故障",
  "TWF": "工具磨损故障",
  "HDF": "热耗散故障",
  "PWF": "功率故障",
  "OSF": "过应力故障",
  "RNF": "随机故障",
  "Date": "日期",
  "Time": "时间"
};

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

  // Logic for dynamic height to fit in one screen
  const MAX_HEIGHT = 500;
  const BASE_ROW_HEIGHT = 20; // Default h-5 equivalent

  const totalHeightNeeded = rows.length * BASE_ROW_HEIGHT;
  const shouldCompress = totalHeightNeeded > MAX_HEIGHT;

  // Calculate compressed row height, minimum 1px to be visible
  const rowHeight = shouldCompress ? Math.max(1, MAX_HEIGHT / rows.length) : BASE_ROW_HEIGHT;

  // Label sampling: ensure labels don't overlap (assuming ~12px per label)
  const LABEL_MIN_HEIGHT = 12;
  const labelStep = rowHeight < LABEL_MIN_HEIGHT ? Math.ceil(LABEL_MIN_HEIGHT / rowHeight) : 1;

  return (
    <div className="w-full relative">
      <div className="flex items-start">
        {/* Main Heatmap Area */}
        <div className="flex-1">
          <div className="w-full pr-4">
            <div className="grid" style={{ gridTemplateColumns: `110px repeat(${cols.length}, 1fr)` }}>
              {/* Data Rows */}
              {rows.map((r, i) => (
                <React.Fragment key={r}>
                  {/* Y-axis Label */}
                  <div
                    className="text-[10px] flex items-center justify-end pr-2 text-muted-foreground font-mono leading-none"
                    style={{ height: `${rowHeight}px` }}
                  >
                    {/* Show label only if it's the step */}
                    {(i % labelStep === 0) ? r.slice(5) : ""}
                  </div>
                  {/* Cells */}
                  {cols.map((c, j) => {
                    const v = matrix[i]?.[j] ?? 0;
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="w-full"
                        style={{ backgroundColor: getColor(v), height: `${rowHeight}px` }}
                        title={`${r} / ${FIELD_NAME_MAP[c] || c}: ${v.toFixed(2)}`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}

              {/* Footer Row (X-axis Labels) */}
              <div className="text-[10px] text-muted-foreground font-bold flex items-start pt-2 justify-end pr-2"></div>
              {cols.map((c) => (
                <div key={c} className="h-24 flex items-start justify-center pt-2 overflow-visible relative">
                  <div className="absolute top-2 left-1/2 text-[10px] text-muted-foreground whitespace-nowrap origin-top-left rotate-45 w-4">
                    {FIELD_NAME_MAP[c] || c}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm font-bold pl-[110px]">影响因子</div>
          </div>
        </div>

        {/* Color Scale Legend */}
        <div className="w-16 flex flex-col items-center ml-0 sticky right-0 top-0 pt-0">
          <div className="text-[10px] font-bold mb-1">2.0</div>
          <div className="w-4 rounded-full" style={{
            height: shouldCompress ? `${Math.min(MAX_HEIGHT, Math.max(200, rows.length * rowHeight))}px` : '16rem',
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
      if (datasetId === 'empty') return;
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
      <div className="w-full px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center">
          <div className="h-14 flex items-center justify-center">
            <img src="/stable_ai_logo.png" alt="Stable AI Logo" className="h-14 object-contain" />
          </div>
          <div className="w-px h-6 bg-slate-200 ml-2 -mr-[6px] relative z-10"></div>
          <div className="flex items-center gap-0.5">
            <div className="h-12 flex items-center justify-center">
              <img src="/limix_logo.png" alt="LimiX Logo" className="h-12 object-contain" />
            </div>
            <div className="pt-[3px]">
              <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 leading-8">通用数据分析平台</div>
            </div>
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
              <Select.Option key="empty" value="empty">
                -
              </Select.Option>
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
                    "group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm text-left transition-[transform,padding] duration-200 border",
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
                      "relative z-20 flex items-center justify-center w-6 h-6 rounded-lg text-[10px] font-bold border",
                      on
                        ? "border-white/20 bg-white/20 text-white shadow-inner backdrop-blur-sm"
                        : "border-slate-200 bg-slate-50 text-slate-600 group-hover:border-blue-200 group-hover:text-blue-600 group-hover:bg-white"
                    )}
                  >
                    {index + 1}
                  </div>
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-0", on ? "text-white" : "text-slate-400 group-hover:text-blue-600")} />
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
    <div className="fixed inset-0 z-[9999]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-0 p-4 flex items-center justify-center pointer-events-none">
        <Card className="rounded-2xl w-full max-w-3xl shadow-2xl pointer-events-auto bg-white">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-xs"></CardDescription>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}

function BatchUploadForm({ sceneId, onCancel, onConfirm }) {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const handleFileChange = (e, setFile) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e, setFile) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getPlaceholder = () => {
    if (!file1) {
      return "请输入数据集名称";
    }
    if (sceneId === "machine_predictive_maintenance_clf") {
      return "机器故障预测_LimiX";
    }
    if (sceneId === "air_quality_prediction") {
      return "空气质量预测_LimiX";
    }
    return "请输入数据集名称";
  };

  return (
    <div className="space-y-4">
      <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xs">
        提示：支持同时上传训练集和验证集，系统将自动进行关联分析。
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">文件 1 (训练集) <span className="text-red-500">*</span></label>
          <input
            type="file"
            ref={inputRef1}
            className="hidden"
            onChange={(e) => handleFileChange(e, setFile1)}
            accept=".csv,.xlsx,.xls,.json,.parquet"
          />
          <div
            className={`border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group ${file1 ? 'border-blue-300 bg-blue-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            onClick={() => inputRef1.current.click()}
            onDragEnter={preventDefaults}
            onDragOver={preventDefaults}
            onDragLeave={preventDefaults}
            onDrop={(e) => { preventDefaults(e); handleDrop(e, setFile1); }}
          >
            {file1 ? (
              <>
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-xs text-center px-2 font-medium text-blue-700 truncate max-w-[90%]">
                  {file1.name}
                </div>
                <div className="text-[10px] text-blue-400">{(file1.size / 1024).toFixed(1)} KB</div>
              </>
            ) : (
              <>
                <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white transition-colors">
                  <Upload className="h-5 w-5 text-slate-400" />
                </div>
                <div className="text-xs text-center px-2">点击上传<br />或拖拽文件</div>
              </>
            )
            }
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">文件 2 (验证集/测试集)</label>
          <input
            type="file"
            ref={inputRef2}
            className="hidden"
            onChange={(e) => handleFileChange(e, setFile2)}
            accept=".csv,.xlsx,.xls,.json,.parquet"
          />
          <div
            className={`border-2 border-dashed rounded-xl h-32 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer group ${file2 ? 'border-blue-300 bg-blue-50' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            onClick={() => inputRef2.current.click()}
            onDragEnter={preventDefaults}
            onDragOver={preventDefaults}
            onDragLeave={preventDefaults}
            onDrop={(e) => { preventDefaults(e); handleDrop(e, setFile2); }}
          >
            {file2 ? (
              <>
                <div className="bg-white p-2 rounded-full shadow-sm">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-xs text-center px-2 font-medium text-blue-700 truncate max-w-[90%]">
                  {file2.name}
                </div>
                <div className="text-[10px] text-blue-400">{(file2.size / 1024).toFixed(1)} KB</div>
              </>
            ) : (
              <>
                <div className="bg-slate-100 p-2 rounded-full group-hover:bg-white transition-colors">
                  <Upload className="h-5 w-5 text-slate-400" />
                </div>
                <div className="text-xs text-center px-2">点击上传<br />或拖拽文件</div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">数据集名称前缀</label>
        <Input placeholder={getPlaceholder()} className="rounded-xl" />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" className="rounded-xl" onClick={onCancel}>取消</Button>
        <Button className="rounded-xl" onClick={() => onConfirm(file1, file2)}>
          <Upload className="h-4 w-4 mr-2" />
          确认上传
        </Button>
      </div>
    </div>
  );
}

function readCsvFile(file) {
  return new Promise((resolve) => {
    // 【Demo Fix】: 针对 Excel 文件 (.xlsx) 的特殊处理
    // 由于纯前端环境未集成 xlsx 解析库，此处根据文件名自动映射到预置的 Mock 数据
    // 以确保演示效果流畅，避免二进制乱码。
    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      console.log("Detected Excel file, using mock data strategy:", file.name);

      // 1. 空气质量预测场景
      if (file.name.includes("空气") || file.name.includes("Air") || file.name.includes("Quality")) {
        return resolve({
          schema: MOCK_SCHEMA_AIR,
          rows: MOCK_PREVIEW_ROWS_AIR
        });
      }

      // 2. 机器故障预测场景
      if (file.name.includes("机器") || file.name.includes("Machine") || file.name.includes("Maintenance")) {
        return resolve({
          schema: MOCK_SCHEMA_MACHINE,
          rows: MOCK_PREVIEW_ROWS_MACHINE
        });
      }

      // 3. 其他场景 (默认 fallback)
      // 如果都不是，但为了演示不报错，返回一个通用的提示性数据
      return resolve({
        schema: [{ k: "Info", t: "String", desc: "提示" }],
        rows: [{ "Info": "当前演示环境仅支持 CSV 实时解析，Excel 文件已自动加载预置示例数据。" }]
      });
    }

    const processText = (text) => {
      const lines = text.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return resolve({ schema: [], rows: [] });

      const headers = lines[0].split(',').map(h => h.trim());
      const schema = headers.map(h => ({ k: h, t: 'String', desc: '自动推断' }));

      const rows = lines.slice(1).map((line, idx) => {
        const values = line.split(',');
        const row = { id: idx + 1 };
        headers.forEach((h, i) => {
          row[h] = values[i]?.trim();
        });
        return row;
      });

      resolve({ schema, rows });
    };

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // 简单启发式检测：如果包含大量替换字符，尝试用 GBK 重新读取
      // 注意：\uFFFD 是 UTF-8 解码失败时的替换字符
      if (text.includes('\uFFFD')) {
        const readerGBK = new FileReader();
        readerGBK.onload = (e2) => {
          processText(e2.target.result);
        };
        readerGBK.readAsText(file, 'GBK');
      } else {
        processText(text);
      }
    };
    // 读取文件的前 10MB，通常足够覆盖大部分演示用 CSV
    reader.readAsText(file.slice(0, 1024 * 1024 * 10));
  });
}

function DatasetsPanel({ datasetId, setDatasetId, notify, openModal, closeModal, datasets, setDatasets, sceneId }) {
  const dataset = datasets.find((d) => d.id === datasetId);
  const activeSchema = useMemo(() => {
    if (dataset && dataset.schema) return dataset.schema;
    if (sceneId === "machine_predictive_maintenance_clf") return MOCK_SCHEMA_MACHINE;
    if (sceneId === "sd_high_price_clf") return MOCK_SCHEMA_CLF;
    if (sceneId === "air_quality_prediction") return MOCK_SCHEMA_AIR;
    return MOCK_SCHEMA;
  }, [sceneId, dataset]);
  const isV2 = datasetId === "test_+5_v2" || (datasetId && datasetId.endsWith("v2"));

  // 过滤当前场景下的数据集
  const sceneDatasets = useMemo(() => {
    return datasets.filter(d => d.sceneId === sceneId);
  }, [datasets, sceneId]);

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
                  "批量上传数据文件",
                  <BatchUploadForm
                    sceneId={sceneId}
                    onCancel={() => {
                      notify("已取消", "未做更改");
                      closeModal();
                    }}
                    onConfirm={async (file1, file2) => {
                      if (!file1) {
                        alert("请至少上传训练集文件");
                        return;
                      }
                      closeModal();

                      notify("开始上传", `正在解析文件: ${file1.name}${file2 ? ` 和 ${file2.name}` : ''}...`);

                      const data1 = await readCsvFile(file1);
                      const data2 = file2 ? await readCsvFile(file2) : null;

                      notify("上传中", "已完成 45%...");
                      await new Promise(r => setTimeout(r, 800));
                      notify("上传中", "已完成 99%...");
                      await new Promise(r => setTimeout(r, 500));

                      const baseId = `custom_${Date.now()}`;
                      let newDataset1, newDataset2;

                      if (sceneId === "machine_predictive_maintenance_clf") {
                        newDataset1 = {
                          id: `${baseId}_train_machine`,
                          sceneId: sceneId,
                          name: file1.name.replace(/[-_]?v1/gi, ""),
                          version: "v1（训练集）",
                          rows: 1440,
                          cols: data1.schema.length || 10,
                          timeRange: "-",
                          owner: "设备部",
                          qualityScore: 85,
                          previewData: data1.rows,
                          schema: data1.schema
                        };
                        if (file2) {
                          newDataset2 = {
                            id: `${baseId}_test_machine`,
                            sceneId: sceneId,
                            name: file2.name.replace(/[-_]?v1/gi, ""),
                            version: "v1（测试集）",
                            rows: 672,
                            cols: data2?.schema.length || 10,
                            timeRange: "-",
                            owner: "设备部",
                            qualityScore: 88,
                            previewData: data2?.rows,
                            schema: data2?.schema
                          };
                        }
                      } else {
                        newDataset1 = {
                          id: `${baseId}_train`,
                          sceneId: sceneId,
                          name: file1.name,
                          version: "v1（训练集）",
                          rows: Math.floor(Math.random() * 5000) + 10000,
                          cols: data1.schema.length || 17,
                          timeRange: "2025-08-01 ~ 2026-01-01",
                          owner: "当前用户",
                          qualityScore: Math.floor(Math.random() * 20) + 60,
                          previewData: data1.rows,
                          schema: data1.schema
                        };
                        if (file2) {
                          newDataset2 = {
                            id: `${baseId}_test`,
                            sceneId: sceneId,
                            name: file2.name,
                            version: "v1（测试集）",
                            rows: Math.floor(Math.random() * 2000) + 3000,
                            cols: data2?.schema.length || 17,
                            timeRange: "2026-01-02 ~ 2026-02-01",
                            owner: "当前用户",
                            qualityScore: Math.floor(Math.random() * 20) + 60,
                            previewData: data2?.rows,
                            schema: data2?.schema
                          };
                        }
                      }

                      const newDatasets = [newDataset1];
                      if (newDataset2) newDatasets.push(newDataset2);

                      // 仅保留新上传的数据集，清空旧数据（模拟“只展示本次上传”）
                      // 注意：真实业务可能需要追加，这里按需求改为覆盖
                      setDatasets(prev => {
                        // 保留其他场景的数据，移除当前场景的旧数据
                        const otherSceneDatasets = prev.filter(d => d.sceneId !== sceneId);
                        return [...otherSceneDatasets, ...newDatasets];
                      });
                      setDatasetId(newDataset1.id);
                      notify("上传完成", `已上传 ${newDatasets.length} 个数据文件并自动选中训练集`);
                    }}
                  />
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

      {sceneDatasets.length === 0 || datasetId === 'empty' ? (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-20 flex flex-col items-center text-center text-muted-foreground">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
              <Database className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-lg font-medium text-slate-700 mb-2">暂无数据资产</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-8">
              当前场景下暂无数据文件，您可以点击右上角按钮上传本地文件或连接数据库。
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 文件列表切换区 */}
          <Card className="rounded-2xl bg-slate-50/50 border-dashed">
            <CardContent className="p-4">
              <div className="text-sm font-medium mb-3 text-slate-700 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                文件列表 (点击切换预览)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sceneDatasets.map(d => (
                  <div
                    key={d.id}
                    onClick={() => setDatasetId(d.id)}
                    className={`
                            relative p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                            ${d.id === datasetId
                        ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-md'
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                      }
                        `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-medium text-sm truncate text-slate-800" title={d.name}>{d.name}</div>
                      {d.id === datasetId && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                    </div>
                    <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 group-hover:bg-slate-200 transition-colors">{d.version}</span>
                      <span>{formatNum(d.rows)} 行</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">当前数据集概览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">


              <div className="grid md:grid-cols-2 gap-3">
                <Card className="rounded-2xl bg-slate-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center h-7 text-xs text-muted-foreground">数据集</div>
                    <div className="mt-2 font-semibold">{dataset?.name} · {dataset?.version}</div>
                  </CardContent>
                </Card>
                <Card className="rounded-2xl bg-slate-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-center h-7 text-xs text-muted-foreground">规模</div>
                    <div className="mt-2 font-semibold">{formatNum(dataset?.rows)} 行 · {dataset?.cols} 列</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="text-base font-semibold mb-3">字段字典（节选）</div>
                <div className="rounded-xl border bg-white overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-muted-foreground">
                        <th className="py-2.5 px-4 font-medium">字段</th>
                        <th className="py-2.5 px-4 font-medium">类型</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeSchema.map((s) => (
                        <tr key={s.k} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-4 font-mono text-slate-700">{translateHeader(s.k)}</td>
                          <td className="py-2.5 px-4 text-muted-foreground">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{s.t}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Data Preview Table */}
          <CleanedDataPreview datasetId={datasetId} datasets={datasets} />
        </>
      )}

    </div>
  );
}

function HealthPanel({ datasetId, notify, openModal, setActive, datasets, setDatasetId, sceneId }) {
  const sceneDatasets = useMemo(() => {
    return datasets.filter(d => d.sceneId === sceneId);
  }, [datasets, sceneId]);

  const currentDataset = datasets.find(d => d.id === datasetId);
  const isV2 = (datasetId && datasetId.endsWith("v2")) || currentDataset?.version?.includes("v2") || currentDataset?.name?.includes("V2");
  const isClf = (datasetId && datasetId.includes("clf")) || (datasetId && datasetId.includes("machine")) || sceneId.includes("clf");

  const base = isV2 ? HEALTH_V2 : (isClf ? HEALTH_CLF : HEALTH_V1);
  const [health, setHealth] = useState(base);
  const [running, setRunning] = useState(false);
  const [lastRunAt, setLastRunAt] = useState(null);
  const [resolved, setResolved] = useState(() => new Set());

  const [tsnePoints, setTsnePoints] = useState([]);
  const [tsneStatus, setTsneStatus] = useState("idle");

  // 进入数据评估模块时滚动到页面顶部
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const isMachine = sceneId === "machine_predictive_maintenance_clf" || (datasetId && datasetId.includes("machine"));
  const activeSchema = currentDataset?.schema || (isMachine ? MOCK_SCHEMA_MACHINE : (isClf ? MOCK_SCHEMA_CLF : MOCK_SCHEMA));
  const activeRows = currentDataset?.previewData || (isMachine ? MOCK_PREVIEW_ROWS_MACHINE : (isClf ? MOCK_PREVIEW_ROWS_CLF_V1 : (isV2 ? MOCK_PREVIEW_ROWS_V2.slice(0, 10) : MOCK_PREVIEW_ROWS.slice(0, 10))));

  const visualRows = useMemo(() => {
    if (!activeRows || activeRows.length === 0) return [];

    // Deep clone first 10 rows to avoid mutating source
    const rows = activeRows.slice(0, 10).map(r => ({ ...r }));

    // 强制注入数据质量问题（3个缺失值，1个异常值）
    // 为了保证展示效果，我们选择特定的位置注入，覆盖所有数据源情况

    const keys = Object.keys(rows[0]).filter(k => k !== 'id' && k !== 'UDI' && k !== 'Time' && k !== 'date' && k !== 'label' && !k.endsWith('_label'));

    if (keys.length > 0) {
      // 1. 注入 1 个异常值 (Row 1, Last Numeric Column)
      const outlierKey = keys.length > 1 ? keys[1] : keys[0];
      rows[0][outlierKey] = 9999;

      // 2. 注入 3 个缺失值 (Row 3, 5, 7)
      // 确保不覆盖同一个位置
      rows[2][keys[0]] = null;
      rows[4][keys[1 % keys.length]] = null;
      rows[6][keys[2 % keys.length]] = null;
    }

    return rows;
  }, [activeRows]);

  // 计算 UMAP
  useEffect(() => {
    // 如果没有 datasetId，则尝试找默认的 machine dataset
    let targetDataset = currentDataset;

    if (!targetDataset) {
      // 尝试寻找 "机器预测性维护训练集"
      targetDataset = datasets.find(d => d.name.includes("机器预测性维护训练集") || d.id.includes("machine"));
    }

    // 如果还是没找到，就没办法计算了
    if (!targetDataset) {
      // Fallback: use REAL_MACHINE_DATA if accessible, but we need numeric conversion
      // 这里暂时不处理完全找不到的情况，因为默认会有 Mock 数据
      return;
    }

    // 获取数据源
    // 注意：dataset 对象里可能有 previewData (只有几行) 或者我们需要从 real_data 拿完整数据?
    // 现在的 mock 逻辑里，REAL_MACHINE_DATA 是在 real_data.js 里的，LimiPreview 里有 import
    // 但是 dataset 对象本身可能只存了 previewData (前10行)
    // 我们需要判断一下。如果是 "机器预测性维护训练集"，我们可以用 REAL_MACHINE_DATA

    let rawData = [];
    if (targetDataset.id.includes("machine") || targetDataset.sceneId === "machine_predictive_maintenance_clf") {
      // 复用切分逻辑以保持一致
      if (targetDataset.id === "test_machine_v1" || (targetDataset.id.includes("train") && targetDataset.id.includes("machine"))) {
        rawData = REAL_MACHINE_DATA.slice(0, 1440);
      } else if (targetDataset.id === "test_machine_test_v1" || (targetDataset.id.includes("test") && targetDataset.id.includes("machine"))) {
        rawData = REAL_MACHINE_DATA.slice(1440, 1440 + 672);
      } else {
        rawData = REAL_MACHINE_DATA;
      }
    } else if (targetDataset.id.includes("sd_price") || targetDataset.sceneId === "sd_price") {
      rawData = REAL_PRICE_DATA;
    } else if (targetDataset.id.includes("clf") || targetDataset.sceneId === "sd_high_price_clf") {
      rawData = REAL_CLF_DATA;
    } else {
      // 对于自定义上传的，我们可能只有 previewData... 
      // 但按照题意 "选定的数据文件不低于1000行样本的取前1000行处理"
      // 如果是自定义上传，我们在 BatchUploadForm 里读取了全部 content 到 previewData (mock logic actually stored all rows in previewData for uploaded files? let's check BatchUploadForm logic... yes, it stores all rows in previewData)
      rawData = targetDataset.previewData || [];
    }

    if (!rawData || rawData.length === 0) return;

    setTsneStatus("running");

    // 异步执行以免阻塞 UI
    setTimeout(() => {
      try {
        // 1. 数据预处理：选定的数据文件不低于1500行样本的取前1500行处理，小于1500行样本的按实际样本数处理
        const limit = 1500;
        const slicedData = rawData.length > limit ? rawData.slice(0, limit) : rawData;

        // 2. 提取数值特征
        // 我们需要自动识别数值列。
        // 简单的 heuristic: 遍历第一行，看哪些 value 是 number
        if (slicedData.length === 0) {
          setTsneStatus("error");
          return;
        }

        const firstRow = slicedData[0];
        const numericKeys = Object.keys(firstRow).filter(k => {
          const val = firstRow[k];
          return typeof val === 'number' && !isNaN(val) && k !== 'UDI' && k !== 'id'; // 排除 ID
        });

        if (numericKeys.length < 2) {
          // 特征太少，无法降维
          setTsneStatus("error");
          return;
        }

        // 构建数组
        const dataForUmap = slicedData.map(row => numericKeys.map(k => {
          const val = Number(row[k]);
          return isNaN(val) ? 0 : val;
        }));

        // 3. 运行 UMAP
        const umap = new UMAP({
          nNeighbors: 15,
          minDist: 0.1,
          nComponents: 2,
        });

        const embedding = umap.fit(dataForUmap);

        // 4. 转换结果
        const points = embedding.map((p, i) => ({
          id: i,
          x: p[0],
          y: p[1],
          // 尝试保留一个分类用于着色（如果有）
          cluster: slicedData[i].Target ?? slicedData[i].label ?? 0
        }));

        setTsnePoints(points);
        setTsneStatus("done");

      } catch (e) {
        console.error("UMAP error", e);
        setTsneStatus("error");
      }
    }, 100);

  }, [datasetId, datasets, sceneId]);

  useEffect(() => {
    const ds = datasets.find(d => d.id === datasetId);
    const v2 = (datasetId && datasetId.endsWith("v2")) || ds?.version?.includes("v2") || ds?.name?.includes("V2");
    const clf = (datasetId && datasetId.includes("clf")) || (datasetId && datasetId.includes("machine")) || sceneId.includes("clf");

    setHealth(v2 ? HEALTH_V2 : (clf ? HEALTH_CLF : HEALTH_V1));
    setResolved(new Set());
    setLastRunAt(null);
  }, [datasetId, datasets, sceneId]);

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
      notify("体检完成", `已生成体检报告（${(datasetId || "").includes("v2") ? "v2" : "v1"}）。你可以继续生成清洗方案。`);
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

  const summaryView = useMemo(() => {
    return (health?.summary || []).filter((m) => m.name !== "口径不一致");
  }, [health?.summary]);

  // 动态计算统计信息 helper
  const getColStats = (colKey) => {
    // 优先尝试获取全量真实数据（仅限机器预测维护场景）
    let fullData = null;
    if (datasetId && (datasetId.includes("machine") || sceneId === "machine_predictive_maintenance_clf")) {
      // 根据数据集 ID 切分真实数据，确保统计值与展示行数一致
      if (datasetId === "test_machine_v1" || (datasetId && datasetId.includes("train") && datasetId.includes("machine"))) {
        fullData = REAL_MACHINE_DATA.slice(0, 1440); // 训练集 1440 行
      } else if (datasetId === "test_machine_test_v1" || (datasetId && datasetId.includes("test") && datasetId.includes("machine"))) {
        fullData = REAL_MACHINE_DATA.slice(1440, 1440 + 672); // 测试集 672 行
      } else {
        fullData = REAL_MACHINE_DATA; // 清洗后/默认使用全量 8000 行
      }
    } else if (datasetId && (datasetId.includes("clf") || sceneId === "sd_high_price_clf")) {
      fullData = REAL_CLF_DATA; // 749行
    }

    // 如果有全量数据，使用全量数据计算
    if (fullData && fullData.length > 0) {
      let missingCount = 0;
      const values = new Set();
      fullData.forEach(row => {
        const val = row[colKey];
        if (val === null || val === undefined || val === "" || val === "NaN") {
          missingCount++;
        } else {
          values.add(val);
        }
      });

      const missingRate = ((missingCount / fullData.length) * 100).toFixed(1) + "%";
      const uniqueCount = values.size;
      return { unique: uniqueCount, missing: missingRate };
    }

    // 如果是 Mock 数据且有预设统计值，优先使用预设值（为了展示效果更真实，因为 Preview 只有 10 行）
    if (datasetId && !datasetId.startsWith("custom_") && MOCK_PREVIEW_STATS[colKey]) {
      return MOCK_PREVIEW_STATS[colKey];
    }

    // 否则根据 visualRows 实时计算 (Fallback)
    if (!visualRows || visualRows.length === 0) return { unique: "-", missing: "-" };

    let missingCount = 0;
    const values = new Set();
    visualRows.forEach(row => {
      const val = row[colKey];
      if (val === null || val === undefined || val === "" || val === "NaN") {
        missingCount++;
      } else {
        values.add(val);
      }
    });

    const missingRate = ((missingCount / visualRows.length) * 100).toFixed(1) + "%";
    const uniqueCount = values.size;
    return { unique: uniqueCount, missing: missingRate };
  };

  return (
    <div className="space-y-4">
      <SectionTitle
        icon={Stethoscope}
        title="数据评估"
        right={
          <div className="flex items-center gap-2">

          </div>
        }
      />

      <Card className="rounded-2xl bg-slate-50/50 border-dashed">
        <CardContent className="p-4">
          <div className="text-sm font-medium mb-3 text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            文件列表 (点击切换预览)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sceneDatasets.map(d => (
              <div
                key={d.id}
                onClick={() => setDatasetId(d.id)}
                className={`
                            relative p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                            ${d.id === datasetId
                    ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-md'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }
                        `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm truncate text-slate-800" title={d.name}>{d.name}</div>
                  {d.id === datasetId && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                </div>
                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 group-hover:bg-slate-200 transition-colors">{d.version}</span>
                  <span>{d.rows.toLocaleString()} 行</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-3">
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
                  {activeSchema.map((col) => {
                    const stats = getColStats(col.k);
                    const isTime = col.k.includes("时间") || col.k.toLowerCase().includes("time") || col.k.toLowerCase().includes("date");
                    const isZeroMissing = stats.missing === "0%" || stats.missing === "0.0%";

                    return (
                      <th key={col.k} className="p-2 text-left min-w-[140px] align-bottom bg-muted/30 last:rounded-tr-xl last:rounded-br-xl">
                        <div className="flex flex-col gap-1 pb-1">
                          <div className="flex flex-col gap-1 w-fit">
                            <Badge
                              variant="destructive"
                              className="rounded-md px-2 py-0 text-[10px] h-5 flex justify-between gap-2 min-w-[96px]"
                            >
                              <span>缺失:</span>
                              <span className="font-mono">{stats.missing}</span>
                            </Badge>
                            <Badge variant="secondary" className="rounded-md px-2 py-0 text-[10px] h-5 bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 border flex justify-between gap-2 min-w-[96px]">
                              <span>唯一值:</span>
                              <span className="font-mono">{stats.unique}</span>
                            </Badge>
                          </div>
                          {(() => {
                            const isSeq = col.k.includes("序号") || col.k.toLowerCase().includes("id") || col.k === "UDI";

                            let showMetrics = false;
                            let mean = 0;
                            let variance = 0;

                            // 优先尝试获取全量真实数据（仅限机器预测维护场景）
                            let fullData = null;
                            if (datasetId && (datasetId.includes("machine") || sceneId === "machine_predictive_maintenance_clf")) {
                              // 复用切分逻辑
                              if (datasetId === "test_machine_v1" || (datasetId && datasetId.includes("train") && datasetId.includes("machine"))) {
                                fullData = REAL_MACHINE_DATA.slice(0, 1440);
                              } else if (datasetId === "test_machine_test_v1" || (datasetId && datasetId.includes("test") && datasetId.includes("machine"))) {
                                fullData = REAL_MACHINE_DATA.slice(1440, 1440 + 672);
                              } else {
                                fullData = REAL_MACHINE_DATA;
                              }
                            } else if (datasetId && (datasetId.includes("clf") || sceneId === "sd_high_price_clf")) {
                              fullData = REAL_CLF_DATA;
                            }

                            if (!isSeq && !isTime) {
                              // 如果有全量数据，使用全量数据计算均值方差
                              const dataToUse = (fullData && fullData.length > 0) ? fullData : visualRows;

                              const validVals = dataToUse
                                .map(r => parseFloat(r[col.k]))
                                .filter(v => !isNaN(v));

                              if (validVals.length > 0) {
                                showMetrics = true;
                                mean = validVals.reduce((a, b) => a + b, 0) / validVals.length;
                                variance = validVals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / validVals.length;
                              }
                            }

                            if (showMetrics) {
                              return (
                                <div className="flex flex-col gap-1 w-fit">
                                  <Badge variant="secondary" className="rounded-md px-2 py-0 text-[10px] h-5 bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 border flex justify-between gap-2 min-w-[96px]">
                                    <span>均值:</span>
                                    <span className="font-mono">{mean.toPrecision(4)}</span>
                                  </Badge>
                                  <Badge variant="secondary" className="rounded-md px-2 py-0 text-[10px] h-5 bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200 border flex justify-between gap-2 min-w-[96px]">
                                    <span>方差:</span>
                                    <span className="font-mono">{variance.toPrecision(4)}</span>
                                  </Badge>
                                </div>
                              );
                            } else {
                              // 缺省展示，保持高度一致
                              return (
                                <div className="flex flex-col gap-1 w-fit">
                                  <Badge variant="secondary" className="rounded-md px-2 py-0 text-[10px] h-5 bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 border flex justify-between gap-2 min-w-[96px]">
                                    <span>均值:</span>
                                    <span className="font-mono">-</span>
                                  </Badge>
                                  <Badge variant="secondary" className="rounded-md px-2 py-0 text-[10px] h-5 bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200 border flex justify-between gap-2 min-w-[96px]">
                                    <span>方差:</span>
                                    <span className="font-mono">-</span>
                                  </Badge>
                                </div>
                              );
                            }
                          })()}
                          <div className="mt-1 font-semibold text-slate-700 whitespace-nowrap">{translateHeader(col.k)}</div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visualRows.slice(0, 10).map((row, i) => (
                  <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
                    {activeSchema.map((col) => {
                      const val = row[col.k];
                      const isNaN = val === "NaN" || val === null || val === undefined || val === "";
                      const isOutlier = val === 123456.78 || val === -999.99 || val === 9999;

                      return (
                        <td key={col.k} className={`p-3 ${isOutlier ? "bg-orange-100" : ""}`}>
                          {isNaN ? (
                            <span className="text-red-500 font-medium bg-red-50 px-1.5 py-0.5 rounded text-xs">NaN</span>
                          ) : (
                            <span className={`font-mono text-xs ${isOutlier ? "text-orange-700 font-bold" : "text-slate-600"}`}>{val}</span>
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

      <Card className="rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-base">数据分布特征</CardTitle>
          </div>
          <CardDescription>
            {sceneId === "air_quality_prediction"
              ? "展示各污染物浓度随时间的变化趋势。"
              : "将高维数据映射到二维平面，每一个点代表一行数据。（坐标轴无实际物理意义）"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full relative">
            {tsneStatus === "running" && (
              <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-slate-500">正在计算 UMAP 分布...</span>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%">
              {sceneId === "air_quality_prediction" ? (
                <LineChart data={MOCK_AIR_QUALITY_TRENDS} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="Time"
                    tickFormatter={(v) => v ? v.slice(5, 16) : v}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    minTickGap={30}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="CO(GT)" stroke="#8884d8" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="NMHC(GT)" stroke="#82ca9d" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="C6H6(GT)" stroke="#ffc658" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="NOx(GT)" stroke="#ff7300" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="NO2(GT)" stroke="#387908" dot={false} strokeWidth={2} />
                </LineChart>
              ) : (
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Dim 1"
                    unit=""
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Dim 2"
                    unit=""
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border rounded shadow-lg text-xs">
                          <p className="font-semibold mb-1">样本 #{data.id}</p>
                          <p className="text-slate-400">Dim 1: {data.x.toFixed(2)}</p>
                          <p className="text-slate-400">Dim 2: {data.y.toFixed(2)}</p>
                          {data.cluster !== undefined && <p className="text-slate-600 mt-1 font-medium">Label: {data.cluster}</p>}
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Scatter name="Samples" data={tsnePoints}>
                    {tsnePoints.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.cluster == 1 ? "#ef4444" : "#3b82f6"}
                        fillOpacity={0.6}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

function CleanedDataPreview({ datasetId, datasets }) {
  // 安全获取数据逻辑
  const safeId = datasetId || "";
  const isClf = safeId.startsWith("test_clf");

  // 尝试从 datasets 中获取当前选中数据集
  const currentDataset = datasets ? datasets.find(d => d.id === datasetId) : null;

  // 优先使用 datasets 中的数据，如果不存在则降级到 Mock 数据
  let activeSchema, activeRows;

  if (currentDataset && currentDataset.schema && currentDataset.previewData) {
    activeSchema = currentDataset.schema;
    activeRows = currentDataset.previewData;
  } else {
    // 确保引用的是文件顶部定义的全局变量
    // 如果这些变量未定义，给予默认空数组以防崩溃
    activeSchema = isClf ? (typeof MOCK_SCHEMA_CLF !== 'undefined' ? MOCK_SCHEMA_CLF : []) : (typeof MOCK_SCHEMA !== 'undefined' ? MOCK_SCHEMA : []);
    activeRows = isClf ? (typeof MOCK_PREVIEW_ROWS_CLF_V1 !== 'undefined' ? MOCK_PREVIEW_ROWS_CLF_V1 : []) : (typeof MOCK_PREVIEW_ROWS_V2 !== 'undefined' ? MOCK_PREVIEW_ROWS_V2 : []);
  }

  // 严格检查
  if (!Array.isArray(activeSchema) || !Array.isArray(activeRows)) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-4 text-center text-muted-foreground text-sm">
          数据格式异常，无法预览
        </CardContent>
      </Card>
    );
  }

  if (activeRows.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-4 text-center text-muted-foreground text-sm">
          暂无清洗后数据
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-base">数据预览（节选）</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left min-w-[60px] align-bottom bg-muted/30 first:rounded-tl-xl first:rounded-bl-xl">
                  <div className="font-semibold text-slate-700 whitespace-nowrap">序号</div>
                </th>
                {activeSchema.map((col, idx) => (
                  <th key={col.k || idx} className="p-2 text-left min-w-[140px] align-bottom bg-muted/30 last:rounded-tr-xl last:rounded-br-xl">
                    <div className="font-semibold text-slate-700 whitespace-nowrap">{translateHeader(col.k) || "未知列"}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeRows.slice(0, 10).map((row, i) => (
                <tr key={i} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="p-3 text-muted-foreground font-mono text-xs">{i + 1}</td>
                  {activeSchema.map((col, idx) => (
                    <td key={col.k || idx} className="p-3">
                      <span className="font-mono text-xs text-slate-600">
                        {/* 极度防御性编程：确保不报错 */}
                        {row && typeof row === 'object' ? String(row[col.k] ?? "") : ""}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function CleanPanel({ datasetId, setDatasetId, notify, openModal, datasets, setDatasets, sceneId }) {
  const [generated, setGenerated] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasCleaned, setHasCleaned] = useState(false);
  const cleaningRef = useRef(false);

  // 过滤当前场景下的数据集
  const sceneDatasets = useMemo(() => {
    return datasets.filter(d => d.sceneId === sceneId);
  }, [datasets, sceneId]);

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
            // Mock cleaning logic: simple fill for preview data
            const cleanedPreviewData = current.previewData ? current.previewData.map(row => {
              const newRow = { ...row };
              Object.keys(newRow).forEach(k => {
                // 清洗缺失值：将空值、null、undefined、NaN 填充为合理值
                const val = newRow[k];
                if (val === "" || val === null || val === undefined || val === "NaN" || val === "null") {
                  // 根据字段类型填充不同的默认值
                  if (k.includes("temperature") || k.includes("Temperature")) {
                    newRow[k] = 300; // 温度默认值
                  } else if (k.includes("speed") || k.includes("Speed") || k.includes("rpm")) {
                    newRow[k] = 1400; // 转速默认值
                  } else if (k.includes("Torque") || k.includes("扭矩")) {
                    newRow[k] = 40; // 扭矩默认值
                  } else if (k.includes("wear") || k.includes("Wear")) {
                    newRow[k] = 100; // 磨损默认值
                  } else if (k === "CO(GT)") {
                    newRow[k] = 1.5; // 一氧化碳默认值
                  } else if (k === "RH") {
                    newRow[k] = 55; // 相对湿度默认值
                  } else if (k.includes("PT08")) {
                    newRow[k] = 1200; // 传感器默认值
                  } else {
                    newRow[k] = 0; // 其他默认填0
                  }
                }
                // 清洗异常值：将 9999 替换为合理值
                if (val === 9999) {
                  if (k.includes("speed") || k.includes("Speed") || k.includes("rpm")) {
                    newRow[k] = 1450; // 转速正常值
                  } else if (k === "NMHC(GT)") {
                    newRow[k] = 95; // 非甲烷烃正常值
                  } else {
                    newRow[k] = 100; // 其他异常值替换为100
                  }
                }
              });
              return newRow;
            }) : [];

            const newDataset = {
              ...current,
              id: newId,
              name: current.name.replace(/V1.*$/, 'V2-清洗后.csv'),
              version: "v2（清洗后）",
              qualityScore: 88 + Math.floor(Math.random() * 10),
              previewData: cleanedPreviewData
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
        title="数据治理"
        right={
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button className="rounded-2xl" onClick={applyToV2} disabled={!generated || applying || hasCleaned}>
              {applying ? "清洗中…" : hasCleaned ? "已清洗" : "一键清洗"}
            </Button>
          </div>
        }
      />

      {/* 文件列表切换区 */}
      <Card className="rounded-2xl bg-slate-50/50 border-dashed">
        <CardContent className="p-4">
          <div className="text-sm font-medium mb-3 text-slate-700 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            文件列表 (点击切换预览)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sceneDatasets.map(d => (
              <div
                key={d.id}
                onClick={() => setDatasetId(d.id)}
                className={`
                            relative p-3 rounded-xl border cursor-pointer transition-all duration-200 group
                            ${d.id === datasetId
                    ? 'bg-white border-blue-500 ring-2 ring-blue-100 shadow-md'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                  }
                        `}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm truncate text-slate-800" title={d.name}>{d.name}</div>
                  {d.id === datasetId && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />}
                </div>
                <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 group-hover:bg-slate-200 transition-colors">{d.version}</span>
                  <span>{d.rows.toLocaleString()} 行</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2">
        <Badge className="rounded-xl" variant={isV2 ? "secondary" : "outline"}>
          当前数据：{isV2 ? "v2（清洗后）" : "v1"}
        </Badge>
        {/* <Badge className="rounded-xl" variant={generated ? "secondary" : "outline"}>
          策略状态：{generated ? "已生成" : "未生成"}
        </Badge> */}
      </div>

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center space-y-0 gap-6 py-4">
          <CardTitle className="text-base shrink-0">规则清单</CardTitle>
          <div className="flex flex-wrap gap-3">
            {MOCK_CLEAN_RULES.map((r) => (
              <div key={r.id} className="px-3 py-1.5 rounded-lg border flex items-center gap-2 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <Badge className="rounded px-1.5 h-5 flex items-center justify-center bg-white shadow-sm text-[10px] font-mono" variant="outline">
                  {r.id}
                </Badge>
                <div className="font-medium text-sm text-slate-700">{r.name}</div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>

      {(hasCleaned || isV2) ? (
        <CleanedDataPreview datasetId={datasetId} datasets={datasets} />
      ) : (
        <Card className="rounded-2xl border-dashed">
          <CardContent className="py-12 flex flex-col items-center text-center text-muted-foreground">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-700 mb-1">等待执行清洗</h3>
            <p className="text-xs max-w-xs mx-auto">请点击右上角“一键清洗”按钮，系统将自动应用规则并生成清洗后的数据预览。</p>
          </CardContent>
        </Card>
      )}

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

function TaskProgressModal({ open, tasks, onClose, isFastForwarding }) {
  const getDurationDisplay = (durationStr) => {
    // Input: "123s", "6.4s", "725.4s"
    if (!durationStr || typeof durationStr !== 'string') return "-";
    const seconds = parseFloat(durationStr.replace('s', ''));
    if (isNaN(seconds)) return durationStr;

    if (seconds >= 60) {
      const mins = (seconds / 60).toFixed(1);
      return `${mins}分钟`;
    } else {
      return `${seconds}s`;
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-[600px] max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200 relative overflow-hidden">
        {isFastForwarding && (
          <div className="absolute inset-0 z-50 bg-white/10 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="bg-blue-600/90 p-6 rounded-full shadow-2xl animate-pulse">
              <FastForward className="w-12 h-12 text-white fill-white" />
            </div>
            <div className="mt-4 text-2xl font-bold text-blue-700 drop-shadow-sm">加速中</div>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between border-b py-3">
          <CardTitle className="text-base">任务运行进度</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto p-4 space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="space-y-1.5">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{task.taskType}</span>
                  <Badge variant="outline" className="text-xs h-5 px-1.5 font-normal text-muted-foreground">
                    {FIELD_NAME_MAP[task.target] || task.target}
                  </Badge>
                  <Badge variant="secondary" className="text-xs h-5 px-1.5">
                    {task.modelName}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {task.duration && <span className="text-muted-foreground">耗时: {getDurationDisplay(task.duration)}</span>}
                  <span className={`font-medium ${task.status === '已完成' ? 'text-green-600' : 'text-blue-600'}`}>
                    {task.status}
                  </span>
                  <span className="text-muted-foreground font-mono w-9 text-right">{task.progress.toFixed(0)}%</span>
                </div>
              </div>
              <Progress value={task.progress} className={`h-1.5 ${task.status === '已完成' ? 'bg-green-100' : ''}`} indicatorClassName={task.status === '已完成' ? 'bg-green-500' : ''} />
            </div>
          ))}
          {tasks.length === 0 && <div className="text-center text-muted-foreground py-8">暂无运行中的任务</div>}
        </CardContent>
        <div className="p-3 border-t bg-slate-50/50 flex justify-end">
          <Button onClick={onClose} size="sm" variant={tasks.every(t => t.status === '已完成') ? "default" : "outline"}>
            {tasks.every(t => t.status === '已完成') ? "关闭" : "后台运行"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function TasksPanel({ quickMode, runs, setRuns, notify, sceneId, datasetId, setDatasetId, datasets, openModal, initialTab = "tasks" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync internal state if initialTab changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const [type, setType] = useState(undefined);
  const [targets, setTargets] = useState([]);
  const [running, setRunning] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedModels, setSelectedModels] = useState(["limix", "patchtst", "deepseek"]);
  const [timeColumn, setTimeColumn] = useState("");
  const [showProgress, setShowProgress] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [progressTasks, setProgressTasks] = useState([]);
  const [selectedDatasetIds, setSelectedDatasetIds] = useState([]);

  // Refs for timing logic
  const limixFinishTimeRef = useRef(null);
  const fastForwardStartTimeRef = useRef(null);

  const currentScene = SCENES.find(s => s.id === sceneId);

  // 过滤当前场景下的数据集
  const sceneDatasets = useMemo(() => {
    return datasets.filter(d => d.sceneId === sceneId);
  }, [datasets, sceneId]);

  // 不再自动选中数据版本，让用户手动选择
  // useEffect(() => {
  //   if (datasetId) {
  //     setSelectedDatasetIds([datasetId]);
  //   }
  // }, [datasetId]);



  const models = [
    {
      id: "limix",
      name: "LimiX",
      badges: [
        { text: "数据大模型", variant: "secondary" }
      ],
      desc: "LimiX自研结构化数据大模型，支持多种任务",
      meta: "大小: 78.9MB   支持任务: classification, regression, forecasting",
      tags: []
    },
    {
      id: "patchtst",
      name: "PatchTST",
      badges: [
        { text: "Transformer", variant: "secondary" }
      ],
      desc: "普林斯顿大学与 IBM 研究院联合研发的时序 Transformer 模型。",
      meta: "大小: 120MB   支持任务: forecasting",
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
    // Priority: Scene check > Dataset Schema
    // This ensures we always show the full feature list for air quality scene
    // even if the dataset object has a limited schema
    if (sceneId === "air_quality_prediction") {
      return MOCK_SCHEMA_AIR.map(c => c.k);
    }
    if (currentDataset?.schema) {
      return currentDataset.schema.map(c => c.k);
    }
    if (sceneId === "sd_high_price_clf") {
      return MOCK_SCHEMA_CLF.map(c => c.k);
    } else {
      return MOCK_SCHEMA.map(c => c.k);
    }
  }, [currentDataset, sceneId]);

  useEffect(() => {
    if (columns.length > 0) {
      // Ensure targets are valid
      const validTargets = targets.filter(t => columns.includes(t));

      if (validTargets.length !== targets.length) {
        setTargets(validTargets);
      }

      // Ensure timeColumn is valid
      if (!timeColumn || !columns.includes(timeColumn)) {
        // Default to 'Time' if exists, else first column
        const defaultTime = columns.includes('Time') ? 'Time' : columns[0];
        setTimeColumn(defaultTime);
      }
    }
  }, [columns]);

  useEffect(() => {
    // Reset selection when dataset changes
    const validCols = columns.filter(c => !targets.includes(c) && (type !== '时序预测' || c !== timeColumn));
    setSelectedFeatures(validCols);
  }, [datasetId, sceneId]); // Only reset on dataset/scene change

  useEffect(() => {
    // When targets/time/type changes, remove invalid columns from selection (but keep others)
    setSelectedFeatures(prev => prev.filter(c => !targets.includes(c) && (type !== '时序预测' || c !== timeColumn)));
  }, [targets, timeColumn, type]);

  const getDurationDisplay = (durationStr) => {
    // Input: "123s", "6.4s", "725.4s"
    if (!durationStr || typeof durationStr !== 'string') return "-";
    const seconds = parseFloat(durationStr.replace('s', ''));
    if (isNaN(seconds)) return durationStr;

    if (seconds >= 60) {
      const mins = (seconds / 60).toFixed(1);
      return `${mins}分钟`;
    } else {
      return `${seconds}s`;
    }
  };

  useEffect(() => {
    if (!showProgress) {
      // Reset timing refs when modal closes or starts
      limixFinishTimeRef.current = null;
      fastForwardStartTimeRef.current = null;
      setIsFastForwarding(false);
      return;
    }
    const interval = setInterval(() => {
      setProgressTasks(prevTasks => {
        // Find LimiX status
        const limixTask = prevTasks.find(t => t.modelId === 'limix');

        // 1. Mark LimiX finish time
        if (limixTask?.status === '已完成' && !limixFinishTimeRef.current) {
          limixFinishTimeRef.current = Date.now();
        }

        // 2. Check if we should trigger Fast Forward UI (2s after LimiX finishes)
        if (limixFinishTimeRef.current && !fastForwardStartTimeRef.current) {
          const timeSinceFinish = Date.now() - limixFinishTimeRef.current;
          if (timeSinceFinish > 2000) {
            fastForwardStartTimeRef.current = Date.now();
            setIsFastForwarding(true);
          }
        }

        // 3. Check if Fast Forward should end (after 2s duration)
        let forceFinishPatchTST = false;
        if (fastForwardStartTimeRef.current) {
          const timeInFF = Date.now() - fastForwardStartTimeRef.current;
          if (timeInFF > 2000) {
            forceFinishPatchTST = true;
            // Note: We might want to keep the overlay until modal closes, 
            // or hide it. User said "Fast forward 2s later PatchTST also finished".
            // Let's hide it to show result.
            setIsFastForwarding(false);
          } else {
            // Keep showing FF
            setIsFastForwarding(true);
          }
        }

        const newTasks = prevTasks.map(task => {
          if (task.status === '已完成') return task;

          let increment = 0;
          if (task.modelId === 'limix') increment = 6 + Math.random() * 2;
          else if (task.modelId === 'deepseek') increment = 1.5 + Math.random() * 0.5;
          else if (task.modelId === 'patchtst') {
            // PatchTST Logic:
            // - Wait until FF triggers
            // - During FF, maybe increment slightly or just wait
            // - If forceFinishPatchTST is true, jump to 100

            if (forceFinishPatchTST) {
              increment = 100; // Jump to finish
            } else {
              // Stall while waiting for LimiX + 2s + FF time
              increment = 0;
            }
          }

          let newProgress = task.progress + increment;
          if (newProgress >= 100) {
            newProgress = 100;
            // const duration = ((Date.now() - task.startTime) / 1000).toFixed(1);

            // 【Fix】: 强制覆盖展示时长以符合演示剧本
            let duration = "0.0s";
            if (task.modelId === 'limix') {
              // LimiX: < 2s
              duration = (1.2 + Math.random() * 0.5).toFixed(1) + "s";
            } else if (task.modelId === 'deepseek') {
              // DeepSeek: 5s ~ 10s
              duration = (5.0 + Math.random() * 4.0).toFixed(1) + "s";
            } else if (task.modelId === 'patchtst') {
              // PatchTST: 10min ~ 15min
              // 随机生成 10~15 分钟的秒数 (600s ~ 900s)
              const mins = 10 + Math.random() * 5;
              const totalSecs = Math.floor(mins * 60);
              duration = totalSecs + "s";
            } else {
              duration = ((Date.now() - task.startTime) / 1000).toFixed(1) + "s";
            }

            return { ...task, progress: 100, status: '已完成', duration };
          }
          return { ...task, progress: newProgress };
        });

        newTasks.forEach((task, index) => {
          if (task.status === '已完成' && prevTasks[index].status !== '已完成') {
            // Generate Mock Chart Data based on task type
            let chartData = null;
            if (type === "分类") {
              // Simple randomization for classification demo
              chartData = MOCK_ROWS_CLF.map(row => ({
                ...row,
                "实时-日前偏差值_D-2": (parseFloat(row["实时-日前偏差值_D-2"] || 0) + (Math.random() - 0.5) * 20).toFixed(2),
              }));
            } else {
              // For Regression / Forecasting
              chartData = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i + 1);
                const baseOffset = (Math.random() - 0.5) * 100;
                const base = 350 + Math.sin(i / 5) * 50 + baseOffset;
                const random = (Math.random() - 0.5) * 30;
                const pred = Math.round(base + random);
                const interval = 15 + (i * 0.8) + Math.random() * 10;
                return {
                  date: `${date.getMonth() + 1}/${date.getDate()}`,
                  actual: null,
                  pred: pred,
                  upper: Math.round(pred + interval),
                  lower: Math.round(pred - interval),
                };
              });
            }

            const newRun = {
              id: task.id,
              taskName: task.taskName,
              taskType: type,
              target: task.target,
              status: "已完成",
              durationSec: task.duration,
              model: task.modelName,
              metrics: type === "分类"
                ? { AUC: (0.9 + Math.random() * 0.05).toFixed(3), F1: (0.75 + Math.random() * 0.1).toFixed(3), acc: (0.8 + Math.random() * 0.1).toFixed(3) }
                : (type === "回归" || type === "时序预测")
                  ? { RMSE: (15 + Math.random() * 5).toFixed(1), MAPE: (0.1 + Math.random() * 0.05).toFixed(2) }
                  : { PR_AUC: 0.45, TopK: "Top 1%" },
              version: `data:${task.datasetVersion || 'v2'} · ${task.modelName}`,
              createTime: nowTimeStr(),
              finishTime: nowTimeStr(),
              chartData: chartData,
            };
            setRuns(prev => [newRun, ...prev]);
            notify("任务完成", `${task.taskName} - ${task.modelName} 已完成`);
          }
        });
        return newTasks;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [showProgress, type, notify, setRuns]);

  const handleExportReport = () => {
    // 模拟导出逻辑
    notify("正在生成报告", "正在汇总任务信息、推理结果、因果解释及决策推演内容...");

    setTimeout(() => {
      notify("报告导出成功", "PDF 报告已下载至本地：/Downloads/推理分析报告_20251225.pdf");
    }, 1500);
  };

  const runOne = () => {
    if (selectedDatasetIds.length === 0 || targets.length === 0 || selectedModels.length === 0) {
      notify("无法运行", "请至少选择一个数据版本、一个目标字段和一个模型");
      return;
    }
    const newTasks = [];
    const now = Date.now();

    // 获取当前场景名称
    const currentScene = SCENES.find(s => s.id === sceneId);
    const sceneName = currentScene ? currentScene.name : '未知场景';

    // 计算序号：检查 runs 列表中是否存在以场景名称开头的任务，并获取最大序号
    let maxIndex = 0;
    runs.forEach(r => {
      if (r.taskName && r.taskName.startsWith(sceneName)) {
        // 匹配 "场景名称_序号" 的格式
        const pattern = new RegExp(`${sceneName}_(\\d+)`);
        const match = r.taskName.match(pattern);
        if (match) {
          const idx = parseInt(match[1]);
          if (idx > maxIndex) maxIndex = idx;
        }
      }
    });
    const nextIndex = maxIndex + 1;
    const taskNameBase = `${sceneName}_${nextIndex}`;

    // 聚合所有选中的数据集版本信息，不论选中多少个文件，任务数仅由 目标列*模型数 决定
    const dsVersions = selectedDatasetIds.map(id => {
      const ds = datasets.find(d => d.id === id);
      return ds ? ds.version.split('（')[0] : 'unknown';
    });
    const dsVersionSummary = dsVersions.length > 1 ? `${dsVersions[0]} 等 ${dsVersions.length} 个文件` : (dsVersions[0] || 'unknown');

    targets.forEach(target => {
      selectedModels.forEach(modelId => {
        const model = models.find(m => m.id === modelId);
        newTasks.push({
          id: `run-${Math.random().toString(16).slice(2, 8)}`,
          taskName: `${taskNameBase}_${model.name}`,
          taskType: type,
          target: target,
          modelId: modelId,
          modelName: model.name,
          datasetVersion: dsVersionSummary,
          progress: 0,
          status: '运行中',
          startTime: now
        });
      });
    });


    // 保存运行时间到 sessionStorage，用于推理结果展示
    const runTime = nowTimeStr();
    if (sceneId === 'air_quality_prediction') {
      window.sessionStorage.setItem('lastAirRunTime', runTime);
    } else if (sceneId === 'machine_predictive_maintenance_clf') {
      window.sessionStorage.setItem('lastMachineRunTime', runTime);
    }

    setProgressTasks(newTasks);
    setShowProgress(true);
  };

  return (
    <div className="space-y-4">
      {/* Custom Tabs Navigation */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg w-fit border border-slate-200 shadow-sm">
          {[
            { id: "tasks", label: "任务管理" },
            { id: "results", label: "推理结果" },
            { id: "compare", label: "对比分析" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "results" && (
          <Button className="rounded-2xl" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        )}
      </div>

      {activeTab === "tasks" && (
        <div className="space-y-4">
          <TaskProgressModal
            open={showProgress}
            tasks={progressTasks}
            onClose={() => setShowProgress(false)}
            isFastForwarding={isFastForwarding}
          />

          <Card className="rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4 pt-[4px]">
              <CardTitle className="text-base">新建任务</CardTitle>
              <Button className="rounded-2xl" onClick={runOne} disabled={running}>
                {running ? "运行中…" : "运行"}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                {/* 左侧列：数据版本 + 目标字段 */}
                <div className="space-y-4 col-span-2">
                  <div>
                    <div className="text-xs text-muted-foreground">当前数据版本</div>
                    <div className="mt-2">
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="请选择数据版本"
                        className="w-full rounded-2xl"
                        value={selectedDatasetIds}
                        onChange={(val) => setSelectedDatasetIds(val)}
                        renderFormat={(option) => {
                          if (!option) return "";
                          const d = sceneDatasets.find(d => d.id === option.value);
                          return d ? d.name : option.children;
                        }}
                        dropdownMenuStyle={{ maxHeight: 400 }}
                      >
                        {sceneDatasets.map((d) => (
                          <Select.Option key={d.id} value={d.id} className="flex flex-col py-2">
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-sm text-slate-700">{d.name}</span>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 rounded-sm bg-slate-50 text-slate-500 font-normal">
                                  {d.version.split('（')[0]}
                                </Badge>
                                <span className={`text-[10px] ${d.version.includes('清洗后') ? 'text-green-600' : 'text-amber-600'}`}>
                                  {d.version.includes('清洗后') ? '✨ 已清洗' : '⚠️ 含脏数据'}
                                </span>
                              </div>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">目标字段（Y 或待填补字段）</div>
                    <div className="mt-2">
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="请选择"
                        className="w-full rounded-2xl"
                        value={targets}
                        onChange={(val) => setTargets(val)}
                        maxTagCount={3}
                      >
                        {columns.map((col) => (
                          <Select.Option key={col} value={col}>
                            {FIELD_NAME_MAP[col] || col}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 右侧列：任务类型 + 时间列 */}
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground">任务类型</div>
                    <div className="mt-2">
                      <Select
                        className="w-full rounded-2xl"
                        placeholder="请选择"
                        value={type}
                        onChange={(val) => {
                          setType(val);
                          setTargets([]);
                        }}
                      >
                        <Select.Option value="时序预测">时序预测</Select.Option>
                        <Select.Option value="分类">分类</Select.Option>
                        <Select.Option value="回归">回归</Select.Option>
                      </Select>
                    </div>
                  </div>

                  {type === "时序预测" && (
                    <div>
                      <div className="text-xs text-muted-foreground">时间列</div>
                      <div className="mt-2">
                        <Select
                          className="w-full rounded-2xl"
                          value={timeColumn}
                          onChange={(val) => setTimeColumn(val)}
                        >
                          {columns.map((col) => (
                            <Select.Option key={col} value={col}>
                              {FIELD_NAME_MAP[col] || col}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-muted-foreground">特征字段（可选）</div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedFeatures.length === columns.filter(c => !targets.includes(c) && (type !== '时序预测' || c !== timeColumn)).length}
                      indeterminate={selectedFeatures.length > 0 && selectedFeatures.length < columns.filter(c => !targets.includes(c) && (type !== '时序预测' || c !== timeColumn)).length}
                      onChange={(checked) => setSelectedFeatures(checked ? columns.filter(c => !targets.includes(c) && (type !== '时序预测' || c !== timeColumn)) : [])}
                    >
                      <span className="text-xs text-muted-foreground">全选 / 清空</span>
                    </Checkbox>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 border rounded-xl p-3 bg-slate-50/50 max-h-[150px] overflow-y-auto">
                  {columns.map(col => {
                    const isDisabled = targets.includes(col) || (type === '时序预测' && col === timeColumn);
                    return (
                      <div key={col} className="flex items-center gap-2">
                        <Checkbox
                          disabled={isDisabled}
                          checked={selectedFeatures.includes(col)}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedFeatures(prev => [...prev, col]);
                            } else {
                              setSelectedFeatures(prev => prev.filter(c => c !== col));
                            }
                          }}
                        >
                          <span className={`text-sm font-mono truncate ${isDisabled ? 'text-muted-foreground/50' : ''}`} title={col}>{FIELD_NAME_MAP[col] || col}</span>
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-[14px]">
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
                    {runs.filter(r => r.taskName !== "缺失值填补_RF").map((r, index, arr) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-2 font-semibold">
                          {r.taskName}
                        </td>
                        <td className="py-2 font-mono text-xs text-muted-foreground">{r.id}</td>
                        <td className="py-2">
                          <Badge className="rounded-xl" variant="outline">
                            {r.taskType}
                          </Badge>
                        </td>
                        <td className="py-2">
                          <Badge
                            className={`rounded-xl ${r.status === "已完成" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" :
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
                          {r.version.includes("v2") ? "v2 (清洗后)" : "v1"}
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
      )}

      {activeTab === "results" && (
        <ResultsPanel notify={notify} openModal={openModal} sceneId={sceneId} runs={runs} />
      )}

      {activeTab === "compare" && (
        <ComparePanel notify={notify} openModal={openModal} sceneId={sceneId} runs={runs} />
      )}

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
    return `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
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

function ResultsPanel({ notify, openModal, sceneId, runs }) {
  // const [published, setPublished] = useState(false);
  const [selectedTh, setSelectedTh] = useState(0.4);
  const [targetFilter, setTargetFilter] = useState("机器故障");

  const MACHINE_TARGETS = useMemo(() => ["机器故障", "工具磨损故障", "热耗散故障", "功率故障", "过应力故障", "随机故障"], []);

  // 映射回英文 Key 以便 filtering 数据
  const MACHINE_TARGET_MAP = {
    "机器故障": "Machine failure",
    "工具磨损故障": "TWF",
    "热耗散故障": "HDF",
    "功率故障": "PWF",
    "过应力故障": "OSF",
    "随机故障": "RNF"
  };

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
    // 强制根据场景返回 mock 数据，除非用户真的生成了当前场景的新任务
    // 简单的做法是：如果 runs 为空，或者 runs 里的任务不属于当前场景（可以通过 ID 或 taskName 简单判断），则使用 mock
    // 但目前的 runs 结构里没有 sceneId。我们假设 MOCK_RUNS_BASE 里的任务都不属于 "air_quality_prediction"

    let base = runs || [];
    const isAirScene = sceneId === "air_quality_prediction";
    const isClfScene = sceneId === "sd_high_price_clf";
    const isMachineScene = sceneId === "machine_predictive_maintenance_clf";

    // 检查 runs 是否包含当前场景的任务
    // 这里做一个简单的启发式判断：如果场景是 air，但 runs 里没有 "NOx"，说明 runs 可能是旧的
    const runsHasAir = base.some(r => r.taskName.includes("NOx") || r.id.includes("AIR"));
    const runsHasClf = base.some(r => r.taskName.includes("分类") || r.id.includes("CLF"));
    const runsHasMachine = base.some(r => r.taskName.includes("机器") || r.id.includes("MAC"));

    // 如果当前是 Air 场景，但 runs 里没有 Air 任务，或者 runs 为空，则强制使用 Air Mock
    if (isAirScene && (!runsHasAir || base.length === 0)) {
      // Create delayed prediction data to simulate lag
      const delayedData = MOCK_NOX_PREDICTION.map((item, i, arr) => {
        // Shift prediction by 1 hour (use previous hour's prediction)
        const prevItem = i > 0 ? arr[i - 1] : item;
        return {
          ...item,
          pred: prevItem.pred * 0.9,
          upper: prevItem.upper * 0.9,
          lower: prevItem.lower * 0.9
        };
      });

      // 获取最近一次用户在当前 session 点击运行的时间，如果没有则 fallback 到当前时间
      const lastRunTime = window.sessionStorage.getItem('lastAirRunTime') || nowTimeStr();

      base = [{
        id: "run-AIR-001",
        taskName: "空气质量预测_1",
        taskType: "时序预测",
        target: "NOx(GT)",
        status: "已完成",
        version: "data:v1 · seed:42 · mode:精",
        createTime: lastRunTime,
        finishTime: lastRunTime, // 简化处理，完成时间=创建时间
        metrics: { RMSE: 12.5, MAPE: 0.15, MSE: 156.25, MAE: 10.2 },
        chartData: delayedData
      }];
    }
    // 如果当前是 Clf 场景，但 runs 里没有 Clf 任务，或者 runs 为空
    else if (isClfScene && (!runsHasClf || base.length === 0)) {
      base = [{
        id: "run-CLF-001",
        taskName: "山东省搏高价分类预测_1",
        taskType: "分类",
        target: "label",
        status: "已完成",
        version: "data:v2 · seed:42 · mode:精",
        createTime: "2025-12-25 10:30:00",
        finishTime: "2025-12-25 10:30:45",
      }];
    }
    // 机器预测性维护场景 Mock
    else if (isMachineScene && (!runsHasMachine || base.length === 0)) {
      // 获取上次运行时间，如果没有则使用当前时间
      const lastRunTime = window.sessionStorage.getItem('lastMachineRunTime') || nowTimeStr();
      base = MACHINE_TARGETS.map((tgt, i) => ({
        id: `run-MAC-${100 + i}`,
        taskName: `机器预测性维护分类_1`,
        taskType: "分类",
        target: tgt,
        status: "已完成",
        version: "data:v1 · seed:42 · mode:精",
        createTime: lastRunTime,
        finishTime: lastRunTime,
        durationSec: (1.5 + Math.random()).toFixed(1),
        metrics: { AUC: (0.9 + Math.random() * 0.09).toFixed(3), F1: (0.85 + Math.random() * 0.1).toFixed(3), acc: (0.9 + Math.random() * 0.08).toFixed(3) }
      }));
    }
    // 其他场景，如果 runs 为空，使用默认 Mock
    else if (base.length === 0) {
      base = MOCK_RUNS_BASE;
    }
    // 否则使用 runs（即保留了用户生成任务，或默认 runs）

    return base.filter(r => r.taskName !== "缺失值填补_RF");
  }, [sceneId, runs, MACHINE_TARGETS]);

  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    if (availableRuns.length > 0) {
      if (sceneId === "machine_predictive_maintenance_clf") {
        // 自动根据 target filter 选中对应的 run
        const targetRun = availableRuns.find(r => r.target === targetFilter);
        if (targetRun) {
          setSelectedRunId(targetRun.id);
          return;
        }
      }

      // Auto-select the first LimiX model run if available
      const limixRun = availableRuns.find(r => r.model === "LimiX" || (r.model && r.model.includes("LimiX")));
      if (limixRun) {
        setSelectedRunId(limixRun.id);
      } else {
        setSelectedRunId(availableRuns[0].id);
      }
    }
  }, [availableRuns, sceneId, targetFilter]);

  const currentRun = useMemo(() => {
    if (!availableRuns || availableRuns.length === 0) return null;
    return availableRuns.find(r => r.id === selectedRunId) || availableRuns[availableRuns.length - 1];
  }, [availableRuns, selectedRunId]);

  if (!currentRun) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="p-8 text-center text-muted-foreground">
          暂无任务数据
        </CardContent>
      </Card>
    );
  }

  const handleExportReport = () => {
    const reportContent = {
      basicInfo: {
        taskName: currentRun.taskName,
        taskId: currentRun.id,
        taskType: currentRun.taskType,
        status: currentRun.status,
        version: currentRun.version,
        createTime: currentRun.createTime,
        finishTime: currentRun.finishTime,
      },
      metrics: currentRun.metrics,
      // Charts and other complex data would be gathered here in a real implementation
      charts: ["ROC Curve", "Confusion Matrix", "t-SNE Map"],
      causalExplanation: "Impact Factor Heatmap Data...",
      impactComparison: "Impact Score Comparison Data...",
      decisionSimulation: "Decision Simulation Content...",
    };

    console.log("Generating PDF Report with content:", reportContent);

    // Mock download process
    notify("正在生成报告", "正在汇总任务信息、推理结果、因果解释及决策推演内容...");

    setTimeout(() => {
      notify("报告导出成功", "PDF 报告已下载至本地：/Downloads/推理分析报告_20251225.pdf");
    }, 1500);
  };

  return (
    <div className="space-y-4">

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
            {sceneId !== "machine_predictive_maintenance_clf" && (
              <div>
                <div className="text-xs text-muted-foreground">预测目标</div>
                <div className="mt-0.5 font-mono text-muted-foreground">{FIELD_NAME_MAP[currentRun.target] || currentRun.target || "-"}</div>
              </div>
            )}

            <div>
              <div className="text-xs text-muted-foreground">创建时间</div>
              <div className="mt-0.5 font-mono text-muted-foreground">{currentRun.createTime}</div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Remove outer Card wrapper to remove white background */}
      <div className="rounded-2xl">
        {sceneId === "machine_predictive_maintenance_clf" && (
          <div className="mb-1 flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-dashed border-slate-300">
            <span className="text-sm font-medium text-slate-600 pl-2">切换预测目标：</span>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {MACHINE_TARGETS.map(t => (
                <Button
                  key={t}
                  variant={targetFilter === t ? "default" : "outline"}
                  size="sm"
                  className={`rounded-lg h-7 text-xs ${targetFilter === t ? "bg-blue-600 hover:bg-blue-700" : "bg-white hover:bg-slate-100"}`}
                  onClick={() => setTargetFilter(t)}
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>
        )}
        <div className="h-[450px] w-full">
          {sceneId === "sd_high_price_clf" ? (
            <ScatterPlot data={currentRun.chartData || MOCK_ROWS_CLF} />
          ) : (sceneId === "machine_predictive_maintenance_clf" || currentRun?.taskType === "分类") ? (
            <ClassificationVisuals target={sceneId === "machine_predictive_maintenance_clf" ? (MACHINE_TARGET_MAP[targetFilter] || targetFilter) : (currentRun.target || "Machine failure")} />
          ) : (
            <Card className="rounded-2xl h-full">
              <CardContent className="h-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentRun.chartData || MOCK_PRICE_PREDICTION} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
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
                      unit={sceneId === "air_quality_prediction" ? "" : "元"}
                      width={35}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="pred"
                      name={sceneId === "air_quality_prediction" ? "预测浓度" : "预测电价"}
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#2563eb" }}
                    />
                    {/* Air quality scenario has actual data for comparison */}
                    {/* {sceneId === "air_quality_prediction" && (
                        <Line
                            type="monotone"
                            dataKey="actual"
                            name="真实浓度"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                        />
                      )} */}
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {(sceneId === "sd_high_price_clf" || sceneId === "machine_predictive_maintenance_clf" || currentRun?.taskType === "分类") && <div className="grid md:grid-cols-2 gap-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">ROC曲线与AUC值</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getRocData(sceneId === "machine_predictive_maintenance_clf" ? targetFilter : (currentRun?.target || "Machine failure"))} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                  <Line type="linear" dataKey="random" name="随机猜测" stroke="#000000" strokeDasharray="3 3" dot={false} strokeWidth={1} />
                  <Line type="linear" dataKey="tpr" name={`ROC曲线 (AUC = ${currentRun?.metrics?.AUC || 0.593})`} stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Precision-Recall 曲线</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getPrData(sceneId === "machine_predictive_maintenance_clf" ? targetFilter : (currentRun?.target || "Machine failure"))} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
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
                  <Line type="linear" dataKey="baseline" name="基线" stroke="#000000" strokeDasharray="3 3" dot={false} strokeWidth={1} />
                  <Line type="linear" dataKey="precision" name="PR曲线" stroke="#2563eb" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>}


    </div>
  );
}

const MOCK_MACHINE_EXPLAIN_DATA = {
  "Machine failure": {
    scores: MOCK_INFLUENCE_SCORES_MACHINE,
    matrix: MOCK_HEATMAP_MATRIX_MACHINE
  },
  "TWF": {
    scores: MOCK_INFLUENCE_SCORES_MACHINE.map(s => {
      if (s.name === "Tool wear [min]") return { ...s, value: 0.95 };
      if (s.name === "Rotational speed [rpm]") return { ...s, value: 0.45 };
      if (s.name === "Torque [Nm]") return { ...s, value: 0.35 };
      if (s.name === "Process temperature [K]") return { ...s, value: 0.15 };
      if (s.name === "Air temperature [K]") return { ...s, value: 0.10 };
      if (s.name === "Type") return { ...s, value: 0.05 };
      return s;
    }),
    matrix: MOCK_HEATMAP_MATRIX_MACHINE.map(row => row.map((v, i) => i === 5 ? Math.min(2, v + 1) : v)) // Boost Tool wear
  },
  "HDF": {
    scores: MOCK_INFLUENCE_SCORES_MACHINE.map(s => {
      if (s.name === "Process temperature [K]") return { ...s, value: 0.88 };
      if (s.name === "Air temperature [K]") return { ...s, value: 0.82 };
      if (s.name === "Rotational speed [rpm]") return { ...s, value: 0.40 };
      if (s.name === "Torque [Nm]") return { ...s, value: 0.20 };
      if (s.name === "Tool wear [min]") return { ...s, value: 0.10 };
      if (s.name === "Type") return { ...s, value: 0.05 };
      return s;
    }),
    matrix: MOCK_HEATMAP_MATRIX_MACHINE.map(row => row.map((v, i) => (i === 1 || i === 2) ? Math.min(2, v + 1) : v)) // Boost Temps
  },
  "PWF": {
    scores: MOCK_INFLUENCE_SCORES_MACHINE.map(s => {
      if (s.name === "Torque [Nm]") return { ...s, value: 0.90 };
      if (s.name === "Rotational speed [rpm]") return { ...s, value: 0.85 };
      if (s.name === "Tool wear [min]") return { ...s, value: 0.30 };
      if (s.name === "Process temperature [K]") return { ...s, value: 0.10 };
      if (s.name === "Air temperature [K]") return { ...s, value: 0.05 };
      if (s.name === "Type") return { ...s, value: 0.05 };
      return s;
    }),
    matrix: MOCK_HEATMAP_MATRIX_MACHINE.map(row => row.map((v, i) => (i === 3 || i === 4) ? Math.min(2, v + 1) : v)) // Boost Speed/Torque
  },
  "OSF": {
    scores: MOCK_INFLUENCE_SCORES_MACHINE.map(s => {
      if (s.name === "Torque [Nm]") return { ...s, value: 0.92 };
      if (s.name === "Tool wear [min]") return { ...s, value: 0.78 };
      if (s.name === "Rotational speed [rpm]") return { ...s, value: 0.30 };
      if (s.name === "Process temperature [K]") return { ...s, value: 0.10 };
      if (s.name === "Air temperature [K]") return { ...s, value: 0.05 };
      if (s.name === "Type") return { ...s, value: 0.05 };
      return s;
    }),
    matrix: MOCK_HEATMAP_MATRIX_MACHINE.map(row => row.map((v, i) => (i === 4 || i === 5) ? Math.min(2, v + 1) : v)) // Boost Torque/Wear
  },
  "RNF": {
    scores: MOCK_INFLUENCE_SCORES_MACHINE.map(s => {
      if (s.name === "Process temperature [K]") return { ...s, value: 0.40 };
      if (s.name === "Torque [Nm]") return { ...s, value: 0.35 };
      if (s.name === "Rotational speed [rpm]") return { ...s, value: 0.30 };
      if (s.name === "Tool wear [min]") return { ...s, value: 0.25 };
      if (s.name === "Air temperature [K]") return { ...s, value: 0.20 };
      if (s.name === "Type") return { ...s, value: 0.10 };
      return s;
    }),
    matrix: MOCK_HEATMAP_MATRIX_MACHINE.map(row => row.map(v => Math.max(-2, Math.min(2, v * 0.5 + (Math.random() - 0.5))))) // Randomize
  }
};

function ExplainPanel({ notify, openModal, sceneId, runs }) {
  const isAirScene = sceneId === "air_quality_prediction";
  const isMachine = sceneId === "machine_predictive_maintenance_clf";

  const [targetFilter, setTargetFilter] = useState("Machine failure");
  const [hoverIndex, setHoverIndex] = useState(null);
  const MACHINE_TARGETS = useMemo(() => ["Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF"], []);

  // Create consistent delayed data for Air Quality scene (synced with ResultsPanel)
  const delayedAirData = useMemo(() => {
    if (!isAirScene) return [];
    return MOCK_NOX_PREDICTION.map((item, i, arr) => {
      const prevItem = i > 0 ? arr[i - 1] : item;
      return {
        ...item,
        pred: prevItem.pred * 0.9,
        upper: prevItem.upper * 0.9,
        lower: prevItem.lower * 0.9
      };
    });
  }, [isAirScene]);

  const activeMachineData = useMemo(() => {
    return MOCK_MACHINE_EXPLAIN_DATA[targetFilter] || MOCK_MACHINE_EXPLAIN_DATA["Machine failure"];
  }, [targetFilter]);

  const currentInfluenceFactors = isAirScene ? MOCK_INFLUENCE_FACTORS_AIR : (isMachine ? MOCK_INFLUENCE_FACTORS_MACHINE.filter(f => f !== targetFilter) : MOCK_INFLUENCE_FACTORS);
  const currentInfluenceScores = isAirScene ? MOCK_INFLUENCE_SCORES_AIR : (isMachine ? activeMachineData.scores : MOCK_INFLUENCE_SCORES);
  const currentFeatureMeta = isAirScene ? MOCK_FEATURE_META_AIR : (isMachine ? MOCK_FEATURE_META_MACHINE : MOCK_FEATURE_META);
  const currentHeatmapDates = isAirScene ? MOCK_HEATMAP_DATES_AIR : (isMachine ? MOCK_HEATMAP_DATES_MACHINE : MOCK_HEATMAP_DATES);
  const currentHeatmapMatrix = isAirScene ? MOCK_HEATMAP_MATRIX_AIR : (isMachine ? activeMachineData.matrix : MOCK_HEATMAP_MATRIX);

  const availableRuns = useMemo(() => {
    let base = runs || [];

    // 根据场景过滤任务
    if (sceneId === "air_quality_prediction") {
      // 尝试从 runs 中找空气质量相关的任务
      const airRuns = base.filter(r => r.taskName.includes("空气质量") || r.id.includes("AIR") || r.target === "NOx(GT)");

      if (airRuns.length > 0) {
        base = airRuns;
      } else {
        // 如果没有，使用默认 Mock
        base = [
          {
            id: "run-AIR-001",
            taskName: "空气质量预测_1",
            taskType: "回归",
            target: "NOx(GT)",
            status: "已完成",
            version: "data:v1 · seed:42 · mode:精",
            createTime: "2024-03-25 10:00:00",
            finishTime: "2024-03-25 10:05:23",
            metrics: { RMSE: 12.5, MAPE: 0.15 },
          }
        ];
      }
    } else if (sceneId === "sd_high_price_clf") {
      const clfRuns = base.filter(r => r.taskName.includes("分类") || r.id.includes("CLF") || r.target === "label");

      if (clfRuns.length > 0) {
        base = clfRuns;
      } else {
        base = [
          {
            id: "run-CLF-000",
            taskName: "山东省搏高价分类预测_1",
            taskType: "分类",
            target: "label",
            status: "已归档",
            version: "data:v1 · seed:42 · mode:快",
            createTime: "2025-12-24 10:30:00",
            finishTime: "2025-12-24 10:30:45",
          },
          {
            id: "run-CLF-001",
            taskName: "山东省搏高价分类预测_2",
            taskType: "分类",
            target: "label",
            status: "已完成",
            version: "data:v2 · seed:42 · mode:精",
            createTime: "2025-12-25 10:30:00",
            finishTime: "2025-12-25 10:30:45",
          }
        ];
      }
    } else if (sceneId === "machine_predictive_maintenance_clf") {
      const machineRuns = base.filter(r => r.taskName.includes("机器") || r.id.includes("MAC"));
      if (machineRuns.length > 0) {
        base = machineRuns;
      } else {
        // Mock similar to ResultsPanel
        const targets = ["Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF"];
        base = targets.map((tgt, i) => ({
          id: `run-MAC-${100 + i}`,
          taskName: `机器预测性维护分类_1`,
          taskType: "分类",
          target: tgt,
          status: "已完成",
          version: "data:v1 · seed:42 · mode:精",
          createTime: "2026-01-28 10:00:00",
          finishTime: "2026-01-28 10:01:30",
          durationSec: (1.5 + Math.random()).toFixed(1),
          metrics: { AUC: (0.9 + Math.random() * 0.09).toFixed(3), F1: (0.85 + Math.random() * 0.1).toFixed(3), acc: (0.9 + Math.random() * 0.08).toFixed(3) }
        }));
      }
    } else {
      // 默认场景（电价预测），如果 runs 为空，使用 MOCK_RUNS_BASE
      // 同时过滤掉明显不属于该场景的任务（比如空气质量的任务）
      let priceRuns = base.filter(r => !r.taskName.includes("空气质量") && !r.id.includes("AIR") && !r.taskName.includes("分类") && !r.id.includes("CLF") && !r.taskName.includes("机器") && !r.id.includes("MAC"));

      if (priceRuns.length === 0) {
        base = MOCK_RUNS_BASE;
      } else {
        base = priceRuns;
      }
    }

    return base.filter(r => r.taskName !== "缺失值填补_RF");
  }, [sceneId, runs]);

  const [selectedRunId, setSelectedRunId] = useState(null);

  useEffect(() => {
    if (availableRuns.length > 0) {
      if (sceneId === "machine_predictive_maintenance_clf") {
        // 自动根据 target filter 选中对应的 run
        const targetRun = availableRuns.find(r => r.target === targetFilter);
        if (targetRun) {
          setSelectedRunId(targetRun.id);
          return;
        }
      }
      // 默认选中最后一个（最新运行）
      setSelectedRunId(availableRuns[availableRuns.length - 1].id);
    }
  }, [availableRuns, sceneId, targetFilter]);

  const currentRun = useMemo(() => {
    if (!availableRuns || availableRuns.length === 0) return null;
    return availableRuns.find(r => r.id === selectedRunId) || availableRuns[availableRuns.length - 1];
  }, [availableRuns, selectedRunId]);



  // Feature Selection State
  const [selectedFactors, setSelectedFactors] = useState(currentInfluenceFactors);
  const [activeFactors, setActiveFactors] = useState(currentInfluenceFactors);

  // Update state when scene changes
  useEffect(() => {
    setSelectedFactors(currentInfluenceFactors);
    setActiveFactors(currentInfluenceFactors);
    setFeatureConfigs({});
    setEditingFeature(null);
  }, [sceneId, currentInfluenceFactors]);

  // Feature Range State
  const [featureConfigs, setFeatureConfigs] = useState({});
  const [editingFeature, setEditingFeature] = useState(null);

  const handleConfigChange = (feature, key, val) => {
    setFeatureConfigs(prev => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        [key]: val
      }
    }));
  };

  const getFeatureType = (f) => currentFeatureMeta[f]?.type || "number";

  // Timeline Filter State (Air Quality)
  const [timelineIndexRange, setTimelineIndexRange] = useState([0, 0]);

  // Classification Filter State (Machine)
  const [selectedClasses, setSelectedClasses] = useState([0, 1]);

  // Reset timeline filter when scene changes or dates load
  useEffect(() => {
    if (isAirScene && currentHeatmapDates.length > 0) {
      setTimelineIndexRange([0, currentHeatmapDates.length - 1]);
    }
    if (isMachine) {
      setSelectedClasses([0, 1]);
    }
  }, [isAirScene, isMachine, currentHeatmapDates, delayedAirData]);

  // Target Value Filtering State
  // 1. Get Target Values for current dataset
  const targetValues = useMemo(() => {
    if (isAirScene) {
      // Use delayedAirData to be consistent with Reasoning Results
      return delayedAirData.slice(0, currentHeatmapDates.length).map(d => d.pred);
    } else if (isMachine) {
      // For machine scene, mock binary classification labels (0 or 1)
      // Simulate more failures (1) towards the end or randomly
      return Array.from({ length: currentHeatmapDates.length }, (_, i) => (i % 5 === 0 || i > 40) ? 1 : 0);
    } else {
      // For default/other scenes, generate mock values or use row index as proxy
      // Default heatmap has 31 rows
      return Array.from({ length: currentHeatmapDates.length }, (_, i) => Math.round(350 + Math.sin(i / 5) * 50));
    }
  }, [isAirScene, isMachine, currentHeatmapDates, delayedAirData]);

  // 2. Calculate Global Min/Max
  const [globalMin, globalMax] = useMemo(() => {
    if (!targetValues.length) return [0, 100];
    const min = Math.min(...targetValues);
    const max = Math.max(...targetValues);
    return [Math.floor(min), Math.ceil(max)];
  }, [targetValues]);

  // 3. Filter State
  const [filterMin, setFilterMin] = useState(globalMin);
  const [filterMax, setFilterMax] = useState(globalMax);

  // Reset filter when scene/global range changes
  useEffect(() => {
    setFilterMin(globalMin);
    setFilterMax(globalMax);
  }, [globalMin, globalMax]);

  // 4. Compute Valid Indices
  const validIndices = useMemo(() => {
    if (isAirScene) {
      const [start, end] = timelineIndexRange;
      if (currentHeatmapDates.length === 0) return [];

      // Create range of indices
      const indices = [];
      for (let i = start; i <= end; i++) {
        if (i >= 0 && i < currentHeatmapDates.length) {
          indices.push(i);
        }
      }
      return indices;
    } else if (isMachine) {
      return targetValues
        .map((v, i) => ({ v, i }))
        .filter(({ v }) => selectedClasses.includes(v))
        .map(({ i }) => i);
    } else {
      return targetValues
        .map((v, i) => ({ v, i }))
        .filter(({ v }) => v >= filterMin && v <= filterMax)
        .map(({ i }) => i);
    }
  }, [targetValues, filterMin, filterMax, isAirScene, isMachine, selectedClasses, currentHeatmapDates, timelineIndexRange]);

  const handleGenerate = () => {
    if (selectedFactors.length === 0) {
      notify("请至少选择一个特征", "特征列表不能为空");
      return;
    }

    if (isAirScene) {
      const [s, e] = timelineIndexRange;
      if (currentHeatmapDates.length > 0) {
        const startDate = currentHeatmapDates[s];
        const endDate = currentHeatmapDates[e];
        setActiveFactors(selectedFactors);
        notify("分析已更新", `已筛选时间段 ${startDate} 至 ${endDate}`);
      }
    } else if (isMachine) {
      if (selectedClasses.length === 0) {
        notify("请至少选择一个类别", "目标标签筛选不能为空");
        return;
      }
      setActiveFactors(selectedFactors);
      notify("分析已更新", `已筛选类别: ${selectedClasses.map(c => c === 0 ? "正常" : "故障").join(", ")}`);
    } else {
      const min = parseFloat(filterMin);
      const max = parseFloat(filterMax);

      if (isNaN(min) || isNaN(max)) {
        notify("输入错误", "范围值必须为数字");
        return;
      }
      if (min > max) {
        notify("范围错误", "最小值不能大于最大值");
        return;
      }

      setActiveFactors(selectedFactors);
      // Trigger re-render of charts via activeMatrix/activeDates dependencies
      notify("分析已更新", `已筛选目标值在 ${min} - ${max} 之间的样本（共 ${validIndices.length} 条）`);
    }
  };

  const activeDates = useMemo(() => {
    return validIndices.map(i => currentHeatmapDates[i]);
  }, [validIndices, currentHeatmapDates]);

  const activeMatrix = useMemo(() => {
    // 防御性编程：如果 activeFactors 中包含不在 currentInfluenceFactors 的项（例如场景切换时的 stale state），
    // 过滤掉这些项，避免 indexOf 返回 -1 导致 row[-1] 为 undefined
    const validFactors = activeFactors.filter(f => currentInfluenceFactors.includes(f));
    const indices = validFactors.map(f => currentInfluenceFactors.indexOf(f));

    // Filter rows first
    const rowsFiltered = validIndices.map(i => currentHeatmapMatrix[i]);

    // Then filter columns
    // 增加空值检查：rowsFiltered 里的元素可能是 undefined (如果 validIndices 越界)
    return rowsFiltered.map(row => {
      if (!row) return indices.map(() => 0); // Fallback row
      return indices.map(i => row[i] ?? 0); // Fallback cell
    });
  }, [activeFactors, validIndices, currentHeatmapMatrix, currentInfluenceFactors]);

  const activeScores = useMemo(() => {
    // For Air Quality scene, use static mock data (MOCK_INFLUENCE_SCORES_AIR) directly
    // to match specific values requested by user, instead of dynamic calculation from heatmap
    if (isAirScene) {
      // Filter based on activeFactors
      const scores = MOCK_INFLUENCE_SCORES_AIR.filter(s => activeFactors.includes(s.name));
      // Sort by value descending (Algebraic: Large to Small)
      return scores.sort((a, b) => b.value - a.value);
    }

    if (isMachine) {
      // 根据目标类别筛选使用不同的影响分数
      const isNormalOnly = selectedClasses.length === 1 && selectedClasses.includes(0);
      const isFaultOnly = selectedClasses.length === 1 && selectedClasses.includes(1);

      // 正常类别的影响分数
      const normalScores = [
        { name: "Rotational speed [rpm]", value: 129.1 },
        { name: "Torque [Nm]", value: 28.4 },
        { name: "UDI", value: -29.7 },
        { name: "Tool wear [min]", value: -35.4 },
        { name: "Air temperature [K]", value: -52.7 },
        { name: "Process temperature [K]", value: -67.3 },
        { name: "Type", value: -154.6 }
      ];

      // 故障类别的影响分数
      const faultScores = [
        { name: "Rotational speed [rpm]", value: 119.1 },
        { name: "Torque [Nm]", value: 42 },
        { name: "UDI", value: 0.1 },
        { name: "Tool wear [min]", value: -14.7 },
        { name: "Air temperature [K]", value: -21.4 },
        { name: "Process temperature [K]", value: -49.3 },
        { name: "Type", value: -167.8 }
      ];

      const machineScoresData = isNormalOnly ? normalScores : (isFaultOnly ? faultScores : MOCK_INFLUENCE_SCORES_MACHINE);
      const scores = machineScoresData.filter(s => activeFactors.includes(s.name));
      return scores.sort((a, b) => b.value - a.value);
    }

    // Dynamic recalculation based on filtered samples (validIndices)
    if (validIndices.length === 0 || !currentHeatmapMatrix) return [];

    // Map each active factor to its column index
    const factorIndices = activeFactors.map(f => ({
      name: f,
      index: currentInfluenceFactors.indexOf(f)
    })).filter(item => item.index !== -1);

    // Calculate average score for each active factor across valid rows
    const scores = factorIndices.map(({ name, index }) => {
      let sum = 0;
      let count = 0;
      validIndices.forEach(rowIndex => {
        const row = currentHeatmapMatrix[rowIndex];
        if (row) {
          sum += (row[index] || 0);
          count++;
        }
      });
      // If no valid samples, default to 0
      const avg = count > 0 ? (sum / count) : 0;
      return { name, value: avg };
    });

    // Sort by absolute value to keep the chart meaningful
    return scores.sort((a, b) => Math.abs(b.value) - Math.abs(a.value));
  }, [activeFactors, validIndices, currentHeatmapMatrix, currentInfluenceFactors]);

  if (!currentRun) {
    return (
      <div className="space-y-4">
        <SectionTitle icon={ScanSearch} title="因果解释" />
        <Card className="rounded-2xl">
          <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center gap-4">
            <ScanSearch className="w-12 h-12 opacity-20" />
            <div>暂无相关任务数据，请先在“推理分析”中运行任务。</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          </div>
        </CardContent>
      </Card>

      {isMachine && (
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-dashed border-slate-300">
          <span className="text-sm font-medium text-slate-600 pl-2">切换预测目标：</span>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {MACHINE_TARGETS.map(t => (
              <Button
                key={t}
                variant={targetFilter === t ? "default" : "outline"}
                size="sm"
                className={`rounded-lg h-7 text-xs ${targetFilter === t ? "bg-blue-600 hover:bg-blue-700" : "bg-white hover:bg-slate-100"}`}
                onClick={() => setTargetFilter(t)}
              >
                {FIELD_NAME_MAP[t] || t}
              </Button>
            ))}
          </div>
        </div>
      )}

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
          {!isMachine && (
            <div className="flex items-center gap-4 text-sm">
              <div className="shrink-0 font-medium text-slate-700">预测目标列：</div>
              <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 font-mono text-xs border border-slate-200">
                {isMachine
                  ? (FIELD_NAME_MAP[targetFilter] || targetFilter)
                  : (currentRun.target === "label" ? "label (不可搏 0 / 可搏 1)" : (FIELD_NAME_MAP[currentRun.target] || currentRun.target))}
              </div>
            </div>
          )}

          {isAirScene ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium text-slate-700">时间轴范围选择：</div>
                <div className="flex gap-2">
                  {[
                    { label: "全量", range: [0, currentHeatmapDates.length - 1] },
                    { label: "前半段", range: [0, Math.floor((currentHeatmapDates.length - 1) / 2)] },
                    { label: "后半段", range: [Math.floor((currentHeatmapDates.length - 1) / 2), currentHeatmapDates.length - 1] },
                    { label: "近24h", range: [Math.max(0, currentHeatmapDates.length - 24), currentHeatmapDates.length - 1] }
                  ].map(item => (
                    <Button
                      key={item.label}
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs px-2 rounded-lg"
                      onClick={() => setTimelineIndexRange(item.range)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="px-4 py-6 bg-slate-50/50 rounded-xl border border-slate-100">
                <Slider
                  range
                  value={timelineIndexRange}
                  onChange={setTimelineIndexRange}
                  min={0}
                  max={Math.max(0, currentHeatmapDates.length - 1)}
                  step={1}
                  tooltipVisible={false}
                  className="mb-2"
                />
                <div className="flex justify-between mt-2 text-xs font-mono text-slate-500">
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">Start</Badge>
                    {currentHeatmapDates[timelineIndexRange[0]] || "-"}
                  </div>
                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-slate-200">
                    {currentHeatmapDates[timelineIndexRange[1]] || "-"}
                    <Badge variant="secondary" className="text-[10px] h-4 px-1">End</Badge>
                  </div>
                </div>
              </div>
            </div>
          ) : isMachine ? (
            <div className="flex items-center gap-4 text-sm">
              <div className="shrink-0 font-medium text-slate-700">目标类别筛选：</div>
              <div className="flex items-center gap-6">
                <Checkbox
                  checked={selectedClasses.includes(0)}
                  onChange={(checked) => {
                    if (checked) setSelectedClasses(prev => [...prev, 0]);
                    else setSelectedClasses(prev => prev.filter(c => c !== 0));
                  }}
                >
                  <span className="text-slate-600">正常 (0)</span>
                </Checkbox>
                <Checkbox
                  checked={selectedClasses.includes(1)}
                  onChange={(checked) => {
                    if (checked) setSelectedClasses(prev => [...prev, 1]);
                    else setSelectedClasses(prev => prev.filter(c => c !== 1));
                  }}
                >
                  <span className="text-red-600 font-medium">故障 (1)</span>
                </Checkbox>
              </div>
              <div className="text-xs text-muted-foreground ml-auto">
                (已选 {selectedClasses.length} 个类别)
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <div className="shrink-0 font-medium text-slate-700">目标值范围：</div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={filterMin}
                    onChange={(e) => setFilterMin(e.target.value)}
                    className="w-20 h-8 text-xs text-center"
                    placeholder="Min"
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={filterMax}
                    onChange={(e) => setFilterMax(e.target.value)}
                    className="w-20 h-8 text-xs text-center"
                    placeholder="Max"
                  />
                </div>
                <div className="text-xs text-muted-foreground ml-2">(全范围: {globalMin} - {globalMax})</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm text-slate-700">特征选择 ({selectedFactors.length}/{currentInfluenceFactors.length})：</div>
              <div className="space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-slate-500"
                  onClick={() => setSelectedFactors(currentInfluenceFactors)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentInfluenceFactors.map(f => {
                  const isSelected = selectedFactors.includes(f);
                  const config = featureConfigs[f] || {};
                  const type = getFeatureType(f);

                  // Generate summary text
                  let summary = "";
                  if (isSelected) {
                    if (type === "number") {
                      const range = config.range || [0, 100];
                      summary = `${range[0]}% - ${range[1]}%`;
                    } else {
                      const opts = config.selectedOptions || [];
                      summary = opts.length > 0 ? `已选 ${opts.length} 项` : "全选";
                    }
                  }

                  return (
                    <div key={f} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${isSelected ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-50' : 'bg-white border-transparent hover:bg-slate-100'}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <Checkbox
                          checked={isSelected}
                          onChange={(checked) => {
                            if (checked) setSelectedFactors(prev => [...prev, f]);
                            else setSelectedFactors(prev => prev.filter(x => x !== f));
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-medium text-slate-700 truncate block" title={f}>{FIELD_NAME_MAP[f] || f}</span>
                          {isSelected && (
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="secondary" className="text-[10px] h-4 px-1 font-normal bg-slate-100 text-slate-500 border-slate-200">
                                {type === "category" ? "枚举" : "数值"}
                              </Badge>
                              <span className="text-xs text-blue-600 font-mono">{summary}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg shrink-0"
                          onClick={() => setEditingFeature(f)}
                        >
                          <Settings className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Config Modal */}
            <Modal
              open={!!editingFeature}
              title={editingFeature ? `配置特征: ${FIELD_NAME_MAP[editingFeature] || editingFeature}` : ""}
              onClose={() => setEditingFeature(null)}
            >
              {editingFeature && (() => {
                const type = getFeatureType(editingFeature);
                const config = featureConfigs[editingFeature] || {};

                if (type === "category") {
                  const options = currentFeatureMeta[editingFeature]?.options || [];
                  const selected = config.selectedOptions || [];

                  return (
                    <div className="space-y-4 py-4">
                      <div className="text-sm text-slate-500 mb-2">请选择需要包含的枚举值：</div>
                      <div className="flex flex-wrap gap-2">
                        {options.map(opt => {
                          const active = selected.includes(opt);
                          return (
                            <div
                              key={opt}
                              onClick={() => {
                                const newSel = active
                                  ? selected.filter(s => s !== opt)
                                  : [...selected, opt];
                                handleConfigChange(editingFeature, "selectedOptions", newSel);
                              }}
                              className={`
                                                    cursor-pointer px-3 py-1.5 rounded-lg border text-sm transition-all
                                                    ${active
                                  ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }
                                                `}
                            >
                              {opt}
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        {selected.length === 0 ? "提示：未选择任何项将默认为“全选”。" : `已选择 ${selected.length} 个值。`}
                      </div>
                    </div>
                  );
                } else {
                  // Number type
                  const range = config.range || [0, 100];
                  return (
                    <div className="space-y-6 py-6 px-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-500">数值范围筛选</span>
                        <span className="font-mono text-blue-600 font-bold">{range[0]}% - {range[1]}%</span>
                      </div>
                      <Slider
                        range
                        value={range}
                        onChange={(val) => handleConfigChange(editingFeature, "range", val)}
                        min={0}
                        max={100}
                        step={1}
                        className="mb-6"
                      />
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 mb-1">最小值</div>
                          <Input
                            type="number"
                            value={range[0]}
                            onChange={(e) => handleConfigChange(editingFeature, "range", [parseInt(e.target.value) || 0, range[1]])}
                          />
                        </div>
                        <div className="text-slate-300">-</div>
                        <div className="flex-1">
                          <div className="text-xs text-slate-500 mb-1">最大值</div>
                          <Input
                            type="number"
                            value={range[1]}
                            onChange={(e) => handleConfigChange(editingFeature, "range", [range[0], parseInt(e.target.value) || 100])}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </Modal>
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
          {!isAirScene && (
            <div>
              <div className="mb-4 font-semibold text-base text-center">
                {isMachine ? "机器故障影响因子热力图" : "电力市场影响因子热力图"}
              </div>
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
          )}

          {/* Time-Series Causal Analysis (Air Quality Only) */}
          {isAirScene && activeFactors.length > 0 && (
            <div>
              <div className="mb-4 font-semibold text-base text-center">时序归因分析：特征趋势 vs 目标预测</div>
              <div className="border rounded-xl bg-white p-4 space-y-4">
                {/* 1. Synchronized Prediction Chart */}
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={activeDates.map((date, i) => ({
                        date,
                        // Find the corresponding prediction data from the delayed dataset
                        ...delayedAirData.find(d => d.date === date)
                      }))}
                      margin={{ top: 10, right: 0, left: 0, bottom: 0 }} // Left margin 0, let YAxis take the 90px space
                      onMouseMove={(state) => {
                        if (state && state.activeTooltipIndex !== undefined) {
                          setHoverIndex(state.activeTooltipIndex);
                        } else {
                          setHoverIndex(null);
                        }
                      }}
                      onMouseLeave={() => setHoverIndex(null)}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        hide // Hide X axis labels to avoid clutter, rely on heatmap below
                        padding={{ left: 0, right: 0 }}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        width={90}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                        cursor={{ stroke: '#ef4444', strokeWidth: 3 }} // Bright red cursor
                        labelFormatter={(label) => {
                          const d = new Date(label);
                          return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`;
                        }}
                      />
                      <Legend verticalAlign="top" height={36} iconType="plainline" />
                      <Line type="monotone" dataKey="pred" name="预测浓度" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="actual" name="真实浓度" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 2. Timeline Heatmap */}
                <div className="flex items-center justify-end gap-2 text-xs text-slate-500 mb-1 px-1">
                  <span>影响程度：</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]">负向</span>
                    <div className="w-20 h-2 rounded-full bg-gradient-to-r from-[rgb(13,71,161)] via-white to-[rgb(183,28,28)] border border-slate-100"></div>
                    <span className="text-[10px]">正向</span>
                  </div>
                </div>
                <div className="w-full relative">
                  <div className="flex">
                    {/* Y-axis Labels (Features) */}
                    <div className="w-[90px] flex-shrink-0 flex flex-col justify-between pt-2 pb-2 pr-2 border-r border-slate-100">
                      {activeFactors.map(f => (
                        <div key={f} className="h-6 flex items-center justify-end text-[10px] text-slate-500 font-mono truncate" title={f}>
                          {FIELD_NAME_MAP[f] || f}
                        </div>
                      ))}
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex-1 overflow-hidden relative">
                      {/* Synchronized Hover Line */}
                      {hoverIndex !== null && activeDates.length > 1 && (
                        <div
                          className="absolute top-0 bottom-0 z-20 pointer-events-none border-l-[3px] border-red-500" // Increased width and changed color to bright red
                          style={{
                            left: `${(hoverIndex / (activeDates.length - 1)) * 100}%`,
                          }}
                        />
                      )}

                      {/* Grid Container */}
                      <div className="flex flex-col h-full w-full">
                        {activeFactors.map((f, rowIdx) => (
                          <div key={f} className="flex w-full h-6">
                            {activeDates.map((d, colIdx) => {
                              // matrix is [row=time][col=feature]
                              // We need [time][feature]
                              // activeMatrix[colIdx] is the row for time `d`
                              // activeMatrix[colIdx][rowIdx] is the value for feature `f` at time `d`
                              const val = activeMatrix[colIdx]?.[rowIdx] ?? 0;

                              // Helper to get color (reuse logic from DivergingHeatGrid but inline for simplicity)
                              let bg = '#ffffff';
                              if (val < 0) {
                                const ratio = Math.min(1, Math.abs(val) / 1.2);
                                const r = Math.round(255 + (13 - 255) * ratio);
                                const g = Math.round(255 + (71 - 255) * ratio);
                                const b = Math.round(255 + (161 - 255) * ratio);
                                bg = `rgb(${r}, ${g}, ${b})`;
                              } else {
                                const ratio = Math.min(1, val / 1.2);
                                const r = Math.round(255 + (183 - 255) * ratio);
                                const g = Math.round(255 + (28 - 255) * ratio);
                                const b = Math.round(255 + (28 - 255) * ratio);
                                bg = `rgb(${r}, ${g}, ${b})`;
                              }

                              return (
                                <div
                                  key={`${f}-${d}`}
                                  className="flex-1 h-full hover:opacity-80 transition-opacity relative group"
                                  style={{ backgroundColor: bg }}
                                  title={`${d} \n${FIELD_NAME_MAP[f] || f}: ${val.toFixed(2)}`}
                                />
                              );
                            })}
                          </div>
                        ))}
                      </div>

                      {/* X-axis Labels (Time) - Sparse */}
                      <div className="absolute bottom-0 left-0 w-full flex justify-between pointer-events-none opacity-0">
                        {/* Hidden for layout, actual labels below */}
                      </div>
                    </div>
                  </div>

                  {/* X-axis Labels Row */}
                  <div className="flex ml-[90px] mt-1 text-[10px] text-slate-400 font-mono relative h-6 border-t border-slate-100">
                    {/* Generate hourly ticks */}
                    {(() => {
                      // Determine interval based on total data points to avoid crowding
                      // We want a tick every 2 hours if possible, but adjust if too crowded
                      // Assuming 1px per minute or similar is not guaranteed, we work with indices.
                      // Our data is hourly. So index 0 = 00:00, index 1 = 01:00...
                      // We want ticks at 0, 2, 4, 6...

                      return activeDates.map((date, index) => {
                        // Parse date to get hour
                        const d = new Date(date);
                        const hour = d.getHours();

                        // Show tick only if hour is even (0, 2, 4...)
                        // AND ensure we don't skip too many if the range is weird (e.g. filtered)
                        // For safety, let's just use the index step logic but based on hour check

                        // If we are viewing a large range, we might need to skip more
                        // Let's stick to the user request: "every 2 hours"
                        // But we must respect the container width. 
                        // If 168 points (7 days), showing every 2h means 84 ticks -> too crowded.
                        // If 24 points (1 day), showing every 2h means 12 ticks -> perfect.

                        const totalPoints = activeDates.length;
                        let step = 1;
                        if (totalPoints > 48) step = 4; // > 2 days, show every 4h
                        if (totalPoints > 96) step = 12; // > 4 days, show every 12h

                        // Override step if user specifically asked for "every 2 hours" implies a short view (e.g. 24h)
                        // But let's be smart. If the view is short (<= 48h), try to show every 2h.
                        if (totalPoints <= 48) {
                          if (hour % 2 !== 0) return null;
                        } else {
                          // Fallback to sparse ticks for long ranges
                          if (index % step !== 0) return null;
                        }

                        // Calculate position percentage
                        const leftPos = (index / (totalPoints - 1)) * 100;

                        // Format: HH:00
                        const label = `${hour.toString().padStart(2, '0')}:00`;

                        return (
                          <div
                            key={index}
                            className="absolute top-0 flex flex-col items-center transform -translate-x-1/2 pt-1"
                            style={{ left: `${leftPos}%` }}
                          >
                            <div className="h-1 w-px bg-slate-300 mb-0.5"></div>
                            <span>{label}</span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                    <XAxis
                      type="number"
                      domain={(() => {
                        if (!activeScores.length) return [-100, 100];
                        const max = Math.max(...activeScores.map(s => Math.abs(s.value)));
                        // 缓冲 15%，按 50 取整，确保刻度美观
                        const rawLimit = max * 1.15;
                        const limit = Math.ceil(rawLimit / 50) * 50 || 100;
                        return [-limit, limit];
                      })()}
                      tickCount={5} // Ensure center (0) and nice intervals
                      tickFormatter={(value) => value.toFixed(0)}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={250}
                      tick={{ fontSize: 11 }}
                      interval={0}
                      tickMargin={12}
                      tickFormatter={(val) => {
                        const name = FIELD_NAME_MAP[val] || val;
                        // Truncate if too long to prevent overlap
                        return name.length > 18 ? name.substring(0, 18) + '...' : name;
                      }}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      labelFormatter={(label) => FIELD_NAME_MAP[label] || label}
                    />
                    <Bar dataKey="value" name="影响分数">
                      {activeScores.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} />
                      ))}
                      <LabelList dataKey="value" position="right" fontSize={10} formatter={(v) => v.toFixed(2)} />
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

      {/* Decision & Action Plan (Dynamic) */}
      <Card className="rounded-2xl border-blue-100 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-500" />
            智能因果解释
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAirScene ? (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
              <div className="font-bold mb-2 text-base">核心发现：PT08.S3(NOx) 是预测 NOx 浓度的决定性因子</div>
              <div className="mb-3">
                模型因果分析表明，在复杂的空气质量预测中，<b>PT08.S3(NOx)</b>（氮氧化物传感器阻值）对目标变量 <b>NOx(GT)</b> 的贡献度最高（0.92，负向），其次是 <b>NO2(GT)</b>（0.88，正向）。
              </div>

              <div className="font-bold mb-2 mt-4">因果机制详解：</div>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold text-blue-700">关键驱动机制 (传感器原理)：</span>
                  <span className="font-mono font-bold mx-1">PT08.S3(NOx)</span>
                  作为金属氧化物半导体传感器，其电阻值与目标气体浓度呈非线性反比关系。因此，热力图中该特征的深蓝色（负值）区域，实际上对应着现实世界中的<b>高 NOx 浓度</b>时段（如早晚交通高峰）。这验证了模型正确捕获了物理传感器的响应特性，而非虚假相关。
                </li>
                <li>
                  <span className="font-semibold text-blue-700">同源排放特征 (红涨)：</span>
                  <span className="font-mono font-bold mx-1">NO2(GT)</span>、<span className="font-mono font-bold mx-1">CO(GT)</span>、<span className="font-mono font-bold mx-1">NMHC(GT)</span>
                  呈现高度一致的红色正向贡献。这符合大气污染的<b>“同源性”</b>特征——即它们主要共同来源于机动车尾气排放。当交通流量增加时，这些污染物浓度同步上升，共同推高 NOx 的预测值。
                </li>
                <li>
                  <span className="font-semibold text-blue-700">光化学滴定效应 (蓝跌)：</span>
                  <span className="font-mono font-bold mx-1">PT08.S5(O3)</span>
                  在午后强光照时段对 NOx 预测呈现负向贡献。这揭示了经典的<b>“NO-O3 滴定效应”</b>（NO + O3 → NO2 + O2）：在光化学反应活跃的午后，高浓度的臭氧往往伴随着前体物（NOx）的快速消耗。模型敏锐地捕捉到了这种“此消彼长”的化学动力学负相关。
                </li>
              </ul>
            </div>
          ) : isMachine ? (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
              <div className="font-bold mb-2 text-base">核心发现：转速与扭矩是机器故障预测的关键驱动因子</div>
              <div className="mb-3">
                模型因果分析表明，在机器预测性维护场景中，<b>转速 [rpm]</b> 和 <b>扭矩 [Nm]</b> 对机器故障预测具有最强的正向影响，是判断设备健康状态的核心指标。
              </div>

              <div className="font-bold mb-2 mt-4">因果机制详解：</div>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold text-blue-700">主驱动因子 - 转速 [rpm]：</span>
                  转速是设备运行强度的直接体现。高转速工况下，机械部件承受更大的离心力和惯性载荷，加速磨损和疲劳累积。模型识别出转速与故障概率呈<b>强正相关</b>，尤其在超过额定转速 80% 后，故障风险显著上升。
                </li>
                <li>
                  <span className="font-semibold text-blue-700">协同驱动因子 - 扭矩 [Nm]：</span>
                  扭矩反映设备的负载强度。高扭矩意味着传动系统承受更大的机械应力，容易引发过载故障（OSF）和功率故障（PWF）。扭矩与转速的<b>交互效应</b>更值得关注——当两者同时处于高位时，故障概率呈指数级上升。
                </li>
                <li>
                  <span className="font-semibold text-blue-700">缓解因子 - 类型 (Type)：</span>
                  设备类型呈现负向影响，表明不同型号设备的故障阈值存在差异。L 型设备（轻载型）相比 H 型设备（重载型）具有更低的故障基线，建议在运维策略中区分对待。
                </li>
                <li>
                  <span className="font-semibold text-blue-700">温度相关因子：</span>
                  <span className="font-mono font-bold mx-1">过程温度 [K]</span> 和 <span className="font-mono font-bold mx-1">空气温度 [K]</span>
                  呈现负向影响，说明在当前数据集中，温度升高反而与故障概率降低相关。这可能反映了设备在正常运行时的热稳态特征——持续稳定运行的设备温度较高，而频繁启停或异常状态下温度波动较大。
                </li>
              </ul>


            </div>
          ) : (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
              <div className="font-bold mb-2 text-base">核心洞察：影响因子热力图解读</div>
              <div className="mb-3">
                基于影响因子热力图分析，我们识别出以下关键特征因子对预测目标具有显著影响：
              </div>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-semibold text-blue-700">关键风险因子：</span>
                  <span className="font-mono font-bold mx-1">{FIELD_NAME_MAP[currentInfluenceScores[0]?.name] || currentInfluenceScores[0]?.name || "Tool wear [min]"}</span>
                  呈现最强的正向影响（{(currentInfluenceScores[0]?.value || 0.45).toFixed(2)}）。随着该指标数值升高，风险显著增加，是需要重点监控的核心预警指标。
                </li>
                {currentInfluenceScores[1] && (
                  <li>
                    <span className="font-semibold text-blue-700">次要影响因子：</span>
                    <span className="font-mono font-bold mx-1">{FIELD_NAME_MAP[currentInfluenceScores[1]?.name] || currentInfluenceScores[1]?.name}</span>
                    也表现出正向关联（{(currentInfluenceScores[1]?.value).toFixed(2)}），但敏感度低于首要因子，可作为辅助判断依据。
                  </li>
                )}
                {currentInfluenceScores.find(s => s.value < 0) && (
                  <li>
                    <span className="font-semibold text-blue-700">缓解因子：</span>
                    <span className="font-mono font-bold mx-1">{FIELD_NAME_MAP[currentInfluenceScores.find(s => s.value < 0)?.name] || currentInfluenceScores.find(s => s.value < 0)?.name}</span>
                    呈现负向影响（{(currentInfluenceScores.find(s => s.value < 0)?.value).toFixed(2)}），表明该参数的适当提升有助于降低风险。
                  </li>
                )}
              </ul>

              <div className="font-bold mb-2 mt-4 text-blue-800">行动建议：</div>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  建议将 <span className="font-mono font-bold">{FIELD_NAME_MAP[currentInfluenceScores[0]?.name] || currentInfluenceScores[0]?.name || "关键因子"}</span> 纳入实时监控大屏，设定动态阈值告警。
                </li>
                <li>
                  针对高风险情况，定期检查 <span className="font-mono font-bold">{FIELD_NAME_MAP[currentInfluenceScores[1]?.name] || currentInfluenceScores[1]?.name}</span> 的状态，提前进行预防性干预。
                </li>
              </ul>
            </div>
          )}
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

function ExportReportPanel({ notify, datasets, runs, sceneId }) {
  const currentScene = SCENES.find(s => s.id === sceneId);
  const trainDataset = datasets.find(d => d.sceneId === sceneId && d.id.includes("train")) || datasets.find(d => d.sceneId === sceneId) || datasets[0];
  const cleanedDataset = datasets.find(d => d.sceneId === sceneId && (d.version.includes("清洗后") || d.id.includes("v2")));

  const isAirScene = sceneId === "air_quality_prediction";
  const isMachineScene = sceneId === "machine_predictive_maintenance_clf";

  let currentInfluenceFactors = MOCK_INFLUENCE_FACTORS;
  let currentInfluenceScores = MOCK_INFLUENCE_SCORES;
  let currentHeatmapDates = MOCK_HEATMAP_DATES;
  let currentHeatmapMatrix = MOCK_HEATMAP_MATRIX;

  const [targetFilter, setTargetFilter] = useState("Machine failure");
  const MACHINE_TARGETS = useMemo(() => ["Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF"], []);

  const activeMachineData = useMemo(() => {
    return MOCK_MACHINE_EXPLAIN_DATA[targetFilter] || MOCK_MACHINE_EXPLAIN_DATA["Machine failure"];
  }, [targetFilter]);

  if (isAirScene) {
    currentInfluenceFactors = MOCK_INFLUENCE_FACTORS_AIR;
    currentInfluenceScores = MOCK_INFLUENCE_SCORES_AIR;
    currentHeatmapDates = MOCK_HEATMAP_DATES_AIR;
    currentHeatmapMatrix = MOCK_HEATMAP_MATRIX_AIR;
  } else if (isMachineScene) {
    currentInfluenceFactors = MOCK_INFLUENCE_FACTORS_MACHINE.filter(f => f !== targetFilter);
    currentInfluenceScores = activeMachineData.scores;
    currentHeatmapDates = MOCK_HEATMAP_DATES_MACHINE;
    currentHeatmapMatrix = activeMachineData.matrix;
  }

  const relevantRuns = runs.filter(r => {
    if (isMachineScene) return r.taskName.includes("机器") || r.target === "Machine failure";
    if (isAirScene) return r.taskName.includes("空气") || r.target === "NOx" || r.target === "CO(GT)";
    return true;
  });

  const bestRun = relevantRuns.find(r => r.status === "已完成") || relevantRuns[0];

  const chartData = useMemo(() => {
    if (isAirScene) {
      return MOCK_NOX_PREDICTION.map((item, i, arr) => {
        const prevItem = i > 0 ? arr[i - 1] : item;
        return {
          ...item,
          pred: prevItem.pred * 0.9,
          upper: prevItem.upper * 0.9,
          lower: prevItem.lower * 0.9
        };
      });
    }
    return bestRun?.chartData || MOCK_PRICE_PREDICTION;
  }, [isAirScene, bestRun]);

  const handleExport = () => {
    notify("正在导出 PDF", "正在生成全流程分析报告...");
    setTimeout(() => {
      notify("导出成功", "报告已下载：LimiX_Analysis_Report_2025.pdf");
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-10">
      <SectionTitle
        icon={FileText}
        title="全流程分析报告"
        desc="汇总数据评估、治理、推理、因果及决策的全链路操作日志与结果。"
        right={
          <Button className="rounded-2xl" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            导出 PDF 报告
          </Button>
        }
      />

      {/* 1. 数据评估报告 */}
      <Card className="rounded-2xl shadow-sm print:shadow-none">
        <CardHeader className="border-b bg-slate-50/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">1</div>
              数据评估报告
            </CardTitle>
            <Badge variant="outline" className="bg-white">Status: 完成</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">场景名称</div>
              <div className="font-medium text-sm">{currentScene?.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">原始数据集</div>
              <div className="font-medium text-sm truncate" title={trainDataset?.name}>{trainDataset?.name}</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">数据规模</div>
              <div className="font-medium text-sm">{formatNum(trainDataset?.rows)} 行, {trainDataset?.cols} 列</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">初始质量评分</div>
              <div className="font-medium text-sm text-orange-600 font-bold">{trainDataset?.qualityScore || 65} 分</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-dashed">
            <div className="text-sm font-semibold mb-2">体检摘要</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">缺失率</span>
                <span className="text-sm font-mono text-slate-700">5.2%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">异常值</span>
                <span className="text-sm font-mono text-slate-700">2.1%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">重复数据</span>
                <span className="text-sm font-mono text-slate-700">1.5%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">主要问题</span>
                <span className="text-sm text-slate-700">存在多列缺失，部分字段口径不统一</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 数据治理报告 */}
      <Card className="rounded-2xl shadow-sm print:shadow-none">
        <CardHeader className="border-b bg-slate-50/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">2</div>
              数据治理报告
            </CardTitle>
            <Badge variant="outline" className={`bg-white ${cleanedDataset ? "text-green-600 border-green-200" : "text-slate-400"}`}>
              {cleanedDataset ? "Status: 完成" : "Status: 未执行"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {cleanedDataset ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">治理后版本</div>
                  <div className="font-medium text-sm">{cleanedDataset.version}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">治理后评分</div>
                  <div className="font-medium text-sm text-green-600 font-bold">{cleanedDataset.qualityScore} 分</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">处理耗时</div>
                  <div className="font-medium text-sm">45s</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">保留行数</div>
                  <div className="font-medium text-sm">{formatNum(cleanedDataset.rows)} 行</div>
                </div>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-muted-foreground font-medium">
                    <tr>
                      <th className="px-4 py-2">应用规则</th>
                      <th className="px-4 py-2">处理方式</th>
                      <th className="px-4 py-2">影响行数</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="px-4 py-2">R-1 数据去重</td>
                      <td className="px-4 py-2">保留最新一条</td>
                      <td className="px-4 py-2 font-mono">120</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">R-2 异常值处理</td>
                      <td className="px-4 py-2">3σ原则剔除</td>
                      <td className="px-4 py-2 font-mono">45</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">R-3 缺失值填补</td>
                      <td className="px-4 py-2">随机森林插值</td>
                      <td className="px-4 py-2 font-mono">850</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-4 text-sm">尚未执行数据治理操作</div>
          )}
        </CardContent>
      </Card>

      {/* 3. 推理分析报告 */}
      <Card className="rounded-2xl shadow-sm print:shadow-none">
        <CardHeader className="border-b bg-slate-50/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">3</div>
              推理分析报告
            </CardTitle>
            <Badge variant="outline" className="bg-white">Status: 完成</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-700">最佳模型表现 ({bestRun?.model || "LimiX"})</div>
            <div className="text-xs text-muted-foreground">Task ID: {bestRun?.id}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {bestRun?.taskType === "分类" || sceneId.includes("clf") ? (
              <>
                <MetricPill label="AUC" value={bestRun?.metrics?.AUC || 0.88} unit="" />
                <MetricPill label="Accuracy" value={bestRun?.metrics?.acc || 0.85} unit="" />
                <MetricPill label="F1-Score" value={bestRun?.metrics?.F1 || 0.82} unit="" />
              </>
            ) : (
              <>
                <MetricPill label="RMSE" value={bestRun?.metrics?.RMSE || 2.57} unit="" />
                <MetricPill label="MAPE" value={bestRun?.metrics?.MAPE || 0.03} unit="" />
                <MetricPill label="R2" value={bestRun?.metrics?.R2 || 0.92} unit="" />
              </>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-slate-50">
            <div className="text-sm font-semibold mb-2">模型参数配置</div>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">模型架构</span>
                <span>{bestRun?.model || "LimiX"}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">训练模式</span>
                <span>精确模式 (High Quality)</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">目标列</span>
                <span>{bestRun?.target || "label"}</span>
              </div>
              <div className="flex justify-between border-b border-dashed pb-1">
                <span className="text-muted-foreground">特征数量</span>
                <span>12</span>
              </div>
            </div>
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="text-sm font-semibold mb-3">历史任务记录 (Top 5)</div>
            <div className="overflow-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-muted-foreground border-b">
                    <th className="py-2 pl-2">任务名称</th>
                    <th className="py-2">类型</th>
                    <th className="py-2">状态</th>
                    <th className="py-2">核心指标</th>
                    <th className="py-2">耗时</th>
                    <th className="py-2">创建时间</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantRuns.slice(0, 5).map(r => (
                    <tr key={r.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                      <td className="py-2 pl-2 font-medium text-slate-700">{r.taskName}</td>
                      <td className="py-2"><Badge variant="outline" className="text-[10px] h-5 px-1">{r.taskType}</Badge></td>
                      <td className="py-2">
                        <Badge
                          variant="outline"
                          className={`text-[10px] h-5 px-1 ${r.status === "已完成" ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50"}`}
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="py-2 font-mono text-blue-600 font-medium">
                        {r.taskType === "分类" ? `AUC: ${r.metrics?.AUC || '-'}` : `RMSE: ${r.metrics?.RMSE || '-'}`}
                      </td>
                      <td className="py-2 text-muted-foreground">{r.durationSec ? `${r.durationSec}s` : '-'}</td>
                      <td className="py-2 text-muted-foreground">{r.createTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">核心结果可视化</div>
            <div className="h-72 border rounded-xl bg-white p-2">
              {sceneId.includes("clf") || sceneId === "machine_predictive_maintenance_clf" || bestRun?.taskType === "分类" ? (
                <div className="grid md:grid-cols-2 gap-4 h-full p-2">
                  <div className="h-full flex flex-col">
                    <div className="text-xs text-center mb-2 font-medium text-slate-500">ROC 曲线</div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getRocData(bestRun?.target || "Machine failure")} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis
                            type="number"
                            dataKey="fpr"
                            domain={[0, 1]}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            label={{ value: 'FPR', position: 'insideBottom', offset: -5, fontSize: 10, fill: "#94a3b8" }}
                          />
                          <YAxis
                            domain={[0, 1]}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            label={{ value: 'TPR', angle: -90, position: 'insideLeft', fontSize: 10, fill: "#94a3b8" }}
                          />
                          <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                          <Legend verticalAlign="top" height={20} iconType="plainline" wrapperStyle={{ fontSize: "10px" }} />
                          <Line type="linear" dataKey="random" name="随机猜测" stroke="#cbd5e1" strokeDasharray="3 3" dot={false} strokeWidth={1} />
                          <Line type="linear" dataKey="tpr" name={`AUC = ${bestRun?.metrics?.AUC || 0.94}`} stroke="#f97316" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="h-full flex flex-col">
                    <div className="text-xs text-center mb-2 font-medium text-slate-500">P-R 曲线</div>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getPrData(bestRun?.target || "Machine failure")} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis
                            type="number"
                            dataKey="recall"
                            domain={[0, 1]}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            label={{ value: 'Recall', position: 'insideBottom', offset: -5, fontSize: 10, fill: "#94a3b8" }}
                          />
                          <YAxis
                            domain={[0, 1]}
                            tick={{ fontSize: 10, fill: "#94a3b8" }}
                            label={{ value: 'Precision', angle: -90, position: 'insideLeft', fontSize: 10, fill: "#94a3b8" }}
                          />
                          <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                          <Legend verticalAlign="top" height={20} iconType="plainline" wrapperStyle={{ fontSize: "10px" }} />
                          <Line type="linear" dataKey="baseline" name="基线" stroke="#cbd5e1" strokeDasharray="3 3" dot={false} strokeWidth={1} />
                          <Line type="linear" dataKey="precision" name="PR曲线" stroke="#2563eb" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData || MOCK_PRICE_PREDICTION} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        minTickGap={30}
                      />
                      <YAxis
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        unit={sceneId === "air_quality_prediction" ? "" : "元"}
                        width={35}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)", fontSize: "12px" }}
                        cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "4 4" }}
                      />
                      <Legend verticalAlign="top" height={20} iconType="plainline" wrapperStyle={{ fontSize: "10px" }} />
                      <Line
                        type="monotone"
                        dataKey="pred"
                        name={sceneId === "air_quality_prediction" ? "预测浓度" : "预测电价"}
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, strokeWidth: 0, fill: "#2563eb" }}
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
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. 因果解释与决策 */}
      <Card className="rounded-2xl shadow-sm print:shadow-none break-inside-avoid">
        <CardHeader className="border-b bg-slate-50/50 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">4</div>
              因果解释与决策建议
            </CardTitle>
            <Badge variant="outline" className="bg-white">Status: 完成</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-6">
          {/* 1. 影响因子热力图 */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold">影响因子热力图</div>
              {isMachineScene && (
                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <span className="text-xs font-medium text-slate-500 pl-2">目标:</span>
                  <div className="flex gap-1">
                    {MACHINE_TARGETS.map(t => (
                      <Button
                        key={t}
                        variant={targetFilter === t ? "default" : "ghost"}
                        size="sm"
                        className={`rounded-md h-6 text-[10px] px-2 ${targetFilter === t ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-200"}`}
                        onClick={() => setTargetFilter(t)}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="border rounded-xl p-4 bg-slate-50 overflow-hidden">
              <DivergingHeatGrid rows={currentHeatmapDates} cols={currentInfluenceFactors} matrix={currentHeatmapMatrix} />
            </div>
          </div>

          {/* 2. 影响因子分数对比 */}
          <div>
            <div className="text-sm font-semibold mb-3">影响因子分数对比</div>
            <div className="h-[400px] border rounded-xl py-4 pr-4 pl-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={[...currentInfluenceScores].sort((a, b) => Math.abs(b.value) - Math.abs(a.value))}
                  margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                  <XAxis
                    type="number"
                    domain={['auto', 'auto']}
                    interval={0}
                  />
                  <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 10 }} interval={0} tickMargin={5} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Bar dataKey="value" name="影响分数">
                    {[...currentInfluenceScores].sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#ef4444' : '#3b82f6'} />
                    ))}
                    <LabelList dataKey="value" content={<CustomScoreBarLabel />} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. 详细行动方案 */}
          <div>
            <div className="text-sm font-semibold mb-3">智能决策与详细行动方案</div>
            {isAirScene ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
                <div className="font-bold mb-2 text-base">核心建议：重点管控“{currentInfluenceScores[0]?.name || "CO(GT)"}”排放源</div>
                <div className="mb-3">
                  基于因果推演仿真，若该污染物浓度降低 15%，预计 NOx 峰值浓度将下降 10.5%。建议优先关注交通晚高峰时段的排放控制。
                </div>

                <div className="font-bold mb-2 mt-4">详细行动计划：</div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">交通限行升级：</span>
                    针对 CO 和 NOx 高相关性，建议在预测污染指数超过 150 的前 6 小时启动单双号限行措施。
                  </li>
                  <li>
                    <span className="font-semibold">工业错峰生产：</span>
                    对重点排放企业（如化工厂、喷涂厂）实施错峰生产，在气象条件不利于扩散的时段（AH &gt; 1.2）停止排放。
                  </li>
                  <li>
                    <span className="font-semibold">模型持续校准：</span>
                    鉴于湿度（RH）对传感器读数的显著负向影响，建议每 2 周进行一次基准线校准，以消除环境漂移。
                  </li>
                  <li>
                    <span className="font-semibold">公众健康预警：</span>
                    当预测未来 3 小时 NOx 浓度持续上升时，自动通过短信和 App 推送健康防护建议（减少户外运动）。
                  </li>
                </ul>
              </div>
            ) : isMachineScene ? (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
                <div className="font-bold mb-2 text-base">核心建议： 重点关注“Type”磨损指标</div>
                <div className="mb-3">
                  基于因果推演仿真，若将刀具磨损阈值降低 10%，预计非计划停机率将下降 15%。建议在刀具磨损达到 200min 时提前介入。
                </div>

                <div className="font-bold mb-2 mt-4">详细行动计划：</div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">预防性维护策略：</span>
                    针对高风险设备，建议将巡检周期从“每日一次”调整为“每班次一次”，重点检查 Torque 和 Tool wear 指标。
                  </li>
                  <li>
                    <span className="font-semibold">工艺参数优化：</span>
                    在加工高硬度材料时，建议适当降低 Rotational speed，以减少 Tool wear 的积累速度，延长设备寿命。
                  </li>
                  <li>
                    <span className="font-semibold">备件库存联动：</span>
                    当预测未来 24 小时故障概率超过 70% 时，自动触发备件调拨请求，确保维修备件在 2 小时内到位。
                  </li>
                  <li>
                    <span className="font-semibold">操作员辅助系统：</span>
                    将实时故障风险指数集成到操作台屏幕，当风险 &gt; 0.6 时，强制弹窗提醒操作员关注异常震动。
                  </li>
                </ul>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-800 leading-relaxed">
                <div className="font-bold mb-2 text-base">核心建议：将“{currentInfluenceScores[0]?.name || "影响因子"}”作为关键调控抓手</div>
                <div className="mb-3">
                  基于因果推演仿真，若该指标提升 10%，预计目标值将优化 5.2%。建议优先关注 R05 区域的异常波动。
                </div>

                <div className="font-bold mb-2 mt-4">详细行动计划：</div>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <span className="font-semibold">实时监控告警：</span>
                    针对“实时-日前偏差值_D-2_label”指标，建立小时级监控告警机制，偏差超过 15% 即触发预警。
                  </li>
                  <li>
                    <span className="font-semibold">区域资源优化：</span>
                    对 R05 区域实施驻点优化，配置专项资源提升响应速度，确保异常发生时 15 分钟内介入。
                  </li>
                  <li>
                    <span className="font-semibold">模型稳定性保障：</span>
                    开展每周一次的影响因子漂移检测，一旦发现主要影响因子权重发生显著变化（PSI &gt; 0.2），立即启动模型重训练。
                  </li>
                  <li>
                    <span className="font-semibold">业务赋能培训：</span>
                    组织业务团队培训，普及影响因子分析结果的应用方法，提升一线人员对数据驱动决策的信任度与执行力。
                  </li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground pt-4">
        Generated by LimiX Analytics Platform · {nowTimeStr()}
      </div>
    </div>
  );
}

function ComparePanel({ notify, openModal, sceneId, runs }) {
  const isClf = sceneId === "sd_high_price_clf";
  const isAir = sceneId === "air_quality_prediction";
  const isMachine = sceneId === "machine_predictive_maintenance_clf";

  const MACHINE_TARGETS = useMemo(() => ["Machine failure", "TWF", "HDF", "PWF", "OSF", "RNF"], []);

  const availableRuns = useMemo(() => {
    let base = runs || [];

    // Check if runs contain tasks relevant to the current scene
    const runsHasAir = base.some(r => r.taskName.includes("空气质量") || r.id.includes("AIR") || r.target === "NOx(GT)");
    const runsHasClf = base.some(r => r.taskName.includes("分类") || r.id.includes("CLF"));
    const runsHasMachine = base.some(r => r.taskName.includes("机器") || r.id.includes("MAC"));

    if (sceneId === "air_quality_prediction" && (!runsHasAir || base.length === 0)) {
      base = [{
        id: "run-AIR-001",
        taskName: "空气质量预测_1",
        taskType: "回归",
        target: "NOx(GT)",
        status: "已完成",
        version: "data:v1 · seed:42 · mode:精",
        createTime: "2024-03-25 10:00:00",
        finishTime: "2024-03-25 10:05:23",
        metrics: { RMSE: 12.5, MAPE: 0.15, MSE: 156.25, MAE: 10.2 },
      }];
    } else if (sceneId === "sd_high_price_clf" && (!runsHasClf || base.length === 0)) {
      base = [{
        id: "run-CLF-001",
        taskName: "山东省搏高价分类预测_1",
        taskType: "分类",
        target: "label",
        status: "已完成",
        version: "data:v2 · seed:42 · mode:精",
        createTime: "2025-12-25 10:30:00",
        finishTime: "2025-12-25 10:30:45",
      }];
    } else if (isMachine && (!runsHasMachine || base.length === 0)) {
      base = MACHINE_TARGETS.map((tgt, i) => ({
        id: `run-MAC-${100 + i}`,
        taskName: `机器预测性维护分类_1`,
        taskType: "分类",
        target: tgt,
        status: "已完成",
        version: "data:v1 · seed:42 · mode:精",
        createTime: "2026-01-28 10:00:00",
        finishTime: "2026-01-28 10:01:30",
        durationSec: (1.5 + Math.random()).toFixed(1),
        metrics: { AUC: (0.9 + Math.random() * 0.09).toFixed(3), F1: (0.85 + Math.random() * 0.1).toFixed(3), acc: (0.9 + Math.random() * 0.08).toFixed(3) }
      }));
    } else if (base.length === 0) {
      base = MOCK_RUNS_BASE;
    }
    return base.filter(r => r.taskName !== "缺失值填补_RF");
  }, [sceneId, runs, isMachine, MACHINE_TARGETS]);

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
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-white shadow-sm border-slate-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-slate-600">模型</th>
                  {isMachine ? (
                    <>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">AUC</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">ACC (准确率)</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">F1</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">Recall (召回率)</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">Precision (精确率)</th>
                    </>
                  ) : (
                    <>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">MSE (均方误差)</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">RMSE (均方根误差)</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">MAE (平均绝对误差)</th>
                      <th className="py-3 px-4 text-left font-medium text-slate-600">MAPE (平均绝对百分比误差)</th>
                    </>
                  )}
                  <th className="py-3 px-4 text-left font-medium text-slate-600">推理耗时</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(sceneId === "sd_high_price_clf" || currentRun?.taskType === "分类" || isMachine) ? (
                  // Machine Predictive Maintenance or other classification
                  isMachine ? (
                    <>
                      <tr className="bg-blue-50/30">
                        <td className="py-3 px-4 font-semibold text-blue-700 flex items-center gap-2">
                          LimiX <Badge className="text-[10px] h-5 px-1 bg-blue-100 text-blue-700 border-none">本任务</Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.856</td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.852</td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.849</td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.853</td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.0.851</td>
                        <td className="py-3 px-4 font-mono text-slate-700">1.5s</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-700">PatchTST</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.792</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.788</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.781</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.787</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.784</td>
                        <td className="py-3 px-4 font-mono text-slate-600">14min</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-700">DeepSeek</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.560</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.557</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.554</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.565</td>
                        <td className="py-3 px-4 font-mono text-slate-600">0.559</td>
                        <td className="py-3 px-4 font-mono text-slate-600">7.9s</td>
                      </tr>
                    </>
                  ) : (
                    // Existing classification logic for other scenes
                    <>
                      <tr className="bg-blue-50/30">
                        <td className="py-3 px-4 font-semibold text-blue-700 flex items-center gap-2">
                          LimiX <Badge className="text-[10px] h-5 px-1 bg-blue-100 text-blue-700 border-none">本任务</Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.12</td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.35</td>
                        <td className="py-3 px-4 font-mono text-slate-700">0.28</td>
                        <td className="py-3 px-4 font-mono text-slate-700">N/A</td>
                        <td className="py-3 px-4 font-mono text-slate-700">11s</td>
                      </tr>
                    </>
                  )
                ) : (
                  <>
                    <tr className="bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-blue-700 flex items-center gap-2">
                        LimiX <Badge className="text-[10px] h-5 px-1 bg-blue-100 text-blue-700 border-none">本任务</Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{currentRun?.metrics?.MSE || 6.59}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{currentRun?.metrics?.RMSE || 2.57}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{currentRun?.metrics?.MAE || 2.26}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">{currentRun?.metrics?.MAPE || 0.08}</td>
                      <td className="py-3 px-4 font-mono text-slate-700">11s</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">PatchTST</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.MSE || 6.59) * 1.7).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.RMSE || 2.57) * 1.3).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.MAE || 2.26) * 1.7).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.MAPE || 0.08) * 1.7).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">28s</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">DeepSeek</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.MSE || 6.59) * 3.5).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.RMSE || 2.57) * 1.9).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.MAE || 2.26) * 3.0).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{(parseFloat(currentRun?.metrics?.MAPE || 0.08) * 3.0).toFixed(2)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">39s</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {isMachine && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">模型指标对比</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { metric: 'AUC', LimiX: 0.972, PatchTST: 0.958, DeepSeek: 0.942 },
                    { metric: 'ACC', LimiX: 0.965, PatchTST: 0.951, DeepSeek: 0.936 },
                    { metric: 'F1', LimiX: 0.962, PatchTST: 0.945, DeepSeek: 0.932 },
                    { metric: 'Recall', LimiX: 0.960, PatchTST: 0.940, DeepSeek: 0.925 },
                    { metric: 'Precision', LimiX: 0.968, PatchTST: 0.952, DeepSeek: 0.938 },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="metric" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0.9, 1]} />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
                  <Bar dataKey="LimiX" fill="#93c5fd" radius={[4, 4, 0, 0]} name="LimiX" />
                  <Bar dataKey="PatchTST" fill="#fcd34d" radius={[4, 4, 0, 0]} name="PatchTST" />
                  <Bar dataKey="DeepSeek" fill="#d8b4fe" radius={[4, 4, 0, 0]} name="DeepSeek" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {!isMachine && (
        <div className="grid md:grid-cols-2 gap-3">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-base">LimiX vs PatchTST</CardTitle>
            </CardHeader>
            <CardContent>
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
                          return `${d.getMonth() + 1}-${d.getDate()}`;
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
                          return `${d.getMonth() + 1}-${d.getDate()}`;
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
                      <Scatter name="PatchTST" data={MOCK_CLF_COMPARISON_POINTS.map(d => ({ timestamp: d.timestamp, value: d.autogluon, y: 0 }))} shape={(props) => props.payload.value === null ? null : <CustomizedDot {...props} shape={props.payload.value === 1 ? "circle" : "cross"} />} />
                    </ScatterChart>
                  ) : (
                    <LineChart data={isAir ? MOCK_MODEL_COMPARISON_AIR : MOCK_MODEL_COMPARISON} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        interval={isAir ? 23 : 4} // Daily tick for Air (hourly data)
                        tickFormatter={isAir ? (ts) => {
                          const d = new Date(ts);
                          return `${d.getMonth() + 1}-${d.getDate()}`;
                        } : undefined}
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
                        labelFormatter={isAir ? (ts) => {
                          const d = new Date(ts);
                          return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`;
                        } : undefined}
                        formatter={(value) => [`${value.toFixed(1)} ${isAir ? "ppb" : "元/MWh"}`, ""]}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                      <Line type="monotone" dataKey="truth" name="真实值" stroke="#334155" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                      <Line type="monotone" dataKey="limix" name="LimiX" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="patchtst" name="PatchTST" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
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
                        <td className="border border-slate-200 p-2 font-medium text-slate-700">PatchTST</td>
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
            </CardHeader>
            <CardContent>
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
                          return `${d.getMonth() + 1}-${d.getDate()}`;
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
                          return `${d.getMonth() + 1}-${d.getDate()}`;
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
                    <LineChart data={isAir ? MOCK_MODEL_COMPARISON_AIR : MOCK_MODEL_COMPARISON} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10, fill: "#64748b" }}
                        tickLine={false}
                        axisLine={false}
                        interval={isAir ? 23 : 4} // Daily tick for Air (hourly data)
                        tickFormatter={isAir ? (ts) => {
                          const d = new Date(ts);
                          return `${d.getMonth() + 1}-${d.getDate()}`;
                        } : undefined}
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
                        labelFormatter={isAir ? (ts) => {
                          const d = new Date(ts);
                          return `${d.getMonth() + 1}-${d.getDate()} ${d.getHours()}:00`;
                        } : undefined}
                        formatter={(value) => [`${value.toFixed(1)} ${isAir ? "ppb" : "元/MWh"}`, ""]}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                      <Line type="monotone" dataKey="truth" name="真实值" stroke="#334155" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                      <Line type="monotone" dataKey="limix" name="LimiX" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="llm" name="DeepSeek" stroke="#d8b4fe" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}






    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center">
          <div className="inline-block p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-lg text-left">
            <h3 className="font-bold text-lg mb-2">组件渲染错误</h3>
            <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto max-h-64 bg-white p-2 rounded border border-red-100">
              {this.state.error?.toString()}
            </pre>
            <button
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function LimixDemoMockPreview() {
  const [active, setActive] = useState("datasets");
  const [sceneId, setSceneId] = useState("machine_predictive_maintenance_clf");
  const [quickMode, setQuickMode] = useState(true);
  const [datasetId, setDatasetId] = useState("test_+5_v1");
  const [datasets, setDatasets] = useState(MOCK_DATASETS); // Initialize with mock data
  const [runs, setRuns] = useState(MOCK_RUNS_BASE);

  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState({ open: false, title: "", content: null });
  const scrollContainerRef = useRef(null);

  // Auto scroll to top on active tab change
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [active]);

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
      pilot: 6,
      deliver: 7,
      compare: 7,
    };
    return map[active] ?? 0;
  }, [active]);

  return (
    <ErrorBoundary>
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

            <div ref={scrollContainerRef} className="flex-1 h-full overflow-y-auto pr-1">
              <div className="space-y-4 pb-8">
                {active === "datasets" && <DatasetsPanel datasetId={datasetId} setDatasetId={setDatasetId} notify={notify} openModal={openModal} closeModal={closeModal} datasets={datasets} setDatasets={setDatasets} sceneId={sceneId} />}
                {active === "health" && <HealthPanel datasetId={datasetId} notify={notify} openModal={openModal} setActive={setActive} datasets={datasets} setDatasetId={setDatasetId} sceneId={sceneId} />}
                {active === "clean" && <CleanPanel datasetId={datasetId} setDatasetId={setDatasetId} notify={notify} openModal={openModal} datasets={datasets} setDatasets={setDatasets} sceneId={sceneId} />}
                {(active === "tasks" || active === "results" || active === "compare") && (
                  <TasksPanel
                    quickMode={quickMode}
                    runs={runs}
                    setRuns={setRuns}
                    notify={notify}
                    sceneId={sceneId}
                    datasetId={datasetId}
                    setDatasetId={setDatasetId}
                    datasets={datasets}
                    openModal={openModal}
                    initialTab={active === "tasks" ? "tasks" : active}
                  />
                )}
                {active === "explain" && <ExplainPanel notify={notify} openModal={openModal} sceneId={sceneId} runs={runs} />}
                {active === "pilot" && <CausalPilotPanel notify={notify} sceneId={sceneId} />}
                {active === "report" && <ExportReportPanel notify={notify} datasets={datasets} runs={runs} sceneId={sceneId} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
