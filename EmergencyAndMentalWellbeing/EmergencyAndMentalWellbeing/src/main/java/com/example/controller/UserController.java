package com.example.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Location;
import com.example.model.TestResult; // Add this import
import com.example.model.User;
import com.example.repository.LocationRepository;
import com.example.repository.TestResultRepository; // Add this import
import com.example.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // Update to match your frontend port
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private TestResultRepository testResultRepository; // Inject the repository

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signup(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        try {
            userService.registerUser(user);
            response.put("message", "User registered successfully!");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409 Conflict
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            response.put("message", "Signup failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response); // 500
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = loginData.get("email");
            String password = loginData.get("password");
            if (email == null || password == null) {
                response.put("message", "Email and password are required.");
                return ResponseEntity.badRequest().body(response);
            }
            boolean authenticated = userService.authenticateUser(email, password);
            if (authenticated) {
                User user = userService.getUserByEmail(email).get();
                response.put("message", "Login successful!");
                response.put("userId", user.getId()); // Send userId
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Invalid email or password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            response.put("message", "Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/location/save")
    public ResponseEntity<Map<String, String>> saveLocation(@RequestBody Map<String, Object> locationData) {
        Map<String, String> response = new HashMap<>();
        try {
            String phoneNumber = (String) locationData.get("phoneNumber");
            String address = (String) locationData.get("address");
            double latitude = ((Number) locationData.get("latitude")).doubleValue();
            double longitude = ((Number) locationData.get("longitude")).doubleValue();

            Location location = new Location(phoneNumber, address, latitude, longitude);
            locationRepository.save(location);

            response.put("message", "Location saved successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Save location error: " + e.getMessage());
            response.put("message", "Failed to save location: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/test-results/save")
    public ResponseEntity<Map<String, String>> saveTestResult(@RequestBody TestResult result) {
        Map<String, String> response = new HashMap<>();
        try {
            System.out.println("Saving test result: " + result);
            testResultRepository.save(result);
            response.put("message", "Test result saved successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Save test result error: " + e.getMessage());
            response.put("message", "Failed to save test result: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/test-results")
    public ResponseEntity<List<TestResult>> getTestHistory(@RequestParam String userId) {
        try {
            List<TestResult> results = testResultRepository.findByUserId(userId);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            System.err.println("Get test history error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/test-results/{id}")
    public ResponseEntity<Map<String, String>> deleteTestResult(@PathVariable String id) {
        Map<String, String> response = new HashMap<>();
        try {
            testResultRepository.deleteById(id);
            response.put("message", "Test result deleted successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Delete test result error: " + e.getMessage());
            response.put("message", "Failed to delete test result: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Replace the existing ResetPassword component-related endpoint and add these:

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> getSecurityQuestion(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            Optional<User> user = userService.getUserByEmail(email);
            
            if (user.isPresent()) {
                String securityQuestion = user.get().getSecurityQuestion();
                if (securityQuestion == null || securityQuestion.isEmpty()) {
                    response.put("message", "No security question set for this user");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                response.put("securityQuestion", securityQuestion);
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", "Error processing request: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-security-answer")
    public ResponseEntity<Map<String, String>> verifySecurityAnswer(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            String answer = request.get("answer");
            
            Optional<User> user = userService.getUserByEmail(email);
            if (!user.isPresent()) {
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            if (user.get().getSecurityAnswer().equals(answer)) {
                response.put("message", "Answer verified successfully");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Incorrect security answer");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
        } catch (Exception e) {
            response.put("message", "Error verifying answer: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String email = request.get("email");
            String newPassword = request.get("password");
            
            String passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
            if (!newPassword.matches(passwordRegex)) {
                response.put("message", "Password must be at least 8 characters long and include: one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            Optional<User> user = userService.getUserByEmail(email);
            if (!user.isPresent()) {
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User userToUpdate = user.get();
            userToUpdate.setPassword(newPassword);
            userService.updateUser(userToUpdate);

            response.put("message", "Password reset successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("message", "Error resetting password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}