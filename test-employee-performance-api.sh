#!/bin/bash

# Test the top performers API
echo "Testing top performers API..."
curl -X GET "http://localhost:8080/api/employee-performance/top-performers?startDate=01/01/2025&endDate=01/05/2025&limit=5" | json_pp

echo -e "\n\nTesting with different date range..."
curl -X GET "http://localhost:8080/api/employee-performance/top-performers?startDate=01/04/2025&endDate=03/05/2025&limit=3" | json_pp
