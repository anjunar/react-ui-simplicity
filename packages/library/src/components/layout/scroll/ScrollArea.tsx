import "./ScrollArea.css"
import React, {CSSProperties, useContext, useLayoutEffect, useRef, useState} from "react"
import VerticalScrollbar from "./VerticalScrollbar"
import HorizontalScrollbar from "./HorizontalScrollbar"

const cache = new Map();

function ScrollArea(properties : ScrollArea.Attributes) {

    const { children, style, ...rest } = properties

    const [scrollX, setScrollX] = useState(0)
    const [scrollY, setScrollY] = useState(0)

    const [scrollXVisible, setScrollXVisible] = useState(false)
    const [scrollYVisible, setScrollYVisible] = useState(false)

    const contentRef = useRef(null)
    const containerRef = useRef(null)

    const checkScrollBars = () => {
        setTimeout(() => {
            let clientOffsetHeight =
                containerRef.current.offsetHeight - contentRef.current.scrollHeight + 36
            let clientOffsetWidth =
                containerRef.current.offsetWidth - contentRef.current.scrollWidth + 36

            setScrollXVisible(clientOffsetWidth <= 0)
            setScrollYVisible(clientOffsetHeight <= 0)
        }, 100)
    }

    const onScroll = () => {
        let content = contentRef.current
        let container = containerRef.current

        if (content) {
            let clientOffsetHeight = container.offsetHeight - content.offsetHeight
            let clientOffsetWidth = container.offsetWidth - content.offsetWidth
            let top = clientOffsetHeight * (scrollY || 0)
            let left = clientOffsetWidth * (scrollX || 0)

            content.style.transition = "all 0s cubic-bezier(0.2, .84, .5, 1)"
            content.style.transform = `translate3d(${left}px, ${top}px, 0px)`
        }
    }

    function getMatrix(element : HTMLDivElement) {
        if (element.style.transform === "") {
            return {
                x: 0,
                y: 0,
                z: 0
            }
        }

        let regex = /translate3d\((-?[\d.]+)px,\s*(-?[\d.]+)px,\s*(-?[\d.]+)px\)/
        let transform = regex.exec(element.style.transform) || []
        return {
            x: Number.parseInt(transform[1]),
            y: Number.parseInt(transform[2]),
            z: Number.parseInt(transform[3])
        }
    }

    const onWheel :  React.WheelEventHandler<HTMLDivElement> = (event) => {
        if (scrollYVisible) {
            event.stopPropagation()
            return onWheelIntern(event.deltaY)
        }
    }

    const onWheelIntern = (deltaY : number)=> {
        let viewport = containerRef.current
        let content = contentRef.current

        let matrix = getMatrix(content)
        let top = -matrix.y + deltaY
        let clientOffsetHeight = content.offsetHeight - viewport.offsetHeight
        if (clientOffsetHeight > 0) {
            if (top < 0) {
                top = 0
            }
            if (top > clientOffsetHeight) {
                top = clientOffsetHeight
            }
            let position = top / clientOffsetHeight
            setScrollY(position)

            content.style.transition = "all .5s cubic-bezier(0.2, .84, .5, 1)"
            content.style.transform = `translate3d(${matrix.x}px, ${-top}px, 0px)`

            /*
                              scrollYChange({
                                  value : position,
                                  direction : deltaY < 0 ? "top" : "bottom"
                              });
                  */
        }
        return false
    }

    useLayoutEffect(() => {

        let draggableElement = containerRef.current
        let content = contentRef.current

        let isDragging = false;
        let initialX : number, initialY : number;

        draggableElement.addEventListener('touchstart', (event: any) => {
            // Prevent default touch behavior (scrolling, zooming)
            // event.preventDefault();
            isDragging = true;
            initialX = event.touches[0].clientX; // Get initial X position of touch
            initialY = event.touches[0].clientY; // Get initial Y position of touch
        });

        document.addEventListener('touchmove', (event) => {
            if (isDragging) {
                const touch = event.touches[0]; // Get the first touch point
                const deltaX = -(touch.clientX - initialX); // Calculate change in X position
                const deltaY = -(touch.clientY - initialY); // Calculate change in Y position


                let matrix = getMatrix(content)


                let top = -matrix.y + deltaY
                let left = -matrix.x + deltaX
                let clientOffsetHeight = content.offsetHeight - draggableElement.offsetHeight
                let clientOffsetWidth = content.offsetWidth - draggableElement.offsetWidth
                if (clientOffsetHeight > 0 || clientOffsetWidth > 0) {
                    if (top < 0) {
                        top = 0
                    }
                    if (top > clientOffsetHeight) {
                        top = clientOffsetHeight
                    }
                    if (left < 0) {
                        left = 0
                    }
                    if (left > clientOffsetWidth) {
                        left = clientOffsetWidth
                    }
                    setScrollY(top / clientOffsetHeight)
                    setScrollX(left / clientOffsetWidth)

                    content.style.transition = "all .5s cubic-bezier(0.2, .84, .5, 1)"
                    content.style.transform = `translate3d(${-left}px, ${-top}px, 0px)`

                }


                // Update initial positions for next move
                initialX = touch.clientX;
                initialY = touch.clientY;
            }
        });

// Event listener for touchend (drag termination)
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
    }, [containerRef.current, contentRef.current])

    useLayoutEffect(() => {
        checkScrollBars()

        let listener = () => {
            checkScrollBars()
        }

        let cached = cache.get(children.type);
        if (cached) {
            setScrollX(cached.x)
            setScrollY(cached.y)
        } else {
            cache.set(children.type, {x : scrollX, y : scrollY})
            setScrollX(0)
            setScrollY(0)
        }


        window.addEventListener("resize", listener)

        return () => {
            window.removeEventListener("resize", listener)
        }
    }, [children])

    useLayoutEffect(() => {
        let cached = cache.get(children.type);

        if (cached) {
            cached.x = scrollX
            cached.y = scrollY
        }

        onScroll();

    }, [scrollX, scrollY])

    useLayoutEffect(() => {
        onScroll();
    }, [contentRef.current?.offsetHeight, contentRef.current?.offsetWidth])

    return (
        <div
            style={{touchAction : "none", ...style}}
            ref={containerRef}
            className={"scroll-area-container"}
            onWheel={onWheel}
            {...rest}
        >
            <div ref={contentRef} className={"scroll-area-content"}>
                {children}
            </div>
            {scrollYVisible ? (
                <VerticalScrollbar
                    position={scrollY}
                    onPosition={(event : any) => setScrollY(event.value)}
                />
            ) : (
                ""
            )}
            {scrollXVisible ? (
                <HorizontalScrollbar
                    style={{ marginTop: "-16px" }}
                    position={scrollX}
                    onPosition={(event : any) => setScrollX(event.value)}
                />
            ) : (
                ""
            )}
        </div>
    )
}

namespace ScrollArea {
    export interface Attributes {
        children : React.ReactElement
        style? : CSSProperties
    }
}

export default ScrollArea