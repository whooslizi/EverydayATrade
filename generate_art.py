import os
import random
from PIL import Image, ImageDraw

random.seed(42) # For deterministic generation

BASE_DIR = 'public'
BG_DIR = os.path.join(BASE_DIR, 'backgrounds')
SPRITE_DIR = os.path.join(BASE_DIR, 'sprites')
PORTRAIT_DIR = os.path.join(SPRITE_DIR, 'portraits')

for d in [BG_DIR, SPRITE_DIR, PORTRAIT_DIR]:
    os.makedirs(d, exist_ok=True)

def scale_img(img, factor):
    resample_filter = getattr(Image, 'NEAREST', 0)
    if hasattr(Image, 'Resampling'):
        resample_filter = Image.Resampling.NEAREST
    return img.resize((img.width * factor, img.height * factor), resample=resample_filter)

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_bg_title_clean():
    img = Image.new('RGB', (110, 195))
    draw = ImageDraw.Draw(img)
    
    # Sky Gradient
    colors = ['#1e1b4b', '#311a61', '#581c87', '#86374a', '#b45309']
    step = 130 // len(colors)
    for i, c in enumerate(colors):
        draw.rectangle([0, i*step, 110, (i+1)*step], fill=hex_to_rgb(c))
        
    # Starfield
    for _ in range(40):
        x, y = random.randint(0, 110), random.randint(0, 70)
        draw.point((x, y), fill=hex_to_rgb('#ffffff' if random.random() > 0.3 else '#fef08a'))
        
    # Distant Silhouette Roofs
    draw.polygon([(10, 130), (55, 90), (100, 130)], fill=hex_to_rgb('#1e293b'))
    draw.polygon([(-20, 140), (20, 110), (60, 140)], fill=hex_to_rgb('#0f172a'))
    draw.polygon([(50, 140), (90, 100), (130, 140)], fill=hex_to_rgb('#0f172a'))
    
    # Ground
    draw.rectangle([0, 130, 110, 195], fill=hex_to_rgb('#334155'))
    
    # Cart
    draw.rectangle([35, 120, 75, 150], fill=hex_to_rgb('#78350f'))
    draw.polygon([(30, 120), (55, 105), (80, 120)], fill=hex_to_rgb('#451a03')) # Cart roof
    
    # Lanterns
    for lx in [35, 55, 75]:
        draw.rectangle([lx-3, 122, lx+3, 130], fill=hex_to_rgb('#dc2626'))
        draw.point((lx, 128), fill=hex_to_rgb('#fef08a')) # Glow

    # Bamboo borders
    draw.rectangle([0, 50, 8, 195], fill=hex_to_rgb('#166534'))
    draw.rectangle([102, 30, 110, 195], fill=hex_to_rgb('#166534'))
    for _ in range(30):
        y = random.randint(50, 150)
        draw.rectangle([0, y, random.randint(5, 12), y+2], fill=hex_to_rgb('#14532d'))
        y = random.randint(30, 150)
        draw.rectangle([random.randint(98, 105), y, 110, y+2], fill=hex_to_rgb('#14532d'))

    scaled = scale_img(img, 4)
    scaled.save(os.path.join(BG_DIR, 'title_bg_clean.png'))
    print('Generated title_bg_clean.png')

def create_bg_jail():
    img = Image.new('RGBA', (110, 195), hex_to_rgb('#1e293b'))
    draw = ImageDraw.Draw(img)
    
    # Floor
    draw.rectangle([0, 140, 110, 195], fill=hex_to_rgb('#334155'))
    
    # Straw Mat
    draw.rectangle([20, 160, 90, 185], fill=hex_to_rgb('#a16207'))
    for x in range(22, 90, 4):
        draw.line([(x, 160), (x, 185)], fill=hex_to_rgb('#713f12'))
        
    # Light Cone
    overlay = Image.new('RGBA', img.size, (0,0,0,0))
    odraw = ImageDraw.Draw(overlay)
    odraw.polygon([(55, 10), (10, 150), (100, 150)], fill=hex_to_rgb('#fef08a') + (40,))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)
    
    # Bulb
    draw.ellipse([50, -5, 60, 15], fill=hex_to_rgb('#fef08a'))
    
    # Iron Bars
    for x in range(5, 110, 18):
        draw.rectangle([x, 0, x+4, 195], fill=hex_to_rgb('#0f172a'))
    draw.rectangle([0, 80, 110, 84], fill=hex_to_rgb('#0f172a'))

    scaled = scale_img(img.convert('RGB'), 4)
    scaled.save(os.path.join(BG_DIR, 'jail_cell.png'))
    print('Generated jail_cell.png')

