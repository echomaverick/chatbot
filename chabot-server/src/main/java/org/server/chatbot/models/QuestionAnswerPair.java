package org.server.chatbot.models;

import java.util.List;

public class QuestionAnswerPair {
    private String question;
    private List<String> answer;

    public QuestionAnswerPair(String question, List<String> answer) {
        this.question = question;
        this.answer = answer;
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