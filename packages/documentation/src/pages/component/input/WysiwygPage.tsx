import React from "react";
import {Editor} from "react-ui-simplicity";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height : "100%", padding : "10px"}}>
            <Editor style={{height : "100%"}}/>
        </div>
    )
}