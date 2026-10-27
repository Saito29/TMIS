# Devices & Sessions frontend integration

The profile's Devices & Sessions section is currently a **frontend preview**.
It makes no authentication requests and does not create, revoke, or persist real
sessions. It does not enable the retained authentication backend.

## Files

- `app/admin/users/profile.html`: collapsible inventory and confirmation dialog.
- `src/css/users/profile.css`: device cards, loading placeholders, and dialog.
- `src/js/users/profile-sessions.js`: UI, preview provider, and inactive API adapter.

The first card describes this browser from its user agent but is still marked
Preview. Other cards are explicitly sample devices. Locations and timestamps on
sample cards are demonstration data. Reset preview restores them. No preview
operations are written to the user's real activity history or browser storage.

## Future connection

Keep the current default until the backend is approved for use. Later, enable the
existing account client and replace the default provider at the module's init:

```javascript
const provider = createSessionApiProvider(window.TmisAuth.request);
mountDeviceSessions({ provider });
```

Wait for authenticated session readiness before mounting a live provider. Do not
mount both preview and live controllers on the same DOM. Importing the adapter
alone never sends requests. The three session endpoints below are contracts;
**they have not been added to the disabled backend**.

### GET sessions

Respond with authenticated sessions owned by the signed-in user:

```json
{
  "sessions": [
    {
      "id": "public-session-reference",
      "deviceName": "Work laptop",
      "deviceType": "desktop",
      "browser": "Chrome",
      "platform": "Windows",
      "location": "Approximate location or null",
      "createdAt": "2026-10-26T01:00:00Z",
      "lastActiveAt": "2026-10-26T02:30:00Z",
      "isCurrent": true
    }
  ]
}
```

Use ISO timestamps; null/missing values display Not available. `deviceType` can be
`desktop`, `mobile`, or `tablet`. Session IDs must be unique opaque display
references, never usable authentication tokens or cookie values. Derive
`isCurrent` from the real server session, never from client input. The current
session should appear exactly once in an authenticated inventory.

### POST sessions/revoke

Request: `{ "id": "public-session-reference" }`.

Resolve the current user from the server session, check ownership, and reject an
attempt to revoke the current session through this endpoint. Respond with
`{ "success": true }` only after revocation succeeds.

### POST sessions/revoke-others

Request: `{}`. Revoke other sessions owned by the signed-in user while preserving
the calling session. Respond with `{ "success": true, "revokedCount": 2 }`.

## Backend responsibilities

- Require authentication and CSRF protection on write requests.
- Enforce ownership and expiry on the server; do not accept a user ID from the UI.
- Invalidate revoked sessions on every subsequent protected request, not merely
  hide their rows. Include pending MFA challenges when appropriate.
- Require recent authentication or an MFA challenge for sensitive revocations as
  your policy requires. Return an actionable 401/403 error if reauthentication is
  needed; the UI shows errors without claiming a successful sign-out.
- Store creation, last activity, expiry, and device metadata in the server session
  store. Treat user-agent descriptions as untrusted display information.
- If approximate location is available, label it approximate; do not infer or
  fabricate an IP address or location in the frontend.
- Write real revocation events into the authenticated user's audit history.
- Return `{ "error": "User-facing explanation" }` for errors. The supplied request
  client should reject non-success HTTP responses.

## Checks

```powershell
node --test tests/profile-sessions.test.mjs
node --test tests/profile-sessions-browser.test.mjs
```

The browser test uses installed Chrome and a temporary static fixture server.
It does not start the authentication backend or change real account data.
