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

  // Archivio sul tuo account Claude (quando l'app è aperta da claude.ai): resta anche cambiando dispositivo.
  let cloud = null; // { db, base }
  const MAX_DOC = 240000;
  function withTimeout(p, ms) { return Promise.race([p, new Promise((r) => setTimeout(() => r(null), ms))]); }
  async function initCloud() {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    try {
      const [db, user] = await withTimeout(Promise.all([window.claude.use('db'), window.claude.use('user')]), 10000) || [];
      if (!db || !user) return;
      const id = await withTimeout(user.id(), 8000);
      if (!id) return;
      cloud = { db, base: 'data/users/' + id };
    } catch (e) { cloud = null; }
  }
  const readyP = initCloud();
  const cloudRef = (store, id) => cloud.db.collection(cloud.base).doc(store + '~' + id);

  const local = {
    all(store) { return tx(store, 'readonly', (s) => s ? req2p(s.getAll()) : Array.from(mem[store].values())); },
    get(store, id) { return tx(store, 'readonly', (s) => s ? req2p(s.get(id)) : mem[store].get(id)); },
    put(store, obj) { return tx(store, 'readwrite', (s) => { if (s) s.put(obj); else mem[store].set(obj.id, obj); return obj; }); },
    del(store, id) { return tx(store, 'readwrite', (s) => { if (s) s.delete(id); else mem[store].delete(id); }); }
  };
  // una scrittura alla volta per documento
  const chains = new Map();
  function serial(key, fn) {
    const prev = chains.get(key) || Promise.resolve();
    const next = prev.catch(() => {}).then(fn);
    chains.set(key, next);
    return next;
  }

  const Store = {
    ready() { return readyP; },
    async all(store) {
      const loc = await local.all(store).catch(() => []);
      if (!cloud) return loc;
      try {
        const snap = await withTimeout(cloud.db.collection(cloud.base).where('kind', '==', store).get(), 10000);
        if (!snap) return loc;
        const map = new Map(loc.map((o) => [o.id, o]));
        snap.docs.forEach((d) => { const v = d.data(); if (v && v.obj) map.set(v.obj.id, JSON.parse(JSON.stringify(v.obj))); });
        return Array.from(map.values());
      } catch (e) { return loc; }
    },
    get(store, id) { return local.get(store, id); },
    async put(store, obj) {
      await local.put(store, obj).catch(() => {});
      if (cloud) {
        const body = { kind: store, obj };
        if (JSON.stringify(body).length < MAX_DOC) await serial(store + obj.id, () => cloudRef(store, obj.id).set(body)).catch(() => {});
      }
      return obj;
    },
    async del(store, id) {
      await local.del(store, id).catch(() => {});
      if (cloud) await serial(store + id, () => cloudRef(store, id).delete()).catch(() => {});
    },
    get persistent() { return !!cloud || !useMem; },
    get cloud() { return !!cloud; }
  };
  window.Store = Store;
})();
