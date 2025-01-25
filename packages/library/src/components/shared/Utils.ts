export function classes(className : string, value : string) {
    return value + (className ? " " + className : "")
}

export function debounce<T extends Function>(cb: T, wait = 20) {
    let h : any = 0;
    let callable = (...args: any) => {
        clearTimeout(h);
        h = setTimeout(() => cb(...args), wait);
    };
    return <T>(<any>callable);
}


