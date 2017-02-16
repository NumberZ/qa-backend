const koa = require('koa');
const app = koa();
const Router = require('koa-router');
const fs = require('fs');
const http = require('http');
const weixin = require('weixin-node');
const request = require('request');
const sign = require('./sign.js');
const uploadVoice = require('./uploadVoice');

const router = new Router({
    prefix: '/api'
});

const wxConfig = {
 appId: 'wx039613f59e8ce6c4',
 secret: '8e5149e62d86e15f51080a4cd88e575b'
}



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
  const token = yield weixin.getToken(wxConfig.appId, wxConfig.secret);
  console.log('token:', token);
  const ticket = yield weixin.getTicket(token.access_token);
  console.log('ticket:', ticket)
  const res = sign(ticket.ticket, this.query.localUrl);
  console.log('res:', res);
  this.body = res;
  yield next;
});

router.get('/uploadVoice', function *(next) {
  const serverId = this.query.serverId;
  const token = yield weixin.getToken(wxConfig.appId, wxConfig.secret);
  console.log(`http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=${token.access_token}&media_id=${serverId}`);
  const url = `http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=${token.access_token}&media_id=${serverId}`;
  const time = String(new Date().getTime());
  request(url)
  .on('response', (response) => {
    response.on('end', () => {
      console.log('end');
      uploadVoice(`${time}.amr`);
    })
  })
  .pipe(fs.createWriteStream(`${time}.amr`))
  // uploadVoice(res);
  this.body = `http://file.api.weixin.qq.com/cgi-bin/media/get?access_token=${token.access_token}&media_id=${serverId}`;
})
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
    console.log('app is listing on 3000');
});