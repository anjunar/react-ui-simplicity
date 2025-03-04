import React from "react";
import {Editor} from "react-ui-simplicity";
import {ListProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/list/ListProvider";

export default function WysiwygPage() {
    let listProvider = new ListProvider();

    return (
        <div className={"wysiwyg-page"} style={{height : "calc(100% - 20px)", padding : "10px"}}>
            <Editor style={{height : "100%"}} providers={[listProvider]}/>
        </div>
    )
}