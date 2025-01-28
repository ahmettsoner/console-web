import { State } from "../models/types";
import { StateManager } from "../state/stateManager";

export class HistoryManager {
  private readonly stateManager = StateManager.getInstance();

  constructor() {
    this.loadHistory();
  }

  public loadHistory(): void {
    const state = this.stateManager.getState<State>();
    const history = localStorage.getItem("history");
    if (history) {
      state.commandHistory = JSON.parse(history);
    }
  }

  public historyClear(): void {
    this.stateManager.setState({ commandHistory: [], historyIndex: -1 });
  }
  public historyAdd(command: string): void {
    const state = this.stateManager.getState<State>();

    if (command.length > 0) {
      const existingIndex = state.commandHistory.indexOf(command);
      if (existingIndex > -1) {
        state.commandHistory.splice(existingIndex, 1);
      }

      state.commandHistory.push(command);
      state.historyIndex = -1;
    }

    this.stateManager.setState({
      commandHistory: state.commandHistory,
      historyIndex: state.historyIndex,
    });
    localStorage.setItem("history", JSON.stringify(state.commandHistory));
  }
  public historyGetPrevious(): string {
    const state = this.stateManager.getState<State>();
    if (state.commandHistory.length > 0) {
      if (state.historyIndex < state.commandHistory.length - 1) {
        state.historyIndex++;
        this.stateManager.setState({
          commandHistory: state.commandHistory,
          historyIndex: state.historyIndex,
        });
        return state.commandHistory[
          state.commandHistory.length - 1 - state.historyIndex
        ];
      }
    }
    this.stateManager.setState({
      commandHistory: state.commandHistory,
      historyIndex: state.historyIndex,
    });

    return "";
  }

  public hasHistory(): boolean {
    const state = this.stateManager.getState<State>();
    return state.commandHistory.length > 0;
  }
  public historyGetNext(): string {
    const state = this.stateManager.getState<State>();
    if (state.commandHistory.length > 0) {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        this.stateManager.setState({
          commandHistory: state.commandHistory,
          historyIndex: state.historyIndex,
        });
        return state.commandHistory[
          state.commandHistory.length - 1 - state.historyIndex
        ];
      } else {
        state.historyIndex = -1;
      }
    }
    this.stateManager.setState({
      commandHistory: state.commandHistory,
      historyIndex: state.historyIndex,
    });
    return "";
  }

  public getLastNCommands(n: number): string[] {
    const state = this.stateManager.getState<State>();
    const historyLength = state.commandHistory.length;

    if (n > historyLength) {
      n = historyLength;
    }

    return state.commandHistory.slice(historyLength - n, historyLength);
  }
}
