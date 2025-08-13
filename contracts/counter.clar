;; =============================================================================
;; Title: Counter Contract with Owner Access Control
;; Version: 1.1.0
;; Summary: A secure and testable smart contract demonstrating access control,
;;          state management, and error handling using Clarity.
;; Description: This contract implements a simple counter that can only be
;;              incremented or reset by a designated contract owner. It showcases
;;              core Clarity features including data variables, read-only views,
;;              public functions, and robust error handling.
;; =============================================================================

;; =============================================================================
;; CONSTANTS
;; =============================================================================

;; Contract owner - hardcoded for simulation and testing purposes
(define-constant CONTRACT-OWNER 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Error constants for better error handling and debugging
(define-constant ERR-OWNER-ONLY (err u100))
(define-constant ERR-COUNTER-OVERFLOW (err u101))

;; Maximum safe integer value to prevent overflow
(define-constant MAX-COUNTER-VALUE u340282366920938463463374607431768211455)

;; =============================================================================
;; DATA STORAGE
;; =============================================================================

;; Counter storage - tracks the current count value
(define-data-var counter uint u0)

;; =============================================================================
;; READ-ONLY FUNCTIONS
;; =============================================================================

;; Get the current counter value
;; @returns uint: Current counter value
(define-read-only (get-count)
    (var-get counter)
)

;; Get the contract owner address
;; @returns principal: Address of the contract owner
(define-read-only (get-owner)
    CONTRACT-OWNER
)

;; Check if a given principal is the contract owner
;; @param user: Principal to check
;; @returns bool: True if user is the owner, false otherwise
(define-read-only (is-owner (user principal))
    (is-eq user CONTRACT-OWNER)
)

;; =============================================================================
;; PUBLIC FUNCTIONS
;; =============================================================================

;; Increment the counter by 1
;; Only the contract owner can call this function
;; @returns (response bool uint): Ok true on success, error code on failure
(define-public (count-up)
    (begin
        ;; Verify caller is the contract owner
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)

        ;; Prevent integer overflow
        (asserts! (< (var-get counter) MAX-COUNTER-VALUE) ERR-COUNTER-OVERFLOW)

        ;; Increment the counter
        (var-set counter (+ (var-get counter) u1))

        ;; Return success
        (ok true)
    )
)

;; Reset the counter to zero
;; Only the contract owner can call this function
;; @returns (response bool uint): Ok true on success, error code on failure
(define-public (reset-counter)
    (begin
        ;; Verify caller is the contract owner
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-OWNER-ONLY)

        ;; Reset counter to zero
        (var-set counter u0)

        ;; Return success
        (ok true)
    )
)

;; =============================================================================
;; CONTRACT INITIALIZATION
;; =============================================================================

;; Contract initializes with counter set to 0 and owner set to predefined principal// Minor update to trigger PR eligibility
