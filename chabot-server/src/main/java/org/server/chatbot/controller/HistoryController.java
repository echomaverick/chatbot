package org.server.chatbot.controller;

import org.server.chatbot.models.History;
import org.server.chatbot.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class HistoryController {

	@Autowired
	private HistoryService historyService;

	@PostMapping("/save-history")
	public History saveHistory(@RequestBody History request) {
		return historyService.saveHistory(request.getUsername() , request.getQuestion() , request.getAnswer());
	}

	@GetMapping("/history")
	public List<History> getHistory() {
		return historyService.getAllHistory();
	}

	@GetMapping("/history-by-username/{username}")
	public List<History> getHistoryByUsername(@PathVariable String username) {
		return historyService.getHistoryByUsername(username);
	}
}
