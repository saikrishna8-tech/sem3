package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // CREATE USER
   public User createUser(User user) {

    User existingUser = userRepository.findByEmail(user.getEmail());

    if (existingUser != null) {
        throw new IllegalArgumentException("Email already exists");
    }

    // DEFAULT ROLE
    if (user.getRole() == null || user.getRole().isBlank()) {
        user.setRole("USER");
    }

    return userRepository.save(user);
}

    // UPDATE USER
    public User updateUser(Long id, User userDetails) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        user.setName(userDetails.getName());

        user.setEmail(userDetails.getEmail());

        // UPDATE PASSWORD
        if (userDetails.getPassword() != null &&
                !userDetails.getPassword().isEmpty()) {

            user.setPassword(
                    passwordEncoder.encode(userDetails.getPassword())
            );
        }

        // UPDATE ROLE
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }

        return userRepository.save(user);
    }

    // DELETE USER
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        userRepository.delete(user);
    }
}