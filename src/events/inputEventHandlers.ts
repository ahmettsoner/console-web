import { SuggestionSystem } from "../suggestions/suggestionSystem";
import { InputManager } from "../inputOutput/inputManager";

export class InputEventHandler {
  private readonly suggestionSystem: SuggestionSystem = new SuggestionSystem();
  private readonly inputManager: InputManager = new InputManager();

  public handleInput(e: Event): void {
    const event = e as InputEvent;
    if (this.suggestionSystem.hasSuggestions()) {
      const input = this.inputManager.getValue();
      this.suggestionSystem.filter(input);
      if (this.suggestionSystem.hasSuggestions()) {
        const selected = this.suggestionSystem.getSelected();
        this.suggestionSystem.displaySuggestions();
        const suggestionInput = this.suggestionSystem.getSuggestionsInput();
        const parts = suggestionInput.split(" ");
        const lastWord = parts[parts.length - 1];
        if (event.type === "insertText") {
          if (selected.startsWith(lastWord)) {
            const newInput = [...parts.slice(0, -1), selected].join(" ");
            this.inputManager.setValue(newInput);
          } else {
            const newInput = [...parts, selected].join(" ");
            this.inputManager.setValue(newInput);
          }
        }
      }
    }
  }
}
