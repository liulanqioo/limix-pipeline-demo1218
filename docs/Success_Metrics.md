# 产品成功指标框架 (Success Metrics Framework)

## 1. 北极星指标 (North Star Metric)
**指标**: **Weekly Active Analyses (WAA)**
**定义**: 每周成功完成完整分析流程（上传 -> 清洗 -> 建模 -> 查看解释）并停留超过 30 秒的次数。
**理由**: 该指标反映了用户真正从产品中获得了价值（不仅是跑了模型，还查看了结果解释），且体现了活跃度。

## 2. 阶段性关键指标 (OMTM - One Metric That Matters)

### 阶段一：验证期 (Validation)
- **OMTM**: **Landing Page 注册转化率**
- **目标**: > 10%
- **现状**: 11.3% (已达成)

### 阶段二：MVP/V1.0 期 (Solution)
- **OMTM**: **核心流程完成率 (Completion Rate)**
- **定义**: 开始新建任务的用户中，成功查看到结果页面的比例。
- **目标**: > 80%
- **关注点**: 消除 Bug，优化交互流畅度，降低等待焦虑。

### 阶段三：增长期 (Growth)
- **OMTM**: **K 因子 (Viral Coefficient)**
- **定义**: 每个现有用户平均带来的新用户数。
- **目标**: > 0.5 (配合付费投放可实现快速增长)

## 3. 详细指标体系 (按 AARRR)

| 维度 | 关键指标 | 定义 | 采集频率 |
| :--- | :--- | :--- | :--- |
| **Acquisition** | CAC (获客成本) | 营销总投入 / 新增付费用户数 | 月度 |
| | 渠道 ROI | 各渠道带来的 LTV / 渠道成本 | 月度 |
| **Activation** | Day-1 Retention | 次日留存率 | 日度 |
| | Aha Moment 达成时长 | 用户从注册到完成首次分析的耗时 | 实时 |
| **Retention** | Week-4 Retention | 第 4 周留存率 | 周度 |
| | 活跃用户流失率 | 上周活跃本周不活跃的比例 | 周度 |
| **Revenue** | MRR (月经常性收入) | 当月总订阅收入 | 月度 |
| | ARPU (每用户平均收入) | 总收入 / 活跃用户数 | 月度 |
| **Referral** | NPS (净推荐值) | 用户问卷评分 (9-10分比例 - 0-6分比例) | 季度 |
| | 邀请转化率 | 发出邀请的用户比例 * 受邀注册比例 | 月度 |

## 4. 数据收集与决策机制

### 4.1 埋点计划
- **事件**: `upload_success`, `clean_start`, `clean_finish`, `task_create`, `task_finish`, `explain_view`, `report_export`.
- **属性**: `dataset_size`, `model_type`, `duration`, `error_code`.

### 4.2 决策触发阈值
- **警报**: 核心流程完成率 < 70% -> **立即停止功能开发，全力修 Bug / 优化交互**。
- **调整**: Week-4 留存率 < 20% -> **重新审视产品价值主张，进行用户回访**。
- **扩张**: NPS > 50 且 LTV/CAC > 3 -> **加大投放力度，快速扩张**。
