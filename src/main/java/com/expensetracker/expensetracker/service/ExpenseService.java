package com.expensetracker.expensetracker.service;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import com.expensetracker.expensetracker.repository.ExpenseRepository;
import com.expensetracker.expensetracker.model.Expense;
import java.util.List;
import java.time.LocalDate;



@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    public Expense addExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public Expense getExpenseById(Long id) {
        return expenseRepository.findById(id).orElse(null);
    }

    public Expense updateExpense(Long id, Expense expense) {
        return expenseRepository.findById(id)
            .map(existingExpense -> {
                existingExpense.setAmount(expense.getAmount());
                existingExpense.setCategory(expense.getCategory());
                existingExpense.setDescription(expense.getDescription());
                existingExpense.setDate(expense.getDate());
                return expenseRepository.save(existingExpense);
            }).orElse(null);
    }

    public void deleteExpense(Long id) {
        expenseRepository.deleteById(id);
    }

    public List<Expense> getExpensesByCategory(String category) {
        return expenseRepository.findByCategoryIgnoreCase(category);
    }

    public List<Expense> getExpensesByDateRange(LocalDate start, LocalDate end) {
        return expenseRepository.findByDateBetween(start, end);
    }

    public void deleteAllExpenses() {
        expenseRepository.deleteAll();
    }
}
