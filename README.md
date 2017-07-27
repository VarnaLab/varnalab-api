
# VarnaLab API

[![travis-ci]][travis] [![coveralls-status]][coveralls]


## Table of Contents

- [Origin](#origin)
- [Public API](#public-api)
- [Admin API](#admin-api)
- [Owner API](#owner-api)
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
  "some": "json"
}
```
</details>

---

## Whois

### GET /whois/known

<details>
<summary>All known people</summary>

```json
{
  "some": "json"
}
```
</details>

### GET /whois/online

<details>
<summary>Known and unknown online people and devices</summary>

```json
{
  "some": "json"
}
```
</details>

---

## Finance

### GET /finance

<details>
<summary>The entire financial data</summary>

```json
{
  "some": "json"
}
```
</details>

### GET /finance/stats

<details>
<summary>All financial stats</summary>

```json
{
  "some": "json"
}
```
</details>

### GET /finance/stats/backers

<details>
<summary>Backers stats</summary>

```json
{
  "some": "json"
}
```
</details>

---

## Admin API

```
Authorization Bearer [Admin JWT]
```

### POST /whois/known

<details>
<summary>Add new known human</summary>

```json
{
  "some": "json"
}
```
</details>

### PATCH /whois/known/:id

<details>
<summary>Update known human</summary>

```json
{
  "some": "json"
}
```
</details>

---

## Owner API

```
Authorization Bearer [Owner JWT]
```

### POST /whois/online

<details>
<summary>Sync online devices</summary>

```json
{
  "some": "json"
}
```
</details>

### POST /finance

<details>
<summary>Sync financial data and stats</summary>

```
Authorization Bearer [Owner JWT]
```

```json
{
  "some": "json"
}
```
</details>

---

## Module

### Configuration

```json
{
  "development": {
    "db": {
      "known": "/path/to/known.json",
      "unknown": "/path/to/unknown.json",
      "online": "/path/to/online.json",
      "finance": "/path/to/finance.json",
      "stats": "/path/to/stats.json"
    },
    "auth": {
      "public": "/path/to/public.pem",
      "private": "/path/to/private.pem"
    },
    "github": {
      "connect": "/oauth/connect/route",
      "team": "GitHub Team ID"
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
