const elasticsearch = require('elasticsearch')
const AgentKeepAlive = require('agentkeepalive')

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH || 'localhost:9200',
  retryCount: 100,
  createNodeAgent (connection, config) {
    return new AgentKeepAlive(connection.makeAgentConfig(config))
  },
  requestTimeout: 60000
})

function saveState (state) {
  console.log('saving state')
  return new Promise((resolve, reject) => {
    client.index({
      index: 'state',
      type: 'state',
      body: state
    }, (err, response) => {
      if (err) {
        console.error('elastic error', err)
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
}

module.exports = {
  saveState
}
