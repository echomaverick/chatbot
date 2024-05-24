package org.server.chatbot.service;

import org.springframework.util.StringUtils;
import org.server.chatbot.models.User;
import org.server.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public User createUser(User user) {
		if (!isValidEmail(user.getEmail())) {
			throw new IllegalArgumentException("Invalid email format");
		}
		if (userRepository.existsByEmail(user.getEmail())) {
			throw new IllegalArgumentException("Email already exists");
		}
		if (userRepository.existsByUsername(user.getUsername())) {
			throw new IllegalArgumentException("Username already exists");
		}
		if (!isValidLength(user.getName())) {
			throw new IllegalArgumentException("Name should be at least 2 characters long");
		}
		if (!isValidPassword(user.getPassword())) {
			throw new IllegalArgumentException("Password should be at least 8 characters long, including one letter, one symbol, and one number");
		}
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		System.out.println("Creating user: " + user.getUsername());
		return userRepository.save(user);
	}

	private boolean isValidEmail(String email) {
		String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
		return Pattern.matches(emailRegex , email);
	}

	private boolean isValidLength(String value) {
		return StringUtils.hasText(value) && value.length() >= 2;
	}


	private boolean isValidPassword(String password) {
		String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$";
		return Pattern.matches(passwordRegex , password);
	}
}
