import React from "react";
import {Editor} from "react-ui-simplicity";
import {ListProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/list/ListProvider";
import {ImageProvider} from "react-ui-simplicity/src/components/inputs/wysiwyg/blocks/image/ImageProvider";

export default function WysiwygPage() {
    return (
        <div className={"wysiwyg-page"} style={{height : "calc(100% - 20px)", padding : "10px"}}>
            <Editor style={{height : "100%"}} providers={[new ListProvider(), new ImageProvider()]}/>
        </div>
    )
}