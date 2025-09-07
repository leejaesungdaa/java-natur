import os
import re
import glob
from pathlib import Path

def remove_comments(content):
    """Remove single line comments, multi-line comments, and JSDoc comments"""
    # Remove single line comments
    content = re.sub(r'^\s*//.*$', '', content, flags=re.MULTILINE)
    
    # Remove multi-line comments including JSDoc
    content = re.sub(r'/\*[\s\S]*?\*/', '', content, flags=re.MULTILINE | re.DOTALL)
    
    # Remove empty lines that may have been left behind
    content = re.sub(r'\n\s*\n', '\n\n', content)
    
    # Clean up multiple consecutive empty lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content

def replace_brand_name(content):
    """Replace NATUR JAVA and Natur Java with Java Natur"""
    content = re.sub(r'NATUR JAVA', 'Java Natur', content)
    content = re.sub(r'Natur Java', 'Java Natur', content)
    return content

def process_file(file_path):
    """Process a single file to remove comments and replace brand names"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Remove comments
        content = remove_comments(content)
        
        # Replace brand names
        content = replace_brand_name(content)
        
        # Write back only if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    # Get all TypeScript and JavaScript files in src directory
    src_dir = "src"
    patterns = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
    
    processed_files = []
    
    for pattern in patterns:
        files = glob.glob(os.path.join(src_dir, pattern), recursive=True)
        for file_path in files:
            if process_file(file_path):
                processed_files.append(file_path)
                print(f"Processed: {file_path}")
    
    print(f"\nTotal files processed: {len(processed_files)}")
    for file_path in processed_files:
        print(f"  - {file_path}")

if __name__ == "__main__":
    main()