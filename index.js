'use strict';
const http = require('node:http');
const auth = require('http-auth');
const router = require('./lib/router');

const basic = auth.basic({
  realm: 'Enter username and password.',
  file: './users.htpasswd'
});

const server = http.createServer(basic.check((req, res) => {
  Promise.resolve(router.route(req, res)).catch((e) => {
    console.error('Request Error', e);
    if (!res.headersSent) {
      res.writeHead(500, {
        'Content-Type': 'text/plain; charset=utf-8'
      });
    }
    res.end('サーバーエラーが発生しました');
  });
}))
  .on('error', e => {
    console.error('Server Error', e);
  })
  .on('clientError', e => {
    console.error('Client Error', e);
  });

const port = process.env.PORT || 8000;
server.listen(port, '0.0.0.0', () => {
  console.info(`Listening on ${port}`);
});
