import os, json, re, sys, asyncio
from urllib.parse import quote

ROOT = os.path.dirname(os.path.abspath(__file__))
THUMB_DIR = os.path.join(ROOT, 'thumbnails')

def clean_title(filename):
    name = filename.rsplit('.', 1)[0]
    name = name.replace('-', ' ').replace('_', ' ')
    name = re.sub(r'\s+', ' ', name)
    return name.strip().title()

def get_category(parts):
    if len(parts) == 1 and 'manim' in parts[0].lower():
        return "🎥 Manim Studio"
    if len(parts) > 1:
        cat = parts[0].replace('_', ' ').replace('-', ' ').title()
        if cat.lower() == 'chapters' and len(parts) > 2:
            sub = parts[1].replace('_', ' ').replace('-', ' ').title()
            return f"{cat} - {sub}"
        return cat
    return "Miscellaneous"

def slugify(rel_path):
    return re.sub(r'[^A-Za-z0-9]+', '_', rel_path).strip('_') + '.png'

def scan():
    apps = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if not d.startswith('.')]
        for f in filenames:
            if f.endswith('.html') and f.lower() != 'index.html':
                rel = os.path.relpath(os.path.join(dirpath, f), ROOT)
                apps.append({
                    "title": clean_title(f),
                    "path": rel.replace(os.sep, '/'),
                    "category": get_category(rel.split(os.sep)),
                    "raw_file": f,
                    "slug": slugify(rel),
                    "thumb": ""
                })
    apps.sort(key=lambda x: x['title'])
    return apps

async def make_thumbs(items):
    from playwright.async_api import async_playwright
    os.makedirs(THUMB_DIR, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=['--enable-unsafe-swiftshader'])
        page = await browser.new_page(viewport={'width': 960, 'height': 540})
        page.on('dialog', lambda d: asyncio.ensure_future(d.dismiss()))
        for it in items:
            out = os.path.join(THUMB_DIR, it['slug'])
            if os.path.exists(out) and '--force' not in sys.argv:
                continue
            url = 'file://' + quote(os.path.join(ROOT, it['path']))
            try:
                await page.goto(url, wait_until='load', timeout=45000)
                await page.wait_for_timeout(2500)   # let canvases/WebGL render
                await page.screenshot(path=out)
                print('📸', it['path'])
            except Exception as e:
                print('⚠️  skipped:', it['path'], '-', e)
        await browser.close()

def main():
    apps = scan()
    if '--thumbs' in sys.argv:
        try:
            asyncio.run(make_thumbs(apps))
        except ImportError:
            print("Playwright not installed. Run:\n  pip install playwright\n  playwright install chromium")
    for a in apps:
        p = os.path.join(THUMB_DIR, a['slug'])
        a['thumb'] = 'thumbnails/' + a['slug'] if os.path.exists(p) else ''
        del a['slug']
    with open(os.path.join(ROOT, 'gallery.json'), 'w', encoding='utf-8') as f:
        json.dump(apps, f, indent=4, ensure_ascii=False)
    print(f"✅ gallery.json written with {len(apps)} simulations.")

if __name__ == "__main__":
    main()