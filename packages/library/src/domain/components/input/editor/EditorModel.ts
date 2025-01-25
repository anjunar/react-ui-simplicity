import Entity from "../../../../mapper/annotations/Entity";
import Basic from "../../../../mapper/annotations/Basic";

@Entity("Editor")
export default class EditorModel {

    $type = "Editor"

    @Basic()
    html : string

    @Basic()
    text : string

}