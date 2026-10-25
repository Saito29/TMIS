# TMIS role access matrix

This is the requested access policy. It describes intended permissions, not access controls already enforced by the app.

| Capability | System Administrator | Data Encoder | Program Administrator | Program Head |
| --- | --- | --- | --- | --- |
| Create, assign roles to, update, deactivate, or delete users | Yes | No | No | No |
| Create or update farmer and participant profiles | Yes | Yes | No | No |
| Delete farmer and participant profiles | Yes | No | No | No |
| Encode or edit pre-test and post-test answers | Yes | Yes | No | No |
| Encode or edit training and resource person evaluations | Yes | Yes | No | No |
| Create questionnaires | Yes | No | Yes | No |
| Edit or delete submitted questionnaires | Yes | No | No | No |
| View training and farmer or participant information | Yes | As needed for encoding | As needed for questionnaires | Yes |
| Create or update training information | Yes | No | No | No |
| Generate and export reports | Yes | No | No | Yes |

Program Administrator can resume an unfinished questionnaire draft that they created; submitted questionnaire changes require System Administrator access. Data Encoder can resume their own unfinished encoding drafts. These ownership rules require authenticated user IDs and server-side checks.

## Current implementation audit

- `app/authentication/login.html` has a login form, but `src/js/auth/authentication.js` prevents submission and does not establish a session.
- `app/admin/administration/create/register.html` saves a user record and selected role to `localStorage` as `Pending approval`. It does not create an account, authenticate the user, or grant permissions.
- There are no role checks around admin routes, navigation, forms, or save and delete handlers. Anyone who opens a page in this static prototype can reach its controls.
- Administration approval, user list, view, edit, inactive, and trash HTML files are empty. User approval, role updates, deactivation, and deletion are not implemented.
- Dashboard report rows in `src/js/dashboard/scriptv2.js` are sample data. The report modal can export that data, but it is not a live report from training and participant records.
- Many record operations use browser `localStorage`. Hiding buttons or redirecting pages in JavaScript would not secure these records because a user can change local storage or run the scripts directly.

## Enforcement needed before these roles govern real users

1. Add authenticated server sessions and a persistent user store. Keep passwords and session secrets out of `localStorage`.
2. Define named permissions for each operation, then check them on every server request. Start with a default-deny policy.
3. Restrict role assignment, user management, record deletion, and report generation on the server. Check ownership for draft access.
4. Use the same permission map to show relevant desktop and mobile navigation and to disable unavailable UI actions. Treat that UI as guidance; server checks remain authoritative.
5. Replace report sample rows with authorized data queries and record who created, changed, deleted, or exported data.
