package org.server.chatbot.models;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class History {

	private String username;
	private String question;
	private List<String> answer;

	public History(String username, String question, List<String> answer) {
		this.username = username;
		this.question = question;
		this.answer = answer;
	}

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getQuestion() {
		return question;
	}
	public void setQuestion(String question) {
		this.question = question;
	}
	public List<String> getAnswer() {
		return answer;
	}
	public void setAnswer(List<String> answer) {
		this.answer = answer;
	}
}
