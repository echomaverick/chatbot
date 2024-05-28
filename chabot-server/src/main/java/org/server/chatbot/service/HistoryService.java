package org.server.chatbot.service;

import org.server.chatbot.models.History;
import org.server.chatbot.repository.HistoryRepository;
import org.server.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistoryService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private HistoryRepository historyRepository;

	public History saveHistory(String username , String question , List<String> answer) {
		// Check if the user exists
		if (userRepository.existsByUsername(username)) {
			// Create a new History object
			History history = new History(username , question , answer);

			// Save the history and return the saved object
			return historyRepository.save(history);
		} else {
			throw new RuntimeException("User not found");
		}
	}

	public List<History> getAllHistory() {
		return historyRepository.findAll();
	}

	public List<History> getHistoryByIdsByUsername(String username) {
		if (userRepository.existsByUsername(username)) {
			return historyRepository.findByUsername(username);
		} else {
			throw new RuntimeException("User not found");
		}
	}
	public History getHistoryById(String id) {
		Optional<History> history = historyRepository.findById(id);
		if (history.isPresent()) {
			return history.get();
		} else {
			throw new RuntimeException("History not found");
		}
	}
}

