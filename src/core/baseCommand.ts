import { OutputManager, OutputStatuses } from "../inputOutput/outputManager";
import { SubCommands } from "./subCommands";

export abstract class BaseCommand implements ICommand {
  // TODO: bu bilgiler json object olarak tek seferde command'a atanacak şekilde iyileştirilmeli
  public hidden: boolean = false;
  public name: string = "";
  public aliases: string[] = [];
  public readonly base: BaseCommand | undefined;
  public subCommands: SubCommands;
  protected readonly outputManager!: OutputManager;

  constructor(
    name: string,
    base: BaseCommand | undefined = undefined,
    aliases: string[] = []
  ) {
    this.base = base;
    this.name = name;
    this.aliases = aliases;
    this.subCommands = new SubCommands();
    this.outputManager = new OutputManager();
  }

  protected execute(...args: string[]): void {
    this.outputManager.outputCommand([this.name, ...args].join(" "), [
      ...this.help(),
    ]);
  }

  abstract help(): string[];

  public executeCommand(...args: string[]): void {
    const shouldSkipExecution = this.redirectToSubCommandsIfExists(args);
    if (!shouldSkipExecution) {
      this.execute(...args);
    }
  }

  private redirectToSubCommandsIfExists(args: string[]): boolean {
    if (args.length > 0) {
      const subCommand = this.subCommands.getSubCommand(args[0]);
      if (subCommand) {
        subCommand.executeCommand(...args.slice(1));
        return true;
      } else if (!this.subCommands.isStandalone) {
        this.outputManager.output(
          [
            `Error: Invalid subcommand '${args[0]}'.`,
            `Please use a valid subcommand. Use '${this.getFullCommand()} help' to see available commands.`,
          ],
          OutputStatuses.Error
        );
        return true;
      }
    }
    return false;
  }

  public getFullCommand(): string {
    if (this.base) {
      return `${this.base.getFullCommand()} ${this.name}`;
    } else {
      return this.name;
    }
  }
}