def create_bg_wedding():
    img = Image.new('RGB', (110, 195), hex_to_rgb('#fde047')) # Golden afternoon sky
    draw = ImageDraw.Draw(img)
    
    # Sun
    draw.ellipse([70, 20, 100, 50], fill=hex_to_rgb('#fef08a'))
    
    # Distant trees
    draw.rectangle([0, 100, 110, 195], fill=hex_to_rgb('#4ade80'))
    
    # Marquee Top
    for x in range(0, 110, 20):
        draw.polygon([(x, 60), (x+10, 90), (x+20, 60)], fill=hex_to_rgb('#ef4444'))
        draw.polygon([(x+10, 60), (x+20, 90), (x+30, 60)], fill=hex_to_rgb('#ffffff'))
    draw.rectangle([0, 0, 110, 60], fill=hex_to_rgb('#ef4444'))
    for x in range(10, 110, 20):
        draw.rectangle([x, 0, x+10, 60], fill=hex_to_rgb('#ffffff'))
        
    # Arch
    draw.polygon([(0, 195), (20, 100), (40, 195)], fill=hex_to_rgb('#166534'))
    draw.polygon([(70, 195), (90, 100), (110, 195)], fill=hex_to_rgb('#166534'))
    
    # Tables
    draw.rectangle([10, 150, 50, 170], fill=hex_to_rgb('#e2e8f0'))
    draw.rectangle([60, 160, 100, 180], fill=hex_to_rgb('#e2e8f0'))
    
    scaled = scale_img(img, 4)
    scaled.save(os.path.join(BG_DIR, 'wedding_tent.png'))
    print('Generated wedding_tent.png')

def create_bg_memorial():
    img = Image.new('RGB', (110, 195))
    draw = ImageDraw.Draw(img)
    
    # Sky Gradient
    colors = ['#bae6fd', '#e0f2fe', '#fbcfe8']
    step = 140 // len(colors)
    for i, c in enumerate(colors):
        draw.rectangle([0, i*step, 110, (i+1)*step], fill=hex_to_rgb(c))
        
    # Grass Mound
    draw.ellipse([-50, 120, 160, 220], fill=hex_to_rgb('#4ade80'))
    draw.ellipse([-20, 140, 130, 250], fill=hex_to_rgb('#22c55e'))
    
    # Tree Trunk
    draw.rectangle([70, 80, 85, 150], fill=hex_to_rgb('#78350f'))
    draw.polygon([(65, 140), (70, 100), (80, 150)], fill=hex_to_rgb('#451a03'))
    
    # Tombstone (Large, distinct, grey)
    # Background Base
    draw.rectangle([25, 160, 65, 165], fill=hex_to_rgb('#64748b'))
    # Main block
    draw.rectangle([30, 125, 60, 160], fill=hex_to_rgb('#94a3b8'))
    # Rounded top
    draw.ellipse([30, 115, 60, 135], fill=hex_to_rgb('#94a3b8'))
    # Inner shadow
    draw.rectangle([35, 135, 55, 137], fill=hex_to_rgb('#64748b'))
    draw.rectangle([40, 143, 50, 145], fill=hex_to_rgb('#64748b'))
    
    # Peach Blossoms
    draw.ellipse([40, 30, 110, 100], fill=hex_to_rgb('#f472b6'))
    draw.ellipse([20, 50, 80, 120], fill=hex_to_rgb('#f9a8d4'))
    draw.ellipse([60, 40, 120, 90], fill=hex_to_rgb('#ec4899'))
    
    # Falling Petals
    for _ in range(20):
        px, py = random.randint(20, 100), random.randint(80, 180)
        draw.rectangle([px, py, px+2, py+1], fill=hex_to_rgb('#fbcfe8'))

    scaled = scale_img(img, 4)
    scaled.save(os.path.join(BG_DIR, 'memorial_grave.png'))
    print('Generated memorial_grave.png')

