# Auth API Usage

This document provides instructions on how to use the authentication APIs.

## Endpoints

### 1. Register

*   **Endpoint:** `POST /auth/register`
*   **Description:** Registers a new user.
*   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "username": "optional_username"
    }
    ```

*   **Response:**

    ```json
    {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "username": "optional_username",
        // ... other user properties
      },
      "accessToken": "your_access_token",
      "refreshToken": "your_refresh_token"
    }
    ```

*   **Details:**
    *   The `refreshToken` is sent as an `httpOnly` cookie.

### 2. Login

*   **Endpoint:** `POST /auth/login`
*   **Description:** Logs in an existing user.
*   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

*   **Response:**

    ```json
    {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        // ... other user properties
      },
      "accessToken": "your_access_token",
      "refreshToken": "your_refresh_token"
    }
    ```

*   **Details:**
    *   The `refreshToken` is sent as an `httpOnly` cookie.

### 3. Send Email Verification

*   **Endpoint:** `POST /auth/verify-email/send`
*   **Description:** Sends a verification code to the user's email.
*   **Request Body:**

    ```json
    {
      "email": "user@example.com"
    }
    ```

### 4. Confirm Email Verification

*   **Endpoint:** `POST /auth/verify-email/confirm`
*   **Description:** Confirms the email verification code.
*   **Request Body:**

    ```json
    {
      "email": "user@example.com",
      "verificationCode": "123456"
    }
    ```

### 5. Forgot Password

*   **Endpoint:** `POST /auth/forgot-password`
*   **Description:** Sends a password reset link to the user's email.
*   **Request Body:**

    ```json
    {
      "email": "user@example.com"
    }
    ```

### 6. Reset Password

*   **Endpoint:** `POST /auth/reset-password`
*   **Description:** Resets the user's password.
*   **Request Body:**

    ```json
    {
      "resetToken": "your_reset_token",
      "newPassword": "new_password_123"
    }
    ```

### 7. Logout

*   **Endpoint:** `POST /auth/logout`
*   **Description:** Logs out the user and revokes the refresh token.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`

### 8. Create Password

*   **Endpoint:** `POST /auth/create-password`
*   **Description:** Sets a password for a user who signed up using a social login.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Request Body:**

    ```json
    {
      "password": "new_password_123"
    }
    ```

### 9. Google OAuth Login

*   **Endpoint:** `GET /auth/google`
*   **Description:** Initiates the Google OAuth login flow. The user will be redirected to the Google login page.

### 10. Google OAuth Callback

*   **Endpoint:** `GET /auth/google/callback`
*   **Description:** Handles the callback from Google after successful authentication. The user will be redirected to the frontend with the `accessToken` and `userId` in the query parameters.

### 11. Refresh Token

*   **Endpoint:** `POST /auth/refresh`
*   **Description:** Refreshes the access token using the refresh token.
*   **Details:**
    *   This endpoint is protected by the `JwtAuthGuard`, so a valid `accessToken` must be provided in the `Authorization` header.
    *   The `refreshToken` is read from the `httpOnly` cookie.
*   **Response:**

    ```json
    {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        // ... other user properties
      },
      "accessToken": "new_access_token",
      "refreshToken": "new_refresh_token"
    }
    ```
