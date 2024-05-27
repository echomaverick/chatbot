package org.server.chatbot.repository;

import org.server.chatbot.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
	// Method to check if a user with a given username exists
	boolean existsByUsername(String username);

	// Method to check if a user with a given email exists
	boolean existsByEmail(String email);

	User findByUsername(String username);
}
