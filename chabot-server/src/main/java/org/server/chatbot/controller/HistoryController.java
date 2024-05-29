package org.server.chatbot.controller;

import org.server.chatbot.models.History;
import org.server.chatbot.models.QuestionAnswerPair;
import org.server.chatbot.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class HistoryController {

	@Autowired
	private HistoryService historyService;

	@PostMapping("/history")
	public History saveHistory(@RequestBody History request) {
		System.out.println("Request from frontend: " + request);
		List<QuestionAnswerPair> questionAnswerPairs = request.getQuestionAnswerPairs();
		List<String> questions = questionAnswerPairs.stream().map(QuestionAnswerPair::getQuestion).collect(Collectors.toList());
		List<List<String>> answers = questionAnswerPairs.stream().map(QuestionAnswerPair::getAnswer).collect(Collectors.toList());
		return historyService.saveHistory(request.getSessionId() , request.getUsername() , request.getQuestionAnswerPairs());
	}


	@GetMapping("/history")
	public List<History> getAllHistory() {
		return historyService.getAllHistory();
	}

	@GetMapping("/history/username/{username}")
	public List<History> getHistoryByUsername(@PathVariable String username) {
		return historyService.getHistoryByIdsByUsername(username);
	}

	@GetMapping("/history/{id}")
	public History getHistoryById(@PathVariable String id) {
		return historyService.getHistoryById(id);
	}
	 @DeleteMapping("/history/delete/{username}/{id}")
    public ResponseEntity<Void> deleteHistoryForUser(@PathVariable String username, @PathVariable String id) {
        historyService.deleteHistoryByUsernameAndId(username, id);
        return ResponseEntity.noContent().build();
    }
}
