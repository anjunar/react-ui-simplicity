import "./Link.css"
import React, {CSSProperties, ReactNode, useLayoutEffect, useState} from "react"
import RestLink from "../../../domain/container/LinkObject";
import LinkContainerObject from "../../../domain/container/LinkContainerObject";
import LinksObject from "../../../domain/container/LinksObject";
import Router from "../router/Router";

function Link(properties : Link.Attributes) {

    const {data, value, children, ...rest} = properties

    const [activeState, setActiveState] = useState(false)

    const onClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
        event.preventDefault()
        Router.navigate(value)
    }

    useLayoutEffect(() => {
        let listener = () => {
            setActiveState(window.location.pathname === value)
        }

        listener()

        window.addEventListener("popstate", listener)

        return () => {
            window.removeEventListener("popstate", listener)
        }
    }, [])

    const baseUrl = process.env.PUBLIC_URL

    return (
        <a
            href={baseUrl + value}
            onClick={onClick}
            {...rest}
            className={activeState ? "active" : ""}>
            {children}
        </a>
    )
}

namespace Link {

    export interface Attributes {
        data?: any
        value: string
        children: ReactNode
        style? : CSSProperties
        className? : string
    }

    export function onLink($links :LinkContainerObject, rel: string, callback: (link: RestLink) => React.ReactNode) {
        if ($links) {
            let link = $links[rel];

            if (link) {
                return callback(link)
            }
        }
        return ""
    }

    export function renderWithSymbol(container: LinksObject) {
        return Object.values(container?.links || {}).map((link: any) => (
            <Link key={link.rel} value={link.url}>
                <i className={"material-icons"}>navigate_next</i>
            </Link>
        ));
    }

    export function renderWithDescription(container: LinksObject) {
        return Object.values(container?.links || {}).map((link: any) => (
            <Link key={link.rel} value={link.url}>
                {link.title}
            </Link>
        ));
    }

}

export default Link