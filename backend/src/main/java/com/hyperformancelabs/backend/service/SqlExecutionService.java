package com.hyperformancelabs.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Service
public class SqlExecutionService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Execute the provided SQL statement. If it is a SELECT query, the method returns a
     * list of rows where each row is represented as a Map with column names as keys and
     * values as Objects. For all other statements (UPDATE, INSERT, DELETE, etc.) a map
     * with the key "rowsAffected" is returned.
     *
     * @param sql raw SQL statement to execute.
     * @return execution result (either List<Map<String, Object>> or Map<String, Integer>). 
     */
    public Object executeSql(String sql) {
        if (sql == null || sql.trim().isEmpty()) {
            throw new IllegalArgumentException("SQL query must not be empty");
        }

        sql = sql.trim();
        boolean isSelect = sql.toLowerCase().startsWith("select");

        if (isSelect) {
            // JdbcTemplate returns each row as a Map where the keys are the column names
            List<Map<String, Object>> rows = jdbcTemplate.queryForList(sql);
            return rows;
        }

        int affected = jdbcTemplate.update(sql);
        return Collections.singletonMap("rowsAffected", affected);
    }
} 