"use server"

import { NextResponse } from "next/server"
import { notFound } from "next/navigation"
import { pagesCollection } from '@/app/lib/mongodb'

export async function GET(
  request, 
  { params: { year } } 
) {
  // Only add the latest revision to the sitemap, which hints to google it as canonical
  const pages = await pagesCollection()

  const result = await pages.aggregate([
    {
      '$match': {
        'visible': true,
        '$expr': {
          '$eq': [
            {'$year': '$published'},
            parseInt(year) // [year].xml
          ]
        }
      }
    },
    {
      '$sort': {
        'revision': 1
      }
    },
    {
      '$group': {
        _id: "$slug",
        document: {
          "$last": "$$ROOT"
        }
      }
    },
    {
      '$replaceRoot': {
        newRoot: "$document"
      }
    },
    {
      '$project': {
        'slug': 1, 
        'revision': 1, 
        'published': 1,
        'visible': 1,
        'year': {
          '$year': '$published'
        }
      }
    },
    {
      '$sort': { published: -1 }
    }
  ],
    {
      allowDiskUse: true
    }
  ).toArray()

  if (result.length === 0) {
    return notFound()
  }

  const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${result.map(({slug, revision, published}) => {
      return `
        <url>
          <loc>https://jsperf.app/${slug}${revision === 1 ? '' : `/${revision}`}</loc>
          <lastmod>${new Date(published).toISOString()}</lastmod>
        </url>
      `
    }).join('')}
    </urlset>
  `


  return new NextResponse(xmlResponse, { 
    headers: { 
      "Cache-Control": "s-maxage=60, stale-while-revalidate",
      "Content-Type": "text/xml" 
    } 
  })
}
