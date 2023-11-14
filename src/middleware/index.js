const axios = require('axios')
const path = require('path')
const http01 = require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' })

const S3 = { bucketName: 'some-fantastic-private-bucket' }
const store = require('le-store-s3').create({ S3 })

const greenlock = require('greenlock-express').create({
  server: 'https://acme-v02.api.letsencrypt.org/directory',
  version: 'draft-11',
  configDir: path.join(__dirname, 'acme'),
  approveDomains,
  app: require('../../app.js'),
  communityMember: true,
  store,
  debug: process.env.NODE_ENV === 'development',
  renewBy: 10 * 24 * 60 * 60 * 1000,
  renewWithin: 14 * 24 * 60 * 60 * 1000
})

function approveDomains (opts, certs, cb) {
  opts.challenges = { 'http-01': http01 }
  opts.email = config.email

  if (certs) {
    opts.domains = [certs.subject].concat(certs.altnames)
  }

  checkDomain(opts.domains, (err, agree) => {
    if (err) { cb(err); return }
    opts.agreeTos = agree
    cb(null, { options: opts, certs: certs })
  })
}

function checkDomain (domains, cb) {
  const userAgrees = true
  if (domains[0]) {
    axios.get(`https://your.application.com/check-this-domain/ + ${domains[0]}`)
      .then(res => {
        cb(null, userAgrees)
      })
      .catch(err => {
        cb(err)
      })
  } else {
    cb(new Error('No domain found'))
  }
}

greenlock.listen(80, 443)