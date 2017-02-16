const qiniu = require('qiniu');
const qnConfig = {
  access_key: 'Dwzp6cGfVhaZ70YLOBtKXt6orlKw2kAgHuH2AGdW',
  secret_key: 'xnmXns5ac9asQ1ZqoxzypJvGxCNlcFwGwLif0UZV'
}

qiniu.conf.ACCESS_KEY = qnConfig.access_key;
qiniu.conf.SECRET_KEY = qnConfig.secret_key;

const bucket = 'vinnie';


const pipleline = 'anwser';
const fops = "avthumb/mp3";

function uptoken(bucket, key) {
  const putPolicy = new qiniu.rs.PutPolicy(bucket);
  putPolicy.persistentOps = fops;
  putPolicy.persistentPipeline = pipleline;
  return putPolicy.token();
}

function uploadFile(body) {
  const key = String(new Date().getTime()) + '.mp3';
  const token = uptoken(bucket, key);
  const extra = new qiniu.io.PutExtra();
  return new Promise((reslove, reject) => {
    qiniu.io.putFile(token, key, body, extra, (err, ret) => {
      if (!err) {
        reslove({
          hash: ret.hash,
          name: key
        });
      } else {
        reject(err);
      }
    })
  });
}

module.exports = uploadFile;