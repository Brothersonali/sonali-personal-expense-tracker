package com.student.personal_expense_tracker.repository;

import com.student.personal_expense_tracker.model.Transaction;
import com.student.personal_expense_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);

    List<Transaction> findByUserAndType(User user, String type);

    List<Transaction> findByUserAndCategory(User user, String category);
}