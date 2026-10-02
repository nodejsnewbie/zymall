import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory data store for persistent demo session
interface ProductItem {
  id: string;
  name: string;
  spec: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  tags: string[];
  licenseNo: string;
  batchNo: string;
  price: number;
  originalPrice?: number;
  soldCount: string;
  image: string;
  traceCode: string;
  activeIngredient: string;
  toxicity: string;
  formulation: string;
  targetDisease: string;
  dosagePerMu: string;
  waterPerMu: string;
  safeInterval: string;
  manufacturer: string;
  highlightText?: string;
  isOfficialDirect: boolean;
  canBookService: boolean;
}

const PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    name: '华农植保·75%肟菌·戊唑醇悬浮剂',
    spec: '100ml / 瓶',
    category: '水稻杀菌剂',
    badge: '绿标溯源',
    badgeColor: 'bg-[#006d40]',
    tags: ['一物一码溯源', '官方正品', '水稻纹枯病/稻瘟病特效'],
    licenseNo: 'PD20210892',
    batchNo: '20240901HN',
    price: 48.0,
    originalPrice: 56.0,
    soldCount: '已出库 1.2万件',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcU-0kej1VjmMvzv9ZF7Q1mSfCiUd2IHhYvD2ukxDr_pPl1XOTFBUCtfbtqnB-kZ2Hnoy2AWZYf7_jFC3eYAmQ5Tl0q9CBiU-Np7Z-QQ-Fb8eRpkwm5l9nyCKaEL4k1DKzRs-2SAephUTw0vf6nSLEifAqin3areaxTTVincydrIsogwLDxB3aBxM1AneEd8vu1liGK5YVoVW4PR9YcgFCZAQ1lFaYVUB_38g5A3ivuVfBaW8oqeVS',
    traceCode: '1020210892090124883901',
    activeIngredient: '肟菌酯 25% + 戊唑醇 50%',
    toxicity: '微毒 (低残留)',
    formulation: '悬浮剂 (SC)',
    targetDisease: '水稻纹枯病、稻瘟病、稻曲病',
    dosagePerMu: '10-15ml / 亩',
    waterPerMu: '常规喷雾 30L / 亩；无人机飞防 1.5-2.0L / 亩',
    safeInterval: '21天 (每季最多施用2次)',
    manufacturer: '湖南华农现代生物植保股份有限公司',
    isOfficialDirect: true,
    canBookService: true,
  },
  {
    id: 'prod-2',
    name: '极飞特约·氯虫苯甲酰胺 200g/L 浓悬浮剂',
    spec: '200ml / 瓶',
    category: '稻飞虱杀虫剂',
    badge: '飞防特供',
    badgeColor: 'bg-[#004425]',
    tags: ['飞防原浆', '抗性二化螟稻纵卷叶螟克星'],
    highlightText: '亩均成本省15%',
    licenseNo: 'PD20180431',
    batchNo: '20240815HN',
    price: 68.0,
    originalPrice: 79.0,
    soldCount: '已出库 8,920件',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK2OdAQ62scKS4qfIkWd5GQXTTj9yximl6jBnTb3Fo_xi7Z6uj0Z9G5BFcwIoPYdoh74Q-Qm3avzaWYv2A8BvmdrxgThXFlINNwxJqVpn4qxNlrd9znsc1sT9jnI3VvlFD8z28BxKJRL8LA3AAuyJcM1NgiQduf-KMYNyMRezEm-g5OQt9wh1-bGr8y2e_qQ95eBngkVt_2bpPQfidPZhj-dCTCbnYAzcORkjgufYDQqv8R2DYhPfy',
    traceCode: '1020180431081524771234',
    activeIngredient: '氯虫苯甲酰胺 200克/升',
    toxicity: '微毒',
    formulation: '悬浮剂 (SC) 特调飞防抗蒸发型',
    targetDisease: '水稻二化螟、三化螟、稻纵卷叶螟',
    dosagePerMu: '8-10ml / 亩',
    waterPerMu: '常规喷雾 30L / 亩；无人机飞防 1.0-1.5L / 亩',
    safeInterval: '14天 (每季最多施用2次)',
    manufacturer: '极飞农业技术精细化工厂联名直供',
    isOfficialDirect: true,
    canBookService: true,
  },
  {
    id: 'prod-3',
    name: '湘农丰·高纯度磷酸二氢钾 99%晶体',
    spec: '1000g / 袋',
    category: '增产叶面肥',
    badge: '99%高纯',
    badgeColor: 'bg-[#7d4200]',
    tags: ['促灌浆防倒伏', '增糖着色'],
    highlightText: '实体仓现货直发',
    licenseNo: '农肥(2022)准字第8892号',
    batchNo: '20241002XN',
    price: 25.0,
    originalPrice: 32.0,
    soldCount: '已出库 2.4万件',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcL2vMMAi9Exeq1kuJqZiIcdmsM9JfYk2LIWcucXPsXvju0sbMztRE2KNLrKSUzKztqcKqxP9H-5G4289Eb_kspRDj8C3S5QwnQu3qOPtFt9OUqhDJxb0leTI5BFIrcX7q02IAXlKemPZNfwQwg7UznV0i1m-q5PSQAtvn56610EGAhCYDU-hUMiG09JBotC7ECJzUp8teEIk6F15DLt1k5j-omYBfRI4iMKdcQxBMgjfgpMFRAmNm',
    traceCode: '1020228892110224669871',
    activeIngredient: '有效养分 KH2PO4 ≥ 99.0% (P2O5≥52%, K2O≥34%)',
    toxicity: '无毒环保',
    formulation: '高纯结晶粉末 (速溶型)',
    targetDisease: '后期抗干热风、促水稻灌浆饱满、提升千粒重',
    dosagePerMu: '100-150g / 亩',
    waterPerMu: '常规喷雾 40-50kg 水稀释；飞防 2-3kg 水超细雾化',
    safeInterval: '全生育期均可使用 (破口期/齐穗期最佳)',
    manufacturer: '湖南省农业科学院科技成果转化示范基地',
    isOfficialDirect: true,
    canBookService: false,
  },
  {
    id: 'prod-4',
    name: '极效农机·高压自洁陶瓷喷头 (4枚装)',
    spec: '4枚装 (含防滴胶垫)',
    category: '农机维保耗材',
    badge: '原厂配件',
    badgeColor: 'bg-[#404941]',
    tags: ['农机维保', '雾化均匀', '耐磨防堵'],
    highlightText: '安沙站极速闪送',
    licenseNo: '适配DJI/XAG全系',
    batchNo: '20240905JX',
    price: 36.0,
    originalPrice: 45.0,
    soldCount: '已出库 4,310件',
    image: '',
    traceCode: '2024090588123990145612',
    activeIngredient: '高强度氧化锆纳米陶瓷芯 + 防酸碱聚合物外套',
    toxicity: '无毒',
    formulation: '高压离心自洁结构',
    targetDisease: '农用植保机均匀喷洒，减少飘移，节药20%',
    dosagePerMu: '建议每作业 1500 亩更换一套',
    waterPerMu: '喷幅范围 1.5m - 2.8m 可调',
    safeInterval: '质保一年，杜绝漏液',
    manufacturer: '极效精工智能农机部件有限公司',
    isOfficialDirect: true,
    canBookService: false,
  },
  {
    id: 'prod-5',
    name: '科农·24%螺虫乙酯·噻虫啉悬浮剂',
    spec: '100ml / 瓶',
    category: '稻飞虱杀虫剂',
    badge: '杀卵双绝',
    badgeColor: 'bg-[#004425]',
    tags: ['双向传导', '持效期长达25天'],
    licenseNo: 'PD20200156',
    batchNo: '20240912KN',
    price: 52.0,
    originalPrice: 60.0,
    soldCount: '已出库 6,800件',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcU-0kej1VjmMvzv9ZF7Q1mSfCiUd2IHhYvD2ukxDr_pPl1XOTFBUCtfbtqnB-kZ2Hnoy2AWZYf7_jFC3eYAmQ5Tl0q9CBiU-Np7Z-QQ-Fb8eRpkwm5l9nyCKaEL4k1DKzRs-2SAephUTw0vf6nSLEifAqin3areaxTTVincydrIsogwLDxB3aBxM1AneEd8vu1liGK5YVoVW4PR9YcgFCZAQ1lFaYVUB_38g5A3ivuVfBaW8oqeVS',
    traceCode: '1020200156091224119933',
    activeIngredient: '螺虫乙酯 12% + 噻虫啉 12%',
    toxicity: '低毒',
    formulation: '悬浮剂 (SC)',
    targetDisease: '稻飞虱、白背飞虱、蚜虫、蓟马',
    dosagePerMu: '15-20ml / 亩',
    waterPerMu: '常规喷雾 30L / 亩',
    safeInterval: '14天 (每季最多施用2次)',
    manufacturer: '科农生物工程技术有限公司',
    isOfficialDirect: true,
    canBookService: true,
  },
  {
    id: 'prod-6',
    name: '农友·草铵膦 200g/L 高效水剂',
    spec: '1000ml / 瓶',
    category: '果树除草剂',
    badge: '烂根不伤土',
    badgeColor: 'bg-[#7d4200]',
    tags: ['触杀型灭生性', '柑橘茶园定向除草'],
    licenseNo: 'PD20191288',
    batchNo: '20240828NY',
    price: 32.0,
    originalPrice: 38.0,
    soldCount: '已出库 1.5万件',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAK2OdAQ62scKS4qfIkWd5GQXTTj9yximl6jBnTb3Fo_xi7Z6uj0Z9G5BFcwIoPYdoh74Q-Qm3avzaWYv2A8BvmdrxgThXFlINNwxJqVpn4qxNlrd9znsc1sT9jnI3VvlFD8z28BxKJRL8LA3AAuyJcM1NgiQduf-KMYNyMRezEm-g5OQt9wh1-bGr8y2e_qQ95eBngkVt_2bpPQfidPZhj-dCTCbnYAzcORkjgufYDQqv8R2DYhPfy',
    traceCode: '1020191288082824551122',
    activeIngredient: '草铵膦 200克/升',
    toxicity: '微毒',
    formulation: '水剂 (AS)',
    targetDisease: '防除恶性杂草、牛筋草、马唐、野艾蒿',
    dosagePerMu: '150-200ml / 亩',
    waterPerMu: '常规喷雾 30-40L (加装定向喷罩)',
    safeInterval: '土壤无残留，遇土钝化',
    manufacturer: '农友绿色化工产业园',
    isOfficialDirect: true,
    canBookService: true,
  },
];

