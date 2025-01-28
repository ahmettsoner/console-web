export type Theme = 'dark' | 'light'

export interface CommandSystem {
    commands: string[]
    projects: string[]
    articles: string[]
    contacts: string[]
    configThemes: Theme[]
    availableCommands: string[]
}

export interface HTMLElements {
    body: HTMLElement
    terminal: HTMLElement
    output: HTMLElement
    commandInput: HTMLInputElement
    suggestionDisplay: HTMLElement
}

export interface State {
    commandHistory: string[]
    historyIndex: number
    suggestionInput: string
    suggestions: string[]
    selectedIndex: number
    suggestionStartIndex: number
}

