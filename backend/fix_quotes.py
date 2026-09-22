import re

with open('app/core/endings.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace problematic ASCII double quotes inside description strings
# These should be Chinese curly quotes instead
content = content.replace('\u201c', '\u300c')  # left double quote to left corner bracket
content = content.replace('\u201d', '\u300d')  # right double quote to right corner bracket

# Also fix any direct ASCII quotes that are meant to be Chinese quotes
# Pattern: description value has unescaped quotes
lines = content.split('\n')
fixed_lines = []
for line in lines:
    if '"description"' in line:
        # Count double quotes - if more than 2 (the outer ones), we have issues
        # Replace inner quotes with escaped versions
        parts = line.split('"description": "', 1)
        if len(parts) == 2:
            prefix = parts[0] + '"description": "'
            rest = parts[1]
            # Find the last quote that closes the string (before the comma)
            # The rest should end with ", or ",} pattern
            if rest.rstrip().endswith('",'):
                value = rest.rstrip()[:-2]  # remove ",
                # Escape any inner double quotes
                value = value.replace('"', '\\"')
                line = prefix + value + '",'
            elif rest.rstrip().endswith('",}'):
                value = rest.rstrip()[:-3]  # remove ",}
                value = value.replace('"', '\\"')
                line = prefix + value + '",}'
    fixed_lines.append(line)

content = '\n'.join(fixed_lines)

with open('app/core/endings.py', 'w', encoding='utf-8') as f:
    f.write(content)

print('Quotes fixed successfully')