// In-memory traceability history log (Farmer digital ledger)
const traceLedger: Array<{
  id: string;
  code: string;
  productName: string;
  batchNo: string;
  licenseNo: string;
  queryTime: string;
  status: 'passed' | 'warning';
  station: string;
}> = [
  {
    id: 'LED-001',
    code: '1020210892090124883901',
    productName: '华农植保·75%肟菌·戊唑醇悬浮剂',
    batchNo: '20240901HN',
    licenseNo: 'PD20210892',
    queryTime: '2024-10-01 09:41',
    status: 'passed',
    station: '长沙县安沙农资自营直供中心',
  },
  {
    id: 'LED-002',
    code: '1020180431081524771234',
    productName: '极飞特约·氯虫苯甲酰胺 200g/L 浓悬浮剂',
    batchNo: '20240815HN',
    licenseNo: 'PD20180431',
    queryTime: '2024-10-01 09:42',
    status: 'passed',
    station: '长沙县安沙农资自营直供中心',
  },
];

// Service bookings store
const bookingsStore = [
  {
    id: 'BK-20241001-01',
    serviceType: 'drone_spraying',
    cropType: '双季晚稻 (优质杂交稻)',
    acreage: 45,
    preferredDate: '2024-10-02',
    timeSlot: '上午 (07:00-11:00 飞防适期)',
    station: '长沙县安沙农资自营直供中心',
    contactName: '李建平',
    contactPhone: '138-7589-9921',
    plotAddress: '长沙县安沙镇水渡河村8组高产片区',
    associatedProducts: ['华农植保·75%肟菌·戊唑醇悬浮剂', '湘农丰·磷酸二氢钾'],
    status: 'in_progress',
    assignedAgronomist: {
      name: '陈伟农',
      certId: '农技职字 2016-HN-0428',
      phone: '139-7312-8800',
      title: '高级农艺师 / 执业植保专家',
    },
  },
];

