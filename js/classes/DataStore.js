class DataStore {
  constructor() {
    if (DataStore._instance) return DataStore._instance;
    this._data   = null;
    this._loaded = false;
    DataStore._instance = this;
  }

  async load() {
    if (this._loaded) return this._data;
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error(`Failed to load data (${res.status})`);
    this._data   = await res.json();
    this._loaded = true;
    return this._data;
  }

  get global()  { return this._data?.global ?? {}; }

  getPage(key) {
    return this._data?.pages?.[key] ?? this._data?.pages?.['index'] ?? {};
  }
}
