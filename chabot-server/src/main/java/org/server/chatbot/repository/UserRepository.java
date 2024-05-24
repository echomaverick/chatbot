package org.server.chatbot.repository;

import org.server.chatbot.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository  extends MongoRepository<User, String> {
	boolean existsByUsername(String username);
	boolean existsByEmail(String email);
}
