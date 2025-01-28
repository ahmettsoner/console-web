export class StateManager {
  private static readonly instances: Map<string | undefined, StateManager> = new Map();
  private readonly states: Map<string | undefined, any> = new Map();

  // Private constructor to prevent direct instantiation
  private constructor() {}

  // Modify the getInstance method to use undefined as the default key
  public static getInstance(key?: string): StateManager {
    if (!StateManager.instances.has(key)) {
      StateManager.instances.set(key, new StateManager());
    }
    return StateManager.instances.get(key)!;
  }

  // Generic method to get state, using undefined as default key
  public getState<T>(key?: string, defaultValue?: Partial<T>): T {
    if (!this.states.has(key)) {
      if (!defaultValue) {
        defaultValue = this.getDefaultState<T>();
      }
      this.states.set(key, defaultValue);
    }
    return this.states.get(key) as T;
  }

  // Generic method to set state, using undefined as default key
  public setState<T>(newState: Partial<T> | T, key?: string): void {
    const currentState = this.states.get(key) || ({} as T);
    const updatedState = { ...currentState, ...newState } as T;
    this.states.set(key, updatedState);
    console.log(`State for key '${key}' updated:`, updatedState);
  }

  // Default state generation
  private getDefaultState<U>(): U {
    return {} as U;
  }
}