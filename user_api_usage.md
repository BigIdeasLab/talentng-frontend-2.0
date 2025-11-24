# User API Usage

This document provides instructions on how to use the user-related APIs.

## Endpoints

### 1. Get All Users (Admin only)

*   **Endpoint:** `GET /users`
*   **Description:** Retrieves a list of all users. This endpoint is restricted to admin users.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Query Parameters:**
    *   `username` (optional): Filter by username.
    *   `email` (optional): Filter by email.
    *   `role` (optional): Filter by role (`general`, `talent`, `recruiter`, `mentor`, `admin`).
    *   `status` (optional): Filter by status (`active`, `suspended`, `banned`).
    *   `isVerified` (optional): Filter by verification status (true/false).
    *   `verificationLevel` (optional): Filter by verification level (`basic`, `kyc`, `org`).
*   **Response:** An array of user objects.

### 2. Get Current Authenticated User

*   **Endpoint:** `GET /users/me`
*   **Description:** Retrieves the profile of the currently authenticated user.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Response:** The user object of the authenticated user.

### 3. Update Current Authenticated User

*   **Endpoint:** `PATCH /users/me`
*   **Description:** Updates the profile of the currently authenticated user.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Request Body:**

    ```json
    {
      "username": "new_username",
      "email": "new_email@example.com",
      // ... other updatable fields
    }
    ```

*   **Response:** The updated user object.

### 4. Update User Status (Admin only)

*   **Endpoint:** `PATCH /users/:id/status`
*   **Description:** Updates the status of a specific user. This endpoint is restricted to admin users.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Request Body:**

    ```json
    {
      "status": "suspended"
    }
    ```

*   **Response:** The updated user object.

### 5. Update User Role (Admin only)

*   **Endpoint:** `PATCH /users/:id/role`
*   **Description:** Updates the role of a specific user. This endpoint is restricted to admin users.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Request Body:**

    ```json
    {
      "role": "admin"
    }
    ```

*   **Response:** The updated user object.

### 6. Update OneSignal Player ID

*   **Endpoint:** `PATCH /users/me/player-id`
*   **Description:** Updates the OneSignal player ID for the currently authenticated user.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Request Body:**

    ```json
    {
      "playerId": "your_onesignal_player_id"
    }
    ```

*   **Response:** The updated user object.

### 7. Onboard User

*   **Endpoint:** `POST /users/me/onboard`
*   **Description:** Onboards the currently authenticated user.
*   **Headers:**
    *   `Authorization`: `Bearer your_access_token`
*   **Request Body:**

    ```json
    {
      // ... onboarding data
    }
    ```

*   **Response:** The updated user object.

### 8. Check if Username is Taken

*   **Endpoint:** `GET /users/username-taken/:username`
*   **Description:** Checks if a username is already taken.
*   **Response:**

    ```json
    {
      "isTaken": true
    }
    ```
