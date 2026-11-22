import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { categoryKeys } from './data/knowledge';
import { products } from './data/products';

const productSlugs = products.map((p) => p.slug) as [string, ...string[]];

// ทุกบทความต้องมีข้อมูลครบตามนี้ ถ้าขาด build จะไม่ผ่าน เว็บจริงจะไม่พัง
const knowledge = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/knowledge' }),
  schema: z.object({
    title: z.string().min(10).max(70),
    description: z.string().min(50).max(160),
    category: z.enum(categoryKeys),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string().startsWith('/images/'),
    coverAlt: z.string().min(5),
    author: z.string().default('ทีมงาน World Class Plastic'),
    relatedProducts: z.array(z.enum(productSlugs)).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { knowledge };
