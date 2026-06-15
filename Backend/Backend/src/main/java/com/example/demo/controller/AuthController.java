package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/test")
    public String test() {
        return "Auth Working";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Compare password directly from PostgreSQL
        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        AuthResponse response = new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        // Default role
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(savedUser);
    }
}