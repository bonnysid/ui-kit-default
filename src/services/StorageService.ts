type ClearProps = {
  includedKeys?: string[];
  excludedKeys?: string[];
};

export class StorageService {
  private storage: Storage;

  constructor(storage: Storage = window.localStorage) {
    this.storage = storage;
  }

  public parseValue<T = string>(value: string | null): T | null {
    try {
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  public setItem<D = unknown>(key: string, value: D): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  public getItem<T = string>(key: string): T | null {
    const value = this.storage.getItem(key);
    return this.parseValue<T>(value);
  }

  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  public clear(props?: ClearProps): void {
    if (!props) {
      this.storage.clear();
    }

    if (props?.includedKeys?.length) {
      Object.keys(localStorage).forEach((key) => {
        if (props.includedKeys?.includes(key)) {
          this.removeItem(key);
        }
      });
    }

    if (props?.excludedKeys?.length) {
      Object.keys(localStorage).forEach((key) => {
        if (!props.excludedKeys?.includes(key)) {
          this.removeItem(key);
        }
      });
    }
  }

  public getKey(index: number): string | null {
    const value = this.storage.key(index);
    return this.parseValue(value);
  }

  public getLength(): number {
    return this.storage.length;
  }
}
