import React, { useMemo } from 'react';
import { Card, Table, Tag, Descriptions, Button, Message } from '@arco-design/web-react';
import { Database, FileText, Calendar, User, Search, Filter, Download } from 'lucide-react';
import { MOCK_DATASETS, MOCK_SCHEMA } from '../../mock/data';
import { SectionTitle } from '../common';

export const DatasetsPanel = ({ datasetId, setDatasetId, openModal }) => {
  const dataset = MOCK_DATASETS.find((d) => d.id === datasetId) || MOCK_DATASETS[0];

  const previewData = useMemo(() => {
    return Array(5).fill(0).map((_, i) => {
      const row = { key: i + 1 };
      MOCK_SCHEMA.forEach((s) => {
        if (s.k === 'severity') row[s.k] = Math.floor(Math.random() * 5) + 1;
        else if (s.t === '数值') row[s.k] = Math.floor(Math.random() * 100);
        else row[s.k] = 'Mock';
      });
      return row;
    });
  }, []);

  const schemaColumns = [
    { title: '字段名', dataIndex: 'k', key: 'k', render: (text) => <span className="font-mono font-semibold">{text}</span> },
    { title: '类型', dataIndex: 't', key: 't', render: (text) => <Tag color={text.includes('目标') ? 'blue' : 'gray'}>{text}</Tag> },
    { title: '业务含义', dataIndex: 'desc', key: 'desc', className: 'text-gray-500' },
  ];

  const previewColumns = MOCK_SCHEMA.slice(0, 8).map((s) => ({
    title: s.k,
    dataIndex: s.k,
    key: s.k,
    render: (text) => <span className="text-xs font-mono">{text}</span>,
  }));

  const metaData = [
    { label: '数据量', value: `${(dataset.rows / 10000).toFixed(1)}万行` },
    { label: '特征数', value: `${dataset.cols}列` },
    { label: '时间范围', value: dataset.timeRange },
    { label: '负责人', value: dataset.owner },
    { label: '质量分', value: <Tag color={dataset.qualityScore > 80 ? 'green' : 'orange'}>{dataset.qualityScore}分</Tag> },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionTitle icon={Database} title="数据接入与概览" action={<Button type="primary" size="small" icon={<Download className="w-4 h-4" />} onClick={() => Message.success('已导出元数据报告')}>导出报告</Button>} />

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 rounded-xl shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">{dataset.name}</span>
              </div>
              <div className="space-y-3">
                {metaData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-dashed border-gray-100 pb-2 last:border-0">
                    <span className="text-gray-500">{item.label}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t">
              <Button type="outline" long onClick={() => openModal("数据血缘（Mock）", <div className="h-40 bg-gray-50 rounded flex items-center justify-center text-gray-400">血缘图谱可视化区域</div>)}>
                查看数据血缘
              </Button>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 rounded-xl shadow-sm" title="Schema 定义">
          <Table
            columns={schemaColumns}
            data={MOCK_SCHEMA}
            pagination={false}
            size="small"
            scroll={{ y: 240 }}
            border={false}
            rowKey="k"
          />
        </Card>
      </div>

      <Card className="rounded-xl shadow-sm" title={
        <div className="flex items-center justify-between">
          <span>数据预览（前5行）</span>
          <div className="flex gap-2">
            <Button size="mini" icon={<Search />}>搜索</Button>
            <Button size="mini" icon={<Filter />}>筛选</Button>
          </div>
        </div>
      }>
        <Table
          columns={previewColumns}
          data={previewData}
          pagination={false}
          size="mini"
          scroll={{ x: true }}
          rowKey="key"
        />
      </Card>
    </div>
  );
};
