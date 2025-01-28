// import { CommandManager } from "../core/commandManager";
// import { State } from "../models/types";
// import { StateManager } from "../state/stateManager";
// import { SuggestionSystem } from "../suggestions/suggestionSystem";

// export class AutoCompleteSystem {
//   private readonly stateManager = StateManager.getInstance();
//   private readonly commandManager = new CommandManager();
//   private readonly suggestionSystem: SuggestionSystem = new SuggestionSystem();

//   public autoComplete(input: string): string {
//     const state = this.stateManager.getState<State>();
//     state.suggestions = this.commandManager.getAvailableCommands(input);
//     state.suggestionInput = input;
//     state.selectedIndex = 0;

//     if (state.suggestions.length > 0) {
//       if (state.suggestions.length === 1) {
//         return state.suggestions[0];
//       } else {
//         this.suggestionSystem.displaySuggestions();
//       }
//     } else {
//       this.suggestionSystem.clearSuggestions();
//     }
//     return input;
//   }
// }
