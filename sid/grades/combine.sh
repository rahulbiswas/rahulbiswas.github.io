#!/bin/bash

echo "Concatenating all files..."

# Create output file with timestamp comment
cat > combined.txt << EOL
// Combined files
// Generated $(date)

EOL

# Loop through all files in directory
for file in *.*; do
   # Skip the combined output file itself
   if [[ "$file" != "combined.txt" && "$file" != "combine.sh" ]]; then
       echo -e "\n// ============ $file ============\n" >> combined.txt
       cat "$file" >> combined.txt
   fi
done

echo "Files combined into combined.txt"