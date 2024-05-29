package org.server.chatbot.models;

import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Document
public class History {

	private String id;
	private String sessionId;
	private String username;
	private LocalDate historyDate;
	private List<QuestionAnswerPair> questionAnswerPairs;

	public History(String sessionId, String username , List<QuestionAnswerPair> questionAnswerPairs) {
		this.sessionId = sessionId;
		this.username = username;
		this.questionAnswerPairs = questionAnswerPairs;
		this.historyDate = LocalDate.now();
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public List<QuestionAnswerPair> getQuestionAnswerPairs() {
		return questionAnswerPairs;
	}

	public void setQuestionAnswerPairs(List<QuestionAnswerPair> questionAnswerPairs) {
		this.questionAnswerPairs = questionAnswerPairs;
	}
	public LocalDate getHistoryDate() {
		return historyDate;
	}
	public void setHistoryDate(LocalDate historyDate) {
		this.historyDate = historyDate;
	}
}
