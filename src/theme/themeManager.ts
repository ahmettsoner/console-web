import { Theme } from "../models/types";
import { HtmlElementsUtils } from "../utils/htmlElementsUtils";

export class ThemeManager {
  private readonly availableThemes: Theme[] = ["dark", "light"];

  public initializeTheme() {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    this.setTheme(storedTheme ?? this.availableThemes[0]);
  }

  public getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  public setTheme(theme: Theme): void {
    const elements = HtmlElementsUtils.getElements();
    if (this.availableThemes.includes(theme)) {
      elements.body.classList.remove(
        ...this.availableThemes.map((t) => `theme-${t}`)
      );
      elements.body.classList.add(`theme-${theme}`);
      localStorage.setItem("theme", theme);
    } else {
      console.log(`Theme ${theme} is not available`);
    }
  }
}
