import { BaseCommand } from "./baseCommand";
import { HelpCommand } from "./help";
import { OutputManager, OutputStatuses } from "../inputOutput/outputManager";
import { CommandSystem } from "../models/types";
import { StateManager } from "../state/stateManager";

export class CommandManager {
  private readonly stateManager = StateManager.getInstance();
  private readonly outputManager!: OutputManager;

  constructor() {
    this.outputManager = new OutputManager();
  }

  public addCommand<T extends BaseCommand>(CommandClass: new () => T): void {
    const instance = new CommandClass();
    this.processCommand(instance);
  }

  private processCommand(instance: BaseCommand) {
    const commands = this.stateManager.getState<Map<string, ICommand>>(
      "commands",
      new Map()
    );

    commands.set(instance.getFullCommand(), instance);

    if (instance.name !== "help") {
      instance.subCommands.addSubCommand(new HelpCommand(instance));
    }

    if (!instance.hidden) {
      this.addCommandSet(instance.getFullCommand());
    }
    instance.aliases.forEach((alias) => {
      commands.set(alias, instance);
      this.addCommandSet(alias);
    });

    instance.subCommands.getSubCommands().forEach((subCommand, subName) => {
      this.processCommand(subCommand);
    });

    this.stateManager.setState<Map<string, ICommand>>(commands);
  }

  executeCommand(input: string): void {
    const commands = this.stateManager.getState<Map<string, BaseCommand>>(
      "commands",
      new Map()
    );
    const [commandName, ...args] = input.split(" ");
    const command = commands.get(commandName);

    if (command) {
      command.executeCommand(...args);
    } else {
      this.outputManager.outputCommand(
        [commandName, ...args].join(" "),
        [`Unknown command: ${input}`],
        OutputStatuses.Error
      );
    }
  }

  private addCommandSet(command: string) {
    const commandSystem = this.stateManager.getState<CommandSystem>(undefined, {
      availableCommands: [],
    });

    if (!commandSystem.availableCommands.includes(command)) {
      commandSystem.availableCommands.push(command);
      commandSystem.availableCommands.sort((a, b) => a.localeCompare(b));
      this.stateManager.setState({ commandSystem });
    }
  }

  // public getAvailableCommands(filter: string): string[] {
  //   const commandHierarchy = Array.from(
  //     this.stateManager
  //       .getState<Map<string, ICommand>>("commands", new Map())
  //       .values()
  //   )
  //     .map((cmd) => cmd as BaseCommand)
  //     .filter((cmd) => cmd.base === undefined);

  //   const commandParts = filter
  //     .split(" ")
  //     .map((part) => part.trim())
  //     .filter((part) => part !== "");

  //   if (commandParts.length === 0) {
  //     return [];
  //   }

  //   let currentCommands = commandHierarchy;

  //   // İlk parça ile eşleşen üst seviye komutları ve varsa alt komutları bulma
  //   const firstPart = commandParts[0];
  //   let baseCommand = currentCommands.find((cmd) => cmd.name === firstPart);

  //   if (baseCommand) {
  //     if (commandParts.length === 1) {
  //       // Sadece üst seviye komutla tam eşleşme varsa, alt komutları döndür
  //       return baseCommand.subCommands
  //         .getSubCommands()
  //         .map((cmd) => cmd.name)
  //         .sort((a, b) => a.localeCompare(b));
  //     } else {
  //       // Alt seviyede komut arama
  //       const secondPart = commandParts[1];
  //       const matchingSubCommands = baseCommand.subCommands
  //         .getSubCommands()
  //         .filter((subCmd) => subCmd.name.startsWith(secondPart));
  //       return matchingSubCommands
  //         .map((cmd) => cmd.name)
  //         .sort((a, b) => a.localeCompare(b));
  //     }
  //   } else {
  //     // İlk parça ile başlayan üst seviye komutları döndür
  //     return currentCommands
  //       .filter((cmd) => cmd.name.startsWith(firstPart))
  //       .map((cmd) => cmd.name)
  //       .sort((a, b) => a.localeCompare(b));
  //   }
  // }

  public getAvailableCommands(filter: string = ""): string[] {
    const commandHierarchy = Array.from(
      this.stateManager
        .getState<Map<string, BaseCommand>>("commands", new Map())
        .values()
    ).filter((cmd) => cmd.base === undefined);

    const commandParts = filter
      .split(" ")
      .map((part) => part.trim())
      .filter((part) => part !== "");

    if (commandParts.length === 0) {
      return commandHierarchy.filter((cmd) => !cmd.base).map((cmd) => cmd.name);
    }

    let currentCommands = commandHierarchy;
    let lastMatchingCommand: BaseCommand | null = null;

    for (let i = 0; i < commandParts.length; i++) {
      const part = commandParts[i];
      const foundCommand = currentCommands.find((cmd) => cmd.name === part);

      if (foundCommand) {
        lastMatchingCommand = foundCommand;
        currentCommands = foundCommand.subCommands.getSubCommands();
      } else if (lastMatchingCommand) {
        // Alt komutlar içinde kısmi eşleşme bul
        const suggestions = lastMatchingCommand.subCommands
          .getSubCommands()
          .filter((cmd) => cmd.name.startsWith(part))
          .map((cmd) => cmd.name);
        return suggestions.sort((a, b) => a.localeCompare(b));
      } else {
        // Eğer hiç eşleşme yoksa, mevcut seviyedeki kısmi eşleşmeleri döndür
        return currentCommands
          .filter((cmd) => cmd.name.startsWith(part))
          .map((cmd) => cmd.name)
          .sort((a, b) => a.localeCompare(b));
      }
    }

    // Eğer tüm parçalar işlendi ve son bir komut eşleştiyse, onun alt komutlarını döneriz
    if (lastMatchingCommand) {
      return lastMatchingCommand.subCommands
        .getSubCommands()
        .map((cmd) => cmd.name)
        .sort((a, b) => a.localeCompare(b));
    }

    return [];
  }
}
