package com.expensetracker.expensetracker.service;

import com.expensetracker.expensetracker.model.Expense;
import com.expensetracker.expensetracker.model.User;
import com.expensetracker.expensetracker.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseService {

  @Autowired
  private ExpenseRepository expenseRepository;

  public Expense addExpense(Expense expense) {
    return expenseRepository.save(expense);
  }

  public List<Expense> getAllExpensesByUser(User user) {
    return expenseRepository.findByUser(user);
  }

  public Expense getExpenseById(Long id) {
    return expenseRepository.findById(id).orElse(null);
  }

  public Expense updateExpense(Long id, Expense expenseDetails) {
    Expense expense = expenseRepository.findById(id).orElse(null);
    if(expense == null) return null;

    expense.setAmount(expenseDetails.getAmount());
    expense.setCategory(expenseDetails.getCategory());
    expense.setDescription(expenseDetails.getDescription());
    expense.setDate(expenseDetails.getDate());
    expense.setUser(expenseDetails.getUser());

    return expenseRepository.save(expense);
  }

  public void deleteExpenseById(Long id) {
    expenseRepository.deleteById(id);
  }

  public List<Expense> getExpensesByCategory(String category) {
    return expenseRepository.findByCategory(category);
  }

  public List<Expense> getExpensesByDateRange(LocalDate start, LocalDate end) {
    return expenseRepository.findByDateBetween(start, end);
  }
}
