// ตรวจว่ายังมีข้อมูลธุรกิจที่ยังไม่ยืนยันเหลืออยู่ตรงไหนบ้าง
// ใช้: npm run check:data
// ถ้า site.indexable = true แต่ยังมีข้อมูลไม่ครบ สคริปต์จะล้มเหลว เพื่อกันไม่ให้ Google เก็บหน้าที่มี placeholder
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { site } from '../src/data/site.ts';
import { products } from '../src/data/products.ts';

const issues = [];

function walk(value, path) {
  if (Array.isArray(value)) return value.forEach((v, i) => walk(v, `${path}[${i}]`));
  if (value && typeof value === 'object') {
    if ('ok' in value && value.ok === false) issues.push(`${path}: ${value.value}  (${value.note ?? ''})`);
    else if ('confirmed' in value && value.confirmed === false) issues.push(`${path}: รอยืนยัน  (${value.source ?? ''})`);
    else Object.entries(value).forEach(([k, v]) => walk(v, path ? `${path}.${k}` : k));
    return;
  }
  if (typeof value === 'string' && /\[(รอ|placeholder)/.test(value)) issues.push(`${path}: ${value}`);
}

walk(site, 'site');
walk(products, 'products');
if (!site.contact.lineOaId) issues.push('site.contact.lineOaId: ยังไม่มี LINE OA ID (ปุ่ม LINE ทุกปุ่มยังเปิดแชตไม่ได้)');
if (!site.contact.lineQr) issues.push('site.contact.lineQr: ยังไม่มีรูป QR code LINE OA');
if (!site.contact.mapsEmbedUrl) issues.push('site.contact.mapsEmbedUrl: ยังไม่มีแผนที่');

// หน้าเว็บที่เขียน placeholder ไว้ตรงๆ
function scan(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) scan(p);
    else if (/\.(astro|md)$/.test(name)) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        if (line.includes('.replace(')) return; // โค้ดไฮไลต์ ไม่ใช่ข้อมูล
        if (/\[(รอ|placeholder|50%|ฟรี|3–14)/.test(line) || /confirmed: false/.test(line) || /class="todo"/.test(line))
          issues.push(`${p}:${i + 1}`);
      });
    }
  }
}
scan('src/pages');
scan('src/content');

if (issues.length === 0) {
  console.log('✓ ข้อมูลครบ พร้อมเปิดให้ Google เก็บข้อมูล (ตั้ง site.indexable = true ได้)');
} else {
  console.log(`ยังมีข้อมูลที่ต้องยืนยัน ${issues.length} จุด:\n`);
  for (const i of issues) console.log('  - ' + i);
  if (site.indexable) {
    console.error('\n✗ site.indexable = true แต่ข้อมูลยังไม่ครบ ยกเลิกการ build');
    process.exit(1);
  }
  console.log('\n(site.indexable = false เว็บยัง noindex อยู่ build ต่อได้)');
}
