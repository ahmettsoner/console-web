import { HTMLElements } from "../models/types";
import { HtmlElementsUtils } from "../utils/htmlElementsUtils";

export class InputManager {
  private elements!: HTMLElements;

  private initializeElements(): void {
    if (!this.elements) {
      this.elements = HtmlElementsUtils.getElements();
    }
  }

  public getValue(): string {
    this.initializeElements();
    return this.elements.commandInput.value;
  }
  public setValue(value: string) {
    this.initializeElements();
    this.elements.commandInput.value = value;
  }
  public appendValue(value: string, space = true) {
    this.initializeElements();
    this.elements.commandInput.value += (space ? " " : "") + value;
  }
  public clear() {
    this.initializeElements();
    this.elements.commandInput.value = "";
  }

  public addKeydownListener(callback: (e: KeyboardEvent) => void) {
    this.initializeElements();
    this.elements.terminal.addEventListener("keydown", callback);
  }
  public addInputListener(callback: (e: Event) => void) {
    this.elements.terminal.addEventListener("input", callback);
  }

  public addContextMenuListener(callback: (e: MouseEvent) => void) {
    this.initializeElements();
    this.elements.terminal.addEventListener("contextmenu", callback);
  }
}
