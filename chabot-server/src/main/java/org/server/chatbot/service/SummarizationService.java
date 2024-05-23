package org.server.chatbot.service;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SummarizationService {
	public String summarize(String content) {
		// @todo Replace these variables with your project and model information found on the Google Cloud Console https://cloud.google.com/
		Dotenv dotenv = Dotenv.configure().directory("/home/samuel/Documents/GitHub/chatbot/chabot-server/.env").load();
		String projectId = dotenv.get("PROJECT_ID");
		String location = dotenv.get("LOCATION");
		String modelName = dotenv.get("MODEL_NAME");

		try (VertexAI vertexAI = new VertexAI(projectId , location)) {
			GenerativeModel model = new GenerativeModel(modelName , vertexAI);
			GenerateContentResponse response = model.generateContent(content);
			return ResponseHandler.getText(response);
		} catch (IllegalArgumentException e) {
			if (e.getMessage() != null && e.getMessage().contains("The response is blocked due to safety reason")) {
				return "The response is blocked due to safety reasons. Please try again later or contact support for assistance.";
			} else {
				e.printStackTrace();
				return "An unexpected error occurred while summarizing content.";
			}
		} catch (IOException e) {
			e.printStackTrace();
			return "An unexpected error occurred while summarizing content.";
		}
	}
}
