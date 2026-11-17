# Features

- Patient registration, login, logout, refresh, password change, and password reset
- Role checks for patient, consultant, administrator, desk officer, nurse, pharmacist, and laboratory officer
- Departments, consultants, availability, and weekday slots in Africa/Lagos
- Online booking onto the super consultant, with one active booking per slot
- Paystack initialize, verify, and signed webhook, each reference applied once. A dummy or empty Paystack secret records the same payment as verified for testing.
- Desk registration, walk-in visits, fictional desk payments, check-in, queue status, and request collection for physical visits
- Encounter drafts with revision checks and idempotency keys, plus an explicit sign action
- Signed consultations fan out to journeys, pharmacy lines, and investigation orders
- Pharmacy dispense with stock checks, diagnostics, nursing administrations, observations, handovers, beds, and admissions
- Adult medicine catalogue searched by generic name. Each strength and dosage form is its own product, and the prescribed dose is entered separately.
- Corporate laboratory prices for haematology, chemical pathology, and microbiology, with the consultation medicine list stored when a drug is missing
- Ratings after a call ends or a visit is completed, fees, policies, staff, consultant booking, and an administrator session switch that is audited
- Role-filtered workspace snapshot for the frontend cache
- Consultation audio and video calls between the patient and the assigned consultant, with call history and one active call per person
- Short-lived HMAC video token with no third-party room and no recording
- Audit rows for mutations
- Swagger at `/api/docs`
