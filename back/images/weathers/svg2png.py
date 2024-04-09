import cairosvg
import os

files = os.listdir()
for file in files:
    if file.endswith('.svg'):
        cairosvg.svg2png(url=file, write_to=file.replace('.svg', '.png'))