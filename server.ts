import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { ICQHttpClient } from './HttpClient';
import express from 'express';
import { extname, join } from 'path';
var path = require('path');
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import {
  accessSync,
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
  writeFileSync,
} from 'fs';
import { ProductAdapter, UniversalProduct } from 'adapters/ProductAdapter';
import { FileRepository } from 'adapters/FileRepository';
import { Order } from './adapters/Order';
import { EOL } from 'os';
import { environment } from 'src/environments/environment';
import { Category, CategoryLike } from 'adapters/Category';
import { Yandex } from 'adapters/Yandex';
import { YandexRss } from 'adapters/YandexRss';
import { ProductRepository } from 'adapters/ProductRepository';
import { CompanyRepository } from 'adapters/CompanyRepository';
import { CompanyQuery } from 'adapters/CompanyQuery';
const fileUpload = require('express-fileupload');

const ROOT_PATH = process.env['ROOT_PATH'] ?? '/var/www/aptechki.ru/assets/';
const uploadPath = ROOT_PATH + '/customerFiles/';
const repositoryPath = ROOT_PATH + 'fileRepository.log';
try {
  accessSync(ROOT_PATH);
} catch (ex) {
  mkdirSync(ROOT_PATH, 0o755);
}
try {
  accessSync(uploadPath);
} catch (ex) {
  mkdirSync(uploadPath, 0o755);
}
try {
  accessSync(repositoryPath);
} catch (ex) {
  writeFileSync(repositoryPath, '[]');
}
const LIMIT_FILE = 8 * 1024 * 1024;
// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  server.use(
    fileUpload({
      limits: { fileSize: LIMIT_FILE },
    })
  );
  server.use(express.json());
  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // INTEGRATION
  const fileRepository = new FileRepository(repositoryPath);
  const http = new ICQHttpClient();
  const companyPromise = CompanyQuery({
    host: 'localhost',
    user: 'root',
    password: '*******',
    database: 'cito3_aptechki',
  });
  const companyRepository = new CompanyRepository();
  const productRepository = new ProductRepository(http);

  productRepository.init().then(() => {
    console.log('INIT ProductRepository / (first)');
  });
  companyPromise.then((clients) => {
    console.log('INIT CompanyRepository / (first) ' + clients.length);
    companyRepository.setCompany(clients);
  });
  server.get('/robots.txt', async (req: any, res: any) => {
    let file = 'User-agent: *' + EOL;
    file += 'Allow: /' + EOL;
    file += 'Disallow: /cart' + EOL;
    file += `Sitemap: ${environment.host}sitemap.xml`;
    res.setHeader('Content-Type', 'plain/text');
    res.send(file);
  });

  function setPage(url: string, lm: string) {
    return `<url>
          <loc>${url}</loc>
          <lastmod>${lm}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>${EOL}`;
  }
  server.get('/sitemap.xml', async (req: any, res: any) => {
    console.log(environment.host);
    let file = '<?xml version="1.0" encoding="UTF-8"?>' + EOL;
    file +=
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + EOL;
    let products = await getAllProducts();
    for (let i of products) {
      if (i.exclude) continue;
      file += setPage(
        `${environment.host}products/${i.id}`,
        new Date(i.updatedAt).toJSON().slice(0, 10)
      );
    }
    file += setPage(`${environment.host}contacts`, '2022-01-01');
    file += setPage(`${environment.host}clients`, '2022-01-01');
    file += setPage(`${environment.host}products`, '2022-01-01');
    file += setPage(`${environment.host}home`, '2022-01-01');
    file += '</urlset>';
    res.setHeader('Content-Type', 'application/xml');
    res.send(file);
  });
  server.get('/prices.yml', async (req: any, res: any) => {
    let categories = await getCategoryAid();
    let products = await getAllProducts();
    let cases = await getProductByCategory(377);
    console.log(cases);
    const file = new Yandex(products, cases, categories).build();
    res.setHeader('Content-Type', 'application/xml');
    res.send(file);
  });

  async function getProductByCategory(id: number) {
    let result = await http.get<UniversalProduct[]>(
      'http://127.0.0.1:9001/v1/product/category/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (!result) result = [];
    return result.map((r) => new UniversalProduct(r.id).initState(r));
  }

  async function getCategoryAid() {
    const categories = await http.get<any>(
      'http://127.0.0.1:9001/v1/category/',
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (categories.status != 0) {
      throw new Error('Временно не работает');
    }
    let aptechkiCategory = [];
    for (let i of categories.response) {
      if (i.parent == 374) {
        aptechkiCategory.push(new Category(i));
      }
    }
    return aptechkiCategory;
  }

  async function getCategoryAidByID(id: number) {
    const categoriy = await http.get<any>(
      'http://127.0.0.1:9001/v1/category/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (categoriy.status != 0) {
      throw new Error('Временно не работает');
    }
    return new Category(categoriy.response);
  }

  async function getAllProducts() {
    const category = await getCategoryAid();
    let product = [];
    for (let cat of category) {
      let productCat = await getProductByCategory(+cat.categoryID);
      product.push(...productCat);
    }
    return product;
  }
  server.get('/api/company/', async (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(companyRepository.getAllCompany()));
  });
  server.get('/api/product/popular', async (req: any, res: any) => {
    let product = await getAllProducts();
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify(
        product
          .filter((r) => r.rare)
          .filter((r: any) => !r.exclude)
          .sort((r: any, l: any) => r.regularPrice - l.regularPrice)
          .map((r) => ProductAdapter(r))
      )
    );
  });

  server.get('/v2/product/popular', async (req: any, res: any) => {
    console.log("POPULAR");
    let product = productRepository.getPopular();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(product.map((r) => ProductAdapter(r))));
  });

  server.get('/api/product/search', async (req: any, res: any) => {
    let query = req.query['q'];
    query = query
      .split(' ')
      .map((r: string) => r.replace(/(ная|ное|ая|ое|ые|[аяоеьы])$/, ''))
      .join('|');
    let reg = new RegExp('(' + query + ')', 'i');
    console.log(req.query['q'], query, reg);
    let product = await getAllProducts();
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify(
        product
          .filter((r: any) => !r.exclude)
          .sort((r: any, l: any) => r.regularPrice - l.regularPrice)
          .map((r) => ProductAdapter(r))
          .filter(
            (r) =>
              reg.test(r.title) || reg.test(r.subtitle) || reg.test(r.keywords)
          )
      )
    );
  });

  server.get('/api/category/', async (reqst: any, res: any) => {
    try {
      if (!reqst?.query?.id) {
        const aptechkiCategory = await getCategoryAid();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(aptechkiCategory));
      } else {
        const id = reqst.query.id;
        let result = await getCategoryAidByID(id);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
      }
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  server.get('/v2/category/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      if (!req?.query?.['id']) {
        let result = productRepository.getAllCategories();
        res.send(JSON.stringify(result));
      } else {
        const id = +req.query['id'];
        let result = productRepository.getCategoryAidByID(id);
        res.send(JSON.stringify(result));
      }
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  server.get('/rss', async (req: any, res: any) => {
    try {
      let productUniversal = await getAllProducts();
      const products = productUniversal
        .filter((r: UniversalProduct) => !r.exclude)
        .map((r) => ProductAdapter(r));
      let rss = new YandexRss(products);

      res.setHeader('Content-Type', 'application/xml');
      res.send(rss.body());
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  server.get('/api/category/:id', async (req: any, res: any) => {
    const id = req.params.id;
    let result = await http.get<any>(
      'http://127.0.0.1:9001/v1/product/category/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (!result) result = [];
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify(
        result.map((r: any) =>
          ProductAdapter(new UniversalProduct(r.id).initState(r))
        )
      )
    );
  });
  server.get('/v2/category/:id', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const id = +req.params.id;
      let result = productRepository.getProductByCategory(id);
      res.send(
        JSON.stringify(result.map((r: UniversalProduct) => ProductAdapter(r)))
      );
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  server.get('/api/product/:id', async (req: any, res: any) => {
    const id = req.params.id;
    let result = await http.get<any>(
      'http://127.0.0.1:9001/v1/product/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );

    res.setHeader('Content-Type', 'application/json');
    if (result.length === 0) {
      res.status(400).send('Нет товара с номером ' + id);
    } else
      res.send(
        JSON.stringify(
          ProductAdapter(
            new UniversalProduct(result[0].id).initState(result[0])
          )
        )
      );
  });

  server.get<{ id: number }>('/v2/product/:id', async (req, res) => {
    try {
      const id = +req.params.id;
      let result = productRepository.getProductByID(id)!;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(ProductAdapter(result)));
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  async function processUploadFile(f: any) {
    if (f.size >= LIMIT_FILE) throw new Error('Too large file');
    return new Promise((res, rej) => {
      const randomID = Math.round(Math.random() * 99999999).toString(32);
      mkdirSync(uploadPath, { recursive: true });
      let itemFile = {
        id: randomID,
        name: f.name,
        size: f.size,
        type: f.mimetype,
        md5: f.md5,
        ttl: 1000 * 60 * 60 * 8,
        create_at: +new Date(),
        path: uploadPath + randomID + extname(f.name),
      };
      f.mv(itemFile.path, (err: any) => {
        if (err) {
          rej(err);
        } else {
          fileRepository.add(itemFile);
          res(itemFile);
        }
      });
    });
  }

  //#region FILE SECTION

  server.post('/api/files', async (req: any, res: any) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }
    try {
      res.setHeader('Content-Type', 'application/json');
      if (req.files['customer-file'].constructor.name == 'Array') {
        let allFiles = await Promise.all(
          req.files['customer-file'].map((r: any) => processUploadFile(r))
        );
        res.send(JSON.stringify(allFiles));
      } else {
        processUploadFile(req.files['customer-file'])
          .then((fileRef) => {
            res.send(JSON.stringify([fileRef]));
          })
          .catch((err) => {
            res.status(400).send('Some problem.');
          });
      }
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  server.delete('/api/files/:id', async (req: any, res: any) => {
    const id = req.params.id;
    fileRepository.delete(id);
    res.send(JSON.stringify({ response: 'Ok' }));
  });

  server.get('/api/files/:id', async (req: any, res: any) => {
    try {
      const id = req.params.id;
      let fileStruct = fileRepository.get(id);
      var file = createReadStream(fileStruct.path);
      var stat = statSync(fileStruct.path);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', fileStruct.type);
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + id + path.extname(fileStruct.name)
      );
      file.pipe(res);
    } catch (ex) {
      res.status(400).send('Some problem.');
    }
  });
  server.get('/api/pdf/:id', async (req: any, res: any) => {
    try {
      const id = req.params.id;
      let pdf = await http.getFile(
        'http://127.0.0.1:9031/api/pdf/' + id,
        {},
        { 'user-agent': 'aptechki.ru' }
      );
      // Pапрос
      res.setHeader('Content-Length', Buffer.byteLength(pdf, 'latin1'));
      res.setHeader(
        'Link',
        `<https://aptechki.ru/api/pdf/${id}>; rel="canonical"`
      );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + id + '.pdf'
      );
      res.send(pdf);
    } catch (ex) {
      res.status(400).send('Some problem.');
    }
  });

  //#endregion

  server.post('/api/order/', async (req: any, res: any) => {
    try {
      let order = new Order(req.body, uploadPath);
      let id = await order.send();
      res.send(JSON.stringify({ response: id }));
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });

  server.post('/api/order/request', async (req: any, res: any) => {
    try {
      let order = new Order(req.body, uploadPath);
      let id = await order.sendRequest();
      res.send(JSON.stringify({ response: id }));
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });
  server.post('/api/order/call', async (req: any, res: any) => {
    try {
      let order = new Order(req.body, uploadPath);
      let id = await order.sendCall();
      res.send(JSON.stringify({ response: id }));
    } catch (ex: any) {
      res.status(400).send(ex.message);
    }
  });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req: any, res: any) => {
    res.render(indexHtml, {
      req,
      providers: [
        { provide: APP_BASE_HREF, useValue: req.baseUrl },
        { provide: 'ProductRepository', useValue: productRepository },
        { provide: 'CompanyRepository', useValue: companyRepository },
      ],
    });
  });

  return server;
}

function run() {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on ${environment.host}:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
