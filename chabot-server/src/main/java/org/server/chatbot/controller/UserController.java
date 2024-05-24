package org.server.chatbot.controller;

import org.server.chatbot.models.User;
import org.server.chatbot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public User register(@RequestBody User user) {
		System.out.println("Received registration request for user: " + user.getUsername());
		return userService.createUser(user);
	}
}
