import { pagesCollection } from '../../lib/mongodb'

const Sitemap = () => {}

export const getServerSideProps = async ({res, params}) => {
  // For some reason defining a route like [year].xml.js results in a 404,
  // so parse the year from the year param e.g. '2021.xml'

  // Only add the latest version to the sitemap, which hints to google it as canonical
  
  const year = parseInt(params.year)

  const pages = await pagesCollection()

  const result = await pages.aggregate([
    {
      '$match': {
        'visible': true,
        '$expr': {
          '$eq': [
            {'$year': '$published'},
            year
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
  ]).toArray()

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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

  /**  Set Cache Control in vercel @see https://vercel.com/docs/edge-network/caching#stale-while-revalidate */
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)

  res.end();

  return {
    props: {},
  }
}

export default Sitemap
