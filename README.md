
# OOCA stress tracking API

A RESTful API for stress tracking tool




## Installation

Install with yarn

```bash
  git clone
  cd stress-tracking-api
  yarn
```
    
## Deployment

Setup Postgres and Redis (for development). I assume that Docker is ready on your machine

```bash
  docker compose up
```

Create env file and update your new env

```bash
  cp .env.example.local .env.development.local
```

Start locally

```bash
  yarn dev
```

Start for production

```bash
  yarn start
```
## Running Tests

To run tests, run the following command

```bash
  yarn test
```


## Postman

You can try APIs by importing the `postman.json` file to Postman