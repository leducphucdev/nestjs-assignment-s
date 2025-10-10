### Greetings developer!
### Thanks for your attention to XT Solution first
### Please read this instructions care fully before try
![XT Solution!](/img/logo.svg "XT Solutio")

# Instruction

1. Create a **🔒<ins>private</ins>🔒 repository** on **Github** based on this Base project.
    
    Please code so that all of the [requirements](#requirements) below are satisfied.

    From a collaboration perspective, your ability to use Git is also evaluated. So actively use **Gitflow.**

    For every commits has **Commit message** that concisely and clearly explains the purpose of the smallest unit of Commit.

2. Please add the following user as a collaborator on Github.
    - github user name : JoJakeTaemoon
    - github user email : whxoans@gmail.com

3. Once completed, fill in the [full name and email](#assignment-applicantor) in READ.md, (To avoid with another applicant)

4. Upload the code to the final Master branch, and notify the HR Manager of XT Solutions.

5. Then wait our contact please

# Requirements

- The result must <ins>run without Docker<ins>.
- Keep the .env.* files (No editing)
- Make all works above running commands in scripts(package.json)
- Generate the migrations with provided ERD in <ins>src/migrations</ins>
- **Implement the task service** in <ins>src/api/tasks</ins> by referring to other services, modules, DTOs, and the tasks-api.md document.
- Wrtie the test code **tasks.service.spec.ts** like others
- Modify your code to pass **all of unit and e2e tests.**
- The execution code and test code are implemented, but please find the parts that are **missing from the API documentation** and update the API documentation as well.
- Change the authentication method, **use JWT** and it is **only valid for 10 minutes**,

    and change the **HTTP header name** from x-api-key to **xt-sol-api-key**,

    and update **all related documents and test codes**.
- Feel free to wrtie code on **tasks.service.spec.ts**
- Please feel free to write down any parts that you think could be added/modified from a **performance optimization** perspective.
- Feel free to refactor (Do the labelling on the commit message)

# ERD
![XT Solution!](/img/ERD4assinment.png "XT Solutio")

# Assignment

This project based on **22.14.0 LTS of Node.js** and **11.7.0 version of MariaDB**.

## Prerequisites
Databases `nest_assignment_development`, `nest_assignment_production` and `nestjs_assignment_test` should be created in the MariaDB.

```sql
CREATE USER nestjs_assignment_development@localhost IDENTIFIED BY 'nestjs_assignment_development';
CREATE USER nestjs_assignment_production@localhost IDENTIFIED BY 'nestjs_assignment_production';
CREATE USER nestjs_assignment_test@localhost IDENTIFIED BY 'nestjs_assignment_test';
```

Don't forget to grant privileges to each users with 'localhost';

## Install dependencies
```bash
# npm
$ npm install

# yarn, pnpm, bun, etc.
$ <package-manager> install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```

## Running tests

Testing generates a local SQLite database. The database location will be depended on the `TYPEORM_DATABASE` path in the `.env.test` file.

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Authentication

This API uses JWT (JSON Web Token) authentication. All requests must include a valid JWT token in the `xt-sol-api-key` header. Tokens expire in 10 minutes.

### Getting a Token

To get a JWT token, first create a user, then login with their email:

1. Create a user:
```bash
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "location": "New York"
     }' \
     --url "localhost:3000/users/create"
```

2. Login to get a token:
```bash
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"email": "john@example.com"}' \
     --url "localhost:3000/users/login"
```

This will return:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

# Requests

When sending HTTP requests, include the JWT token in the `xt-sol-api-key` header. If the header is not included or the token is invalid/expired, the server will respond with a `401 Unauthorized` status code.

Example request:
```bash
curl --url "localhost:3000/users/email/john@example.com" \
     --header "xt-sol-api-key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

# Migrations

```bash
# Run migrations
$ npm run migration:run

# Revert migrations
$ npm run migration:revert
```

# Assignment applicantor
- Full name : Lê Đức Phúc
- Email : leducphuc1234@gmail.com