def create_sprite_hero():
    # 4 frames (idle/walk) in 1 row for simplicity: 64x24
    img = Image.new('RGBA', (64, 24), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    for i in range(4):
        ox = i * 16
        # Head
        draw.rectangle([ox+5, 2, ox+11, 8], fill=hex_to_rgb('#fca5a5'))
        # Hair
        draw.rectangle([ox+4, 1, ox+12, 4], fill=hex_to_rgb('#111827'))
        # Jacket
        draw.rectangle([ox+4, 8, ox+12, 16], fill=hex_to_rgb('#2563eb'))
        # Pants
        draw.rectangle([ox+5, 16, ox+11, 22], fill=hex_to_rgb('#78716c'))
        # Shoes
        draw.rectangle([ox+4, 22, ox+12, 24], fill=hex_to_rgb('#1c1917'))
        
    scaled = scale_img(img, 4)
    scaled.save(os.path.join(SPRITE_DIR, 'hero.png'))
    print('Generated hero.png')

def create_sprite_dung():
    img = Image.new('RGBA', (64, 16), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    for i in range(4):
        ox = i * 16
        # Body
        draw.rectangle([ox+2, 6, ox+12, 12], fill=hex_to_rgb('#f59e0b'))
        # Head
        draw.rectangle([ox+10, 2, ox+15, 8], fill=hex_to_rgb('#d97706'))
        # Ear
        draw.rectangle([ox+10, 3, ox+12, 9], fill=hex_to_rgb('#78350f'))
        # Snout
        draw.point((ox+15, 4), fill=hex_to_rgb('#000000'))
        # Legs
        draw.rectangle([ox+3, 12, ox+5, 16], fill=hex_to_rgb('#b45309'))
        draw.rectangle([ox+9, 12, ox+11, 16], fill=hex_to_rgb('#b45309'))
        
    scaled = scale_img(img, 4)
    scaled.save(os.path.join(SPRITE_DIR, 'dung.png'))
    print('Generated dung.png')

def create_portraits():
    portraits = {
        'hero': {'hair': '#111827', 'skin': '#fca5a5', 'clothes': '#2563eb', 'acc': None},
        'tra': {'hair': '#1e293b', 'skin': '#fcd34d', 'clothes': '#15803d', 'acc': '#facc15'},
        'tom': {'hair': '#451a03', 'skin': '#f87171', 'clothes': '#ea580c', 'acc': '#991b1b'}, # scar
        'sinhvien': {'hair': '#000000', 'skin': '#fef08a', 'clothes': '#0369a1', 'acc': '#ffffff'}, # glasses
        'ongdao': {'hair': '#e5e7eb', 'skin': '#d6d3d1', 'clothes': '#78350f', 'acc': None},
        'ha': {'hair': '#171717', 'skin': '#fecdd3', 'clothes': '#ffffff', 'acc': '#fcd34d'},
        'hoang_it': {'hair': '#020617', 'skin': '#fed7aa', 'clothes': '#1e293b', 'acc': '#38bdf8'}
    }
    
    for name, p in portraits.items():
        img = Image.new('RGBA', (32, 32), (0,0,0,0))
        draw = ImageDraw.Draw(img)
        # Base Head
        draw.rectangle([8, 6, 24, 22], fill=hex_to_rgb(p['skin']))
        # Hair
        draw.rectangle([6, 4, 26, 10], fill=hex_to_rgb(p['hair']))
        draw.rectangle([6, 10, 10, 16], fill=hex_to_rgb(p['hair']))
        # Eyes
        draw.rectangle([12, 12, 14, 14], fill=(0,0,0))
        draw.rectangle([18, 12, 20, 14], fill=(0,0,0))
        # Clothes
        draw.rectangle([6, 22, 26, 32], fill=hex_to_rgb(p['clothes']))
        
        # Specifics
        if name == 'tra':
            draw.rectangle([22, 2, 26, 6], fill=hex_to_rgb(p['hair'])) # Bun
            draw.rectangle([23, 3, 27, 4], fill=hex_to_rgb(p['acc'])) # Hairpin
        elif name == 'tom':
            draw.line([(10, 10), (14, 8)], fill=hex_to_rgb(p['acc']), width=2) # Scar
        elif name == 'sinhvien':
            # Glasses
            draw.rectangle([10, 10, 15, 15], outline=(0,0,0), width=2)
            draw.rectangle([17, 10, 22, 15], outline=(0,0,0), width=2)
            draw.point((11, 11), fill=hex_to_rgb(p['acc'])) # Glare
            draw.point((18, 11), fill=hex_to_rgb(p['acc']))
        elif name == 'ongdao':
            draw.line([(12, 18), (20, 18)], fill=hex_to_rgb('#a8a29e')) # Wrinkle
        elif name == 'ha':
            draw.rectangle([8, 18, 10, 20], fill=hex_to_rgb(p['acc'])) # Earring
        elif name == 'hoang_it':
            draw.rectangle([6, 28, 10, 30], fill=hex_to_rgb(p['acc'])) # Smartwatch
            
        scaled = scale_img(img, 4)
        scaled.save(os.path.join(PORTRAIT_DIR, f'{name}.png'))
        print(f'Generated portraits/{name}.png')

def main():
    print("--- GENERATING 16-BIT ASSETS ---")
    create_bg_title_clean()
    create_bg_jail()
    create_bg_wedding()
    create_bg_memorial()
    
    create_sprite_hero()
    create_sprite_dung()
    
    create_portraits()
    
    print("--- ASSET GENERATION COMPLETE ---")

if __name__ == '__main__':
    main()
