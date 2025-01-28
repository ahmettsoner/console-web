import { HTMLElements } from "../models/types";
import { HtmlElementsUtils } from "../utils/htmlElementsUtils";

export enum OutputStatuses {
  Success = "success",
  Error = "error",
  Warning = "warning",
  Info = "info",
}

export class OutputManager {
  private elements!: HTMLElements;

  public initializeElements(): void {
    if (!this.elements) {
      this.elements = HtmlElementsUtils.getElements();
    }
  }

  public output(
    messages: string[],
    status: OutputStatuses = OutputStatuses.Info
  ) {
    this.initializeElements();
    messages.forEach((message) => {
      const outputBlock = document.createElement("div");
      outputBlock.textContent = message;
      this.elements.output.appendChild(outputBlock);
    });
    this.elements.output.scrollTop = this.elements.output.scrollHeight;
  }
  public outputClear() {
    this.initializeElements();
    this.elements.output.innerHTML =
      '<div class="spacer" style="flex-grow: 1;"></div>';
  }
  public outputCommand(
    command: string,
    message: string[],
    status: OutputStatuses = OutputStatuses.Info
  ) {
    this.initializeElements();
    const commandBlock = document.createElement("div");
    commandBlock.classList.add("command-block");
    const commandSign = document.createElement("span");
    commandSign.classList.add("prompt");
    commandSign.classList.add(status.toString());
    commandSign.textContent = "$";
    commandBlock.appendChild(commandSign);
    const commandDisplay = document.createElement("span");
    commandDisplay.classList.add("command-display");
    commandDisplay.textContent = command;
    commandBlock.appendChild(commandDisplay);
    message.forEach((msg) => {
      const outputBlock = document.createElement("div");
      outputBlock.innerHTML = msg;
      commandBlock.appendChild(outputBlock);
    });
    this.elements.output.appendChild(commandBlock);
    this.elements.output.scrollTop = this.elements.output.scrollHeight;
  }
}
