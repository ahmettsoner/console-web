import { HtmlElementsUtils } from "../utils/htmlElementsUtils";

export class ContextMenuEventHandler {
  public async handleContextMenu(e: MouseEvent): Promise<void> {
    e.preventDefault();

    const elements = HtmlElementsUtils.getElements();
    if (document.hasFocus() && elements.commandInput) {
      const selectedText = window.getSelection()?.toString() ?? "";

      if (selectedText) {
        try {
          await navigator.clipboard.writeText(selectedText);
          console.log("Selected text copied:", selectedText);
        } catch (error) {
          console.error("Unable to copy text:", error);
        }
      }
      try {
        const clipboardText = await navigator.clipboard.readText();
        elements.commandInput.value += clipboardText;
        console.log("Pasted text:", clipboardText);
      } catch (error) {
        console.error("Unable to read from clipboard:", error);
      }
    } else {
      console.warn("Document is not focused.");
    }
  }
}
