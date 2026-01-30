import React, { useState } from 'react';
import { Card, Grid, Button, Switch, List, Typography, Divider, Message } from '@arco-design/web-react';
import { FileText, Code, Mail, Download, Share2, Copy, Play } from 'lucide-react';
import { SectionTitle } from '../common';
import { cn } from '../../utils';

const { Row, Col } = Grid;
const { Text } = Typography;

export const DeliverPanel = ({ notify, openModal }) => {
  const [subscribed, setSubscribed] = useState(false);

  const exportReport = () => {
    notify("报告已生成", "已生成业务可签字的报告（Mock）");
    openModal(
      "报告预览（Mock）",
      <div className="space-y-4">
        <div className="p-4 rounded-lg border bg-gray-50 text-sm">
          <div className="font-bold text-gray-800 mb-2">本期关键结论</div>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>超时风险 Top 区域：<span className="font-mono text-blue-600">R05</span></li>
            <li>阈值建议：<span className="font-mono text-blue-600">0.40</span>（收益最大）</li>
            <li>主要驱动因素：<span className="font-mono">queue_len / active_units</span></li>
            <li>治理建议：口径统一 + 驻点优化</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 justify-end mt-4">
          <Button icon={<Download />} type="primary" onClick={() => { Message.success("报告已下载（Mock）"); }}>下载 PDF</Button>
          <Button icon={<Share2 />} onClick={() => { Message.success("报告链接已分享（Mock）"); }}>分享链接</Button>
        </div>
      </div>
    );
  };

  const copyApi = () => {
    Message.success('API 地址已复制到剪贴板');
  };

  const testApi = () => {
    notify("API 测试通过", "响应耗时 45ms，结果：Risk=0.82 (High)");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle title="交付与服务化" description="生成业务报告与部署推理服务" />
      </div>

      <Row gutter={24}>
        {/* Report Generation */}
        <Col span={8}>
          <Card className="h-full rounded-xl shadow-sm border-none flex flex-col" title="业务报告">
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <FileText size={32} />
              </div>
              <div>
                <h3 className="font-semibold text-lg">智能分析报告</h3>
                <p className="text-gray-500 text-sm mt-1">
                  包含：数据质量、模型效果、阈值建议、归因分析
                </p>
              </div>
              <Button type="primary" className="w-full mt-4" onClick={exportReport}>
                生成并预览
              </Button>
            </div>
          </Card>
        </Col>

        {/* API Service */}
        <Col span={16}>
          <Card className="h-full rounded-xl shadow-sm border-none" title="API 服务化 (Inference)">
             <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Endpoint:</span>
                  <Tag color="green" bordered>Running</Tag>
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm relative group">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="mini" icon={<Copy />} type="secondary" onClick={copyApi} />
                  </div>
                  <div className="text-gray-500 mb-2"># POST /api/v1/predict</div>
                  <div className="text-green-400">curl</div> -X POST https://api.limix.ai/v1/predict \<br/>
                  &nbsp;&nbsp;-H <span className="text-yellow-300">"Authorization: Bearer sk-..."</span> \<br/>
                  &nbsp;&nbsp;-d <span className="text-blue-300">'{`{"features": [10, 8, 25]}`}'</span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button icon={<Copy />} onClick={copyApi}>复制调用代码</Button>
                  <Button icon={<Play />} status="success" onClick={testApi}>在线测试</Button>
                </div>
             </div>
          </Card>
        </Col>
      </Row>
      
      {/* Subscription */}
      <Card className="rounded-xl shadow-sm border-none" title="订阅配置">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <div className="font-semibold">每日监控日报</div>
                <div className="text-gray-500 text-sm">每天早上 9:00 发送至您的邮箱，包含昨日模型运行概览。</div>
              </div>
           </div>
           <Switch checked={subscribed} onChange={(v) => {
             setSubscribed(v);
             if(v) notify("已订阅", "日报将发送至 user@example.com");
             else notify("已取消", "已取消订阅");
           }} />
        </div>
      </Card>
    </div>
  );
};
