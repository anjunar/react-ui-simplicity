export function openDatabase(dbName: string, version: number): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function add(db: IDBDatabase, table : string, entity: any): Promise<void> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readwrite");
        const store = transaction.objectStore(table);
        const request = store.add(entity);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export function get(db: IDBDatabase, table : string, id: number): Promise<any> {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(table, "readonly");
        const store = transaction.objectStore(table);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
