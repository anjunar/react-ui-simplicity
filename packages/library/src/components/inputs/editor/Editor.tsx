import "./Editor.css"
import React, {CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react"
import Toolbar from "./Toolbar"
import {Model} from "../../shared/Model"
import Tabs from "../../layout/tabs/Tabs";
import Tab from "../../layout/tabs/Tab";
import EditorModel from "../../../domain/components/input/editor/EditorModel"
import {useInput} from "../../../hooks/UseInputHook";
import Inspector from "./inspector/Inspector";

function Editor(properties: Editor.Attributes) {

    const {name = "default", value, onChange, disabled, standalone = false, style, onModel, ...rest} = properties

    const [page, setPage] = useState(0)

    const [editable, setEditable] = useState(true)

    const selected = useMemo<{ range: any }>(() => {
        let selection = document.getSelection();
        if (selection && !selection.isCollapsed) {
            return {
                range: selection.getRangeAt(0)
            }
        }
        return {range: null}
    }, [])

    const contentRef = useRef(null)

    let [model, state, setState] = useInput(name, value, standalone);

    useEffect(() => {
        if (selected.range) {
            let selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(selected.range)
        }
    }, [page]);

    useLayoutEffect(() => {
        // For form validation -> Error messages
        model.callbacks.push(() => {
            if (onModel) {
                onModel(model)
            }
        })

        if (contentRef.current) {
            contentRef.current.addEventListener("input", () => {
                if (contentRef.current) {
                    let html = contentRef.current.innerHTML;
                    let text = contentRef.current.textContent;

                    if (html !== state?.html) {

                        let value = new EditorModel();
                        value.html = html
                        value.text = text
                        setState(value)

                        if (onChange) {
                            onChange(state)
                        }

                        if (onModel) {
                            onModel(model)
                        }

                    }
                }
            })
        }

        if (state) {
            contentRef.current.innerHTML = state.html
        }

        if (onModel) {
            onModel(model)
        }
    }, [])

    function onPage(value: number) {
        setPage(value)
    }

    useLayoutEffect(() => {
        if (page === 5) {
            setEditable(false)
        } else {
            setEditable(true)
        }
    }, [page])

    return (
        <div className={"editor"} style={{...style, display: "flex"}} {...rest}>
            {!disabled && <Toolbar page={page} style={{flex: "0 0 auto"}} editableContent={contentRef}/>}
            <div style={{
                overflow: "auto",
                flex: "1 1 auto",
                scrollbarColor: "var(--color-background-secondary) var(--color-background-primary)"
            }}>
                <div style={{minHeight: "calc(100% - 4px)", maxWidth: "100%", outline: 0}}
                     ref={contentRef}
                     className={"content"}
                     contentEditable={!disabled && editable}
                     onSelect={() => selected.range = (document.getSelection().getRangeAt(0))}
                >
                </div>
            </div>
            {
                !editable && (<Inspector contentRef={contentRef}/>)
            }
            <Tabs page={page} onPage={onPage}>
                <Tab selected={true}>
                    <span className={"material-icons"}>text_format</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>format_size</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>palette</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>construction</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>format_align_justify</span>
                </Tab>
                <Tab>
                    <span className={"material-icons"}>frame_inspect</span>
                </Tab>
            </Tabs>
        </div>
    )
}

namespace Editor {
    export interface Attributes {
        name?: string
        disabled?: boolean
        style?: CSSProperties,
        onModel?: (value: Model) => void
        value?: EditorModel
        onChange?: (value: EditorModel) => void
        standalone?: boolean
    }
}

export default Editor