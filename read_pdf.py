import sys
try:
    from pypdf import PdfReader
except ImportError:
    try:
        from PyPDF2 import PdfReader
    except ImportError:
        print("Error: No PDF library found.")
        sys.exit(1)

def extract_text(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    pdf_path = "Nutrition AI Native System.pdf"
    content = extract_text(pdf_path)
    with open("pdf_content.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Done writing to pdf_content.txt")
