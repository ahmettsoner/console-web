import { CommandManager } from "./core/commandManager";
import { UIComponents } from "./components/uiComponents";
import { ThemeManager } from "./theme/themeManager";
import { OutputManager, OutputStatuses } from "./inputOutput/outputManager";
import { StateManager } from "./state/stateManager";
import { InputManager } from "./inputOutput/inputManager";
import { KeydownEventHandler } from "./events/keyDownEventHandlers";
import { InputEventHandler } from "./events/inputEventHandlers";
import { ContextMenuEventHandler } from "./events/contextMenuEventHandlersx";
import { BaseCommand } from "./core/baseCommand";

export default class Terminal {
  private readonly stateManager = StateManager.getInstance();
  private readonly commandManager = new CommandManager();
  private readonly uiComponents = new UIComponents();
  private readonly themeManager: ThemeManager = new ThemeManager();
  private readonly outputManager: OutputManager = new OutputManager();
  private readonly inputManager: InputManager = new InputManager();

  public async init() {
    await this.uiComponents.loadTerminalUI();

    this.initialize();
  }
  public addCommand<T extends BaseCommand>(
    ...commandClasses: (new () => T)[]
  ): void {
    if (commandClasses) {
      commandClasses.forEach((CommandClass) => {
        this.commandManager.addCommand(CommandClass);
      });
    }
  }

  private initialize(): void {
    this.themeManager.initializeTheme();

    this.stateManager.setState({
      // commandHistory: [],
      // historyIndex: -1,
      suggestions: [],
      selectedIndex: -1,
      suggestionStartIndex: 0,
    });

    // Use event handlers
    const keydownHandler = new KeydownEventHandler();
    this.inputManager.addKeydownListener(
      keydownHandler.handleKeydown.bind(keydownHandler)
    );
    const inputHandler = new InputEventHandler();
    this.inputManager.addInputListener(
      inputHandler.handleInput.bind(inputHandler)
    );

    const contextMenuHandler = new ContextMenuEventHandler();
    this.inputManager.addContextMenuListener(
      contextMenuHandler.handleContextMenu.bind(contextMenuHandler)
    );
  }

  public input(command: string) {
    this.commandManager.executeCommand(command);
  }
  public output(
    messages: string[],
    status: OutputStatuses = OutputStatuses.Info
  ) {
    this.outputManager.output(messages, status);
  }
}
