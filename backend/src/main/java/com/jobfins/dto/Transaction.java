package com.jobfins.dto;

/**
 * Transaction DTO class representing banking transactions.
 * Matches Sample Output - 2.png exactly (Experiment 4).
 */
public class Transaction {

    private String id;
    private String holderName;
    private String type;
    private double amount;
    private String status;

    public Transaction() {
    }

    public Transaction(String id, String holderName, String type, double amount, String status) {
        this.id = id;
        this.holderName = holderName;
        this.type = type;
        this.amount = amount;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
