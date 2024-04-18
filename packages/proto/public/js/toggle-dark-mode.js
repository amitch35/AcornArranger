export function toggleDarkMode(target, checked) {
    const customEvent = new CustomEvent(
        "dark-mode:toggle", 
        {
            bubbles: true,
            detail: { checked }
        }
    );
    target.dispatchEvent(customEvent);
}