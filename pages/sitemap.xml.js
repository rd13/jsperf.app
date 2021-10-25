import { pagesCollection } from '../lib/mongodb'

const Sitemap = () => {}

export const getServerSideProps = async ({res}) => {

  const pages = await pagesCollection()

  const result = await pages.aggregate([
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

  console.log(result)

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
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

  /**  Set Cache Control in vercel @see https://vercel.com/docs/edge-network/caching#stale-while-revalidate */
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);

  res.end();

  return {
    props: {},
  }
}

export default Sitemap
