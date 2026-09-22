package com.jobfins.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * TransferRequest DTO class for processing fund transfers.
 * (Experiment 4: TransferRequest @RequestBody DTO).
 */
public class TransferRequest {

    @NotBlank(message = "Sender account is required")
    private String fromAccount;

    @NotBlank(message = "Recipient account is required")
    private String toAccount;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    private Double amount;

    public TransferRequest() {
    }

    public TransferRequest(String fromAccount, String toAccount, Double amount) {
        this.fromAccount = fromAccount;
        this.toAccount = toAccount;
        this.amount = amount;
    }

    public String getFromAccount() {
        return fromAccount;
    }

    public void setFromAccount(String fromAccount) {
        this.fromAccount = fromAccount;
    }

    public String getToAccount() {
        return toAccount;
    }

    public void setToAccount(String toAccount) {
        this.toAccount = toAccount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
