# Local sign-in and authenticator setup

**Currently disabled at the user's request.** Backend source, dependencies, tests,
and any existing private data are retained. The frontend integration imports are
commented out, and direct server startup requires explicit opt-in. The existing
frontend pages work without the account service.


This adds a Node.js account service to the existing TMIS frontend. It uses SQLite,
server-side sessions, scrypt password hashes, encrypted TOTP secrets, QR codes
rendered locally, and hashed single-use recovery codes. No authenticator secrets or
passwords are stored in localStorage, sessionStorage, activity logs, or third-party
QR services.

## Start

Requires Node.js 24 or newer. From the project folder:

```powershell
npm.cmd install
$env:TMIS_ENABLE_AUTH_BACKEND = 'true'
npm.cmd run auth:serve
```

Before reconnecting the frontend, uncomment the script imports marked
`Backend integration disabled for now` in the HTML pages. Restore the profile
transfer control and the two-step sign-in control in `profile.html` if needed.

Open `http://127.0.0.1:3001/TMIS/app/authentication/login.html`.
The existing Apache URL and Vite preview do not execute the account service.
Keep using this Node service URL for authenticated sign-ins.

## Connect your existing profile

Browser storage is separate for different hostnames/ports. If your user-table data
is at the existing Apache address, open My Profile there and select **Transfer
profile**. This downloads only your displayed account's non-secret registration
fields. Import that JSON in the one-time account setup screen at the Node address.

Create your first sign-in using your work email and a new password. The first
account is a System Administrator. Setup is allowed only on a loopback origin and
only while the server database has no accounts. It closes permanently once the
first account is created. No default credentials are installed.

The import does not copy roles, approval privileges, passwords, or MFA material.
It preserves the original registration date when valid. The new server account
uses the imported stable User ID when available.

## Enable two-step verification

1. Open **My Profile > Security > Two-step verification**.
2. Enter your sign-in password and select **Set up authenticator**.
3. Scan the QR code with an authenticator app or enter the manual setup key.
4. Enter the app's current six-digit code and select **Verify and enable**.
5. Download/store the ten recovery codes, then acknowledge them.

Setup expires after ten minutes. The server does not enable verification until a
valid code proves enrollment. Each recovery code can be used once. Replacing
recovery codes invalidates all previous ones. Disabling verification or replacing
codes requires the password and a valid authenticator/recovery code. Previously
used TOTP time steps cannot be reused; wait for the next code if necessary.

After enrollment, sign-in requires a password followed by an authenticator or
unused recovery code. The pending sign-in expires after five minutes.
Password changes require a sign-in within the last five minutes and, when
verification is enabled, an authenticator/recovery code. Other sessions are
revoked after password changes or MFA activation/deactivation.

## Storage and deployment

- Private database: `backend/.data/auth.sqlite` (plus SQLite WAL/SHM files).
- Secret encryption key: `backend/.data/auth.key`. Back it up securely alongside
  the database; losing it makes enrolled authenticator secrets unreadable.
- Private files are excluded from Git and from this server's static routes.
  `backend/.htaccess` also denies Apache access to the backend directory.
- Default binding is loopback only. Do not expose this development server directly
  to the internet. Production needs HTTPS and a configured reverse proxy.
- Set `TMIS_ORIGIN` to the exact public origin. HTTPS origins set Secure cookies.
  The server validates Host, Origin, CSRF tokens and server-session state.
- Optional environment variables: `TMIS_PORT`, `TMIS_HOST`, `TMIS_BASE_PATH`,
  `TMIS_DATA_DIR`, `TMIS_ORIGIN`. No proxy headers are trusted automatically.
- Keep private data outside a public web root for production and restrict file
  permissions. Do not lose the encryption key when moving the database.

## API

All routes are relative to `/TMIS/api/auth/`. GET `session` establishes a CSRF
session. Every POST requires same-origin JSON, the HttpOnly session cookie, and
`X-CSRF-Token` from that session response.

- `POST setup`: one-time local initial account creation.
- `POST login`, `POST login/verify`, `POST logout`.
- `GET session`, `GET security`, `GET logs` (logs are limited to the signed-in user).
- `POST mfa/setup`, `POST mfa/enable`, `POST mfa/cancel`.
- `POST mfa/disable`, `POST mfa/recovery`.
- `POST password`.

The server blocks admin HTML routes until sign-in, but this is not a migration of
all application data: existing participants, training, and administration tables
still use prototype browser storage. Their actions and role permissions are not
server-authorized APIs yet. Additional-account provisioning, forgotten-password
email, administrator MFA recovery, and a full device/session inventory are not
implemented. These remain necessary before a multi-user production release.

## Checks

```powershell
node --test tests/auth-security.test.mjs
node --test tests/auth-browser.test.mjs
```

The browser regression test uses installed Chrome at
`C:/Program Files/Google/Chrome/Application/chrome.exe`, with temporary accounts and
a temporary database. It does not touch the local running account database.

References: [OWASP MFA guidance](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html),
[RFC 6238](https://www.rfc-editor.org/rfc/rfc6238),
[Node SQLite documentation](https://nodejs.org/api/sqlite.html).
