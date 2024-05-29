package org.server.chatbot.repository;

import org.server.chatbot.models.History;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface HistoryRepository extends MongoRepository<History, String> {
	List<History> findByUsername(String username);

	Optional<History> findById(String id);

	History findBySessionId(String sessionId);

	void deleteByUsernameAndId(String username , String id);
}
