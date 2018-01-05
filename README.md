# Tesla to elasticsearch

Polls the state of your Tesla vehicle and stores in elasticsearch.

Uses the unofficial API, documented here: https://timdorr.docs.apiary.io.

# Usage

Get an accesstoken using https://timdorr.docs.apiary.io/#reference/authentication/tokens/get-an-access-token

Create a file config.json and set accessToken to the token received:

```
{
  "accessToken": "your access token"
}
```

To run locally, start elasticsearch and kibana as specified in docker-compose.yml

> docker-compose up

Start polling with

> node index.js

It currently makes three API requests simultaneously without throttling so beware in case of API overuse. In addition to data gathered from `charge_state`, `drive_state`, and `vehicle_state`, it also adds a `timestamp`-field and a `location`-field with the current timestamp, and location gathered from drive_state formatted for use as a `geo_point` type in elasticsearch, plottable in kibana.
