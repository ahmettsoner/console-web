import { CommandManager } from "../core/commandManager";
import { HistoryManager } from "../history/historyManager";
import { InputManager } from "../inputOutput/inputManager";
import { SuggestionSystem } from "../suggestions/suggestionSystem";
import { HtmlElementsUtils } from "../utils/htmlElementsUtils";

export class KeydownEventHandler {
  private readonly commandManager = new CommandManager();
  private readonly suggestionSystem: SuggestionSystem = new SuggestionSystem();
  private readonly inputManager: InputManager = new InputManager();
  private readonly historyManager: HistoryManager = new HistoryManager();

  public handleKeydown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Escape":
        this.handleEscapeKey(e);
        break;
      case "Enter":
        this.handleEnterKey(e);
        break;
      case "ArrowUp":
        this.handleArrowUp(e);
        break;
      case "ArrowDown":
        this.handleArrowDown(e);
        break;
      case "Tab":
        this.handleTabKey(e);
        break;
      case "Backspace":
        this.handleBackspaceKey(e);
        break;
      case "Delete":
        this.handleDeleteKey(e);
        break;
      default:
        // You might want to handle other keys or do nothing
        break;
    }
  }
  private handleBackspaceKey(e: KeyboardEvent): void {}
  private handleDeleteKey(e: KeyboardEvent): void {}
  private handleEscapeKey(e: KeyboardEvent): void {
    if (this.suggestionSystem.hasSuggestions()) {
      this.suggestionSystem.clearSuggestions();
    } else {
      this.inputManager.clear();
    }
  }

  private handleTabKey(e: KeyboardEvent): void {
    const input = this.inputManager.getValue();
    e.preventDefault();
    const output = this.suggestionSystem.filter(input);
    if (this.suggestionSystem.hasSuggestions()) {
      const selected = this.suggestionSystem.getSelected();
      this.suggestionSystem.displaySuggestions();
      const suggestionInput = this.suggestionSystem.getSuggestionsInput();
      const parts = suggestionInput.split(" ");
      const lastWord = parts[parts.length - 1];
      if (selected.startsWith(lastWord)) {
        const newInput = [...parts.slice(0, -1), selected].join(" ");
        this.inputManager.setValue(newInput);
      } else {
        const newInput = [...parts, selected].join(" ");
        this.inputManager.setValue(newInput);
      }
    }
  }

  private handleEnterKey(e: KeyboardEvent): void {
    if (
      this.suggestionSystem.hasSuggestions() &&
      this.suggestionSystem.hasAnySelected()
    ) {
      const selected = this.suggestionSystem.getSelected();
      this.suggestionSystem.displaySuggestions();
      const suggestionInput = this.suggestionSystem.getSuggestionsInput();
      const parts = suggestionInput.split(" ");
      const lastWord = parts[parts.length - 1];
      if (selected.startsWith(lastWord)) {
        const newInput = [...parts.slice(0, -1), selected].join(" ");
        this.inputManager.setValue(newInput);
      } else {
        const newInput = [...parts, selected].join(" ");
        this.inputManager.setValue(newInput);
      }
    }
    this.suggestionSystem.clearSuggestions();

    const input = this.inputManager.getValue();
    this.historyManager.historyAdd(input);
    this.handleCommand(input);
    this.inputManager.clear();
  }

  private handleArrowUp(e: KeyboardEvent): void {
    if (this.suggestionSystem.hasSuggestions()) {
      const selected = this.suggestionSystem.selectPrevious();
      this.suggestionSystem.displaySuggestions();
      const suggestionInput = this.suggestionSystem.getSuggestionsInput();
      const parts = suggestionInput.split(" ");
      const lastWord = parts[parts.length - 1];
      if (selected.startsWith(lastWord)) {
        const newInput = [...parts.slice(0, -1), selected].join(" ");
        this.inputManager.setValue(newInput);
      } else {
        const newInput = [...parts, selected].join(" ");
        this.inputManager.setValue(newInput);
      }
      e.preventDefault();
    } else if (e.ctrlKey) {
      this.scrollOutput("up");
      e.preventDefault();
    } else if (this.historyManager.hasHistory()) {
      this.inputManager.setValue(this.historyManager.historyGetPrevious());
      e.preventDefault();
    }
  }

  private handleArrowDown(e: KeyboardEvent): void {
    if (this.suggestionSystem.hasSuggestions()) {
      const selected = this.suggestionSystem.selectNext();
      this.suggestionSystem.displaySuggestions();
      const suggestionInput = this.suggestionSystem.getSuggestionsInput();
      const parts = suggestionInput.split(" ");
      const lastWord = parts[parts.length - 1];
      if (selected.startsWith(lastWord)) {
        const newInput = [...parts.slice(0, -1), selected].join(" ");
        this.inputManager.setValue(newInput);
      } else {
        const newInput = [...parts, selected].join(" ");
        this.inputManager.setValue(newInput);
      }
      e.preventDefault();
    } else if (e.ctrlKey) {
      this.scrollOutput("down");
      e.preventDefault();
    } else if (this.historyManager.hasHistory()) {
      this.inputManager.setValue(this.historyManager.historyGetNext());
      e.preventDefault();
    }
  }

  private scrollOutput(direction: "up" | "down"): void {
    const elements = HtmlElementsUtils.getElements();

    const scrollAmount = 20;
    if (direction === "down") {
      elements.output.scrollTop += scrollAmount;
    } else {
      elements.output.scrollTop -= scrollAmount;
    }
  }
  private handleCommand(input: string): void {
    this.commandManager.executeCommand(input);
  }
}
