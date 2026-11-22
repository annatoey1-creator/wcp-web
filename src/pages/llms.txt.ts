import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site, lineLink } from '../data/site';
import { products } from '../data/products';
import { categories, type CategoryKey } from '../data/knowledge';

// llms.txt สรุปเว็บให้ AI (ChatGPT, Gemini, Claude ฯลฯ) อ่าน ตามมาตรฐาน https://llmstxt.org
// สร้างอัตโนมัติจากข้อมูลในเว็บ เพิ่มสินค้าหรือบทความแล้วไฟล์นี้จะอัปเดตเอง
// ใส่เฉพาะข้อมูลที่ confirmed แล้ว ข้อมูลที่รอยืนยันจะไม่ถูกส่งให้ AI

const abs = (path: string) => new URL(path, site.url).href;

export const GET: APIRoute = async () => {
  const posts = (await getCollection('knowledge', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );

  const facts = [
    site.nameTh.ok && `ชื่อบริษัท: ${site.nameTh.value}`,
    'ประสบการณ์ในอุตสาหกรรมพลาสติกรีไซเคิล 20+ ปี', // ยืนยันในแชต 2026-11-22 (ดู about.astro)
    ...site.stats.filter((s) => s.fact.ok).map((s) => `${s.label}: ${s.fact.value}`),
    'มีโรงงานผลิตเม็ดพลาสติกเอง ควบคุมวัตถุดิบได้ตั้งแต่เม็ดพลาสติกจนถึงถุงสำเร็จรูป',
    'ตรวจวัดความหนาของถุงด้วยเครื่องวัด',
    'จัดส่งทั่วประเทศและประเทศเพื่อนบ้าน',
    'รับผลิต OEM สร้างแบรนด์ถุงขยะของลูกค้า พร้อมออกแบบโลโก้และแพ็กเกจจิ้งให้ฟรี',
    'สินค้าของบริษัทไม่ได้รับฉลากเขียว (Green Label)',
  ].filter(Boolean);

  const contact = lineLink();
  const lines = [
    `# ${site.brand} (${site.nameTh.ok ? site.nameTh.value : site.brand})`,
    '',
    `> ${site.tagline} ลูกค้าเป็นองค์กร เช่น โรงพยาบาล โรงงาน อาคารสำนักงาน และบริษัททำความสะอาด`,
    '',
    ...facts.map((f) => `- ${f}`),
    '',
    `ติดต่อสั่งซื้อและขอใบเสนอราคาผ่าน LINE เท่านั้น: ${contact.startsWith('http') ? contact : abs(contact)}`,
    '',
    '## สินค้า',
    '',
    ...products.map((p) => `- [${p.name}](${abs(`/products/${p.slug}`)}): ${p.description}`),
    '',
    '## บริการ',
    '',
    `- [รับผลิต OEM สร้างแบรนด์](${abs('/oem')}): ผลิตถุงขยะภายใต้แบรนด์ของลูกค้า`,
    `- [ส่งออกต่างประเทศ](${abs('/export')}): จัดส่งไปประเทศเพื่อนบ้าน`,
    `- [เกี่ยวกับเรา](${abs('/about')})`,
    `- [ติดต่อเรา](${abs('/contact')})`,
    '',
    '## บทความความรู้',
    '',
    ...posts.map(
      (p) =>
        `- [${p.data.title}](${abs(`/knowledge/${p.id}`)}): ${p.data.description} (หมวด${categories[p.data.category as CategoryKey].name})`,
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
