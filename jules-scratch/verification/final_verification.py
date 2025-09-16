from playwright.sync_api import sync_playwright, Page, expect

def final_verification(page: Page):
    """
    This script performs a final verification of the redesigned website.
    It captures a full-page screenshot to demonstrate all fixes and improvements.
    """
    page.goto("http://localhost:5173")

    # Wait for the page to be generally stable and animations to start.
    page.wait_for_load_state('networkidle', timeout=10000)
    page.wait_for_timeout(1000)

    # Scroll to the bottom of the page to ensure all animations have played.
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(2000) # A longer wait to capture the settled state of all animations.

    # Take a screenshot of the final, polished site at the bottom of the page.
    page.screenshot(path="jules-scratch/verification/final_screenshot.png", full_page=True)


# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        final_verification(page)
        browser.close()
