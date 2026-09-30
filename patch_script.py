with open("generate_art.py", "r") as f:
    content = f.read()

content = content.replace(
    "draw.rectangle([0, random.randint(50, 150), random.randint(5, 12), random.randint(50, 150)+2], fill=hex_to_rgb('#14532d'))",
    "y = random.randint(50, 150)\n        draw.rectangle([0, y, random.randint(5, 12), y+2], fill=hex_to_rgb('#14532d'))"
)
content = content.replace(
    "draw.rectangle([random.randint(98, 105), random.randint(30, 150), 110, random.randint(30, 150)+2], fill=hex_to_rgb('#14532d'))",
    "y = random.randint(30, 150)\n        draw.rectangle([random.randint(98, 105), y, 110, y+2], fill=hex_to_rgb('#14532d'))"
)

with open("generate_art.py", "w") as f:
    f.write(content)
