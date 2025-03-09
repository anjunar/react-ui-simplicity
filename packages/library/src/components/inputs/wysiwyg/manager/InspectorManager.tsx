import React, {useEffect} from "react"

function InspectorManager(properties: InspectorManager.Attributes) {

    const {contentEditableRef, inputRef, editorRef, inspectorRef} = properties

    useEffect(() => {
        function onContextClick(event: MouseEvent) {
            event.stopPropagation();
            event.preventDefault();

            const container = editorRef.current;

            let viewport = document.getElementById("viewport") || document.querySelector("body");
            let boundingClientRect = viewport.getBoundingClientRect();

            const topOffset = event.clientY - container.offsetTop + container.scrollTop - boundingClientRect.top + 12;
            const leftOffset = event.clientX - container.offsetLeft + container.scrollLeft - boundingClientRect.left;

            const inspectorWidth = 150
            const containerWidth = container.offsetWidth;

            let adjustedLeftOffset = leftOffset;

            if (leftOffset + inspectorWidth > containerWidth) {
                adjustedLeftOffset = containerWidth - inspectorWidth;
            }

            inspectorRef.current.style.left = adjustedLeftOffset + "px"
            inspectorRef.current.style.top = topOffset + "px"
            inspectorRef.current.style.display = "block"
            inputRef.current.disabled = true
        }

        function onDocumentClick() {
            inspectorRef.current.style.display = "none"
            inputRef.current.disabled = false
        }

        document.addEventListener("click", onDocumentClick)
        contentEditableRef.current.addEventListener("contextmenu", onContextClick)
        return () => {
            document.removeEventListener("click", onDocumentClick)
            contentEditableRef.current.removeEventListener("contextmenu", onContextClick)
        }
    }, []);

    return (
        <div></div>
    )
}

namespace InspectorManager {
    export interface Attributes {
        editorRef: React.RefObject<HTMLDivElement>
        inputRef: React.RefObject<HTMLTextAreaElement>
        contentEditableRef: React.RefObject<HTMLDivElement>
        inspectorRef: React.RefObject<HTMLDivElement>
    }
}

export default InspectorManager
