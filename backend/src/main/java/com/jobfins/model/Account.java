package com.jobfins.model;

import jakarta.persistence.*;

/**
 * Account Entity representing banking accounts in MySQL database.
 * (Experiment 5: @Entity, @Table(name = "accounts"), @Id, @GeneratedValue).
 */
@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String holderName;

    @Column(nullable = false)
    private String accountType; // SAVINGS, CURRENT

    @Column(nullable = false)
    private Double balance;

    public Account() {
    }

    public Account(String accountNumber, String holderName, String accountType, Double balance) {
        this.accountNumber = accountNumber;
        this.holderName = holderName;
        this.accountType = accountType;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
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

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}
