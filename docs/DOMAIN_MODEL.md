# Domain model and boundaries

## Approach

BoldTrip uses pragmatic Domain-Driven Design inside a modular monolith. Modules protect business language and rules, while Payload remains the persistence and administration framework. DDD does not justify microservices, empty interfaces, or an abstraction for every file.

## Bounded contexts

| Context | Owns | Does not own |
|---|---|---|
| catalog | Countries, visa options, services, requirements, pricing mode, publish state | Articles, customer requests |
| scheduling | Consultants, availability, exceptions, slot holds, bookings, cancellation rules | Payment receipt review |
| cases | Service requests, applicants, answers, case status, action requests, timelines | File bytes, authentication |
| documents | Document metadata, ownership, category, versions, review state, secure access | Case workflow and user sessions |
| payments | Manual payment intent, instruction snapshot, receipt reference, review, payment status | Bank settlement or online gateway |
| identity | Customers, staff roles, account status, session-related policy | Domain permissions beyond published authorization contracts |
| notifications | Templates, delivery requests, provider adapters, retry status | Business decisions about when state changes |
| content | Articles, FAQ, pages, navigation, SEO | Country/visa operational catalog |

## Dependency rule

Presentation calls an application use case. The use case loads domain state through a port, applies rules, and persists through infrastructure. React components and Payload hooks must not become the only location of business logic.

A module may:

- import shared value objects and utilities;
- call another module through a small application contract;
- react to an explicit domain/application event.

A module may not:

- import another module's collection implementation;
- update another aggregate directly from a UI component;
- use a global generic service to bypass ownership.

## Suggested module shape

    src/modules/scheduling/
      domain/
        booking.ts
        booking-status.ts
        availability-rule.ts
        booking-policy.ts
      application/
        hold-consultation-slot.ts
        confirm-booking-payment.ts
        cancel-booking.ts
        booking-repository.ts
        scheduling-clock.ts
      infrastructure/
        bookings.collection.ts
        payload-booking-repository.ts
        postgres-booking-lock.ts
      presentation/
        booking-form.schema.ts
        hold-slot.action.ts
        booking-view-model.ts

Folders are created when needed. Domain files must contain actual policy or state behavior, not interfaces created for symmetry.

## Aggregates and invariants

### Booking

Aggregate root: Booking

Invariants:

- start time is in the future at creation;
- duration belongs to the selected consultation type;
- consultant is available;
- no overlapping active booking exists for the consultant;
- hold expiry exists while pending receipt;
- only an authorized finance result can confirm payment;
- final bookings cannot silently return to an earlier state.

### Service request

Aggregate root: ServiceRequest

Invariants:

- service and form version are snapshotted at submission;
- required answers and documents are complete for submission;
- only the owning customer may change a draft;
- submitted customer answers are immutable unless reopened through a defined correction action;
- status changes include actor, timestamp, and reason where required.

### Manual payment

Aggregate root: ManualPayment

Invariants:

- amount and currency are positive and immutable after receipt submission;
- instruction details are snapshotted so later settings changes do not alter old requests;
- one active receipt version is reviewed at a time;
- confirmation/rejection records the operator;
- a confirmed payment cannot be reconfirmed or rejected.

### Document

Aggregate root: DocumentRecord

Invariants:

- every file has an owner and purpose;
- storage keys are opaque and never user-provided;
- file bytes stay in private storage;
- replacement creates a new version rather than overwriting audit history;
- access is authorized against the related customer/request/booking.

## Important value objects

- CustomerId, StaffId, BookingId, RequestId, DocumentId, PaymentId.
- ReferenceNumber: human-facing, non-sequential, not an authorization secret.
- Money: amount in the smallest supported unit plus currency.
- TimeRange: start and end in UTC; display uses configured business timezone.
- ReviewedSource: official URL plus last-reviewed timestamp.
- StorageKey: server-generated opaque key.
- PaymentInstructionSnapshot: safe card/account display fields valid at payment creation.
- StatusReason: required for rejection, cancellation, or replacement requests.

## Cross-context workflows

Application orchestration coordinates workflows without merging aggregates.

Example: receipt confirmation

1. Payments confirms the manual payment.
2. An application event identifies the related booking or service request.
3. Scheduling or Cases performs its own valid state transition.
4. Notifications records a delivery request.
5. Audit records actor and result.

For the MVP this may run in one database transaction plus an outbox entry. A message broker is unnecessary.

## Shared kernel

Keep shared small:

- IDs, Result/Error conventions, clock interface, money and time primitives;
- authenticated actor context;
- audit metadata;
- transaction and outbox boundaries;
- common validation helpers.

Do not move domain-specific status values, repository queries, or UI view models into shared.