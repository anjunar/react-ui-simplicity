import "./Section.css"
import React from "react";
import Header from "../Header";

export default function Section({children, text} : {children : React.ReactNode, text : string}) {
    return (
        <div className={"section"}>
            <Header>{text}</Header>
            <br/>
            <div className={"container"}>
                {children}
            </div>
        </div>
    )
}