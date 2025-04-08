package com.hyperformancelabs.backend.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class EnvLoader {

    public static void loadEnv(String envLocalPath, String envDefaultPath) {
        File envFile = new File(envLocalPath);

        if (!envFile.exists()) {
            System.out.println("[EnvLoader] .env.local not found, trying to load .env");
            envFile = new File(envDefaultPath);
        } else {
            System.out.println("[EnvLoader] Found .env.local, loading it.");
        }

        if (!envFile.exists()) {
            System.err.println("[EnvLoader] No .env or .env.local file found. Skipping env loading.");
            return;
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(envFile))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();

                // Skip empty lines and comments
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }

                String[] parts = line.split("=", 2);
                if (parts.length == 2) {
                    String key = parts[0].trim();
                    String value = parts[1].trim();
                    if (!key.isEmpty() && !value.isEmpty()) {
                        System.setProperty(key, value);
                    }
                }
            }
            System.out.println("[EnvLoader] Loaded environment variables from: " + envFile.getName());
        } catch (IOException e) {
            System.err.println("[EnvLoader] Error reading .env file: " + e.getMessage());
        }
    }
}
