import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Compass, Zap, Settings, AlertTriangle, RotateCcw, CheckCircle2, PlayCircle } from 'lucide-react';
import { SectionTitle } from '../common';
import { cn } from "@/lib/utils";
import { Slider } from "@arco-design/web-react";

const INITIAL_PARAMS = {
  "Type": { value: "M (中等)", type: "immutable", unit: "", remark: "机器型号已定" },
  "环境温度": { value: 298.1, type: "immutable", unit: "K", remark: "厂房环境温度" },
  "过程温度": { value: 308.6, type: "result", unit: "K", remark: "随转速变化" },
  "转速": { value: 1550, type: "actionable", unit: "rpm", min: 1200, max: 3000, step: 10, remark: "可以调节旋钮" },
  "扭矩": { value: 52.5, type: "actionable", unit: "Nm", min: 10, max: 80, step: 0.5, remark: "随负载调整" },
  "工具磨损": { value: 232, type: "costly", unit: "min", min: 0, max: 250, step: 1, remark: "需要停机换刀" },
};

const INITIAL_PARAMS_AIR = {
  "T": { value: 25.0, type: "immutable", unit: "°C", remark: "环境温度" },
  "RH": { value: 60.0, type: "immutable", unit: "%", remark: "相对湿度" },
  "CO(GT)": { value: 2.5, type: "actionable", unit: "mg/m^3", min: 0, max: 10, step: 0.1, remark: "一氧化碳浓度 (可控)" },
  "NMHC(GT)": { value: 150, type: "actionable", unit: "µg/m^3", min: 0, max: 300, step: 10, remark: "非甲烷烃 (工业排放)" },
  "NOx(GT)": { value: 180, type: "result", unit: "ppb", remark: "氮氧化物 (预测目标)" },
};

const MOCK_PLANS = [
  {
    id: "A",
    title: "方案 A：更换刀具 (根因治理)",
    type: "recommended",
    action: "重置 Tool wear (关键风险因子)",
    operation: "232 min → 0 min",
    targetParams: { "工具磨损": 0 },
    prob: 99,
    sideEffect: "需停机换刀 (30min)",
    color: "blue"
  },
  {
    id: "B",
    title: "方案 B：降低扭矩 (临时缓解)",
    type: "temporary",
    action: "降低 Torque (次要因子)",
    operation: "52.5 Nm → 40.0 Nm",
    targetParams: { "扭矩": 40.0 },
    prob: 65,
    sideEffect: "加工效率降低 20%",
    color: "green"
  },
  {
    id: "C",
    title: "方案 C：激进提速 (高风险)",
    type: "aggressive",
    action: "提升转速试图补偿效率",
    operation: "1550 rpm → 2200 rpm",
    targetParams: { "转速": 2200 },
    prob: 15,
    sideEffect: "极高概率导致直接停机",
    color: "orange"
  }
];

const MOCK_PLANS_AIR = [
  {
    id: "A",
    title: "方案 A：交通限行 (推荐)",
    type: "recommended",
    action: "限制单双号通行，降低 CO",
    operation: "2.5 → 1.5 mg/m^3",
    targetParams: { "CO(GT)": 1.5 },
    prob: 90,
    sideEffect: "市民出行不便",
    color: "blue"
  },
  {
    id: "B",
    title: "方案 B：工业减排",
    type: "root",
    action: "暂停周边工厂排放，降低 NMHC",
    operation: "150 → 80 µg/m^3",
    targetParams: { "NMHC(GT)": 80 },
    prob: 95,
    sideEffect: "工业产值受损",
    color: "green"
  },
  {
    id: "C",
    title: "方案 C：人工增雨",
    type: "aggressive",
    action: "实施局部人工增雨",
    operation: "RH 60% → 85%",
    targetParams: { "RH": 85 },
    prob: 70,
    sideEffect: "成本较高，影响局部天气",
    color: "orange"
  }
];

