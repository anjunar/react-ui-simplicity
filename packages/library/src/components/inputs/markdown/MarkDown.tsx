import "./MarkDown.css"
import React, {CSSProperties, RefObject, useEffect, useMemo, useRef, useState} from "react"
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import {Marked, Token} from "marked";
import FileStore = MarkDown.FileStore;

export const MarkDownContext = React.createContext<MarkDown.Context>({} as MarkDown.Context)

function MarkDown(properties: MarkDown.Attributes) {

    const {style} = properties

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const viewRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState(0)

    const [ast, setAst] = useState<Token[]>([])

    const [text, setText] = useState('**test**');

    const fileStore = useMemo<FileStore>(() => {
        return {files : []}
    }, []);

    const marked = useMemo(() => {
        let marked = new Marked();

        const renderer = {
            image({href, title, text} : {href : string, title : string, text : string}) : string {
                const imageData = fileStore.files.find(file => file.name === href)

                return `<img src="${imageData.data}" style="width: 100%" alt="${text}" title="${title || ''}">`;
            }
        };

        marked.use({ renderer });

        return marked
    }, []);

    useEffect(() => {
        setAst(marked.lexer(text))
    }, [text]);

    useEffect(() => {

        viewRef.current.innerHTML = marked.parser(ast)

    }, [ast]);

    return (
        <div className={"markdown-editor"} style={style}>
            <MarkDownContext.Provider value={{imageStore: fileStore, textAreaRef}}>
                <Toolbar page={page} onPage={value => setPage(value)}/>
                <textarea ref={textAreaRef} onInput={(event : any) => setText(event.target.value)} value={text} className={"content"}></textarea>
                <div ref={viewRef} className={"view"}></div>
                <Footer page={page} onPage={(value) => setPage(value)}/>
            </MarkDownContext.Provider>
        </div>
    )
}

namespace MarkDown {
    export interface Attributes {
        style? : CSSProperties
    }

    export interface EditorModel {
        fileStore : FileStore
        ast : Token[]
    }

    export interface File {
        name : string,
        type : string
        lastModified : number
        data : string
    }

    export interface FileStore {
        files : File[]
    }

    export interface Context {
        imageStore : FileStore
        textAreaRef : RefObject<HTMLTextAreaElement>
    }
}

export default MarkDown