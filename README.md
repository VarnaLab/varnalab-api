
# VarnaLab API

[![travis-ci]][travis] [![coveralls-status]][coveralls]


## Table of Contents

- [Origin](#origin)
- [Public API](#public-api)
- [Admin API](#admin-api)
- [Slack API](#slack-api)
- [Module](#module)


## Origin

```bash
https://simo.varnalab.org/api[API Endpoint] # staging
```

```bash
https://api.varnalab.org[API Endpoint] # production
```

## Public API

## Auth

### GET /auth/login

<details>
<summary>Login with your GitHub account</summary>

```json
{
  "admin": true,
  "jwt": "..."
}
```
</details>

---

## Whois

> **[varnalab-whois]**

### GET /whois/known

<details>
<summary>All known people</summary>

```json
[
  {
    "id": "b0e915e2-e60c-4d4d-a693-343c9c0234c9",
    "name": "Симеон Величков",
    "gravatar": "bc8400cd663c63dbdbc8607870390a20",
    "backer": "Симо V",
    "github": "simov",
    "twitter": "_simov"
  }
]
```
</details>

### GET /whois/online

<details>
<summary>Known and unknown online people and devices</summary>

```json
{
  "known": [
    "b93b098c-adb5-48ce-8dd1-8828f39d99d3",
    "42ccbc1a-f0bc-416d-a7f7-f4c6e0910023"
  ],
  "unknown": [
    {
      "id": "6197b1fd-9fb7-473f-bdb9-a9a832065c72",
      "host": "debian",
      "vendor": "Intel Corporate"
    },
    {
      "id": "71c325b8-f123-46d9-847c-97bf45fb37f7",
      "host": "android-cae44bf1974b5f66",
      "vendor": "Motorola Mobility LLC, a Lenovo Company"
    }
  ]
}
```
</details>

---

## Finance

> **[varnalab-finance]**

### GET /finance

<details>
<summary>The entire financial data</summary>

```json
{
  "income": {...},
  "spend": {...}
}
```
</details>

### GET /finance/stats

<details>
<summary>All financial stats</summary>

```json
[
  [...],
  [...]
]
```
</details>

### GET /finance/stats/backers

<details>
<summary>Backers stats</summary>

```json
[
  {
    "name": "Тодор Драгнев",
    "monthly": [50,50,50,50,50,80,50,50,0,0,0,0],
    "total": 430,
    "average": 61
  }
]
```
</details>

---

## Events

### GET /events

- `offset` *0*
- `limit` *10*

<details>
<summary>VarnaLab Events Range</summary>

```json
[
  {
    "id": "2044728552423780",
    "name": "LoraWAN - TTN Varna meeting September 2017",
    "description": "Отново ще експериментираме с крайните устройства, ще закачим GPS модул и ще си поиграем и с един аналогов осцилоскоп :)",
    "photo": "https://scontent.xx.fbcdn.net/v/t1.0-0/p480x480/20620935_1515230891867157_3034615754728253404_n.jpg?oh=434022dbe5157cd3a75ce45f5b556de6&oe=5A24590D",
    "start_time": "2017-09-16T11:00:00+0300",
    "end_time": "2017-09-16T18:00:00+0300",
    "updated_time": "2017-08-07T13:28:38+0000"
  }
]
```
</details>


- `id` *Event ID*

<details>
<summary>Single VarnaLab Event</summary>

```json
{
  "id": "2044728552423780",
  "name": "LoraWAN - TTN Varna meeting September 2017",
  "description": "Отново ще експериментираме с крайните устройства, ще закачим GPS модул и ще си поиграем и с един аналогов осцилоскоп :)",
  "photo": "https://scontent.xx.fbcdn.net/v/t1.0-0/p480x480/20620935_1515230891867157_3034615754728253404_n.jpg?oh=434022dbe5157cd3a75ce45f5b556de6&oe=5A24590D",
  "start_time": "2017-09-16T11:00:00+0300",
  "end_time": "2017-09-16T18:00:00+0300",
  "updated_time": "2017-08-07T13:28:38+0000"
}
```
</details>

### GET /events/upcoming

<details>
<summary>Upcoming Events</summary>

```json
[
  {
    "id": "2044728552423780",
    "name": "LoraWAN - TTN Varna meeting September 2017",
    "description": "Отново ще експериментираме с крайните устройства, ще закачим GPS модул и ще си поиграем и с един аналогов осцилоскоп :)",
    "photo": "https://scontent.xx.fbcdn.net/v/t1.0-0/p480x480/20620935_1515230891867157_3034615754728253404_n.jpg?oh=434022dbe5157cd3a75ce45f5b556de6&oe=5A24590D",
    "start_time": "2017-09-16T11:00:00+0300",
    "end_time": "2017-09-16T18:00:00+0300",
    "updated_time": "2017-08-07T13:28:38+0000"
  }
]
```
</details>

---

## Admin API

```
Authorization Bearer [Admin JWT]
```

### POST /whois/known

<details>
<summary>Add new known user</summary>

```json
{
  "id": ""
}
```
</details>

### PATCH /whois/known/:id

<details>
<summary>Update known user</summary>

```json
{
  "id": ""
}
```
</details>

### DELETE /whois/known/:id

<details>
<summary>Delete known user</summary>

```json
{
  "id": ""
}
```
</details>

---

## Slack API

### POST /slack/whois

Slack attachments: Whois Online in VarnaLab

### POST /slack/events

Slack attachments: Upcoming Events in VarnaLab

---

## Module

### Configuration

```json
{
  "development": {
    "db": {
      "users": "/path/to/users.json",
      "devices": "/path/to/devices.json",
      "online": "/path/to/online.json",
      "finance": "/path/to/finance.json",
      "stats": "/path/to/stats.json",
      "events": "/path/to/events.json"
    },
    "auth": {
      "public": "/path/to/public.pem",
      "private": "/path/to/private.pem"
    },
    "github": {
      "connect": "/oauth/connect/route",
      "team": "[Team ID]"
    },
    "slack": {
      "token": "[WebHook Token]"
    }
  }
}
```

### API

```js
var server = express()
var api = require('varnalab-api')
var config = {...}
server.use(api(config))
server.listen(3000)
```

### Server

```bash
node bin/ --config /path/to/config.json
```


  [travis-ci]: https://img.shields.io/travis/VarnaLab/varnalab-api/master.svg?style=flat-square (Build Status - Travis CI)
  [coveralls-status]: https://img.shields.io/coveralls/VarnaLab/varnalab-api.svg?style=flat-square (Test Coverage - Coveralls)

  [travis]: https://travis-ci.org/VarnaLab/varnalab-api
  [coveralls]: https://coveralls.io/github/VarnaLab/varnalab-api

  [varnalab-whois]: https://github.com/VarnaLab/varnalab-whois
  [varnalab-finance]: https://github.com/VarnaLab/varnalab-finance
