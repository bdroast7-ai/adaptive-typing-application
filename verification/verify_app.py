from playwright.sync_api import Page, expect, sync_playwright

def test_app(page: Page):
    page.goto("http://localhost:5173")
    expect(page.get_by_text("Professional Typing Engine")).to_be_visible()
    page.screenshot(path="./verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_app(page)
        finally:
            browser.close()
