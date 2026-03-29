import { Slice } from '@/types/slice';

export const mockSlices: Slice[] = [
  {
    id: '1',
    title: '肝细胞癌',
    description: '中等分化肝细胞癌，可见梁状排列，核分裂象易见。肿瘤细胞胞质丰富，嗜酸性，可见胆汁分泌。',
    fileUrl: '/slices/hcc.svs',
    thumbnailUrl: '/images/slices/hcc-thumb.jpg',
    magnification: 40,
    width: 50000,
    height: 40000,
    category: 'digestive',
    tags: ['肝脏', '恶性肿瘤', '肝癌', '肝细胞癌'],
    annotations: [],
    uploadedBy: 'T001',
    uploadedAt: new Date('2024-09-15'),
  },
  {
    id: '2',
    title: '肺腺癌',
    description: '浸润性肺腺癌，贴壁状生长模式。肿瘤细胞沿肺泡壁生长，可见腺腔形成。',
    fileUrl: '/slices/lung-adenocarcinoma.svs',
    thumbnailUrl: '/images/slices/lung-adenocarcinoma-thumb.jpg',
    magnification: 40,
    width: 45000,
    height: 38000,
    category: 'respiratory',
    tags: ['肺', '腺癌', '恶性肿瘤', '肺癌'],
    annotations: [],
    uploadedBy: 'T002',
    uploadedAt: new Date('2024-10-01'),
  },
  {
    id: '3',
    title: '乳腺浸润性导管癌',
    description: '浸润性导管癌，III级，可见导管内成分。肿瘤细胞异型性明显，核分裂象多见。',
    fileUrl: '/slices/breast-idc.svs',
    thumbnailUrl: '/images/slices/breast-idc-thumb.jpg',
    magnification: 40,
    width: 48000,
    height: 42000,
    category: 'breast',
    tags: ['乳腺', '浸润性导管癌', '恶性肿瘤', '乳腺癌'],
    annotations: [],
    uploadedBy: 'T001',
    uploadedAt: new Date('2024-11-01'),
  },
  {
    id: '4',
    title: '胃腺癌',
    description: '胃腺癌，中分化，可见不规则腺管结构。肿瘤细胞浸润至肌层。',
    fileUrl: '/slices/gastric-adenocarcinoma.svs',
    thumbnailUrl: '/images/slices/gastric-adenocarcinoma-thumb.jpg',
    magnification: 40,
    width: 46000,
    height: 40000,
    category: 'digestive',
    tags: ['胃', '腺癌', '恶性肿瘤', '胃癌'],
    annotations: [],
    uploadedBy: 'T001',
    uploadedAt: new Date('2024-10-15'),
  },
  {
    id: '5',
    title: '肝硬化',
    description: '肝硬化，可见假小叶形成，纤维间隔包绕再生结节。肝细胞变性坏死明显。',
    fileUrl: '/slices/cirrhosis.svs',
    thumbnailUrl: '/images/slices/cirrhosis-thumb.jpg',
    magnification: 20,
    width: 35000,
    height: 30000,
    category: 'digestive',
    tags: ['肝脏', '肝硬化', '慢性肝病'],
    annotations: [],
    uploadedBy: 'T001',
    uploadedAt: new Date('2024-09-20'),
  },
  {
    id: '6',
    title: '甲状腺乳头状癌',
    description: '甲状腺乳头状癌，可见典型乳头结构，细胞核呈毛玻璃样，可见核沟和核内包涵体。',
    fileUrl: '/slices/thyroid-ptc.svs',
    thumbnailUrl: '/images/slices/thyroid-ptc-thumb.jpg',
    magnification: 40,
    width: 42000,
    height: 36000,
    category: 'endocrine',
    tags: ['甲状腺', '乳头状癌', '恶性肿瘤'],
    annotations: [],
    uploadedBy: 'T002',
    uploadedAt: new Date('2024-11-15'),
  },
  {
    id: '7',
    title: '肾透明细胞癌',
    description: '肾透明细胞癌，肿瘤细胞胞质透亮，呈腺泡状排列，血供丰富。',
    fileUrl: '/slices/rcc.svs',
    thumbnailUrl: '/images/slices/rcc-thumb.jpg',
    magnification: 40,
    width: 44000,
    height: 38000,
    category: 'urinary',
    tags: ['肾脏', '透明细胞癌', '恶性肿瘤', '肾癌'],
    annotations: [],
    uploadedBy: 'T003',
    uploadedAt: new Date('2024-12-01'),
  },
  {
    id: '8',
    title: '脑胶质母细胞瘤',
    description: '胶质母细胞瘤，WHO IV级，细胞密集，异型性明显，可见坏死和微血管增生。',
    fileUrl: '/slices/gbm.svs',
    thumbnailUrl: '/images/slices/gbm-thumb.jpg',
    magnification: 40,
    width: 52000,
    height: 44000,
    category: 'nervous',
    tags: ['脑', '胶质母细胞瘤', '恶性肿瘤', '胶质瘤'],
    annotations: [],
    uploadedBy: 'T002',
    uploadedAt: new Date('2024-11-20'),
  },
];

// 获取切片详情
export function getSliceById(id: string): Slice | undefined {
  return mockSlices.find(s => s.id === id);
}

// 根据分类筛选切片
export function getSlicesByCategory(category: string): Slice[] {
  return mockSlices.filter(s => s.category === category);
}

// 搜索切片
export function searchSlices(keyword: string): Slice[] {
  const lowerKeyword = keyword.toLowerCase();
  return mockSlices.filter(s =>
    s.title.toLowerCase().includes(lowerKeyword) ||
    s.description.toLowerCase().includes(lowerKeyword) ||
    s.tags.some(t => t.toLowerCase().includes(lowerKeyword))
  );
}
