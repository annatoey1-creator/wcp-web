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

export const site = {
  // เปิดให้ Google เก็บข้อมูลหรือยัง เปลี่ยนเป็น true เมื่อข้อมูลจริงครบ (npm run check:data ต้องผ่าน)
  indexable: false,

  url: 'https://wcp-web.vercel.app',
  brand: 'World Class Plastic',
  nameTh: unconfirmed('บริษัท เวิลด์คลาสพลาสติก จำกัด', 'จากสไลด์เดิม'),
  nameEn: unconfirmed('World Class Plastic Co., Ltd.', 'จากสไลด์เดิม'),
  tagline: 'โรงงานผลิตและขายส่งถุงขยะ B2B รับสร้างแบรนด์ OEM',

  contact: {
    phone: unconfirmed('061-968-2828', 'จากสไลด์เดิม'),
    phoneHref: 'tel:+66619682828',
    lineId: todo('LINE OA'),
    lineUrl: '', // เช่น https://lin.ee/xxxx
    email: todo('อีเมลฝ่ายขาย'),
    address: todo('ที่อยู่โรงงาน'),
    taxId: todo('เลขประจำตัวผู้เสียภาษี'),
    hours: todo('เวลาทำการ'),
    mapsEmbedUrl: '', // ลิงก์ embed จาก Google Maps
    mapsUrl: '',
    facebook: unconfirmed('https://www.facebook.com/worldclassplastic', 'จาก mockup เดิม'),
  },

  // ฟอร์มขอใบเสนอราคา: ใส่ URL ปลายทาง (Web3Forms / Formspree / Google Apps Script) เมื่อเลือกแล้ว
  form: {
    endpoint: '',
  },

  stats: [
    { label: 'กำลังการผลิตเป่าพลาสติก', fact: unconfirmed('6+ ตัน/วัน', 'จาก brief ใหม่ ขัดกับสไลด์เดิมที่ระบุ 3 ตัน/วัน') },
    { label: 'เครื่องตัดระบบ Servo', fact: unconfirmed('330,000+ ใบ/วัน', 'จาก brief') },
    { label: 'จัดส่งทุกวัน', fact: unconfirmed('300+ กระสอบ/วัน', 'จาก brief') },
  ],

  // แสดงเฉพาะใบรับรองที่มีจริง ถ้าไม่มีให้ลบออก (บริษัทยืนยันแล้วว่าไม่มีฉลากเขียว ห้ามเพิ่ม)
  certifications: [
    { name: 'ถุงขยะติดเชื้อตามข้อกำหนดกระทรวงสาธารณสุข', fact: unconfirmed('ผลิตตามข้อกำหนด', 'จาก brief ต้องตรวจกับกฎกระทรวงและผลทดสอบ') },
    { name: 'ขึ้นทะเบียนตะกร้าเขียว (Green Cart)', fact: unconfirmed('ขึ้นทะเบียนแล้ว', 'จาก brief ยังไม่มีเลขทะเบียน') },
    { name: 'สิทธิส่งออก e-Form D (ATIGA)', fact: unconfirmed('ออกเอกสารได้', 'จาก brief') },
  ],
};
