import { Product, TraceVerificationResult, ServiceBooking, CartItem } from '../types';
import { PRODUCTS } from '../data/mockData';
import { verifyTraceCode as localVerify } from '../utils/traceUtils';

export const api = {
  // Fetch products with optional filtering
  async getProducts(category?: string, query?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category !== '全部') params.append('category', category);
      if (query) params.append('q', query);

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API Client] Backend fetch failed, using local catalog cache', e);
    }
    // Fallback
    return PRODUCTS.filter((p) => {
      const matchCat = !category || category === '全部' || p.category === category;
      const matchQ =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.licenseNo.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchCat && matchQ;
    });
  },

  // Verify National Pesticide Electronic Code
  async verifyTraceCode(code: string): Promise<TraceVerificationResult> {
    try {
      const res = await fetch('/api/trace/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API Client] Backend verification failed, using local validation engine', e);
    }
    return localVerify(code);
  },

  // Get digital traceability ledger
  async getTraceLedger(): Promise<any[]> {
    try {
      const res = await fetch('/api/trace/history');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[API Client] Backend ledger fetch failed', e);
    }
    return [];
  },

  // Fetch bookings
  async getBookings(): Promise<ServiceBooking[]> {
    try {
      const res = await fetch('/api/bookings');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[API Client] Backend bookings fetch failed', e);
    }
    return [];
  },

  // Create new doorstep booking
  async createBooking(booking: Partial<ServiceBooking>): Promise<ServiceBooking> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('[API Client] Backend create booking failed', e);
    }
    return {
      id: `BK-${Date.now().toString().slice(-6)}`,
      serviceType: booking.serviceType || 'drone_spraying',
      cropType: booking.cropType || '水稻',
      acreage: booking.acreage || 30,
      preferredDate: booking.preferredDate || '2024-10-02',
      timeSlot: booking.timeSlot || '上午',
      station: booking.station || '长沙县安沙农资自营直供中心',
      contactName: booking.contactName || '种植户',
      contactPhone: booking.contactPhone || '138-7589-9921',
      plotAddress: booking.plotAddress || '安沙示范区',
      associatedProducts: booking.associatedProducts || [],
      status: 'submitted',
    };
  },

  // Submit procurement order
  async createOrder(items: CartItem[], station?: string): Promise<any> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, station }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[API Client] Backend order submission failed', e);
    }
    return {
      success: true,
      data: {
        orderId: `DD-${Date.now().toString().slice(-8)}`,
        totalAmount: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      },
    };
  },

  // Fetch real-time agro-weather
  async getWeather(): Promise<any> {
    try {
      const res = await fetch('/api/weather');
      if (res.ok) {
        const json = await res.json();
        if (json.success) return json.data;
      }
    } catch (e) {
      console.warn('[API Client] Backend weather fetch failed', e);
    }
    return {
      temperature: 26,
      humidity: 64,
      windSpeed: 1.8,
      windDirection: '东南风 2级',
      droneSprayIndex: '适宜飞防',
    };
  },
};
