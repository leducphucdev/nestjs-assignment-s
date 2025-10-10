# API Documentation

This document provides information about all available endpoints in the Nest.js REST API.

> **Note**: All requests must include a valid JWT token in the `xt-sol-api-key` header. Tokens expire in 10 minutes and can be obtained by logging in via the `/users/login` endpoint. In these examples, the `xt-sol-api-key` header is omitted for brevity.

## Endpoints

Documentation for each endpoint is available in the following sections:

- [Users Endpoint](./docs/users-api.md)
- [Tasks Endpoint](./docs/tasks-api.md)
- [Projects Endpoint](./docs/projects-api.md)