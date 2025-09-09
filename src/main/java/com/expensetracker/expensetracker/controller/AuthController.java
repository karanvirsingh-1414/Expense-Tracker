package com.expensetracker.expensetracker.controller;

import com.expensetracker.expensetracker.model.User;
import com.expensetracker.expensetracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

  @Autowired
  private UserRepository userRepository;

  // Login endpoint
  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody User loginRequest) {
    Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
    if(userOpt.isPresent()) {
      User user = userOpt.get();
      if(user.getPassword().equals(loginRequest.getPassword())) {
        return ResponseEntity.ok(user);
      }
    }
    return ResponseEntity.status(401).body("Invalid username or password");
  }

  // Registration API
  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody User newUser) {
    if(userRepository.findByUsername(newUser.getUsername()).isPresent()) {
      return ResponseEntity.badRequest().body("Username already taken");
    }
    User savedUser = userRepository.save(newUser);
    return ResponseEntity.ok(savedUser);
  }

  // Update profile (name & salary)
  @PostMapping("/profile/{id}")
  public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User profileRequest) {
    Optional<User> userOpt = userRepository.findById(id);
    if(userOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }
    User user = userOpt.get();
    if (profileRequest.getName() != null && !profileRequest.getName().isEmpty()) {
      user.setName(profileRequest.getName());
    }
    if (profileRequest.getSalary() != null) {
      user.setSalary(profileRequest.getSalary());
    }
    userRepository.save(user);
    return ResponseEntity.ok(user);
  }
}
