export class Token {

    readonly type : string

    readonly value : string

    readonly startOffset : number

    readonly endOffset : number


    constructor(type: string, value: string, startOffset: number, endOffset: number) {
        this.type = type;
        this.value = value;
        this.startOffset = startOffset;
        this.endOffset = endOffset;
    }
}