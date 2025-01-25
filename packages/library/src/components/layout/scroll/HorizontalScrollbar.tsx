import "./HorizontalScrollbar.css"
import React, {CSSProperties, useLayoutEffect, useRef} from "react"

function HorizontalScrollbar(properties: HorizontalScrollbar.Attributes) {

    const { className, onPosition, position, ...rest } = properties

    const elementRef = useRef(null)
    const cursorRef = useRef(null)

    const slider = {
        get position() {
            let element = elementRef.current
            let cursor = cursorRef.current

            if (element && cursor) {
                let left = Number.parseInt(element.style.left.replace("px", ""))
                return left / (element.offsetWidth - 16)
            }
            return -1
        },

        set position(value) {
            let cursor = cursorRef.current
            let element = elementRef.current

            if (cursor && element) {
                let number = (element.offsetWidth - 16) * value
                cursor.style.left = number + "px"
            }
        }
    }

    useLayoutEffect(() => {
        slider.position = position
    }, [position])

    const sliderHorizontal = (event : any) => {
        let cursor = cursorRef.current
        let element = elementRef.current

        if (cursor && element) {
            let delta = cursor.offsetLeft,
                pointer = cursor.offsetLeft

            let elementDrag = (event : any) => {
                event.preventDefault()
                delta = pointer - event.clientX
                pointer = event.clientX
                let computedStyle = Number.parseInt(
                    window.getComputedStyle(cursor).left.replace("px", "")
                )
                let number = computedStyle - delta
                if (number < 0) {
                    number = 0
                }
                if (number > element.offsetWidth - 16) {
                    number = element.offsetWidth - 16
                }
                let position = number / (element.offsetWidth - 16)
                slider.position = position

                if (onPosition) {
                    onPosition({
                        value: position,
                        direction: delta > 0 ? "left" : "right"
                    })
                }
            }

            let closeDragElement = () => {
                document.removeEventListener("mouseup", closeDragElement)
                document.removeEventListener("mousemove", elementDrag)
            }

            event.preventDefault()
            pointer = event.clientX
            document.addEventListener("mouseup", closeDragElement)
            document.addEventListener("mousemove", elementDrag)
        }
    }

    return (
        <div
            ref={elementRef}
            className={(className ? className + " " : "") + "scrollbar-horizontal"}
            {...rest}
        >
            <div
                ref={cursorRef}
                className="cursor"
                onMouseDown={sliderHorizontal}
            ></div>
        </div>
    )
}

namespace HorizontalScrollbar {
    export interface Attributes {
        className?: string
        onPosition?: any
        position?: number
        style? : CSSProperties
    }
}

export default HorizontalScrollbar