#!/bin/bash

echo "=== Creator Signup Flow Verification ==="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Testing Creator Signup Flow...${NC}"
echo ""

# Test 1: Check User model fillable fields
echo "1. Checking User model fillable fields..."
if grep -q "user_type" /var/www/html/mirrormefashion/app/Models/User.php; then
    echo -e "${GREEN}✓${NC} user_type is in User model fillable"
else
    echo -e "${RED}✗${NC} user_type is NOT in User model fillable"
fi

if grep -q "user_name" /var/www/html/mirrormefashion/app/Models/User.php; then
    echo -e "${GREEN}✓${NC} user_name is in User model fillable"
else
    echo -e "${RED}✗${NC} user_name is NOT in User model fillable"
fi

echo ""

# Test 2: Check Creator model
echo "2. Checking Creator model..."
if [ -f /var/www/html/mirrormefashion/app/Models/Creator.php ]; then
    echo -e "${GREEN}✓${NC} Creator model exists"
else
    echo -e "${RED}✗${NC} Creator model NOT found"
fi

echo ""

# Test 3: Check CreatorController
echo "3. Checking CreatorController..."
if [ -f /var/www/html/mirrormefashion/app/Http/Controllers/Api/V2/CreatorController.php ]; then
    echo -e "${GREEN}✓${NC} CreatorController exists"
    if grep -q "public function register" /var/www/html/mirrormefashion/app/Http/Controllers/Api/V2/CreatorController.php; then
        echo -e "${GREEN}✓${NC} register() method exists"
    else
        echo -e "${RED}✗${NC} register() method NOT found"
    fi
else
    echo -e "${RED}✗${NC} CreatorController NOT found"
fi

echo ""

# Test 4: Check routes
echo "4. Checking API routes..."
if grep -q "v2/creator.*register" /var/www/html/mirrormefashion/routes/api.php; then
    echo -e "${GREEN}✓${NC} Creator register route exists"
else
    echo -e "${RED}✗${NC} Creator register route NOT found"
fi

if grep -q "v2/campaign.*parse_bearer_token" /var/www/html/mirrormefashion/routes/api.php; then
    echo -e "${GREEN}✓${NC} Campaign route has bearer token parsing"
else
    echo -e "${RED}✗${NC} Campaign route missing bearer token parsing"
fi

echo ""

# Test 5: Check middleware
echo "5. Checking authentication middleware..."
if [ -f /var/www/html/mirrormefashion/app/Http/Middleware/ParseBearerToken.php ]; then
    echo -e "${GREEN}✓${NC} ParseBearerToken middleware exists"
else
    echo -e "${RED}✗${NC} ParseBearerToken middleware NOT found"
fi

if grep -q "parse_bearer_token" /var/www/html/mirrormefashion/app/Http/Kernel.php; then
    echo -e "${GREEN}✓${NC} parse_bearer_token registered in Kernel"
else
    echo -e "${RED}✗${NC} parse_bearer_token NOT registered in Kernel"
fi

echo ""
echo "=== Verification Complete ==="
echo ""
echo "Next steps:"
echo "1. Test creator signup: POST /api/creator/signup"
echo "2. Verify user has user_type='creator'"
echo "3. Verify Creator profile is created"
echo "4. Test campaign creation with creator token"
