import "./PageLayout.css"
import React from "react";

export default function PageLayout({children} : {children : React.ReactNode}) {
    return (
        <div className={"page-layout"}>
            {children}
        </div>
    )
}

