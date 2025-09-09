package com.expensetracker.expensetracker.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import com.expensetracker.expensetracker.model.Expense;
import com.expensetracker.expensetracker.model.User;
import com.expensetracker.expensetracker.repository.UserRepository;
import com.expensetracker.expensetracker.service.ExpenseService;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Collections;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

  @Autowired
  private ExpenseService expenseService;

  @Autowired
  private UserRepository userRepository;

  @PostMapping
  public ResponseEntity<?> addExpense(@RequestBody Expense expense) {
    if(expense.getUser() == null || expense.getUser().getId() == null) {
      return ResponseEntity.badRequest().body("User information is required");
    }
    Expense saved = expenseService.addExpense(expense);
    return ResponseEntity.ok(saved);
  }

  @GetMapping
  public List<Expense> getAllExpenses(@RequestParam("username") String username) {
    User user = userRepository.findByUsername(username).orElse(null);
    if(user == null) return Collections.emptyList();
    return expenseService.getAllExpensesByUser(user);
  }

  @GetMapping("/{id}")
  public Expense getExpenseById(@PathVariable Long id) {
    return expenseService.getExpenseById(id);
  }

  @PutMapping("/{id}")
  public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
    return expenseService.updateExpense(id, expense);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteExpense(@PathVariable Long id) {
    expenseService.deleteExpenseById(id);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/category/{category}")
  public List<Expense> getExpensesByCategory(@PathVariable String category) {
    return expenseService.getExpensesByCategory(category);
  }

  @GetMapping("/date")
  public List<Expense> getExpensesByDateRange(@RequestParam("start") String start,
                                             @RequestParam("end") String end) {
    return expenseService.getExpensesByDateRange(LocalDate.parse(start), LocalDate.parse(end));
  }

  @GetMapping("/summary")
  public ResponseEntity<?> getUserExpenseSummary(@RequestParam("username") String username) {
    User user = userRepository.findByUsername(username).orElse(null);
    if (user == null) {
      return ResponseEntity.status(404).body("User not found");
    }
    List<Expense> expenses = expenseService.getAllExpensesByUser(user);
    double totalExpense = expenses.stream().mapToDouble(Expense::getAmount).sum();
    Map<String, Object> summary = new HashMap<>();
    summary.put("salary", user.getSalary());
    summary.put("totalExpense", totalExpense);
    summary.put("remainingMoney", user.getSalary() - totalExpense);

    return ResponseEntity.ok(summary);
  }
}
