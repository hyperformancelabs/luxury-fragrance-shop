package com.hyperformancelabs.backend.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.google.genai.ResponseStream;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class LlmService {

    private final Client client;
    private final Gson gson = new Gson();
    private final String systemPrompt;

    public LlmService(@Value("${gemini.api.key}") String apiKey) throws IOException {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Gemini API key is not configured. Please set the 'gemini.api.key' property in your environment or configuration.");
        }
        this.client = Client.builder().apiKey(apiKey).build();
        // Load system prompt from classpath
        ClassPathResource resource = new ClassPathResource("llm/system_prompt.txt");
        try (var in = resource.getInputStream()) {
            this.systemPrompt = new String(in.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    /**
     * Call Gemini model with the business-intelligence system prompt and user question.
     * @param userQuestion natural language question
     * @return raw text response from LLM
     */
    public String generateRawResponse(String userQuestion) {
        String model = "gemini-2.0-flash";

        List<Content> contents = new ArrayList<>();
        // Some Gemini Flash versions don't support system role, so prepend prompt to user content.
        String combined = systemPrompt + "\n\n### USER QUESTION\n" + userQuestion;
        contents.add(Content.builder()
                .role("user")
                .parts(List.of(Part.fromText(combined)))
                .build());

        GenerateContentConfig config = GenerateContentConfig.builder()
                .responseMimeType("text/plain")
                .build();

        ResponseStream<GenerateContentResponse> stream = client.models.generateContentStream(model, contents, config);
        StringBuilder sb = new StringBuilder();
        for (GenerateContentResponse res : stream) {
            if (res.candidates().isEmpty() || res.candidates().get().isEmpty()) {
                continue;
            }
            var candidate = res.candidates().get().get(0);
            if (candidate.content().isEmpty() || candidate.content().get().parts().isEmpty()) {
                continue;
            }
            List<Part> parts = candidate.content().get().parts().get();
            for (Part part : parts) {
                part.text().ifPresent(sb::append);
            }
        }
        stream.close();
        return sb.toString().trim();
    }

    /**
     * Parse LLM raw text to JSON object following the expected schema.
     * @param rawResponse raw string from LLM
     * @return JsonObject parsed JSON or null if cannot parse
     */
    public JsonObject parseToJson(String rawResponse) {
        if (rawResponse == null || rawResponse.isBlank()) return null;
        // The model should output pure JSON, but we try to extract first valid JSON segment as fallback.
        int firstBrace = rawResponse.indexOf('{');
        int lastBrace = rawResponse.lastIndexOf('}');
        if (firstBrace == -1 || lastBrace == -1 || lastBrace <= firstBrace) {
            return null;
        }
        String jsonStr = rawResponse.substring(firstBrace, lastBrace + 1);
        try {
            JsonElement element = JsonParser.parseString(jsonStr);
            if (element.isJsonObject()) {
                return element.getAsJsonObject();
            }
        } catch (Exception ignored) {}
        return null;
    }
} 