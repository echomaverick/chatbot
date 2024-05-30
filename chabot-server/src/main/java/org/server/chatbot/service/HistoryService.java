package org.server.chatbot.service;

import org.server.chatbot.models.History;
import org.server.chatbot.models.QuestionAnswerPair;
import org.server.chatbot.repository.HistoryRepository;
import org.server.chatbot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HistoryService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private HistoryRepository historyRepository;

	public History saveHistory(String sessionId , String username , List<QuestionAnswerPair> questionAnswerPairs) {
		// Check if the user exists
		if (userRepository.existsByUsername(username)) {
			// Check if history exists for this session ID
			History history = historyRepository.findBySessionId(sessionId);
			if (history == null) {
				// Create a new History object with the session ID
				history = new History(sessionId , username , new ArrayList<>());
			}

			history.setHistoryDate(LocalDate.now());

			for (QuestionAnswerPair newPair : questionAnswerPairs) {
				boolean pairExists = false;
				for (QuestionAnswerPair existingPair : history.getQuestionAnswerPairs()) {
					if (existingPair.getQuestion().equals(newPair.getQuestion())) {
						existingPair.setAnswer(newPair.getAnswer());
						pairExists = true;
						break;
					}
				}
				if (!pairExists) {
					history.getQuestionAnswerPairs().add(newPair);
				}
			}
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

	public void deleteHistoryByUsernameAndId(String username, String id) {
        if (!userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("User not found");
        }
        historyRepository.deleteByUsernameAndId(username, id);
    }

	public void deleteHistoryByUsername(String username) {
		if (!userRepository.existsByUsername(username)) {
			throw new IllegalArgumentException("User not found");
		}
		historyRepository.deleteByUsername(username);
	}
}

