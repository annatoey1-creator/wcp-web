// ข้อมูลธุรกิจทั้งหมดของเว็บอยู่ในไฟล์นี้ไฟล์เดียว แก้ที่นี่แล้วจะเปลี่ยนทุกหน้า
//
// กติกา
//   confirmed('...')          เจ้าของยืนยันแล้ว (มีเอกสารใน C:\projects\inbox\doc)
//   unconfirmed('...', 'ที่มา') มีข้อมูลแต่ยังไม่ยืนยัน หน้าเว็บจะไฮไลต์สีเหลือง
//   todo('ชื่อข้อมูล')          ยังไม่มีข้อมูล หน้าเว็บจะแสดง [ชื่อข้อมูล] สีเหลือง
//
// ห้ามแต่งข้อมูลขึ้นเอง ถ้าไม่มีเอกสาร ให้ใช้ todo()
// ข้อมูลที่ยังไม่ confirmed จะไม่ถูกใส่ใน meta tag และ JSON-LD ที่ Google อ่าน

export type Fact = { value: string; ok: boolean; note?: string };

export const confirmed = (value: string): Fact => ({ value, ok: true });
export const unconfirmed = (value: string, note: string): Fact => ({ value, ok: false, note });
export const todo = (label: string): Fact => ({ value: `[${label}]`, ok: false, note: 'ยังไม่มีข้อมูล' });

/** ค่าที่ใช้ได้เฉพาะเมื่อยืนยันแล้ว ใช้กับ meta tag และ JSON-LD */
export const verified = (f: Fact): string | undefined => (f.ok ? f.value : undefined);

// ลูกค้าติดต่อผ่าน LINE OA เท่านั้น (ไม่มีแบบฟอร์ม) ปุ่มทุกปุ่มใช้ฟังก์ชันนี้
// ใส่ message เพื่อให้แชตมีข้อความพิมพ์ไว้ให้ลูกค้ากดส่งได้ทันที
// (ข้อความพิมพ์ไว้ให้ใช้ได้เฉพาะเมื่อมี lineOaId แบบ @ ถ้ามีแค่ลิงก์เพิ่มเพื่อน จะเปิดหน้าเพิ่มเพื่อนแทน)
export function lineLink(message?: string): string {
  const { lineOaId: id, lineAddUrl } = site.contact;
  if (id) {
    const base = `https://line.me/R/oaMessage/${encodeURIComponent(id)}/`;
    return message ? `${base}?${encodeURIComponent(message)}` : base;
  }
  if (lineAddUrl) return lineAddUrl;
  return '/contact#line'; // ยังไม่มีข้อมูล LINE ส่งไปหน้าติดต่อก่อน
}

export const site = {
  // เปิดให้ Google เก็บข้อมูลหรือยัง เปลี่ยนเป็น true เมื่อข้อมูลจริงครบ (npm run check:data ต้องผ่าน)
  indexable: false,

  url: 'https://wcp-web.vercel.app',
  brand: 'World Class Plastic',
  nameTh: confirmed('บริษัท เวิลด์คลาสพลาสติก จำกัด'), // เจ้าของยืนยันในแชต 2026-11-22
  nameEn: unconfirmed('World Class Plastic Co., Ltd.', 'จากสไลด์เดิม'),
  tagline: 'โรงงานผลิตและขายส่งถุงขยะ B2B รับสร้างแบรนด์ OEM',

  contact: {
    phone: unconfirmed('061-968-2828', 'จากสไลด์เดิม'),
    phoneHref: 'tel:+66619682828',
    // LINE OA ID ขึ้นต้นด้วย @ เช่น '@worldclassplastic' ใส่แล้วปุ่ม LINE ทุกปุ่มจะเปิดแชตพร้อมข้อความให้เอง
    lineOaId: '',
    // ลิงก์เพิ่มเพื่อน LINE ส่วนตัวของฝ่ายขาย (ยังไม่ใช่ LINE OA) เจ้าของยืนยัน 2026-11-22
    // ถ้าเปลี่ยนเป็น LINE OA ภายหลัง ให้ใส่ lineOaId แทน ปุ่มจะพิมพ์ข้อความไว้ให้ลูกค้าอัตโนมัติ
    lineAddUrl: 'https://line.me/ti/p/mVLJ2wja5-',
    lineQr: '/images/brand/line-qr.jpg',
    email: todo('อีเมลฝ่ายขาย'),
    address: todo('ที่อยู่โรงงาน'),
    taxId: todo('เลขประจำตัวผู้เสียภาษี'),
    hours: todo('เวลาทำการ'),
    mapsEmbedUrl: '', // ลิงก์ embed จาก Google Maps
    mapsUrl: '',
    facebook: unconfirmed('https://www.facebook.com/worldclassplastic', 'จาก mockup เดิม'),
  },

  // ยืนยันแล้วในแชต 2026-11-22 (ตัวเลข 3 ตัน/วัน ในสไลด์เดิมเป็นข้อมูลเก่า)
  stats: [
    { label: 'กำลังการผลิตเป่าพลาสติก', fact: confirmed('6+ ตัน/วัน') },
    { label: 'เครื่องตัดระบบ Servo', fact: confirmed('330,000+ ใบ/วัน') },
    { label: 'จัดส่งทุกวัน', fact: confirmed('300+ กระสอบ/วัน') },
  ],

  // แสดงเฉพาะใบรับรองที่มีจริง ถ้าไม่มีให้ลบออก (บริษัทยืนยันแล้วว่าไม่มีฉลากเขียว ห้ามเพิ่ม)
  certifications: [
    { name: 'ถุงขยะติดเชื้อตามข้อกำหนดกระทรวงสาธารณสุข', fact: unconfirmed('ผลิตตามข้อกำหนด', 'จาก brief ต้องตรวจกับกฎกระทรวงและผลทดสอบ') },
    { name: 'ขึ้นทะเบียนตะกร้าเขียว (Green Cart)', fact: unconfirmed('ขึ้นทะเบียนแล้ว', 'จาก brief ยังไม่มีเลขทะเบียน') },
    { name: 'สิทธิส่งออก e-Form D (ATIGA)', fact: unconfirmed('ออกเอกสารได้', 'จาก brief') },
  ],
};
