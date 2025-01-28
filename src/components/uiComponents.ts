export class UIComponents {
  public async loadTerminalUI() {
    try {
      const response = await fetch("/consoleweb/views/terminal-ui.html");
      const terminalHtml = await response.text();
      const terminalElement = document.createElement("div");
      terminalElement.innerHTML = terminalHtml;

      document.querySelectorAll("terminal-ui").forEach((element) => {
        element.replaceWith(terminalElement.cloneNode(true));
      });
    } catch (error) {
      console.error("Failed to load terminal UI:", error);
    }
  }

  public initializeComponents() {
    // Initialize UI components
  }
}
