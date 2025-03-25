import React, {DependencyList, useEffect, useState} from "react";

export function useWheel(callback: () => {ref : React.RefObject<HTMLElement>, maximum : number, stopPropagating? : boolean, preventDefault? : boolean}, deps : DependencyList) : [number, React.Dispatch<number>] {

    const [state, setState] = useState(0)

    useEffect(() => {

        let {ref, maximum, preventDefault, stopPropagating} = callback();

        let element = ref.current;

        let lastY = 0;

        const handleTouchStart = (event: TouchEvent) => {
            lastY = event.touches[0].clientY;
        };

        const handleTouchMove = (event: TouchEvent) => {
            if (preventDefault) {
                event.preventDefault();
            }
            if (stopPropagating) {
                event.stopPropagation()
            }

            const deltaY = lastY - event.touches[0].clientY;
            lastY = event.touches[0].clientY;

            setState(prev => {
                return Math.max(0, Math.min(prev + deltaY, maximum));
            });
        };

        element.addEventListener("touchstart", handleTouchStart);
        element.addEventListener("touchmove", handleTouchMove);

        let wheelListener = (event : WheelEvent) => {
            if (preventDefault) {
                event.preventDefault();
            }
            if (stopPropagating) {
                event.stopPropagation()
            }

            setState(prev => {
                return Math.max(0, Math.min(prev + event.deltaY, maximum));
            });
        };

        element.addEventListener("wheel", wheelListener)

        return () => {
            element.removeEventListener("wheel", wheelListener)
            element.removeEventListener("touchstart", handleTouchStart);
            element.removeEventListener("touchmove", handleTouchMove);
        }
    }, deps);

    return [state, setState]
}