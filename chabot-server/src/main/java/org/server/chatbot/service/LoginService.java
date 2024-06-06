package org.server.chatbot.service;

import org.server.chatbot.models.User;
import org.server.chatbot.repository.UserRepository;
import org.server.chatbot.util.JwtTokenUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

	private static final Logger logger = LoggerFactory.getLogger(LoginService.class);

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	public String login(String username , String password) {
		logger.info("Attempting to login user: {}" , username);
		User user = userRepository.findByUsername(username);
		if (user != null && passwordEncoder.matches(password , user.getPassword())) {
			String token = jwtTokenUtil.generateToken(username);
			logger.info("User {} successfully logged in. Token generated." , username);
			return token;
		} else {
			logger.warn("Invalid username or password for user: {}" , username);
			throw new IllegalArgumentException("Invalid username or password");
		}
	}
}