package com.jobfins.repository;

import com.jobfins.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * AccountRepository interface providing ready-to-use CRUD methods (findAll, save, findById, deleteById).
 * (Experiment 5: AccountRepository extending JpaRepository<Account, Long>).
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);
}
