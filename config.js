const nconf = require('nconf')

nconf
  .env()
  .file('./config.json')

nconf.defaults({
  accessToken: '',  // accessToken to tesla api
  refreshToken: '',  // refreshToken to tesla api
  crawler: {
    delayBetweenRequests: 1000
  }
})

module.exports = {
  accessToken: nconf.get('accessToken'),
  refreshToken: nconf.get('refreshToken'),
  delayBetweenRequests: nconf.get('crawler:delayBetweenRequests')
}
