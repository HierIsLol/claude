import asyncio
from playwright.async_api import async_playwright
import os

HTML_DIR = "/home/user/claude/adpal_pptx/html"
SS_DIR = "/home/user/claude/adpal_pptx/screenshots"

pages = [
    ("slide1_campaigns_list.html", "slide1_campaigns_list.png"),
    ("slide2_campaign_overview.html", "slide2_campaign_overview.png"),
    ("slide3_campaign_settings.html", "slide3_campaign_settings.png"),
    ("slide4_dashboard.html", "slide4_dashboard.png"),
    ("slide5_new_campaign.html", "slide5_new_campaign.png"),
]

CHROMIUM_PATH = "/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=CHROMIUM_PATH)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 900}
        )
        page = await context.new_page()

        for html_file, png_file in pages:
            path = os.path.join(HTML_DIR, html_file)
            out = os.path.join(SS_DIR, png_file)
            await page.goto(f"file://{path}")
            await page.wait_for_timeout(500)
            await page.screenshot(path=out, full_page=False)
            print(f"✓ {png_file}")

        await browser.close()

asyncio.run(main())
