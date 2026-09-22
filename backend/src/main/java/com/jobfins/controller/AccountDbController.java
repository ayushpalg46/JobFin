package com.jobfins.controller;

import com.jobfins.dto.ApiResponse;
import com.jobfins.model.Account;
import com.jobfins.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AccountDbController implementing Experiment 5 MySQL Database Integration & CRUD.
 * (Path: /api/db/accounts, uses AccountRepository).
 */
@RestController
@RequestMapping("/api/db/accounts")
@CrossOrigin(origins = "*")
public class AccountDbController {

    @Autowired
    private AccountRepository accountRepository;

    /**
     * Get all accounts from MySQL database.
     * GET /api/db/accounts
     */
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        return ResponseEntity.ok(accountRepository.findAll());
    }

    /**
     * Save new account in MySQL database.
     * POST /api/db/accounts
     */
    @PostMapping
    public ResponseEntity<?> saveAccount(@RequestBody Account account) {
        try {
            if (account.getAccountNumber() == null || account.getAccountNumber().isEmpty()) {
                account.setAccountNumber("ACC" + (100000 + (System.currentTimeMillis() % 900000)));
            }
            Account saved = accountRepository.save(account);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("ERROR", e.getMessage()));
        }
    }

    /**
     * Find account by ID from MySQL database.
     * GET /api/db/accounts/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getAccountById(@PathVariable Long id) {
        return accountRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete account from MySQL database.
     * DELETE /api/db/accounts/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        if (accountRepository.existsById(id)) {
            accountRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("SUCCESS", "Account deleted with ID: " + id));
        }
        return ResponseEntity.notFound().build();
    }
}
