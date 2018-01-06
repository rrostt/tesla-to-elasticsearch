const rq = require('request-promise-native')
const JSONBig = require('json-bigint')
const elastic = require('./lib/elastic')
const config = require('./config')

// here to allow refresh
const tokens = {
  accessToken: config.accessToken,
  refreshToken: config.refreshToken
}

const auth = {
  bearer: tokens.accessToken
}

function getVehicleId () {
  return rq({
    method: 'GET',
    uri: 'https://owner-api.teslamotors.com/api/1/vehicles',
    auth
  })
    .then(json => {
      // id bigger than int, but formatted as number
      const data = JSONBig.parse(json)
      const vehicleId = data.response[0].id
      console.log('vehicleId', vehicleId)
      return vehicleId
    })
}

function getChargeState (vehicleId) {
  console.log('requesting ', `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/charge_state`)
  return rq({
    method: 'GET',
    uri: `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/charge_state`,
    auth,
    json: true
  })
    .then(response => response.response)
}

function getDriveState (vehicleId) {
  console.log('requesting ', `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/drive_state`)
  return rq({
    method: 'GET',
    uri: `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/drive_state`,
    auth,
    json: true
  })
    .then(response => response.response)
}

function getVehicleState (vehicleId) {
  console.log('requesting ', `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/vehicle_state`)
  return rq({
    method: 'GET',
    uri: `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/vehicle_state`,
    auth,
    json: true
  })
    .then(response => response.response)
}

function getClimateState (vehicleId) {
  console.log('requesting ', `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/climate_state`)
  return rq({
    method: 'GET',
    uri: `https://owner-api.teslamotors.com/api/1/vehicles/${vehicleId}/data_request/climate_state`,
    auth,
    json: true
  })
    .then(response => response.response)
}

function mapState (state) {
  return Object.assign({}, state, {
    timestamp: new Date(),
    location: {
      lat: state.driveState.latitude,
      lon: state.driveState.longitude
    }
  })
}

function getState (vehicleId) {
  return Promise.all([
    getChargeState(vehicleId),
    getDriveState(vehicleId),
    getVehicleState(vehicleId),
    getClimateState(vehicleId)
  ])
    .then(([chargeState, driveState, vehicleState, climateState]) => ({chargeState, driveState, vehicleState, climateState}))
    .then(mapState)
}

function getNext (vehicleId) {
  return getState(vehicleId)
    // .then(state => console.log(JSON.stringify(state, null, 2)) || state)
    .then(state => elastic.saveState(state))
    .then(() => getNext(vehicleId))
    .catch(() => setTimeout(() => getNext(vehicleId), 5000))
}

getVehicleId()
  .then(vehicleId =>
    getNext(vehicleId)
  )
  .catch(error => console.error('error', error))
