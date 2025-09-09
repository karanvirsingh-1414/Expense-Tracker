package com.expensetracker.expensetracker.repository;

import com.expensetracker.expensetracker.model.Expense;
import com.expensetracker.expensetracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    // Custom query method to find expenses by user
    List<Expense> findByUser(User user);

    // Custom query method to find expenses by category
    List<Expense> findByCategory(String category);

    // Optional: find expenses by date range
    List<Expense> findByDateBetween(LocalDate start, LocalDate end);

    // Optional: delete by user id (if needed)
    void deleteByUserId(Long userId);
}
