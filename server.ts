import 'zone.js/node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import { ICQHttpClient } from './HttpClient';
import express from 'express';
import { extname, join } from 'path';
var path = require('path');
import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFile,
  statSync,
} from 'fs';
import { ProductAdapter } from 'adapters/ProductAdapter';
import { FileRepository } from 'adapters/FileRepository';
import { Order } from './adapters/Order';
const fileUpload = require('express-fileupload');
const mysql = require('mysql2');

function getAllCompany() {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saq33rrT',
    database: 'cito3_aptechki',
  });

  return new Promise<any[]>((res, rej) => {
    connection.query(
      'SELECT * FROM `company` ORDER BY `company`.`sort` DESC',
      (err: any, results: any, fields: any) => {
        connection.destroy();
        res(results);
      }
    );
  });
}
const uploadPath = '/var/www/aptechki.ru/assets/customerFiles/';
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
  let company: any[] = [];
  getAllCompany().then((r) => {
    company = r;
  });
  setInterval((r) => {
    getAllCompany().then((r) => {
      company = r;
    });
  }, 60 * 60 * 1000);

  // INTEGRATION
  let fileRepository = new FileRepository(
    '/var/www/aptechki.ru/assets/fileRepository.log'
  );
  let http = new ICQHttpClient();

  async function getProductByCategory(id: number) {
    let result = await http.get<any>(
      'http://127.0.0.1:9001/v1/product/category/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (!result) result = [];
    return result;
  }

  async function getCategoryAid() {
    const categories = await http.get<any>(
      'http://127.0.0.1:9001/v1/category/',
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (categories.status != 0) {
      console.log(categories.status);
      throw new Error('Временно не работает');
    }
    let aptechkiCategory = [];
    for (let i of categories.response) {
      if (i.parent == 374) {
        aptechkiCategory.push(i);
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
      console.log(categoriy.status);
      throw new Error('Временно не работает');
    }
    return categoriy.response;
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
    let product = await getAllProducts();
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(company));
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

  server.get('/api/product/search', async (req: any, res: any) => {
    let query = req.query['q'];
    console.log(query);
    let reg = new RegExp('(' + query + ')', 'i');
    let product = await getAllProducts();
    res.setHeader('Content-Type', 'application/json');
    res.send(
      JSON.stringify(
        product
          .filter((r: any) => !r.exclude)
          .sort((r: any, l: any) => r.regularPrice - l.regularPrice)
          .map((r) => ProductAdapter(r))
          .filter((r) => reg.test(r.title) || reg.test(r.subtitle))
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

  server.get('/api/category/:id', async (req: any, res: any) => {
    const id = req.params.id;
    let result = await http.get<any>(
      'http://127.0.0.1:9001/v1/product/category/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );
    if (!result) result = [];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result.map((r: any) => ProductAdapter(r))));
  });

  server.get('/api/product/:id', async (req: any, res: any) => {
    const id = req.params.id;
    let result = await http.get<any>(
      'http://127.0.0.1:9001/v1/product/' + id,
      {},
      { 'user-agent': 'aptechki.ru' }
    );

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(ProductAdapter(result[0])));
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
          console.log(err.errno);
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
            console.log(err);
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
      console.log(ex);
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
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + id + '.pdf'
      );
      res.send(pdf);
    } catch (ex) {
      console.log(ex);
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
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run() {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
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
