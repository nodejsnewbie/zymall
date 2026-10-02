export interface Product {
  id: string;
  name: string;
  spec: string;
  category: string;
  badge?: string;
  badgeColor?: string;
  tags: string[];
  licenseNo: string; // 农药登记证号 / 登记号
  batchNo: string;   // 生产批次
  price: number;
  originalPrice?: number;
  soldCount: string;
  image: string;
  traceCode: string;
  activeIngredient: string; // 有效成分
  toxicity: string;         // 毒性（微毒、低毒）
  formulation: string;      // 剂型（悬浮剂、可溶液剂等）
  targetDisease: string;    // 防治对象
  dosagePerMu: string;      // 亩推荐用量
  waterPerMu: string;       // 亩用水量（常规/飞防）
  safeInterval: string;     // 安全间隔期
  manufacturer: string;     // 生产厂家
  highlightText?: string;
  isOfficialDirect: boolean;
  canBookService: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SupplyChainStep {
  step: string;
  title: string;
  timestamp: string;
  location: string;
  operator: string;
  detail: string;
  status: 'passed' | 'active' | 'pending';
}

export interface TraceVerificationResult {
  code: string;
  isValid: boolean;
  productName: string;
  licenseNo: string;
  productionApprovalNo: string;
  standardNo: string;
  batchNo: string;
  productionDate: string;
  expiryDate: string;
  manufacturer: string;
  factoryAddress: string;
  activeIngredient: string;
  packageSpec: string;
  queryCount: number;
  firstQueryTime: string;
  distributionStation: string;
  storeInDate: string;
  chain: SupplyChainStep[];
  warnings?: string[];
}

export interface ServiceBooking {
  id: string;
  serviceType: 'field_diagnosis' | 'drone_spraying' | 'soil_formulation' | 'followup_inspection';
  cropType: string;
  acreage: number; // 亩
  preferredDate: string;
  timeSlot: string;
  station: string;
  contactName: string;
  contactPhone: string;
  plotAddress: string;
  associatedProducts: string[];
  notes?: string;
  status: 'submitted' | 'assigned' | 'in_progress' | 'completed';
  assignedAgronomist?: {
    name: string;
    certId: string;
    phone: string;
    title: string;
  };
}

export interface Agronomist {
  id: string;
  name: string;
  title: string;
  certNumber: string;
  experienceYears: number;
  specialties: string[];
  avatar: string;
  station: string;
  servedPlots: number;
  rating: number;
}
