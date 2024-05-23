package org.server.chatbot.controller;

import org.server.chatbot.service.ChatBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Objects;

@RestController
@RequestMapping("/api/ask")
public class ChatBotController {

	@Autowired
	private ChatBotService chatBotService;
	@PostMapping
	public HashMap<String, Object> askQuestion(@RequestBody HashMap<String, String> request) {
		String question = request.get("question");
		return chatBotService.getResponses(question);
	}
}
