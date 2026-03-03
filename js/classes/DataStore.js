/**
 * DataStore — Singleton responsible for loading and caching all site data.
 * Single source of truth for content consumed by all other classes.
 */
class DataStore {
  constructor() {
    if (DataStore._instance) return DataStore._instance;
    this._data = null;
    this._loaded = false;
    DataStore._instance = this;
  }

  /**
   * Fetch data from JSON source and cache in memory.
   * @param {string} url  Path to the JSON data file.
   * @returns {Promise<Object>}
   */
  async load(url = 'data/data.json') {
    if (this._loaded) return this._data;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
      this._data = await res.json();
      this._loaded = true;
      return this._data;
    } catch (err) {
      console.error('[DataStore] Failed to load data:', err);
      throw err;
    }
  }

  /** @returns {Object} The full raw data object. */
  get all() { return this._data; }

  /** @returns {Object} Global site data (header, hero, footer). */
  get global() { return this._data?.global ?? {}; }

  /**
   * Get page-specific data by page key.
   * @param {string} pageKey  e.g. "index", "about-us", "ssl"
   * @returns {Object}
   */
  getPage(pageKey) {
    return this._data?.pages?.[pageKey] ?? this._data?.pages?.['index'] ?? {};
  }
}
