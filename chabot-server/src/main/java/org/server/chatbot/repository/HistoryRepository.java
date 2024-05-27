package org.server.chatbot.repository;

import org.server.chatbot.models.History;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface HistoryRepository extends MongoRepository<History, String> {
	List<History> findByUsername(String username);
}
