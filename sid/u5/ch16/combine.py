from xml.etree import ElementTree as ET
import glob


def combine_quiz_files(output_file):
  quiz_files = glob.glob("q*")

  if not quiz_files:
    print("No quiz files found starting with 'q'")
    return

  root = ET.Element("quiz")
  question_number = 1

  for file_name in quiz_files:
    print(f"Adding questions from {file_name}")
    try:
      tree = ET.parse(file_name)
      for question in tree.findall(".//question"):
        question.set("number", str(question_number))
        root.append(question)
        question_number += 1
    except:
      pass

  tree = ET.ElementTree(root)
  tree.write(output_file, encoding="UTF-8", xml_declaration=True)
  print(f"Combined {question_number-1} questions into {output_file}")


combine_quiz_files("combined_quiz.xml")
