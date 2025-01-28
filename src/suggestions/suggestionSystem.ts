import { CommandManager } from "../core/commandManager";
import { visibleSuggestionCount } from "../models/constants";
import { HTMLElements, State } from "../models/types";
import { StateManager } from "../state/stateManager";
import { HtmlElementsUtils } from "../utils/htmlElementsUtils";

export class SuggestionSystem {
  private readonly stateManager = StateManager.getInstance();
  private readonly commandManager = new CommandManager();
  private elements!: HTMLElements;

  public initializeElements(): void {
    if (!this.elements) {
      this.elements = HtmlElementsUtils.getElements();
    }
  }

  public displaySuggestions(): void {
    this.initializeElements();
    const state = this.stateManager.getState<State>();
    this.elements.suggestionDisplay.innerHTML = "";
    const endIndex = Math.min(
      state.suggestionStartIndex + visibleSuggestionCount,
      state.suggestions.length
    );

    state.suggestions
      .slice(state.suggestionStartIndex, endIndex)
      .forEach((suggestion, index) => {
        const item = document.createElement("div");
        item.textContent = suggestion;
        item.className = `suggestion-item ${
          index + state.suggestionStartIndex === state.selectedIndex
            ? "selected"
            : ""
        }`;
        this.elements.suggestionDisplay.appendChild(item);
      });

    this.elements.suggestionDisplay.style.display = "block";
  }

  public clearSuggestions(): void {
    const state = this.stateManager.getState<State>();
    this.initializeElements();
    state.suggestions = [];
    this.elements.suggestionDisplay.innerHTML = "";
    this.elements.suggestionDisplay.style.display = "none";
    state.suggestionStartIndex = 0;
  }

  public hasSuggestions(): boolean {
    const state = this.stateManager.getState<State>();
    return state.suggestions.length > 0;
  }

  public getSuggestionsInput(): string {
    const state = this.stateManager.getState<State>();
    return state.suggestionInput;
  }
  public selectedIndex(): number {
    const state = this.stateManager.getState<State>();
    return state.selectedIndex;
  }

  public hasAnySelected(): boolean {
    return this.selectedIndex() >= 0;
  }
  public getSelected(): string {
    const state = this.stateManager.getState<State>();
    return state.suggestions[state.selectedIndex];
  }
  public selectPrevious(): string {
    const state = this.stateManager.getState<State>();

    state.selectedIndex =
      (state.selectedIndex - 1 + state.suggestions.length) %
      state.suggestions.length;
    if (state.selectedIndex < state.suggestionStartIndex) {
      state.suggestionStartIndex--;
    }

    return this.getSelected();
  }
  public selectNext(): string {
    const state = this.stateManager.getState<State>();
    state.selectedIndex = (state.selectedIndex + 1) % state.suggestions.length;
    if (
      state.selectedIndex >=
      state.suggestionStartIndex + visibleSuggestionCount
    ) {
      state.suggestionStartIndex++;
    }

    return this.getSelected();
  }

  //TODO: Autocomplete te bazı sorunlar var iyileştirlmesi gereken
  // suggestions ve autocomplete ile interactif olmalı
  //co tab "co config" getiriyor, config getirmesi lazım mesela
  //tab ile seçim yapılmalı, comamnd execute etmemeli sadece input'a basmalı, enter ile seçilirse command execute edilebilir
  public filter(input: string): string {
    const state = this.stateManager.getState<State>();
    state.suggestions = this.commandManager.getAvailableCommands(input);
    state.suggestionInput = input;
    state.selectedIndex = -1;

    if (state.suggestions.length > 0) {
      state.selectedIndex = 0;
      if (state.suggestions.length === 1) {
        return state.suggestions[0];
      } else {
        this.displaySuggestions();
      }
    } else {
      this.clearSuggestions();
    }
    return input;
  }
}
