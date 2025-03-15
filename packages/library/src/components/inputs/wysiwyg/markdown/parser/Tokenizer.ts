import {Rule} from "./Rule";
import {Token} from "./Token";

const rules : Rule[] = [
    new Rule("ul", /^(\s*)\* /ym),
    new Rule("h1", /# (\S+)/y),
    new Rule("h2", /## (\S+)/y),
    new Rule("h3", /### (\S+)/y),
    new Rule("italic", /\*([^* ]+)\*/y),
    new Rule("bold", /\*\*([^* ]+)\*\*/y),
    new Rule("bold-italic", /\*\*\*([^* ]+)\*\*\*/y),
    new Rule("text", /([^*\n^#]+)/y),
    new Rule("text", /(\*)/y),
    new Rule("text", /(#)/y),
    new Rule("newLine", /(\n)/y),
    new Rule("whitespace", /(\s+)/y),
]

export function tokenizer(text : string) {

    let tokens : Token[] = []
    let oldLength = - 1
    let index = 0

    while (index <  text.length) {

        for (const token of rules) {
            token.regex.lastIndex = index
            let exec = token.regex.exec(text);
            if (exec) {
                let value = exec[1]
                index = exec.index + exec[0].length
                tokens.push(new Token(token.type, value, exec.index, index))
                break
            }
        }

        if (oldLength === tokens.length) {
            break
        }

        oldLength = tokens.length

    }

    return tokens

}