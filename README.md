# nodejs-typescript-book-review

![nodejs badge](https://img.shields.io/badge/demo_app-blue)

## About the project

Contains the backend implementation of a Book Review app. At its core, the app allows a user to register and, after a successful login, post a review for a book whose information is stored in the database.

The implementation uses an approach that combines RESTful endpoints with microservices. There are 3 services, namely the **Account**, **Book**, and **Review** services. The central role is played by the **Account** service, which receives and processes:

- user registration requests,
- user authentication requests,
- user authorization requests.

The registration and authentication requests come from the client, while the authorization requests come from the **Book** and **Review** services as well as the client.

![Book review schematic](./img/book_review_schematic.png)

Depending on the client's role, each service exposes a number of RESTful endpoints for use by the client. However, the following endpoints are open to all users, irrespective of their role:

- User registration,
- User login.

Finally, the **Account** service exposes an inter-service endpoint to accommodate requests for user authorization by the **Book** and **Review** services.

## Prerequisites

- Node.js (v22.13.1)[^1],
- Redis server (v7.4.2),
- MongoDB,
- MySQL (v8 or higher).

## Testing

Each service follows the same pattern in test organization: unit, backend and database integration tests. Please note that all tests are located in a dedicated **test branch**.

- Account service tests: [click here](https://github.com/geozi/nodejs-typescript-book-review/tree/test/services/account-service/tests)
- Book service tests: [click here](https://github.com/geozi/nodejs-typescript-book-review/tree/test/services/book-service/tests)
- Review service tests: [click here](https://github.com/geozi/nodejs-typescript-book-review/tree/test/services/review-service/tests)

## Security

- **Authentication**: Single factor, local authentication.
- **Authorization**: JSON Web Token (JWT).

## Differences with previous Typescript projects

Compared to previous Typescript projects, the Book Review app is different in its use of:

- [c8](https://www.npmjs.com/package/c8) for code coverage during testing,
- [Redis](https://redis.io/) server for caching in the Account service,
- [MySQL](https://www.mysql.com/) database for storing book-related information,
- [TypeORM](https://typeorm.io/) for interaction with MySQL,
- [Axios](https://axios-http.com/docs/intro) for inter-service communication over HTTP.

##

[^1]: According to the [Release Schedule](https://nodejs.org/en/about/previous-releases), Node.js v22 will enter its maintenance phase in the last quarter of 2025. During that period, it is recommended that the project should migrate to the latest active LTS version.

<p align="center">
        <a href="https://github.com/LelouchFR/skill-icons">
        <img src="https://go-skill-icons.vercel.app/api/icons?i=vscode,nodejs,typescript,express,mocha,mongoose,typeorm,mongo,mysql,redis"/>
      </a>
</p>
