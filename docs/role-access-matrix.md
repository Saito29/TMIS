# TMIS user roles and access plan

Status: planning document only. No access restrictions are being implemented as part of this plan.

## Roles and account scope

Keep four roles initially. "Encoder" duplicates Data Encoder. Add an Evaluator/Reviewer only when a separate approval workflow exists; add a Training Coordinator only if training maintenance must be delegated.

Every account needs a stable ID, one primary role, status (pending, active, suspended, deactivated), assigned region, office/organization, and optionally provinces and assigned trainings. Store scope as IDs. A national assignment must be explicit; a missing region never means nationwide access. Region and office are scope attributes, not extra roles.

| Role | Responsibility | Default scope |
| --- | --- | --- |
| System Administrator | Manage accounts, roles, reference data, and all records | Nationwide, explicit |
| Data Encoder | Maintain farmer/participant records and encode answers | Assigned office/region and training/participants |
| Program Administrator | Create and maintain questionnaires | Assigned program/office; own drafts |
| Program Head | Read training/participant information and generate reports | Assigned office/region, read only |

Pending, suspended, and deactivated accounts cannot access protected data. A user cannot grant themselves a higher role or broader scope.

## System access by role

This overview summarizes the planned access for each role. Actual access enforcement is not implemented by this document. All scoped access requires an explicit office, region, program, training, or participant assignment as applicable.

| System area | System Administrator | Data Encoder | Program Administrator | Program Head |
| --- | --- | --- | --- | --- |
| Dashboard | View system-wide summaries | View assigned encoding and participant summaries | View assigned questionnaire summaries | View assigned program and reporting summaries |
| User accounts and administration | Register, review, approve/reject, edit, assign roles/scope, deactivate, delete/restore, and export user records | No access | No access | No access |
| Farmers/participants and farmer associations | View, create, edit, delete/restore, and manage status | View, create, and update assigned records | No access | View assigned records only |
| Trainings and facilitator/resource-person records | View, create, edit, approve, and deactivate | View assigned records needed for encoding | View assigned records needed for questionnaire design | View assigned records only |
| Questionnaires: creation and drafts | Create, view, edit, and manage all drafts | No access | Create, view, and edit own drafts in the assigned program/office | No access to drafts |
| Published questionnaires | View, publish, activate/deactivate, and delete | View assigned published questionnaires for encoding | View assigned published questionnaires | View assigned published questionnaires only |
| Pre-test and post-test encoding | Create, view, edit, submit, correct/reopen, and delete answers | Create, edit, and submit own drafts for assigned trainings/participants; view assigned submitted answers for corrections | No access to identifiable individual answers | View assigned submitted results only |
| Training and resource-person evaluation encoding | Create, view, edit, submit, correct/reopen, and delete answers | Create, edit, and submit own drafts for assigned trainings/participants; view assigned submitted answers for corrections | No access to identifiable individual answers | View assigned submitted results only |
| Submitted answer changes | Correct, reopen, and delete submitted answers | Request administrator correction; cannot change submitted answers | Cannot change submitted answers | Cannot change submitted answers |
| Evaluation summaries | View all results and aggregates | View assigned submitted results needed for corrections | View scoped aggregates only if explicitly authorized; pending final decision | View assigned results only |
| Reports and Excel exports | Generate and export all authorized system reports | No report/export permission by default | No report/export permission by default | Generate and export assigned reports using approved reporting fields |
| Audit logs, reference data, and permission settings | View audit logs and manage reference data and permissions | No access | No access | No access |

Dashboard summaries follow the same scope and underlying resource permissions as the detailed records. A dashboard does not grant additional record or export permissions. Pending, suspended, and deactivated accounts cannot use protected system areas regardless of role.

## Permission matrix

"Scoped" means the user's assignment includes the record. "Own draft" means the authenticated user created it. Blank means deny.

