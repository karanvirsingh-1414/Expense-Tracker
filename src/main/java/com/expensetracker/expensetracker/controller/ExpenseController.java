package com.expensetracker.expensetracker.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.expensetracker.expensetracker.service.ExpenseService;
import com.expensetracker.expensetracker.model.Expense;
import java.util.List;
import java.time.LocalDate;




@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    // 1. Create Expense
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return expenseService.addExpense(expense);
    }

    // 2. Get All Expenses
    @GetMapping
    public List<Expense> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // 3. Get Expense by ID
    @GetMapping("/{id}")
    public Expense getExpenseById(@PathVariable Long id) {
        return expenseService.getExpenseById(id);
    }

    // 4. Update Expense
   @PutMapping("/{id}")
public Expense updateExpense(@PathVariable Long id, @RequestBody Expense expense) {
    return expenseService.updateExpense(id, expense);
}


    // 5. Delete Expense by ID
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
    }

    // 6. Get Expenses by Category
    @GetMapping("/category/{category}")
    public List<Expense> getExpensesByCategory(@PathVariable String category) {
        return expenseService.getExpensesByCategory(category);
    }

    // 7. Get Expenses by Date Range
    @GetMapping("/date")
    public List<Expense> getExpensesByDateRange(@RequestParam("start") String start,
                                                @RequestParam("end") String end) {
        return expenseService.getExpensesByDateRange(LocalDate.parse(start), LocalDate.parse(end));
    }

    // 8. Delete All Expenses (Optional)
    @DeleteMapping
    public void deleteAllExpenses() {
        expenseService.deleteAllExpenses();
    }
}
