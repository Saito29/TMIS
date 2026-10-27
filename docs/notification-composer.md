# Notification composer (frontend only)

Primary entry: **My Profile > Mail** (`app/admin/users/profile.html#mail`). The
full inbox Create notification link opens this tab. The standalone composer at
`app/admin/notification/notification.html` remains available. Both share the same
frontend controller and per-user draft. The notification dropdown UI is unchanged.

## Available behavior

- Notification type, normal/important priority, title, message, optional reference,
  and optional related page selected from an internal allowlist.
- Specific users, a role, or all active users as the audience.
- Live preview, character counts, recipient summary, and confirmation dialog.
- Per-user local drafts that restore after a reload.
- Local inbox creation using the same record format as all-notification.html.

No API, email, push, or external delivery is used. A notification is saved once
per selected active recipient under localStorage `tmis-notifications`. Records
include a batch ID, recipient ID, creator ID, type, priority, message, timestamp,
reference, and related page. Existing inbox records are preserved. Read and archive
states start empty and continue to use the inbox's per-user local state.

Draft key: `tmis-notification-draft:<user-id>`. A valid current user-table identity
is required to attribute drafts and notifications. A draft may be incomplete but
must contain a title or message. Creating notifications requires valid fields and
at least one active recipient. Recipients are revalidated at confirmation; a
changed recipient set requires another review. The form does not create sample
accounts or silently activate inactive/pending users.

Files:

- `src/css/notification/notification.css`
- `src/js/notification/notification.js`
- `src/js/notification/notification-data.js`

For a future backend, keep the UI/validation and replace the local draft/inbox
writes with authenticated endpoints. The server must resolve the sender, enforce
who may notify each audience, validate internal links, implement idempotency for
batch creation, and deliver to each recipient. Browser filtering is not an
access-control boundary. Backend integration remains disabled and is not modified
by this composer.

Checks:

```powershell
node --test tests/notification-composer.test.mjs tests/notification-composer-browser.test.mjs
```
