# User activity journal (frontend prototype)

`app/admin/users/logs.html` presents a searchable, paginated journal of the current
user's activity. Desktop and mobile Logs navigation already points to this page.
The profile's Logs tab links to the full journal.

## Frontend files

- `src/js/shared/activity-core.js`: identity matching and safe record-change metadata.
- `src/js/shared/activity-log.js`: browser journal and shared action instrumentation.
- `src/js/users/logs.js`, `src/css/users/logs.css`: activity page and details dialog.

The activity module is included on all admin HTML pages. The retained account
backend and security integrations stay disabled. No API calls are made.

## What is recorded

Only completed record mutations are recorded: **create**, **edit/update**, and
**delete**. Account/status changes, approvals, rejections, and restores are grouped
as updates. Attachment additions/removals are recorded as creation/deletion.

Page visits, tabs, filters, refreshes, downloads, exports, warnings, and failed
attempts are excluded. Earlier non-mutation entries are hidden from the journal
without deleting historical browser storage. The CSV export remains available but
does not create a log entry.

Successful storage changes are detected for the explicitly allowed TMIS data
collections. Older in-memory pages can report completed mutations through their
success toast. Initial sample seeding is excluded: writes require a recent trusted
interaction. Delayed deletion and Undo flows are covered by that interaction window.

Shared journal writes contain actor ID/name, date, module, action, reference,
result, page pathname, and changed field names. They do not contain form contents,
passwords, tokens, secret keys, recovery codes, file contents, or old/new values.

The journal also displays saved user/resource-person/association log entries when
they are explicitly attributed to the current user. Unidentified historical events
and hard-coded sample activity are excluded. Nearby duplicate record events are
suppressed when the shared journal already captured the same save.

## Identity and limits

The existing session user ID is preferred. Without it, the prototype resolves the
profile-menu name to one unique registered user, including middle initials. It
never defaults to the first record or displays other users' journal entries.

Entries are kept in localStorage `tmis-user-activity`, retaining the newest 2,000
browser events. They can be altered or removed by browser storage tools. This is
not a trusted security audit. Cross-tab writes are best-effort; they are not a
transactional, multi-user server journal. Earlier unrecorded actions and activity
on another origin, device, or browser cannot be reconstructed. A full server-side
implementation is required for authoritative audit coverage.

Changes to record-backed data are detected automatically. For a new screen whose
action has no storage write or existing toast/event result, record its confirmed
result explicitly:

```javascript
window.TmisActivity?.record({
  action: 'update',
  module: 'training',
  title: 'Training approved',
  description: 'Approval was recorded by this page.',
  reference: training.id,
  status: 'success',
});
```

Call this only after the action succeeds. Do not put secrets or form values in
metadata. Historical descriptions imported from existing records are displayed as
originally saved. A future server should derive actor identity from authentication and
write audit events alongside each successful transaction rather than trusting
these client events.

## Checks

```powershell
node --test tests/activity-log.test.mjs tests/activity-log-browser.test.mjs
```

The browser test performs a real registration using the frontend form, checks
user isolation and metadata privacy, and exercises filters, details and CSV export
without starting or requesting the authentication backend.
