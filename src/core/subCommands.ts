import { BaseCommand } from "./baseCommand";

export class SubCommands {
  private readonly subCommands: Map<string, BaseCommand> = new Map();
  public isStandalone: boolean = false;

  public addSubCommand(subCommand: BaseCommand): void {
    this.subCommands.set(subCommand.name, subCommand);
  }
  public addSubCommandWithName(name: string, subCommand: BaseCommand): void {
    this.subCommands.set(subCommand.name, subCommand);
  }
  public getSubCommand(subCommandName: string): BaseCommand | undefined {
    return this.subCommands.get(subCommandName);
  }

  public getSubCommands(): BaseCommand[] {
    return Array.from(this.subCommands.values());
  }
  public getSubCommandNames(): string[] {
    return Array.from(this.subCommands.keys());
  }

  public getSubCommandsWithNames(): [string, BaseCommand][] {
    return Array.from(this.subCommands.entries());
  }

  public hasSubCommand(subCommandName: string): boolean {
    return this.subCommands.has(subCommandName);
  }

  public removeSubCommand(subCommandName: string): void {
    this.subCommands.delete(subCommandName);
  }

  public clearSubCommands(): void {
    this.subCommands.clear();
  }

  public getSubCommandCount(): number {
    return this.subCommands.size;
  }

  public getSubCommandNamesString(): string {
    return Array.from(this.subCommands.keys()).join(", ");
  }

}
