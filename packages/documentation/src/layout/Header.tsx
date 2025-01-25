import "./Header.css"
import React from "react";

export default function Header({children} : {children : React.ReactNode}) {
    return (
        <div className={"header"}>
            <h1 className={"title"}>{children}</h1>
            <hr/>
        </div>
    )

}