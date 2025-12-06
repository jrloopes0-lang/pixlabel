#!/bin/bash

# PIXLABEL API Testing Script
# Tests all critical endpoints to ensure system is working

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="${1:-http://localhost:3000}"
DEMO_TOKEN="demo-pixlabel-test"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  PIXLABEL API Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Testing: ${YELLOW}${BASE_URL}${NC}\n"

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to test endpoint
test_endpoint() {
  local method=$1
  local path=$2
  local expected_status=$3
  local description=$4
  local data=$5
  
  echo -n "Testing: $description... "
  
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" -H "x-demo-token: $DEMO_TOKEN" "$BASE_URL$path")
  else
    response=$(curl -s -w "\n%{http_code}" -X "$method" -H "Content-Type: application/json" -H "x-demo-token: $DEMO_TOKEN" -d "$data" "$BASE_URL$path")
  fi
  
  status=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$status" = "$expected_status" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $status)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $status)"
    echo -e "  Response: $body"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# ============================================
# CORE ENDPOINTS
# ============================================

echo -e "\n${YELLOW}[1] Core Endpoints${NC}"
test_endpoint "GET" "/api/health" "200" "Health check"
test_endpoint "GET" "/api/auth/status" "200" "Auth status with demo token"

# ============================================
# ITEMS (Medications)
# ============================================

echo -e "\n${YELLOW}[2] Items (Medications)${NC}"
test_endpoint "GET" "/api/items" "200" "List all items"
test_endpoint "POST" "/api/items" "201" "Create new item" '{"code":"MED001","name":"Paracetamol 500mg","presentation":"Comprimido","minStockMonths":1}'

# ============================================
# UNITS
# ============================================

echo -e "\n${YELLOW}[3] Units (Health Units)${NC}"
test_endpoint "GET" "/api/units" "200" "List all units"
test_endpoint "POST" "/api/units" "201" "Create new unit" '{"name":"UBS Centro","type":"centro_saude"}'

# ============================================
# SUPPLIERS
# ============================================

echo -e "\n${YELLOW}[4] Suppliers${NC}"
test_endpoint "GET" "/api/suppliers" "200" "List all suppliers"
test_endpoint "POST" "/api/suppliers" "201" "Create new supplier" '{"name":"Farmácia ABC","contact":"(85) 99999-9999","priority":1}'

# ============================================
# ORDERS
# ============================================

echo -e "\n${YELLOW}[5] Orders${NC}"
test_endpoint "GET" "/api/orders" "200" "List all orders"

# ============================================
# SESI MODULE
# ============================================

echo -e "\n${YELLOW}[6] SESI - Patients${NC}"
test_endpoint "GET" "/api/sesi/pacientes" "200" "List SESI patients"
test_endpoint "POST" "/api/sesi/pacientes" "201" "Create SESI patient" '{"name":"João da Silva","cpf":"12345678901","phone":"(85) 98888-8888"}'

echo -e "\n${YELLOW}[7] SESI - Stock${NC}"
test_endpoint "GET" "/api/sesi/estoque" "200" "List SESI stock"

echo -e "\n${YELLOW}[8] SESI - Medications Search${NC}"
test_endpoint "GET" "/api/sesi/medicamentos?q=para" "200" "Search SESI medications"

# ============================================
# RESULTS SUMMARY
# ============================================

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Results${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
  echo -e "\n${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "\n${RED}✗ Some tests failed.${NC}"
  exit 1
fi
