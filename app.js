const koa = require('koa');
const app = koa();
const Router = require('koa-router');

const sign = require('./sign.js');

const router = new Router({
    prefix: '/api'
});

// logger
app.use(function *(next){
  const start = new Date;
  yield next;
  const ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function *(next) {
  this.body = 'fuck wechat js-sdk';
  yield next;
});

router.get('/sign', function *(next) {
  const res = sign(this.query.jsApiTicket, this.query.localUrl);
  this.body = res;
  yield next;
});



app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('app is listing on 3000');
});