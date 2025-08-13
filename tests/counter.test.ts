
import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;

// =============================================================================
// ACCESS CONTROL TESTS
// =============================================================================

describe("Counter Contract", () => {
    it("should only allow contract owner to increment counter", () => {
        // Initial count should be 0
        let result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(0);

        // Owner calls count-up → should succeed
        let response = simnet.callPublicFn("counter", "count-up", [], deployer);
        expect(response.result).toBeOk(Cl.bool(true));

        // Count should now be 1
        result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(1);

        // Non-owner tries to call count-up → should fail
        response = simnet.callPublicFn("counter", "count-up", [], wallet1);
        expect(response.result).toBeErr(Cl.uint(100)); // ERR-OWNER-ONLY

        // Count should still be 1
        result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(1);
    });

    it("should only allow contract owner to reset counter", () => {
        // Setup: Increment counter twice
        simnet.callPublicFn("counter", "count-up", [], deployer);
        simnet.callPublicFn("counter", "count-up", [], deployer);

        // Verify setup
        let result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(2);

        // Non-owner tries to reset → should fail
        let response = simnet.callPublicFn("counter", "reset-counter", [], wallet1);
        expect(response.result).toBeErr(Cl.uint(100)); // ERR-OWNER-ONLY

        // Owner resets counter → should succeed
        response = simnet.callPublicFn("counter", "reset-counter", [], deployer);
        expect(response.result).toBeOk(Cl.bool(true));

        // Verify counter is reset
        result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(0);
    });

    it("should increment counter multiple times correctly", () => {
        // Reset counter first
        simnet.callPublicFn("counter", "reset-counter", [], deployer);

        // Increment counter 5 times
        for (let i = 0; i < 5; i++) {
            let response = simnet.callPublicFn("counter", "count-up", [], deployer);
            expect(response.result).toBeOk(Cl.bool(true));
        }

        // Final count should be 5
        let result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(5);
    });

    it("should return correct owner information", () => {
        // Get contract owner
        let result = simnet.callReadOnlyFn("counter", "get-owner", [], deployer);
        expect(result.result).toBePrincipal(deployer);

        // Check if deployer is owner (should be true)
        result = simnet.callReadOnlyFn(
            "counter",
            "is-owner",
            [Cl.principal(deployer)],
            deployer
        );
        expect(result.result).toBeBool(true);

        // Check if wallet1 is owner (should be false)
        result = simnet.callReadOnlyFn(
            "counter",
            "is-owner",
            [Cl.principal(wallet1)],
            deployer
        );
        expect(result.result).toBeBool(false);
    });

    it("should maintain state integrity after failed operations", () => {
        // Reset and set initial state
        simnet.callPublicFn("counter", "reset-counter", [], deployer);
        simnet.callPublicFn("counter", "count-up", [], deployer);

        // Multiple unauthorized attempts
        let response1 = simnet.callPublicFn("counter", "count-up", [], wallet1);
        let response2 = simnet.callPublicFn("counter", "count-up", [], wallet2);
        let response3 = simnet.callPublicFn("counter", "reset-counter", [], wallet1);

        // All unauthorized attempts should fail
        expect(response1.result).toBeErr(Cl.uint(100));
        expect(response2.result).toBeErr(Cl.uint(100));
        expect(response3.result).toBeErr(Cl.uint(100));

        // State should remain unchanged
        let result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(1);
    });

    it("should handle sequential increment and reset operations", () => {
        // Reset counter first
        simnet.callPublicFn("counter", "reset-counter", [], deployer);

        // Initial increment
        let response = simnet.callPublicFn("counter", "count-up", [], deployer);
        expect(response.result).toBeOk(Cl.bool(true));

        // Verify count
        let result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(1);

        // Reset counter
        response = simnet.callPublicFn("counter", "reset-counter", [], deployer);
        expect(response.result).toBeOk(Cl.bool(true));

        // Verify reset
        result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(0);

        // Increment after reset
        response = simnet.callPublicFn("counter", "count-up", [], deployer);
        expect(response.result).toBeOk(Cl.bool(true));

        // Final verification
        result = simnet.callReadOnlyFn("counter", "get-count", [], deployer);
        expect(result.result).toBeUint(1);
    });
});