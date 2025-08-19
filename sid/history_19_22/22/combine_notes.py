import os
import glob


def combine_text_files(output_file):
  # Get all .txt files in current directory
  txt_files = glob.glob("*.txt")

  # Sort them alphabetically
  txt_files.sort()

  with open(output_file, "w", encoding="utf-8") as outfile:
    for txt_file in txt_files:
      # Write the filename header
      outfile.write(f"=== {txt_file} ===\n\n")

      # Read and write the contents
      try:
        with open(txt_file, "r", encoding="utf-8") as infile:
          content = infile.read()
          outfile.write(content)
          # Add newlines between files
          outfile.write("\n\n")
      except Exception as e:
        print(f"Error processing {txt_file}: {e}")

    print(f"Combined {len(txt_files)} files into {output_file}!")


# Run the function
combine_text_files("combined_notes.txt")
