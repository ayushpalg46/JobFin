package com.jobfins.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * AccountRequest DTO class for creating new accounts.
 * (Experiment 4: AccountRequest @RequestBody DTO).
 */
public class AccountRequest {

    @NotBlank(message = "Holder name is required")
    private String holderName;

    @NotBlank(message = "Account type is required (e.g. SAVINGS, CURRENT)")
    private String accountType;

    @NotNull(message = "Initial deposit is required")
    @PositiveOrZero(message = "Deposit cannot be negative")
    private Double initialDeposit;

    public AccountRequest() {
    }

    public AccountRequest(String holderName, String accountType, Double initialDeposit) {
        this.holderName = holderName;
        this.accountType = accountType;
        this.initialDeposit = initialDeposit;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public Double getInitialDeposit() {
        return initialDeposit;
    }

    public void setInitialDeposit(Double initialDeposit) {
        this.initialDeposit = initialDeposit;
    }
}
