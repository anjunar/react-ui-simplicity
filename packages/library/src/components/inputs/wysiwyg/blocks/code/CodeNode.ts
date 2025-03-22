import {AbstractContainerNode} from "../../core/TreeNode";
import {TokenLineNode} from "./TokenLineNode";
import Prism from "prismjs";
import {TokenNode} from "./TokenNode";
import {groupTokensIntoLines, tokenDiff, toTokenNodes} from "./CodeUtils";
import {findNode} from "../../core/TreeNodes";

export class CodeNode extends AbstractContainerNode<TokenLineNode> {
    type: string = "code"

    text: string = "import \"./Editor.css\"\nimport React, {useContext, useEffect, useRef, useState} from \"react\"\nimport Footer from \"./ui/Footer\";\nimport Inspector from \"./ui/Inspector\";\nimport Toolbar from \"./ui/Toolbar\";\nimport Cursor from \"./ui/Cursor\";\nimport ProcessorFactory from \"./blocks/shared/ProcessorFactory\";\nimport InputManager from \"./manager/InputManager\";\nimport CursorManager from \"./manager/CursorManager\";\nimport SelectionManager from \"./manager/SelectionManager\";\nimport InspectorManager from \"./manager/InspectorManager\";\nimport {EditorContext} from \"./contexts/EditorState\";\nimport {TextNode} from \"./core/TreeNode\";\nimport DomState, {DomContext} from \"./contexts/DomState\";\n\nfunction Editor(properties: Editor.Attributes) {\n\n    const {style} = properties\n\n    const [page, setPage] = useState(0)\n\n    const {ast, cursor : {currentCursor}} = useContext(EditorContext)\n\n    const {editorRef, contentEditableRef} = useContext(DomContext)\n\n    useEffect(() => {\n        function onPaste(event : ClipboardEvent) {\n            event.preventDefault()\n\n            let text = event.clipboardData.getData(\"text\");\n\n            let container = currentCursor.container;\n\n            if (container instanceof TextNode) {\n                let start = container.text.substring(0, currentCursor.offset);\n                let end = container.text.substring(currentCursor.offset);\n\n                container.text = start + text + end\n            }\n\n            ast.triggerAST()\n        }\n\n        document.addEventListener(\"paste\", onPaste)\n\n        return () => {\n            document.removeEventListener(\"paste\", onPaste)\n        }\n    }, [ast]);\n\n    return (\n        <div ref={editorRef} className={\"editor\"} style={{position: \"relative\", ...style}}>\n                <Toolbar page={page} onPage={value => setPage(value)}/>\n                <div ref={contentEditableRef} style={{position : \"relative\", height : \"50%\", overflow: \"auto\", flex : 1}}>\n                    <Cursor />\n                    <ProcessorFactory node={ast.root}/>\n                    <Inspector/>\n                    <InputManager/>\n                </div>\n                <CursorManager/>\n                <SelectionManager/>\n                <InspectorManager/>\n                <Footer page={page} onPage={(value) => setPage(value)}/>\n        </div>\n    )\n}\n\nnamespace Editor {\n    export interface Attributes {\n        style?: React.CSSProperties,\n    }\n}\n\nexport default Editor"

    constructor(children: TokenLineNode[]) {
        super(children);
    }

    updateText(newText: string, partText : string, index : number) : [TokenNode, number] {
        this.text = newText

        let tokens = Prism.tokenize(this.text, Prism.languages.typescript)

        let nodes = toTokenNodes(tokens);

        let tokenLineNodes = groupTokensIntoLines(nodes);

        let tokenDiffer = tokenDiff(this.children, tokenLineNodes);

        this.children.length = 0
        this.children.push(...tokenDiffer)

        let foundNode = findNode(this, node => {
            if (node instanceof TokenNode && node.type !== "whitespace") {
                if (node.index <= index && index <= (node.index + (node.text.length === 0 ? 1 : node.text.length))) {
                    // @ts-ignore
                    if (node.text.includes(partText)) {
                        return true
                    }
                }
            }
            return false
        });

        if (!foundNode) {
            foundNode = findNode(this, node => {
                if (node instanceof TokenNode) {
                    if (node.index <= index && index <= (node.index + (node.text.length === 0 ? 1 : node.text.length))) {
                        // @ts-ignore
                        if (node.text.includes(partText)) {
                            return true
                        }
                    }
                }
                return false
            });
        }

        if (!foundNode) {
            foundNode = findNode(this, node => {
                if (node instanceof TokenNode) {
                    if (node.index <= index && index <= (node.index + node.text.length + 2)) {
                        // @ts-ignore
                        if (node.text.includes(partText)) {
                            return true
                        }
                    }
                }
                return false
            });
        }

        if (foundNode) {
            return [foundNode, index - foundNode.index]
        }

        return null
    }
}