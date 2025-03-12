import {Token} from "./Token";
import {Literal} from "./Literal";

const tokens : Token[] = [
    new Token("ul", /^(\s*)\* /ym),
    new Token("h1", /# (\S+)/y),
    new Token("h2", /## (\S+)/y),
    new Token("h3", /### (\S+)/y),
    new Token("italic", /\*([^* ]+)\*/y),
    new Token("bold", /\*\*([^* ]+)\*\*/y),
    new Token("bold-italic", /\*\*\*([^* ]+)\*\*\*/y),
    new Token("text", /([\S ]+)/y),
    new Token("newLine", /(\n)/y),
    new Token("whitespace", /(\s+)/y)
]

export function tokenizer(text : string) {

    let literals : Literal[] = []
    let oldLength = - 1
    let index = 0

    while (index <  text.length) {

        for (const token of tokens) {
            token.regex.lastIndex = index
            let exec = token.regex.exec(text);
            if (exec) {
                let value = exec[1]
                index = exec.index + exec[0].length
                literals.push(new Literal(token.type, value))
                break
            }
        }

        if (oldLength === literals.length) {
            break
        }

        oldLength = literals.length

    }

    return literals

}