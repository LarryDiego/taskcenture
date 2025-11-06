# API Specification

## REST API Specification
```yaml
openapi: 3.0.0
info:
  title: taskFlow API
  version: 1.0.0
paths:
  /api/auth/login:
    post:
      summary: Authenticate a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                email:
                  type: string
                password:
                  type: string
      responses:
        '200':
          description: Successful authentication
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
  /api/projects:
    get:
      summary: Get all projects
      responses:
        '200':
          description: A list of projects
  /api/projects/{projectId}/tasks:
    get:
      summary: Get all tasks for a project
      parameters:
        - name: projectId
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: A list of tasks
```
