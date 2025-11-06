# Security and Performance

## Security Requirements
*   **Frontend Security:**
    *   Input validation on all forms.
    *   Securely store JWT in `HttpOnly` cookies.
*   **Backend Security:**
    *   Use Spring Security for authentication and authorization.
    *   Implement CORS policy to only allow requests from the frontend domain.
*   **Authentication Security:**
    *   Passwords must be hashed with BCrypt.
    *   JWTs should have a short expiration time.

## Performance Optimization
*   **Frontend Performance:**
    *   Code splitting by route to reduce initial bundle size.
    *   Lazy loading of images and components.
*   **Backend Performance:**
    *   Database query optimization and indexing.
    *   Use caching for frequently accessed data.
