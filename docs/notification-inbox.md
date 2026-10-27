# Notification inbox (frontend)

The full inbox is `app/admin/notification/details/all-notification.html`.
The header's View all notifications button opens it using the shared navigation
script, independent of the current page depth.

## Features

- Inbox, Unread, and Archived views with counts.
- Search, notification-type filters, grouped dates, and pagination.
- Read/unread, mark all read, archive, and restore controls.
- A details dialog with a validated related-page link.
- An explicit Preview layout mode whose state is kept only in memory.

## Data

The page uses the same current-user identity as the activity journal. It reads
notifications explicitly addressed to that user from localStorage
`tmis-notifications`. It also derives account-review reminders from pending
registrations for the System Administrator, and the current user's recorded
account updates. It does not create arbitrary training or participant events.

Example feed record:

```json
{
  "id": "notification-001",
  "recipientId": "registered-user-id",
  "type": "training",
  "title": "Training details updated",
  "message": "Review the latest training information.",
  "createdAt": "2026-10-26T01:00:00Z",
  "reference": "TRN-001",
  "href": "training/details/all-status.html",
  "action": "View trainings"
}
```

Types: `account`, `training`, `participants`, `evaluation`, `system`.
Dates should use ISO timestamps. Missing dates display Date not recorded rather
than a fabricated timestamp. Links are restricted to the same project's admin
area. Notification text is inserted as text, never raw HTML.

Read/archive changes are saved per user under
`tmis-notification-state:<user-id>`. Archiving does not delete the notification
or alter the related record. Restoring puts it back in the inbox. Preview mode
never writes those real states. The backend remains disabled; this prototype
cannot provide cross-device delivery or server-enforced recipient permissions.

Files: `src/css/notification/details/all-notification.css`,
`src/js/notification/details/all-notification.js`, and `notification-data.js`.

Checks:

```powershell
node --test tests/notifications.test.mjs tests/notifications-browser.test.mjs
```
