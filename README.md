
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
## API Reference

#### Sign up

```http
  POST /signup
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Login

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. Your password |

#### Upload a stress tracking record

```http
  POST /stresses
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `level` | `string` | **Required**. Stress level. Value must be in between 0-5 |
| `image` | `File` | **Required**. Stress image |


#### Inquire all stress tracking records

```http
  GET /stresses
```

