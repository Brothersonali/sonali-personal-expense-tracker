package com.student.personal_expense_tracker.service;

import com.student.personal_expense_tracker.model.Transaction;
import com.student.personal_expense_tracker.model.User;
import com.student.personal_expense_tracker.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Transaction addTransaction(Transaction transaction, User user) {
        transaction.setUser(user);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getUserTransactions(User user) {
        return transactionRepository.findByUser(user);
    }

    public List<Transaction> getUserTransactionsByType(
            User user, String type) {

        return transactionRepository.findByUserAndType(user, type);
    }

    public List<Transaction> getUserTransactionsByCategory(
            User user, String category) {

        return transactionRepository.findByUserAndCategory(user, category);
    }

    public Transaction updateTransaction(
            Long id, Transaction updatedTransaction, User user) {

        Transaction existingTransaction =
                transactionRepository.findById(id).orElse(null);

        if (existingTransaction == null) {
            throw new RuntimeException("Transaction not found");
        }

        if (!existingTransaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized");
        }

        existingTransaction.setTitle(updatedTransaction.getTitle());
        existingTransaction.setAmount(updatedTransaction.getAmount());
        existingTransaction.setType(updatedTransaction.getType());
        existingTransaction.setDate(updatedTransaction.getDate());
        existingTransaction.setCategory(updatedTransaction.getCategory());
        existingTransaction.setDescription(updatedTransaction.getDescription());

        return transactionRepository.save(existingTransaction);
    }

    public void deleteTransaction(Long id, User user) {

        Transaction transaction =
                transactionRepository.findById(id).orElse(null);

        if (transaction == null) {
            throw new RuntimeException("Transaction not found");
        }

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You are not authorized");
        }

        transactionRepository.delete(transaction);
    }
}