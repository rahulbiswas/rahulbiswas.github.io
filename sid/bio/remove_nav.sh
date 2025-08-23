#!/bin/bash

# List of leaf pages
LEAF_PAGES=(
    "water-properties.html"
    "hydrogen-bonding.html"
    "acid-base-reactions.html"
    "chemical-bonds.html"
    "buffers.html"
    "carbohydrates.html"
    "lipids.html"
    "proteins.html"
    "nucleic-acids.html"
    "macromolecule-interactions.html"
    "enzyme-structure.html"
    "enzyme-kinetics.html"
    "enzyme-inhibition.html"
    "enzyme-regulation.html"
)

# Process each file
for file in "${LEAF_PAGES[@]}"; do
    if [ -f "$file" ]; then
        # Remove navigation div and everything inside it (macOS version)
        sed -i '' '/<div class="navigation"/,/<\/div>/d' "$file"
        echo "Processed $file"
    else
        echo "Warning: $file not found"
    fi
done

echo "Done! All navigation sections removed! ✨"