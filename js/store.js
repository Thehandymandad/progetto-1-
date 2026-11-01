/* Archivio locale (IndexedDB) per locandine, modelli e immagini caricate.
   Tutto resta sul dispositivo: niente server, niente costi. */
(function () {
  'use strict';
  const NAME = 'locandine-sacra-famiglia';
  const STORES = ['docs', 'models', 'uploads'];
  let dbp = null;
  const mem = { docs: new Map(), models: new Map(), uploads: new Map() };
  let useMem = false;

  function open() {
    if (dbp) return dbp;
    dbp = new Promise((resolve) => {
      if (!window.indexedDB) { useMem = true; resolve(null); return; }
      let req;
      try { req = indexedDB.open(NAME, 1); } catch (e) { useMem = true; resolve(null); return; }
      req.onupgradeneeded = () => {
        const db = req.result;
        STORES.forEach((s) => { if (!db.objectStoreNames.contains(s)) db.createObjectStore(s, { keyPath: 'id' }); });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => { useMem = true; resolve(null); };
    });
    return dbp;
  }

  function tx(store, mode, fn) {
    return open().then((db) => {
      if (useMem || !db) return fn(null);
      return new Promise((resolve, reject) => {
        const t = db.transaction(store, mode);
        const s = t.objectStore(store);
        let out;
        Promise.resolve(fn(s)).then((r) => { out = r; });
        t.oncomplete = () => resolve(out);
        t.onerror = () => reject(t.error);
      });
    });
  }
  function req2p(r) { return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }

  const Store = {
    all(store) {
      return tx(store, 'readonly', (s) => s ? req2p(s.getAll()) : Array.from(mem[store].values()));
    },
    get(store, id) {
      return tx(store, 'readonly', (s) => s ? req2p(s.get(id)) : mem[store].get(id));
    },
    put(store, obj) {
      return tx(store, 'readwrite', (s) => { if (s) s.put(obj); else mem[store].set(obj.id, obj); return obj; });
    },
    del(store, id) {
      return tx(store, 'readwrite', (s) => { if (s) s.delete(id); else mem[store].delete(id); });
    },
    get persistent() { return !useMem; }
  };
  window.Store = Store;
})();
