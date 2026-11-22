import type { APIRoute } from 'astro';
import { site } from '../data/site';

// อนุญาตทั้ง Google และ AI crawler (GPTBot, ClaudeBot, PerplexityBot ฯลฯ) ให้อ่านเว็บได้
// ระหว่างที่ข้อมูลยังไม่ครบ หน้าเว็บใส่ meta noindex ไว้แล้ว (site.indexable = false)
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site.url).href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
