
# Express Jobly - Back End

This is a Springboard cumulative project consisting of the backend of a full stack web application. This is a queryable API for that consists of data for companies, users, jobs, and applications. Users can create an account, view info on companies and their job postings, as well as apply for specific jobs. 


## API References

### Authentication

#### Generate a token

```http
  POST /auth/token
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |

#### Register a new user

```http
  POST /auth/register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |
| `firstName` | `string` | **Required**.  |
| `lastName` | `string` | **Required**.  |
| `email` | `string` | **Required**.  |



### Users

#### Create a new user (admin only)

```http
  POST /users/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |
| `password` | `string` | **Required**.  |
| `firstName` | `string` | **Required**.  |
| `lastName` | `string` | **Required**.  |
| `email` | `string` | **Required**.  |

#### Get all users (admin only)

```http
  GET /users/
```
#### Get a single user

```http
  GET /users/[username]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `int` | **Required**.  |

#### Apply to a job

```http
  POST /users/[username]/jobs/[id]/[state]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |
| `id` | `int` | **Required**.  |
| `state` | `enum` | Interested, applied, accepted, or rejected  |

#### Update a job application

```http
  PATCH /users/[username]/jobs/[id]/[state]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |
| `id` | `integer` | **Required**.  |
| `state` | `enum` | Interested, applied, accepted, or rejected  |

#### Update a user

```http
  PATCH /users/[username]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |
| `firstName` | `string` | First name of user  |
| `lastName` | `string` | Last name of user  |
| `isAdmin` | `boolean` | Is an admin if true (Only accessible by an admin)  |

#### Delete a user

```http
  DELETE /users/[username]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `username` | `string` | **Required**.  |



### Companies

#### Create a new company (admin only)

```http
  POST /companies/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Company name |
| `handle` | `string` | **Required**. Company handle |
| `description` | `string` | **Required**. Short description of the company |
| `numEmployees` | `integer` |  Total employees |
| `logoUrl` | `string (url)` |  Link to the company's logo |

#### Get all companies

```http
  GET /companies/
```
#### Get a single company

```http
  GET /companies/[handle]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `handle` | `string` | **Required**.  |


#### Update a company (admin only)

```http
  PATCH /companies/[handle]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | Company name |
| `handle` | `string` | **Required**. Company handle |
| `description` | `string` | Short description of the company |
| `numEmployees` | `integer` |  Total employees |
| `logoUrl` | `string (url)` |  Link to the company's logo |

#### Delete a company (admin only)

```http
  DELETE /companies/[handle]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `handle` | `string` | **Required**.  |



### Jobs

#### Create a new job (admin only)

```http
  POST /jobs/
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `title` | `string` | **Required**. Job title |
| `salary` | `integer` | **Required**. Salary of the job |
| `equity` | `number` | Percentage of equity given |
| `companyHandle` | `string` |  **Required**. Company handle |

#### Get all jobs

```http
  GET /jobs/
```
#### Get a single job

```http
  GET /jobs/[id]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id number of a specific job |


#### Update a job (admin only)

```http
  PATCH /jobs/[id]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id number of a specific job |
| `title` | `string` | Job title |
| `salary` | `integer` | Salary of the job |
| `equity` | `number` | Percentage of equity given |

#### Delete a job (admin only)

```http
  DELETE /jobs/[id]
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `integer` | **Required**. Id number of a specific job |


## Authors

- [Jason Scott](https://github.com/jasonscotch) - Springboard Bootcamp Student


## Badges

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-yellow.svg)](https://shields.io/) 

[![made-with-html](https://img.shields.io/badge/Made%20with-HTML-red.svg)](https://shields.io/)

[![made-with-bcrypt](https://img.shields.io/badge/Made%20with-bcrypt-blue.svg)](https://shields.io/)

[![made-with-express](https://img.shields.io/badge/Made%20with-Express-green.svg)](https://shields.io/)

[![made-with-jsonschema](https://img.shields.io/badge/Made%20with-JSONSchema-purple.svg)](https://shields.io/)

[![made-with-jsonwebtoken](https://img.shields.io/badge/Made%20with-JSONWebToken-orange.svg)](https://shields.io/)

[![made-with-morgan](https://img.shields.io/badge/Made%20with-Morgan-white.svg)](https://shields.io/)


## Run Locally

Clone the project

```bash
  git clone https://github.com/jasonscotch/express-jobly
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```


## Running Tests

To run tests, run the following command

```bash
  jest -i
```

