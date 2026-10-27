import { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';

// This adapter is used only in the public static build. It never sends visitor data to a server.
const sampleId = 'sample-wuxi';
const sampleProject = {
  id: sampleId,
  name: '澄地2026-C-4号地块商品房开发项目（公开样例）',
  status: 'interpreting',
  created_at: '2026-07-09T00:00:00Z',
};
const sampleDocument = {
  id: 'sample-document',
  file_name: '无锡澄地2026-C-4号地块商品房开发项目-招标文件.pdf',
  file_size: 1510448,
  type: 'pdf',
  parsed: true,
  created_at: '2026-07-09T00:00:00Z',
};
const dimensions = {
  project_info: { project_name: sampleProject.name, project_overview: '勘察、方案、初步设计招标文件提前公示稿；建安投资约 40,000 万元。' },
  qualification: { qualification_level: '样例报告识别设计及勘察资质要求，具体资质组合请回查原文件。' },
  scoring: { scoring_items: '样例报告列有技术标（设计方案）55 分，具体评分类别请以原文件为准。' },
  risk: { potential_risks: ['最高限价：样例报告提取勘察设计收费限价 582.12 万元。', '核对暗标、保证金、联合体条件等条款。'] },
};
const sources = [
  { id: 'national', code: 'national', name: '全国公共资源交易平台', type: 'WEB', url: 'https://www.ggzy.gov.cn/', industry_code: 'construction', weight: 1, enabled: true, description: '公开信息来源示意，演示版不实时抓取', last_crawled_at: null, last_status: '' },
  { id: 'wuxi', code: 'wuxi', name: '无锡公共资源交易中心', type: 'WEB', url: 'https://ggzyjy.wuxi.gov.cn/', industry_code: 'construction', weight: 1, enabled: true, description: '演示项目公开文件来源', last_crawled_at: null, last_status: '' },
];

function reply(config: InternalAxiosRequestConfig, data: unknown) {
  return { data, status: 200, statusText: 'OK', headers: new AxiosHeaders(), config };
}

function unavailable(config: InternalAxiosRequestConfig): never {
  const detail = '在线演示仅支持预置样例；上传、实时分析、生成、审核和保存需要部署完整平台。';
  if ((config.method || 'get').toLowerCase() !== 'get') {
    window.dispatchEvent(new CustomEvent('duncan-demo-blocked', { detail }));
  }
  const response = { ...reply(config, { detail }), status: 400, statusText: 'Demo unavailable' };
  throw new AxiosError(detail, 'ERR_DEMO_UNAVAILABLE', config, undefined, response);
}

export const staticDemoAdapter: AxiosAdapter = async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const path = (config.url || '').split('?')[0];
  if (method === 'get' && path === '/projects/') return reply(config, { projects: [sampleProject] });
  if (method === 'get' && path === `/projects/${sampleId}`) return reply(config, { ...sampleProject, config: {} });
  if (method === 'get' && path === `/projects/${sampleId}/gate`) return reply(config, { gates: [] });
  if (method === 'get' && path === `/interpret/documents/${sampleId}`) return reply(config, { documents: [sampleDocument] });
  if (method === 'get' && path === '/interpret/document/sample-document') return reply(config, { parsed_content: '此处展示公开样例的解读节选。请通过样例报告中的来源链接查看原始招标文件。', doc_metadata: { pages: 89 } });
  if (method === 'get' && path === `/interpret/analysis/${sampleId}`) return reply(config, {
    has_documents: true, has_parsed: true, has_analysis: true, failed_dimensions: [],
    analysis: { dimensions, scoring_matrix: null, risk_flags: null, sections: null },
    parse_info: { text_length: 55260, doc_metadata: { pages: 89 } },
  });
  if (method === 'post' && path === `/interpret/export/${sampleId}`) {
    if ((config.url || '').includes('format=markdown')) {
      return reply(config, '# Duncan pro 招标解读样例\n\n澄地2026-C-4号地块商品房开发项目。\n\n请以公开招标文件原文为准。\n\n来源：https://ggzyjy.wuxi.gov.cn/doc/2026/07/09/4802454.shtml\n');
    }
    const response = await fetch(`${import.meta.env.BASE_URL}sample-report.html`);
    if (!response.ok) return unavailable(config);
    return reply(config, await response.blob());
  }
  if (method === 'get' && path === `/generate/${sampleId}/outline`) return reply(config, { success: false });
  if (method === 'get' && path === `/generate/${sampleId}/chapters`) return reply(config, { chapters: [] });
  if (method === 'get' && path === `/check/${sampleId}/reports`) return reply(config, { reports: [] });
  if (method === 'get' && path === '/format/templates') return reply(config, { templates: [] });
  if (method === 'get' && path.startsWith('/format/templates/')) return reply(config, { config: {} });
  if (method === 'get' && path === '/news/industries') return reply(config, { industries: [{ code: 'construction', name: '工程建设', icon: '🏗️', weight: 1, children: [] }] });
  if (method === 'get' && path === '/news/sources') return reply(config, { sources, total: sources.length });
  if (method === 'get' && path === '/news/tasks') return reply(config, { tasks: [] });
  if (method === 'get' && (path === '/news/hotspots' || path === '/news/today-hot')) return reply(config, { items: [], total: 0 });
  if (method === 'get' && path === '/llm/configs') return reply(config, { configs: [] });
  if (method === 'get' && path === '/llm/providers') return reply(config, { providers: [] });
  if (method === 'get' && path === '/llm/agent-models') return reply(config, { agents: [] });
  if (method === 'get' && path === '/skills/') return reply(config, { skills: [] });
  return unavailable(config);
};
