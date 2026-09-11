package com.student.personal_expense_tracker.controller;

import com.student.personal_expense_tracker.model.Transaction;
import com.student.personal_expense_tracker.model.User;
import com.student.personal_expense_tracker.repository.UserRepository;
import com.student.personal_expense_tracker.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    private final TransactionService transactionService;
    private final UserRepository userRepository;

    public TransactionController(TransactionService transactionService,
                                 UserRepository userRepository) {
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> addTransaction(
            @RequestParam Long userId,
            @RequestBody Transaction transaction) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(
                transactionService.addTransaction(transaction, user)
        );
    }

    @GetMapping
    public ResponseEntity<?> getTransactions(
            @RequestParam Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Transaction> transactions =
                transactionService.getUserTransactions(user);

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/type")
    public ResponseEntity<?> getByType(
            @RequestParam Long userId,
            @RequestParam String type) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(
                transactionService.getUserTransactionsByType(user, type)
        );
    }

    @GetMapping("/category")
    public ResponseEntity<?> getByCategory(
            @RequestParam Long userId,
            @RequestParam String category) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        return ResponseEntity.ok(
                transactionService.getUserTransactionsByCategory(
                        user, category)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestBody Transaction transaction) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        try {
            return ResponseEntity.ok(
                    transactionService.updateTransaction(
                            id, transaction, user)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(
            @PathVariable Long id,
            @RequestParam Long userId) {

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        try {
            transactionService.deleteTransaction(id, user);
            return ResponseEntity.ok("Transaction deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}