import "./Wysiwyg.css"
import React, {useRef, useState} from "react"
import Toolbar from "./toolbar/Toolbar";
import Footer from "./footer/Footer";

function Wysiwyg(properties: Wysiwyg.Attributes) {

    const [page, setPage] = useState(0)

    const contentEditable = useRef<HTMLDivElement>(null);

    return (
        <div className={"wysiwyg"}>
            <Toolbar page={page} contentEditable={contentEditable}/>
            <div ref={contentEditable} suppressContentEditableWarning={true} contentEditable={true} style={{flex: 1, padding: "12px", whiteSpace: "pre"}}>
                <p>
                    <br/>
                </p>
            </div>
            <Footer page={page} onPage={(value) => setPage(value)}/>
        </div>

    )
}

namespace Wysiwyg {
    export interface Attributes {
    }

    export interface EventHolder {
        handled: boolean
        event: KeyboardEvent,
        trigger: () => void
    }
}

export default Wysiwyg