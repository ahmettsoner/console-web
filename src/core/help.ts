import { OutputManager } from "../inputOutput/outputManager";
import { BaseCommand } from "./baseCommand";

export class HelpCommand extends BaseCommand {
  protected readonly outputManager = new OutputManager();

  constructor(baseCommand: BaseCommand) {
    super("help", baseCommand);
  }
  execute(...args: string[]): void {
    this.outputManager.outputCommand(
      `${this.base!.getFullCommand()} help`,
      this.base!.help()
    );
  }

  help(): string[] {
    return [];
  }
}
