import "./VerticalScrollbar.css"
import React, {CSSProperties, useLayoutEffect, useRef} from "react"

function VerticalScrollbar(properties : VerticalScrollbar.Attributes) {

    const { className, onPosition, position, ...rest } = properties

    const elementRef = useRef(document.createElement("div"))
    const cursorRef = useRef(document.createElement("div"))

    const slider = {
        get position() {
            if (cursorRef.current && elementRef.current) {
                let cursor = cursorRef.current
                let top = cursor.offsetTop
                return top / (elementRef.current.offsetHeight - 16)
            }
            return -1
        },

        set position(value) {
            if (cursorRef.current && elementRef.current) {
                let cursor = cursorRef.current
                let number = (elementRef.current.offsetHeight - 16) * value
                cursor.style.top = number + "px"
            }
        }
    }

    useLayoutEffect(() => {
        slider.position = position
    }, [position])

    const sliderVertical = (event : any) => {
        let cursor = cursorRef.current
        let element = elementRef.current

        if (cursor && element) {
            let delta = cursor.offsetTop,
                pointer = cursor.offsetTop

            let elementDrag = (event :any) => {
                event.preventDefault()
                delta = pointer - event.clientY
                pointer = event.clientY
                let computedStyle = Number.parseInt(
                    window.getComputedStyle(cursor).top.replace("px", "")
                )
                let number = computedStyle - delta
                if (number < 0) {
                    number = 0
                }
                if (number > element.offsetHeight - 16) {
                    number = element.offsetHeight - 16
                }
                let position = number / (element.offsetHeight - 16)
                slider.position = position
                if (onPosition) {
                    onPosition({
                        value: position,
                        direction: delta > 0 ? "top" : "bottom"
                    })
                }
            }

            let closeDragElement = () => {
                document.removeEventListener("mouseup", closeDragElement)
                document.removeEventListener("mousemove", elementDrag)
            }

            event.preventDefault()
            pointer = event.clientY
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    return (
        <div
            ref={elementRef}
            className={(className ? className + " " : "") + "scrollbar-vertical"}
            {...rest}
        >
            <div
                ref={cursorRef}
                className="cursor"
                onMouseDown={sliderVertical}
            ></div>
        </div>
    )
}

namespace VerticalScrollbar {
    export interface Attributes {
        className? : string
        onPosition? : any
        position? : number
        style? : CSSProperties
    }
}

export default VerticalScrollbar