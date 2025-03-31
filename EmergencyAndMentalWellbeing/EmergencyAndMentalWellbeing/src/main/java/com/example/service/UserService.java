package com.example.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.User;
import com.example.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(User user) throws IllegalArgumentException {
        System.err.println("Registering user: " + user.getEmail());
        Optional<User> existingUser = getUserByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already registered!");
        }
        String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
        if (!user.getPassword().matches(passwordRegex)) {
            throw new IllegalArgumentException("Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)");
        }
        User savedUser = userRepository.save(user);
        System.err.println("User saved successfully: " + savedUser.getEmail());
        return savedUser;
    }

    public boolean authenticateUser(String email, String password) {
        try {
            Optional<User> user = getUserByEmail(email);
            return user.isPresent() && user.get().getPassword().equals(password);
        } catch (Exception e) {
            System.err.println("Authentication error for " + email + ": " + e.getMessage());
            return false;
        }
    }
    public User updateUser(User user) {
        return userRepository.save(user);
    }
}