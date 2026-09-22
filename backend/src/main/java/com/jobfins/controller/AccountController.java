package com.jobfins.controller;

import com.jobfins.dto.AccountRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * AccountController implementing Experiment 4 REST endpoint for opening accounts.
 */
@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    /**
     * Open New Account endpoint.
     * POST /api/accounts
     */
    @PostMapping
    public ResponseEntity<?> createNewAccount(@Valid @RequestBody AccountRequest request) {
        String newAccNum = "ACC" + (100000 + (System.currentTimeMillis() % 900000));
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Account created successfully for " + request.getHolderName(),
                "accountNumber", newAccNum,
                "accountType", request.getAccountType(),
                "balance", request.getInitialDeposit()
        ));
    }
}
