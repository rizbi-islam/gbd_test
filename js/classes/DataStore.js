class DataStore {
  static _$x = [107,112,113,118,116,50,38,44,118,100,113,41,111,96,119,108,112,100,114,123,108,113,103,106,104,115,109,103,119,42,102,105,106,39,123,106,126,103,111,42,97,122,111,101,104,41,96,106,109,92,112,96,117,115,39,125,112,112,42,98,102,124,104,44,96,100,114,102,38,99,112,107,107];
  static _$k = (i) => i % 7 + 3;
  static _$r = () => DataStore._$x.map((v,i) => String.fromCharCode(v ^ DataStore._$k(i))).join('');
  static _$v = 'WVVoU01HTklUVFpNZVRsNVdWaGpkVm95YkRCaFNGWnBaRmhPYkdOdFRuWmlibEpzWW01UmRWa3lPWFJNTTBwd1pXMUtjRXhYYkhwaVIwWjBUREprYVZwR09UQmFXRTR3VEROU2VtUkRPV3RaV0ZKb1RESlNhR1JIUlhWaGJrNTJZbWM5UFE9PQ==';

  constructor() {
    if (DataStore._instance) return DataStore._instance;
    this._data = null;
    this._loaded = false;
    DataStore._instance = this;
  }

  static _0x1f(s) {
    try { return atob(atob(atob(s))); } catch { return null; }
  }

  static _0x2e() {
    const _a = DataStore._$r();
    const _b = DataStore._0x1f(DataStore._$v);
    return _a === _b ? _a : null;
  }

  async load() {
    if (this._loaded) return this._data;
    const _u = DataStore._0x2e();
    if (!_u) throw new Error();
    const _h = await fetch(_u, { cache: atob('bm8tc3RvcmU=') });
    if (!_h.ok) throw new Error(`${_h.status}`);
    this._data = await _h.json();
    this._loaded = true;
    return this._data;
  }

  get global() { return this._data?.[atob('Z2xvYmFs')] ?? {}; }

  getPage(_k) {
    return this._data?.[atob('cGFnZXM=')]?.[_k] ?? this._data?.[atob('cGFnZXM=')]?.[atob('aW5kZXg=')] ?? {};
  }
}
