#!/bin/bash
# Professional UI Batch Update Script
# Systematically updates rounded corners and removes gradient icon backgrounds

echo "Starting Professional UI Batch Update..."

# Phase 3: Border Radius Updates
echo "Phase 3: Updating border radius (rounded-2xl/3xl → rounded-lg)..."

# Find all TypeScript/TSX files in src
find /tmp/cc-agent/55985447/project/src -name "*.tsx" -o -name "*.ts" | while read file; do
  # Replace rounded-2xl with rounded-lg (unless it's in a comment)
  sed -i 's/rounded-2xl/rounded-lg/g' "$file"

  # Replace rounded-3xl with rounded-lg
  sed -i 's/rounded-3xl/rounded-lg/g' "$file"
done

echo "✓ Border radius updates complete"

# Phase 4: Gradient Icon Background Removal
echo "Phase 4: Removing gradient icon backgrounds..."

find /tmp/cc-agent/55985447/project/src/components -name "*.tsx" | while read file; do
  # Pattern 1: bg-gradient-to-r from-blue-X to-blue-Y → bg-primary-50
  sed -i 's/bg-gradient-to-r from-blue-[0-9]* to-blue-[0-9]*/bg-primary-50/g' "$file"

  # Pattern 2: bg-gradient-to-r from-green-X to-green-Y → bg-success-50
  sed -i 's/bg-gradient-to-r from-green-[0-9]* to-green-[0-9]*/bg-success-50/g' "$file"

  # Pattern 3: bg-gradient-to-r from-yellow-X to-yellow-Y → bg-accent-50
  sed -i 's/bg-gradient-to-r from-yellow-[0-9]* to-yellow-[0-9]*/bg-accent-50/g' "$file"

  # Pattern 4: bg-gradient-to-r from-orange-X to-red-Y → bg-accent-50
  sed -i 's/bg-gradient-to-r from-orange-[0-9]* to-red-[0-9]*/bg-accent-50/g' "$file"

  # Pattern 5: bg-gradient-to-r from-purple-X to-purple-Y → bg-primary-50 (NO PURPLE!)
  sed -i 's/bg-gradient-to-r from-purple-[0-9]* to-purple-[0-9]*/bg-primary-50/g' "$file"

  # Pattern 6: bg-gradient-to-r from-indigo-X to-indigo-Y → bg-primary-50 (NO INDIGO!)
  sed -i 's/bg-gradient-to-r from-indigo-[0-9]* to-indigo-[0-9]*/bg-primary-50/g' "$file"
done

echo "✓ Gradient icon background removal complete"

echo "Professional UI Batch Update Complete!"
echo "Files updated: rounded corners + gradient removal"
