# User Identification & Session Management Flow

This document describes how the system identifies users, manages sessions, and maintains conversation continuity across devices and browsers.

---

## 1. First Visit (New User)

When a user visits the site for the first time:

### Step 1 — User Input

The user enters their name.

### Step 2 — Data Collected by Frontend

The frontend collects device-related information:

- **Device fingerprint**
- **User Agent**
- **Screen resolution**
- **Timezone**
- **Language**
- **Other browser/device characteristics**

### Step 3 — Session Creation

The backend generates a **Session UUID**.

### Step 4 — Database Storage

The following records are stored in their respective tables:

#### Users Table

| Field       | Description                    |
| :---------- | :----------------------------- |
| `UserId`    | Unique identifier for the user |
| `NameHash`  | Hashed user name               |
| `CreatedAt` | Account creation timestamp     |

#### Devices Table

| Field             | Description                        |
| :---------------- | :--------------------------------- |
| `DeviceId`        | Unique identifier for the device   |
| `UserId`          | Linked user                        |
| `FingerprintHash` | Hashed device fingerprint          |
| `UserAgent`       | Browser information                |
| `FirstSeen`       | First time the device was detected |

#### Sessions Table

| Field         | Description               |
| :------------ | :------------------------ |
| `SessionUUID` | Unique session identifier |
| `DeviceId`    | Linked device             |
| `CreatedAt`   | Session creation time     |
| `LastSeen`    | Last activity timestamp   |

### Step 5 — Store Session in Browser

The frontend saves the **Session UUID** in `localStorage`. This UUID identifies the browser/device on future visits.

### Step 6 — Start Conversation

The system starts a conversation and links it to the `UserId`.

---

## 2. Returning Visit (Normal Case)

- **Step 1:** Frontend sends the stored **Session UUID** from `localStorage`.
- **Step 2:** Backend checks the session.
  - **If session exists:**
    - User is authenticated.
    - Conversation is loaded.
    - ✅ User continues normally.
  - **If session does not exist:**
    - Proceed to **Missing UUID / Cookie Cleared** flow.

---

## 3. Cookie Cleared / Missing UUID

If the browser lost the stored UUID:

- **Step 1 — Device Matching:** Backend compares the current device fingerprint against stored devices.
- **Step 2 — Match Scoring:** A probabilistic similarity score is calculated (e.g., **80% similarity threshold**).
- **Step 3 — Identification Logic:**
  - **If score ≥ 80%:**
    - Ask the user to enter their name.
    - Compare with stored `NameHash`.
    - **If the name matches:**
      - Generate a new **Session UUID**.
      - Store it in the `Sessions` table.
      - Save it in `localStorage`.
      - > **Important:** Old UUIDs are NOT deleted so previously used devices continue working.
  - **If score < 80%:**
    - The system treats the visitor as a new user.
    - ➡ Return to **First Visit Flow**.

---

## 4. New Browser or New Device (Same User)

When the same user accesses the system using a new browser or device:

1.  **Fingerprint + name** match an existing user.
2.  Backend creates a new **Session UUID**.
3.  Session is stored in the `Sessions` table and linked to the existing `UserId`.
4.  Frontend stores the UUID in `localStorage`.

**Result:** The user can access their existing conversation. Multiple devices can be used simultaneously.

| Device          | UUID     |
| :-------------- | :------- |
| Desktop Chrome  | `UUID-1` |
| Desktop Firefox | `UUID-2` |
| Mobile Safari   | `UUID-3` |

_All sessions are linked to the same `UserId`._

---

## 5. Mobile Access / Different Device

If the user opens the system on a mobile device:

### Case 1 — Match Found

If fingerprint + name match an existing user:

- Generate a new **Session UUID**.
- Link it to the existing `UserId`.
- Store the session and continue normally.

### Case 2 — Match Not Found

The system asks the user to choose one of the following options:

1.  **Start a new conversation**
2.  **Enter a recovery code** (e.g., `ZUHRAN-4912`)

If the recovery code matches, the mobile session is linked to the existing `UserId` and previous conversations are loaded.

---

## 6. Recovery Code (Manual Recovery Option)

To support manual recovery across devices:

- **Properties:** Short, human-readable, and easy to type (e.g., `ZUHRAN-4912`).
- **Storage:** Stored in the database and linked to `UserId` and `Session`.
- **Usage:** Entering the code restores access to previous sessions, links the current device, and loads conversations without typing long UUID strings.

---

## 7. Multi-Device Session Handling

The system separates user identity from session identity.

| Concept                   | Implementation                       |
| :------------------------ | :----------------------------------- |
| **User Identity**         | `UserId`                             |
| **Device Identification** | Fingerprint + UserAgent              |
| **Sessions**              | Each device/browser has its own UUID |
| **Conversations**         | Linked to `UserId`                   |

**Example Architecture:**
| Device | Browser | Session UUID |
| :--- | :--- | :--- |
| Desktop | Chrome | `UUID-1` |
| Desktop | Firefox | `UUID-2` |
| Mobile | Safari | `UUID-3` |
_All sessions point to the same `UserId`._

---

## 8. Edge Cases Covered

| Scenario                         | System Behavior                                  |
| :------------------------------- | :----------------------------------------------- |
| **Cookie cleared**               | Fingerprint match → ask name → generate new UUID |
| **Mobile visit**                 | Fingerprint + name → new session created         |
| **Two browsers**                 | Each browser gets its own UUID                   |
| **Recovery code entered**        | Restores previous sessions                       |
| **Fingerprint slightly changed** | 70–80% similarity → ask for name                 |
| **Two users with same name**     | Fingerprint used as primary identifier           |
| **Incognito / private browsing** | Treated as a new device → new UUID               |