// Orders store
const ordersStore: any[] = [];

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Route: Health
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'agro-mall-backend',
      timestamp: new Date().toISOString(),
      connectedNationalDb: true,
      registeredLicense: '农药经湘20240018',
    });
  });

  // API Route: Products
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, q } = req.query;
    let list = [...PRODUCTS];

    if (category && category !== '全部') {
      list = list.filter((p) => p.category === category);
    }

    if (q && typeof q === 'string') {
      const query = q.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.licenseNo.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query)) ||
          p.targetDisease.toLowerCase().includes(query)
      );
    }

    res.json({
      success: true,
      data: list,
      total: list.length,
    });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = PRODUCTS.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: '商品不存在' });
    }
    res.json({ success: true, data: product });
  });

  // API Route: Electronic Traceability Verification
  app.post('/api/trace/verify', (req: Request, res: Response) => {
    const rawCode = (req.body.code || '').trim();
    if (!rawCode) {
      return res.status(400).json({ success: false, error: '请输入有效的农药电子溯源码' });
    }

    // Abnormal / fake detection
    if (rawCode.startsWith('888') || rawCode.toLowerCase().includes('fake') || rawCode === '0000000000000000') {
      const warningResult = {
        code: rawCode,
        isValid: false,
        productName: '【疑似假劣/异常串货】未备案农资产品',
        licenseNo: '无效编码 / 查无准产证',
        productionApprovalNo: '无',
        standardNo: '无',
        batchNo: '未知异常批号',
        productionDate: '无生产记录',
        expiryDate: '无',
        manufacturer: '未知作坊 (未取得农业农村部生产许可)',
        factoryAddress: '未知',
        activeIngredient: '成分未知 (存在重度药害风险)',
        packageSpec: '粗糙仿冒包装',
        queryCount: 142,
        firstQueryTime: '2024-03-12 (异地频繁重复核验，已被系统锁定)',
        distributionStation: '非官方自营实体站，来源不明',
        storeInDate: '无国家系统入库留痕',
        chain: [],
        warnings: [
          '【国家电子溯源预警】该追溯码未在农业农村部农药数字监管系统中登记！',
          '此条码已被多省市重复扫描查验达142次，存在假冒套码串货嫌疑！',
          '严防假劣农药造成烧苗毁田减产！请勿在田间施用，支持假一赔十！',
          '已记录您的查验日志，可一键直连安沙执法服务站申请上门鉴定取样。',
        ],
      };

      traceLedger.unshift({
        id: `LED-${Date.now().toString().slice(-4)}`,
        code: rawCode,
        productName: '【疑似假劣】未备案产品',
        batchNo: '异常批次',
        licenseNo: '无效代码',
        queryTime: new Date().toLocaleString('zh-CN'),
        status: 'warning',
        station: '非官方自营渠道',
      });

      return res.json({ success: true, data: warningResult });
    }

    // Authentic verification match
    const matchedProd =
      PRODUCTS.find((p) => p.traceCode === rawCode) ||
      PRODUCTS.find((p) => rawCode.includes(p.licenseNo.replace(/[^0-9]/g, ''))) ||
      PRODUCTS[0];

    const now = new Date();
    const dateStr = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日`;

    const authenticResult = {
      code: rawCode.length >= 16 ? rawCode : `${rawCode}2024090100889211`,
      isValid: true,
      productName: `${matchedProd.name} (${matchedProd.spec})`,
      licenseNo: `${matchedProd.licenseNo} (正式登记)`,
      productionApprovalNo: '农药生许(湘)0023',
      standardNo: 'GB/T 28143-2022',
      batchNo: matchedProd.batchNo,
      productionDate: '2024年08月20日',
      expiryDate: '2026年08月19日 (保质期24个月)',
      manufacturer: matchedProd.manufacturer,
      factoryAddress: '国家级农业高新技术产业示范园生物科技区',
      activeIngredient: matchedProd.activeIngredient,
      packageSpec: matchedProd.spec,
      queryCount: 1,
      firstQueryTime: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} (首次官方验真)`,
      distributionStation: '长沙县安沙农资自营直供中心 (站号 HN-CS-004)',
      storeInDate: '2024年09月05日 10:15',
      chain: [
        {
          step: '1',
          title: '原厂赋码与合格检定',
          timestamp: '2024-08-20 09:12',
          location: '生产企业洁净灌装车间',
          operator: '质检合规员 QC-12',
          detail: '原装电子溯源码赋码成功，留样及出厂检验全项合格。',
          status: 'passed',
        },
        {
          step: '2',
          title: '国家农药追溯总库互联入库',
          timestamp: '2024-08-22 14:00',
          location: '农业农村部国家农药追溯中心服务器',
          operator: '系统自动核对',
          detail: '一瓶一码已通过国标农药数据校验，数据不可篡改。',
          status: 'passed',
        },
        {
          step: '3',
          title: '实体自营站核收入库',
          timestamp: '2024-09-05 10:15',
          location: '长沙县安沙农资自营直供中心',
          operator: '直营站长 陈伟农',
          detail: '冷藏恒温库位入库上架，三证齐全，专车直供。',
          status: 'passed',
        },
        {
          step: '4',
          title: '终端种植户扫码验真',
          timestamp: `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
          location: '用户当前田间终端',
          operator: '种植户扫码',
          detail: '官方认证原厂正品！享48小时内持证农艺师田间复诊保障。',
          status: 'passed',
        },
      ],
    };

    // Record into digital ledger
    traceLedger.unshift({
      id: `LED-${Date.now().toString().slice(-4)}`,
      code: authenticResult.code,
      productName: matchedProd.name,
      batchNo: matchedProd.batchNo,
      licenseNo: matchedProd.licenseNo,
      queryTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      status: 'passed',
      station: '长沙县安沙农资自营直供中心',
    });

    res.json({ success: true, data: authenticResult });
  });

  // API Route: Digital Traceability Ledger History
  app.get('/api/trace/history', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: traceLedger,
      total: traceLedger.length,
    });
  });

  // API Route: Doorstep Bookings
  app.get('/api/bookings', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: bookingsStore,
      total: bookingsStore.length,
    });
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const {
      serviceType,
      cropType,
      acreage,
      preferredDate,
      timeSlot,
      station,
      contactName,
      contactPhone,
      plotAddress,
      associatedProducts,
    } = req.body;

    const newBooking = {
      id: `BK-${Date.now().toString().slice(-6)}`,
      serviceType: serviceType || 'drone_spraying',
      cropType: cropType || '晚稻',
      acreage: Number(acreage) || 30,
      preferredDate: preferredDate || '2024-10-02',
      timeSlot: timeSlot || '上午 (07:00-11:00 飞防适期)',
      station: station || '长沙县安沙农资自营直供中心',
      contactName: contactName || '种植户',
      contactPhone: contactPhone || '138-7589-9921',
      plotAddress: plotAddress || '安沙镇示范片区',
      associatedProducts: associatedProducts || [],
      status: 'submitted',
      assignedAgronomist: {
        name: '陈伟农',
        certId: '农技职字 2016-HN-0428',
        phone: '139-7312-8800',
        title: '高级农艺师 / 执业植保专家',
      },
    };

    bookingsStore.unshift(newBooking);
    res.json({ success: true, data: newBooking });
  });

  // API Route: Orders / Procurement Checkout
  app.post('/api/orders', (req: Request, res: Response) => {
    const { items, station, plotAddress } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: '清单商品不能为空' });
    }

    const totalAmount = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );
    const eligibleForFreeRecipe = totalAmount >= 200;

    const newOrder = {
      orderId: `DD-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      items,
      totalAmount,
      eligibleForFreeRecipe,
      deliveryStation: station || '长沙县安沙农资自营直供中心',
      deliveryEstimate: '最快 30 分钟送到田边',
      status: 'dispatched',
    };

    ordersStore.unshift(newOrder);
    res.json({ success: true, data: newOrder });
  });

  // API Route: Agro-meteorology and Spraying index
  app.get('/api/weather', (req: Request, res: Response) => {
    res.json({
      success: true,
      data: {
        station: '长沙县安沙水渡河监测站',
        temperature: 26,
        humidity: 64,
        windSpeed: 1.8,
        windDirection: '东南风 2级',
        precipitationChance: 5,
        droneSprayIndex: '适宜飞防',
        reason: '气温适宜，平均风速小于3m/s，药滴沉降附着率高，无逆温飘移风险',
      },
    });
  });

  // Production vs Development handler
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Express Backend] Agro-mall server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[Express Backend Error]', err);
  process.exit(1);
});
