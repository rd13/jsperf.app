const { createServer } = require('http');
const next = require('next');
const { promises, existsSync  } = require('fs');

const dev = (process.env.NODE_ENV || '').indexOf('production') === -1;

const app = next({ dev });
const handle = app.getRequestHandler();

const purgeData = async (pathname) => {
  const fullPathname = `.next/server/pages${pathname}`;
  const fullPathHTML = `${fullPathname}.html`;
  const fullPathJSON = `${fullPathname}.json`;
  try {
    if (existsSync(fullPathHTML)) {
      await promises.unlink(fullPathHTML);
      console.info(`Deleted ${fullPathHTML}`);
    }
    if (existsSync(fullPathJSON)) {
      await promises.unlink(fullPathJSON);
      console.info(`deleted ${fullPathJSON}`);
    }

    /* Delete the entry in cache */
    app.server.incrementalCache.cache.del(pathname);
    console.log(`Cache of ${fullPathname} was successfully purged`);
  } catch (err) {
    console.error(`Could not purge cache of ${fullPathname} - ${err}`);
  }
}

app.prepare().then(() => {
  createServer((req, res) => {
    const url = new URL(req.url, "http://localhost:3000/");
    if (url.searchParams.get('purge') == '1') {
      /* Handle incoming request after purge the cache */
      purgeData(url.pathname).then(r => handle(req, res));
    }else {
      /* Handle incoming request without purge the cache */
      handle(req, res)
    }
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:3000/`);
  })
})
