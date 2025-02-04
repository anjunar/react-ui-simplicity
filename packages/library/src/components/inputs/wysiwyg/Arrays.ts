export function arraysAreEqual<T extends { id: any }>(arr1: T[], arr2: T[]): boolean {
    if (arr1.length !== arr2.length) return false;

    for (let i = 0; i < arr1.length; i++) {
        const item1 = arr1[i];
        const item2 = arr2[i];

        if (item1.id !== item2.id) {
            return false;
        }
    }

    return true;
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

    array.forEach(item => {
        const key = keyFns.map(fn => fn(item)).join("|");

        if (groups.length === 0 || keyFns.some(fn => fn(groups[groups.length - 1][0]) !== fn(item))) {
            groups.push([item]);
        } else {
            groups[groups.length - 1].push(item);
        }

        if (!record[key]) {
            record[key] = [];
        }
        record[key].push(item);
    });

    return { groups, record };
}