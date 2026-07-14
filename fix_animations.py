import re

with open('src/components/DirectoryLayout.tsx', 'r') as f:
    content = f.read()

# Remove blur from variants
content = re.sub(
    r"filter:\s*'blur\(4px\)'",
    r"",
    content
)
content = re.sub(
    r"filter:\s*'blur\(0px\)',",
    r"",
    content
)

# Remove the delay on visible, it causes staggered heavy renders which can cause stuttering
content = re.sub(
    r"delay:\s*\(index\s*%\s*15\)\s*\*\s*0\.04",
    r"delay: (index % 15) * 0.02",
    content
)

with open('src/components/DirectoryLayout.tsx', 'w') as f:
    f.write(content)

print("Fixed heavy animations")