export function CausalPilotPanel({ notify, sceneId }) {
  const isAirScene = sceneId === "air_quality_prediction";
  const [params, setParams] = useState(isAirScene ? INITIAL_PARAMS_AIR : INITIAL_PARAMS);
  const [generated, setGenerated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [simulating, setSimulating] = useState(false);

  // Reset params when scene changes
  useEffect(() => {
    setParams(isAirScene ? INITIAL_PARAMS_AIR : INITIAL_PARAMS);
    setGenerated(false);
    setSelectedPlan(null);
  }, [isAirScene]);

  const currentMockPlans = isAirScene ? MOCK_PLANS_AIR : MOCK_PLANS;

  // 简单的模拟预测逻辑
  const prediction = useMemo(() => {
    if (isAirScene) {
        // Air Quality Logic
        const co = params["CO(GT)"]?.value || 0;
        const nmhc = params["NMHC(GT)"]?.value || 0;
        const rh = params["RH"]?.value || 0;
        
        // Simple mock formula for NOx
        // Base 50 + CO*20 + NMHC*0.2 + RH*0.5
        const predictedNOx = 50 + (co * 20) + (nmhc * 0.2) + (rh * 0.5);
        
        let result = { label: "优 (Excellent)", color: "text-green-600", icon: CheckCircle2 };
        if (predictedNOx > 200) {
             result = { label: "严重污染 (Severe)", color: "text-red-800", icon: AlertTriangle };
        } else if (predictedNOx > 150) {
             result = { label: "重度污染 (Heavy)", color: "text-red-600", icon: AlertTriangle };
        } else if (predictedNOx > 100) {
             result = { label: "轻度污染 (Light)", color: "text-orange-600", icon: AlertTriangle };
        } else if (predictedNOx > 50) {
             result = { label: "良 (Good)", color: "text-blue-600", icon: CheckCircle2 };
        }
        
        return { ...result, value: predictedNOx.toFixed(1), unit: "ppb" };
    }

    const speed = params["转速"]?.value || 0;
    const torque = params["扭矩"]?.value || 0;
    const wear = params["工具磨损"]?.value || 0;
    
    // Process temperature 随 speed 和 torque 变化
    // Base 300K + speed factor + torque factor
    const procTemp = 300.1 + (speed - 1200) * 0.005 + (torque - 10) * 0.1;
    
    let result = { label: "Normal", color: "text-green-600", icon: CheckCircle2 };
    
    // Updated Logic aligned with ExplainPanel (Key: Tool wear, Secondary: Torque)
    if (wear > 250) {
      result = { label: "严重工具故障", color: "text-red-800", icon: AlertTriangle };
    } else if (wear > 220 && torque > 45) {
      result = { label: "工具磨损故障", color: "text-red-600", icon: AlertTriangle };
    } else if (torque > 60) {
      result = { label: "功率故障", color: "text-orange-600", icon: AlertTriangle };
    } else if (speed > 2800) {
      result = { label: "热耗散故障", color: "text-orange-600", icon: AlertTriangle };
    }

    return { ...result, value: procTemp.toFixed(1), unit: "K" };
  }, [params, isAirScene]);

  const handleParamChange = (key, val) => {
    setParams(prev => ({
      ...prev,
      [key]: { ...prev[key], value: val }
    }));
  };

  const handleGenerate = () => {
    setSimulating(true);
    setTimeout(() => {
      setGenerated(true);
      setSimulating(false);
      notify("因果推演完成", "已生成 3 个反事实干预方案");
    }, 1500);
  };

  const applyPlan = (plan) => {
    setSelectedPlan(plan.id);
    const newParams = { ...params };
    Object.keys(plan.targetParams).forEach(key => {
      newParams[key] = { ...newParams[key], value: plan.targetParams[key] };
    });
    setParams(newParams);
    notify("方案已应用", `已自动调整参数：${plan.operation}`);
  };

  const autoOptimize = () => {
    // 自动寻找最佳方案 (模拟)
    const bestPlan = currentMockPlans[0];
    applyPlan(bestPlan);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-500">
      <SectionTitle
        icon={Compass}
        title="因果推演"
        right={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline" className="font-normal bg-blue-50 text-blue-700 border-blue-200">
              {isAirScene ? "Target: NOx < 100 ppb" : "Target: 故障 (1) → 正常 (0)"}
            </Badge>
            <span>Case ID: {isAirScene ? "AIR-20240325" : "M14860"}</span>
          </div>
        }
      />

      <div className="grid md:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left Column: Simulation Panel (Red Box) */}
        <div className="md:col-span-1 h-full">
          <Card className="rounded-2xl shadow-sm border-blue-100 ring-4 ring-blue-50/30 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-dashed bg-slate-50/50 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  实时仿真面板
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:bg-blue-50" onClick={autoOptimize}>
                   <Zap className="w-3 h-3 mr-1" />
                   一键优化
                </Button>
              </div>
              <CardDescription className="flex items-center gap-2 mt-2">
                预测结果: 
                <span className={cn("font-bold flex items-center gap-1", prediction.color)}>
                  <prediction.icon className="w-3 h-3" />
                  {prediction.label}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
               <div className="divide-y">
                 {Object.entries(params).map(([key, config]) => (
                   <div key={key} className="p-4 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center justify-between mb-2">
                       <div className="flex flex-col">
                         <span className="text-sm font-medium text-slate-700">{key}</span>
                         <span className="text-[10px] text-slate-400">{config.remark}</span>
                       </div>
                       <div className="text-right">
                         <div className="font-mono text-sm font-bold">
                           {config.type === "result" ? prediction.value : config.value} 
                           <span className="text-xs font-normal text-muted-foreground ml-1">{config.unit}</span>
                         </div>
                         <Badge 
                            variant="secondary" 
                            className={cn(
                              "text-[10px] h-4 px-1 font-normal mt-0.5",
                              config.type === "immutable" ? "bg-slate-100 text-slate-500" :
                              config.type === "actionable" ? "bg-green-50 text-green-600 border-green-100" :
                              config.type === "costly" ? "bg-orange-50 text-orange-600 border-orange-100" :
                              "bg-blue-50 text-blue-600 border-blue-100"
                            )}
                          >
                            {config.type === "immutable" ? "不可变" : 
                             config.type === "actionable" ? "可调节" :
                             config.type === "costly" ? "高成本" : "结果变量"}
                          </Badge>
                       </div>
                     </div>
                     
                     {/* 交互控件 */}
                     {(config.type === "actionable" || config.type === "costly") && (
                       <div className="pt-1 px-1">
                         <Slider 
                           value={config.value} 
                           min={config.min} 
                           max={config.max} 
                           step={config.step}
                           onChange={(val) => handleParamChange(key, val)}
                           showInput={false}
                           className="w-full"
                         />
                       </div>
                     )}
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Config (Yellow Box) + Recommendations (Blue Box) */}
        <div className="md:col-span-1 flex flex-col gap-6 h-full">
          {/* Top Right: Config (Yellow Box - approx 1/3 height) */}
          <div className="shrink-0">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  反事实推演配置
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="space-y-1">
                    <div className="text-slate-600">目标</div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                        {isAirScene ? "NOx < 100 ppb" : "Target = 0 (Normal)"}
                    </Badge>
                  </div>
                  <Button 
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all px-6" 
                    size="default"
                    onClick={handleGenerate}
                    disabled={simulating}
                  >
                    {simulating ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                        计算中...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        生成方案
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2 pt-2 border-t">
                  <div className="text-xs font-medium text-slate-500">约束条件</div>
                  <div className="flex flex-wrap gap-4">
                    {isAirScene ? (
                        <>
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                            <Switch checked={true} disabled size="small" />
                            <span className="opacity-50 text-xs">环境温度 (T) 不可变</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                            <Switch checked={true} disabled size="small" />
                            <span className="opacity-50 text-xs">湿度 (RH) 不可变</span>
                            </label>
                        </>
                    ) : (
                        <>
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                            <Switch checked={true} disabled size="small" />
                            <span className="opacity-50 text-xs">环境温度 不可变</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                            <Switch checked={true} disabled size="small" />
                            <span className="opacity-50 text-xs">机器型号 不可变</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-700">
                            <Switch defaultChecked={true} size="small" />
                            <span className="text-xs">工具磨损 避免变动</span>
                            </label>
                        </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Right: Recommendations (Blue Box - remaining height) */}
          <div className="flex-1 min-h-0">
            {!generated ? (
              <Card className="h-full rounded-2xl border-dashed bg-slate-50/50 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                  <Compass className="w-6 h-6 text-slate-300" />
                </div>
                <h3 className="text-base font-medium text-slate-700 mb-1">等待生成因果处方</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Limix 将基于因果图模型，搜索 $P(Y=Normal | do(X))$ 概率最大的最小干预路径。
                </p>
              </Card>
            ) : (
              <div className="h-full flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between shrink-0">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      <SparklesIcon className="w-4 h-4 text-yellow-500" />
                      AI 推荐干预方案
                    </h3>
                    <span className="text-[10px] text-muted-foreground">点击应用方案</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                    {currentMockPlans.map((plan) => (
                      <Card 
                        key={plan.id} 
                        className={cn(
                          "rounded-xl transition-all duration-300 cursor-pointer border relative overflow-hidden group hover:-translate-y-0.5",
                          selectedPlan === plan.id 
                            ? `border-${plan.color}-500 shadow-md bg-${plan.color}-50/10` 
                            : "border-slate-200 hover:border-blue-300 shadow-sm"
                        )}
                        onClick={() => applyPlan(plan)}
                      >
                        {plan.type === "recommended" && (
                          <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-bl-lg font-medium">
                            AI 推荐
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm mt-0.5",
                              plan.color === "blue" ? "bg-blue-100 text-blue-600" :
                              plan.color === "green" ? "bg-green-100 text-green-600" :
                              "bg-orange-100 text-orange-600"
                            )}>
                              {plan.id}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2 group-hover:text-blue-600 transition-colors truncate">
                                  {plan.title}
                                </h4>
                                <div className={cn(
                                  "text-lg font-bold ml-2",
                                  plan.prob >= 90 ? "text-green-600" : "text-blue-600"
                                )}>
                                  {plan.prob}%
                                </div>
                              </div>
                              
                              <div className="mt-1 text-xs text-slate-600 line-clamp-2">
                                <span className="font-medium text-slate-700">行动:</span> {plan.action}
                              </div>
                              
                              <div className="flex items-center justify-between mt-2">
                                <div className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                  {plan.operation}
                                </div>
                                <div className="text-[10px] text-red-500 flex items-center gap-1 ml-2 truncate">
                                  <AlertTriangle className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{plan.sideEffect}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  )
}
