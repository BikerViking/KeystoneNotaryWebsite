from playwright.sync_api import sync_playwright, Page, expect

def debug_site(page: Page):
    """
    This script navigates to the homepage to capture its current, reportedly broken, state.
    """
    page.goto("http://localhost:5173")

    # Wait for the page to be generally stable.
    # Instead of waiting for a specific element that might be broken,
    # we'll wait for the network to be idle.
    page.wait_for_load_state('networkidle', timeout=10000)

    # Give animations a moment to start.
    page.wait_for_timeout(1000)

    # Take a screenshot of the initial viewport.
    page.screenshot(path="jules-scratch/verification/bug_report_viewport.png")

    # Scroll down and take a full page screenshot to see all sections.
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    page.wait_for_timeout(1000) # Wait for scroll and animations
    page.screenshot(path="jules-scratch/verification/bug_report_fullpage.png", full_page=True)


# Boilerplate to run the verification
if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        debug_site(page)
        browser.close()
