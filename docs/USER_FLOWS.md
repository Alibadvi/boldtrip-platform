# User flows

## 1. Read visa information and start a request

1. Visitor opens a country page.
2. Visitor selects a visa option or relevant service.
3. The page shows summary, requirements, process, official source, last-reviewed date, and clear disclaimer.
4. Visitor selects Start request.
5. Anonymous visitors sign in or register and return to the same service.
6. Customer completes a guided form, saves a draft, uploads requested documents, accepts the privacy notice, and submits.
7. The system creates a reference number and current action.
8. If the price is fixed, the system creates a manual payment record.
9. If quotation is required, staff reviews the request and publishes the amount before payment is requested.
10. Customer tracks the request from the account.

## 2. Embassy appointment request

1. Visitor selects Embassy appointments.
2. Visitor chooses a supported country and reads country-specific instructions.
3. Customer signs in and selects the appointment service.
4. Customer enters applicant, passport, travel, and preferred-date information defined for that service.
5. Customer uploads required private documents.
6. Customer reviews a masked summary and submits.
7. The request becomes submitted or awaiting quotation.
8. Customer completes manual payment when an amount is available.
9. Staff verifies payment, processes the request, and updates its status.
10. Customer receives notifications and sees required actions in the account.

The platform manages the customer's request. It does not automatically book on an embassy website.

## 3. Consultation booking and manual payment

1. Visitor reads consultation type, duration, price, and policy.
2. Customer signs in.
3. Customer views server-generated available dates and times.
4. Customer selects a slot.
5. The scheduling use case creates a temporary hold inside a transaction.
6. Customer confirms contact details and booking topic.
7. System creates a payment record and displays current admin-managed transfer instructions and exact amount.
8. Customer uploads a transfer receipt before the hold expires.
9. Booking changes to receipt submitted; the slot remains unavailable.
10. Finance staff confirms or rejects the receipt.
11. On confirmation, booking becomes confirmed and a notification is sent.
12. On rejection, the customer sees the reason and correction deadline.
13. If no receipt arrives before expiry, the hold and booking expire and the slot is released.

Concurrency rule: availability shown in the browser is advisory. The server and database are the final authority.

## 4. Customer document correction

1. Operator reviews a submitted document.
2. Operator marks it accepted or replacement required and provides a reason.
3. The system creates an audit event and customer notification.
4. Customer opens the relevant request and uploads a replacement.
5. The old file remains inaccessible to the customer if superseded, but its audit metadata is retained according to policy.
6. Operator reviews the replacement.

## 5. Staff payment review

1. Finance operator opens the receipt review queue.
2. Operator sees the payment reference, expected amount, customer, associated booking/request, receipt preview through an authorized short-lived URL, and submission time.
3. Operator selects Confirm or Reject.
4. Confirm requires a confirmation timestamp and operator identity.
5. Reject requires a reason and optional correction deadline.
6. The payment use case updates payment and associated aggregate state atomically.
7. The system writes status history, audit event, and notification outbox entry.

The application records staff confirmation. It must not claim that it queried or verified a bank.

## 6. Customer tracking

The account homepage prioritizes Next action rather than generic statistics:

- complete an unfinished request;
- upload a missing/replacement document;
- upload or replace a receipt;
- view a confirmed appointment;
- respond to a staff request.

Each request and booking page contains its reference, current status in plain Persian, timeline, documents, payment state, and support contact.

## Main state models

Consultation booking:

    draft -> pending_receipt -> receipt_submitted -> confirmed
                              -> expired
                              -> cancelled
    receipt_submitted -> payment_rejected -> receipt_submitted
    confirmed -> completed | cancelled | no_show

Service request:

    draft -> submitted -> under_review -> awaiting_documents
           -> awaiting_quotation -> awaiting_payment -> payment_review
           -> in_progress -> completed
    any non-final state -> cancelled

Manual payment:

    pending_receipt -> receipt_submitted -> confirmed
    receipt_submitted -> rejected -> receipt_submitted
    pending_receipt -> expired

Exact transitions and who may perform them must be enforced in application use cases, not inferred from UI buttons.