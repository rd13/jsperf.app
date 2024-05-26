"use server"

import { NextResponse } from "next/server"
import { pagesCollection } from '@/app/lib/mongodb'

export async function GET() {
  const pages = await pagesCollection()

  const result = await pages.aggregate([
    {
      '$match': {
        'visible': true
      }
    },
    {
      '$group': {
        '_id': {
          '$year': '$published'
        }
      }
    },
    {
      '$sort': { _id: -1 }
    }
  ]).toArray()

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${result.map(({_id}) => {
      return `
        <sitemap>
          <loc>https://jsperf.app/sitemap/${_id}.xml</loc>
        </sitemap>
      `
    }).join('')}
    </sitemapindex>
  `

  return new NextResponse(xmlResponse, { 
    headers: { 
      "Cache-Control": "s-maxage=60, stale-while-revalidate",
      "Content-Type": "text/xml" 
    } 
  })
}
