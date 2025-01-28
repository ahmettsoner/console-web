import { HTMLElements } from "../models/types";

export class HtmlElementsUtils {
  public static getElements(): HTMLElements {
    return {
      body: document.body,
      terminal: document.getElementById("terminal") as HTMLDivElement,
      output: document.getElementById("output") as HTMLElement,
      commandInput: document.getElementById("commandInput") as HTMLInputElement,
      suggestionDisplay: document.getElementById("suggestions") as HTMLElement,
    };
  }
}
