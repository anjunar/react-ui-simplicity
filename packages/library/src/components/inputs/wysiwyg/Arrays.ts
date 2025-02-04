export function arraysAreEqual<T extends { id: any }>(arr1: T[], arr2: T[]): boolean {
    return arr2.every((item, index) => (arr1.findIndex(it => it.id === item.id) > - 1));
}

export function findKeyByValue<T extends { id: any }>(record: Record<string, T[]>, value: T[]): string | undefined {
    return Object.entries(record).find(([, v]) => arraysAreEqual(v, value))?.[0];
}

export function groupByConsecutiveMulti<T>(
    array: T[],
    keyFns: ((item: T) => any)[]
): { groups: T[][], record: Record<string, T[]> } {

    const groups: T[][] = [];
    const record: Record<string, T[]> = {};

    let lastKey: string | null = null;

    array.forEach(item => {
        const key = keyFns.map(fn => fn(item)).join("|");

        if (lastKey !== key) {
            groups.push([]);
            lastKey = key;
        }

        groups[groups.length - 1].push(item);
        record[key] = [...(record[key] || []), item];
    });

    return { groups, record };
}
