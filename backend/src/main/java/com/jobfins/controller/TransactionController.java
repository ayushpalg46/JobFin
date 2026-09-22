package com.jobfins.controller;

import com.jobfins.dto.Transaction;
import com.jobfins.dto.TransferRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * TransactionController implementing Experiment 4 REST endpoints.
 * Matches Sample Output - 2.png (/api/transactions/recent).
 */
@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final List<Transaction> recentTransactions = new ArrayList<>();

    public TransactionController() {
        // Initializing exact transactions shown in Sample Output - 2.png
        recentTransactions.add(new Transaction("TXN1001", "Sumeet Rathod", "DEPOSIT", 150000, "SUCCESS"));
        recentTransactions.add(new Transaction("TXN1002", "Pritha Rao", "TRANSFER", 45000, "SUCCESS"));
        recentTransactions.add(new Transaction("TXN1003", "Dhyana Singh", "DEPOSIT", 300000, "SUCCESS"));
    }

    /**
     * Get Recent Transactions list.
     * GET /api/transactions/recent
     * Matches Sample Output - 2.png
     */
    @GetMapping("/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions() {
        return ResponseEntity.ok(recentTransactions);
    }

    /**
     * Process fund transfer.
     * POST /api/transactions/transfer
     */
    @PostMapping("/transfer")
    public ResponseEntity<?> processTransfer(@Valid @RequestBody TransferRequest request) {
        String txnId = "TXN" + (System.currentTimeMillis() % 10000);
        recentTransactions.add(0, new Transaction(txnId, request.getFromAccount(), "TRANSFER", request.getAmount(), "SUCCESS"));
        
        return ResponseEntity.ok(Map.of(
                "id", txnId,
                "status", "SUCCESS",
                "message", "Transferred ₹" + request.getAmount() + " from " + request.getFromAccount() + " to " + request.getToAccount()
        ));
    }
}
