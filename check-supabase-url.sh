#!/bin/bash
echo "=== Supabase URL Checker ==="
echo ""
echo "Current URL in .env.local:"
grep "NEXT_PUBLIC_SUPABASE_URL" .env.local 2>/dev/null || echo "Not found"
echo ""
echo "Testing connection..."
URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local 2>/dev/null | cut -d'=' -f2)
if [ -n "$URL" ]; then
  echo "Testing: $URL"
  curl -I "$URL" 2>&1 | head -3
else
  echo "No URL found in .env.local"
fi
echo ""
echo "To fix:"
echo "1. Go to: https://supabase.com/dashboard"
echo "2. Select your project → Settings → API"
echo "3. Copy the exact 'Project URL'"
echo "4. Update NEXT_PUBLIC_SUPABASE_URL in .env.local"
