// หมวดบทความในคลังความรู้ ถ้าจะเพิ่มหมวด ให้เพิ่มที่นี่ และใน src/content.config.ts

export const categories = {
  'law-standards': {
    name: 'กฎหมายและมาตรฐานการจัดซื้อ',
    description: 'ข้อกำหนดถุงขยะติดเชื้อ กฎกระทรวง และการเขียน TOR สำหรับฝ่ายจัดซื้อ',
  },
  'spec-cost': {
    name: 'คำนวณสเปกและลดต้นทุน',
    description: 'วิธีเลือกขนาด ความหนา และคำนวณต้นทุนต่อใบให้คุ้มที่สุด',
  },
  sustainability: {
    name: 'สิ่งแวดล้อมและความยั่งยืน',
    description: 'พลาสติกรีไซเคิล ESG และการจัดการขยะในองค์กร',
  },
  'cross-border': {
    name: 'การค้าส่งออกชายแดน',
    description: 'เอกสารส่งออก สิทธิทางภาษี และการนำเข้าสู่ สปป.ลาว และเมียนมา',
  },
} as const;

export type CategoryKey = keyof typeof categories;
export const categoryKeys = Object.keys(categories) as [CategoryKey, ...CategoryKey[]];

/** เวลาอ่านโดยประมาณ ภาษาไทยไม่มีเว้นวรรคระหว่างคำ จึงนับจากจำนวนตัวอักษร */
export function readingMinutes(body: string | undefined): number {
  const text = (body ?? '').replace(/```[\s\S]*?```/g, '').replace(/[#>*_`\-|\[\]()!]/g, '').replace(/\s+/g, '');
  return Math.max(1, Math.round(text.length / 900));
}

export const formatThaiDate = (d: Date) =>
  d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