| Resource/action | System Administrator | Data Encoder | Program Administrator | Program Head |
| --- | --- | --- | --- | --- |
| Users: create, approve, change role/scope, deactivate | All |  |  |  |
| Users/audit log: view | All |  |  |  |
| Farmer/participant and association: view | All | Scoped |  | Scoped |
| Farmer/participant and association: create/update | All | Scoped |  |  |
| Farmer/participant and association: delete/restore | All |  |  |  |
| Training/resource person: view | All | Scoped, for encoding | Scoped, for questionnaire design | Scoped |
| Training/resource person: create/update/approve/deactivate | All |  |  |  |
| Questionnaire: view published | All | Scoped | Scoped | Scoped, read only |
| Questionnaire: create/edit own draft | All |  | Scoped, own draft |  |
| Questionnaire: publish/activate/deactivate/delete | All |  |  |  |
| Pre/post-test and training/resource-person evaluation answers: create/edit own draft | All | Scoped, own draft |  |  |
| Answers: submit own draft | All | Scoped, own draft |  |  |
| Answers: view submitted/results | All | Scoped, for corrections | Scoped aggregates only, if needed | Scoped, read only |
| Answers: correct/reopen/delete submitted | All |  |  |  |
| Reports: view/generate/export | All |  |  | Scoped |

Questionnaire creation does not grant access to identifiable individual answers. Program Head remains read only even on pages that contain edit controls. Until a review workflow is specified, only System Administrator can publish questionnaires or correct submitted answers. If an Evaluator is later added, give them review/request-correction/approve permissions, without user management or raw-answer editing.

## Access rules to include in the plan

Access should depend on **account status, role, assigned area, record ownership, and record status**. Anything not expressly allowed in the matrix should be unavailable.

- **Scope:** Lists, detail views, dashboard counts, searches, and reports should use the same assigned office/region. Where applicable, an encoder should also be assigned to the training or participant.
- **Ownership:** A non-admin user can edit only their own draft. Reassignment should require an administrator.
- **State:** Non-admin edits stop when a draft is submitted. Published, inactive, deleted, and submitted records need explicit transition permissions. A ten-second Undo option should be available only to someone allowed to restore the record.
- **Relationships:** An answer should belong to a questionnaire, training, and participant within the user's scope.
- **Account changes:** Only System Administrator can assign roles or broaden scope. The final active System Administrator should not be deactivated.
- **Data fields:** Program Head reports should include only fields approved for reporting.

## Pages and navigation

Desktop and mobile menus should follow the same permissions. Administration is for System Administrator. Participant creation/editing is for System Administrator and Data Encoder. Questionnaire creation/drafts are for System Administrator and Program Administrator. Encoding is for System Administrator and Data Encoder. Reporting is for System Administrator and Program Head.

Each role should see only relevant menu items and actions. Page access, direct links, and exports should follow the same policy.

## Planning decisions to finalize

1. Decide whether Program Administrator can publish questionnaires or whether System Administrator approval is required.
2. Decide whether encoded answers need independent review. Add Evaluator/Reviewer only if that person has a distinct approval task.
3. Decide whether training creation and editing should stay with System Administrator or move to a Training Coordinator.
4. Define exactly how office, region, province, and training assignments limit each role's records.
5. Decide which personal data and report exports Program Head may see.
6. Approve the final role matrix and account statuses before designing role-specific screens.

## Example scenarios to review

- Data Encoder can edit an assigned farmer and own answer draft, but cannot edit another encoder's draft or another region's records.
- Program Administrator can create/resume their own questionnaire draft, but cannot change answers or user roles.
- Program Head can view scoped training/participants and export scoped reports; every attempted write is denied.
- System Administrator can manage accounts and records; the final active administrator cannot be deactivated.
- Deactivated accounts have no access; a new role or office assignment changes what the user may see.
- Lists, detail pages, dashboard counts, searches, and exports follow the same scope rules.
- Desktop/mobile menus and direct page links follow the same permissions.

