export class Rule {

    readonly type : string

    readonly regex : RegExp

    constructor(type: string, regex: RegExp) {
        this.type = type;
        this.regex = regex;
    }

}