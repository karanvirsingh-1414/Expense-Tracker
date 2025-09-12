package com.expensetracker.expensetracker.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import com.expensetracker.expensetracker.model.User;
import com.expensetracker.expensetracker.repository.UserRepository;
import com.expensetracker.expensetracker.repository.ExpenseRepository;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ExpenseRepository expenseRepository;

  // Get all users
  @GetMapping
  public List<User> getAllUsers() {
    return userRepository.findAll();
  }

  // Get user by id
  @GetMapping("/{id}")
  public ResponseEntity<User> getUserById(@PathVariable Long id) {
    return userRepository.findById(id)
      .map(user -> ResponseEntity.ok(user))
      .orElse(ResponseEntity.notFound().build());
  }

  // Check password for user by id
  @GetMapping("/{id}/checkPassword")
  public ResponseEntity<?> checkPassword(@PathVariable Long id, @RequestParam String password) {
    return userRepository.findById(id)
      .map(user -> {
        if (user.getPassword().equals(password)) {
          return ResponseEntity.ok("Password matches");
        } else {
          return ResponseEntity.status(401).body("Invalid password");
        }
      })
      .orElse(ResponseEntity.notFound().build());
  }

  // Get salary for user by id
  @GetMapping("/{id}/salary")
  public ResponseEntity<?> getSalary(@PathVariable Long id) {
    return userRepository.findById(id)
      .map(user -> ResponseEntity.ok(user.getSalary()))
      .orElse(ResponseEntity.notFound().build());
  }

  // Delete all users and all expenses  
  @DeleteMapping
  public ResponseEntity<?> deleteAllUsers() {
    // Delete all expenses first before deleting users to avoid FK constraint errors
    expenseRepository.deleteAll();
    userRepository.deleteAll();
    return ResponseEntity.ok("All users and all expenses deleted successfully");
  }

  // Register a new user
  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User user) {
    if (user.getUsername() == null || user.getUsername().isEmpty() ||
        user.getPassword() == null || user.getPassword().isEmpty() ||
        user.getSalary() == null) {
      return ResponseEntity.badRequest().body("Username, password, and salary are required");
    }
    if(userRepository.findByUsername(user.getUsername()).isPresent()) {
      return ResponseEntity.badRequest().body("Username already exists");
    }
    User savedUser = userRepository.save(user);
    return ResponseEntity.ok(savedUser);
  }
}
