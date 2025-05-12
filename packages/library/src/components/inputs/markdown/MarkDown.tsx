import "./MarkDown.css"
import React, {CSSProperties, RefObject, useEffect, useMemo, useRef, useState} from "react"
import Toolbar from "./ui/Toolbar";
import Footer from "./ui/Footer";
import {Token} from "marked";
import {factory, findNodesByOffsets} from "./parser/MarkedFactory";
import EditorModel = MarkDown.EditorModel;

export const MarkDownContext = React.createContext<MarkDown.Context>(null)

function MarkDown(properties: MarkDown.Attributes) {

    const {style} = properties

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const viewRef = useRef<HTMLDivElement>(null);

    const [page, setPage] = useState(0)

    const [model, setModel] = useState<EditorModel>({
        store: {
            files: []
        },
        ast: []
    })

    const [text, setText] = useState('**test**');

    const [cursor, setCursor] = useState<Token[]>(null)

    const marked = useMemo(() => {
        return factory(model)
    }, []);


    function onStoreClick(file: MarkDown.File) {
        let textArea = textAreaRef.current;

        let selectionStart = textArea.selectionStart;
        let selectionEnd = textArea.selectionEnd

        let pre = textArea.value.substring(0, selectionStart);
        let post = textArea.value.substring(selectionEnd);

        textArea.value = `${pre}![Picture](${file.name} "${file.name}")${post}`

        const event = new Event('input', { bubbles: true, cancelable: true});

        textArea.dispatchEvent(event);
    }

    function onSelect() {
        let nodesByOffsets = findNodesByOffsets(model.ast, textAreaRef.current.selectionStart, textAreaRef.current.selectionEnd);

        console.log(nodesByOffsets)

        setCursor(nodesByOffsets)
    }

    useEffect(() => {
        let ast = marked.lexer(text);

        setModel({
            store: model.store,
            ast: ast
        })

    }, [text]);

    useEffect(() => {

        viewRef.current.innerHTML = marked.parser(model.ast)

    }, [model]);

    return (
        <div className={"markdown-editor"} style={style}>
            <MarkDownContext.Provider value={{model: model, textAreaRef, cursor}}>
                <Toolbar page={page} onPage={value => setPage(value)}/>
                <textarea onSelect={onSelect} ref={textAreaRef} onInput={(event: any) => setText(event.target.value)} value={text} className={"content"}></textarea>
                <div>
                    {
                        model.store.files.map(file => <img title={file.name} src={file.data} style={{height: "32px"}} onClick={() => onStoreClick(file)}/>)
                    }
                </div>
                <div ref={viewRef} className={"view"}></div>
                <Footer page={page} onPage={(value) => setPage(value)}/>
            </MarkDownContext.Provider>
        </div>
    )
}

namespace MarkDown {
    export interface Attributes {
        style?: CSSProperties
    }

    export interface EditorModel {
        store: FileStore
        ast: Token[]
    }

    export interface File {
        name: string,
        type: string
        lastModified: number
        data: string
    }

    export interface FileStore {
        files: File[]
    }

    export interface Context {
        model: EditorModel
        textAreaRef: RefObject<HTMLTextAreaElement>
        cursor: Token[]
    }
}

export default MarkDown