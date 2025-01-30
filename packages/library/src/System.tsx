import "./System.css"
import React, {createContext, Dispatch, SetStateAction, useLayoutEffect, useState} from "react";
import {init} from "./domain/Persistence";
import Router from "./components/navigation/router/Router";
import Input from "./components/inputs/input/Input";
import Link from "./components/navigation/link/Link";
import ToolBar from "./components/layout/toolbar/ToolBar";
import Progress from "./components/indicators/Progress";

init()

declare global {
    interface String {
        stripMargin(): string;
    }
}

String.prototype.stripMargin = function (): string {
    return this.replaceAll(/.*\|/g, "")
};

export class WindowRef {

    readonly name: string

    constructor(name: string) {
        this.name = name;
    }
}

export class SystemContextHolder {

    routes: Router.Route[]

    windows: [WindowRef[], Dispatch<SetStateAction<WindowRef[]>>]

    constructor(routes: Router.Route[], windows: [WindowRef[], Dispatch<SetStateAction<WindowRef[]>>]) {
        this.routes = routes
        this.windows = windows
    }

}

export const SystemContext = createContext(new SystemContextHolder([], null))

function System(properties : System.Attributes) {

    const {routes} = properties

    const [loading, setLoading] = useState([])

    const [windows, setWindows] = useState<WindowRef[]>([])

    const [darkMode, setDarkMode] = useState(false)


    useLayoutEffect(() => {
        let matchMedia = window.matchMedia('(prefers-color-scheme: dark)');

        if (matchMedia.matches) {
            setDarkMode(true)
        } else {
            setDarkMode(false)
        }
    }, []);

    useLayoutEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute("data-theme", "dark")
        } else {
            document.documentElement.setAttribute("data-theme", "light")
        }
    }, [darkMode]);

    useLayoutEffect(() => {

        window.fetch = new Proxy(window.fetch, {
            apply(target: (input: (RequestInfo | URL), init?: RequestInit) => Promise<Response>, thisArg: any, argArray: any[]): any {
                setLoading([...loading, argArray])

                let init = argArray[1] || {}
                // argArray[1] = Object.assign(init, {signal: AbortSignal.timeout(12000)})


                let promise = Reflect.apply(target, thisArg, argArray)

                promise
                    .then(() => {
                        setTimeout(() => {
                            let indexOf = loading.indexOf(argArray)
                            loading.splice(indexOf)
                            setLoading([...loading])
                        }, 1000)
                    })
                    .catch((response: any) => {
                        if (response.name === "TimeoutError") {
                            setLoading([])
                            Router.navigate("/errors/timeout")
                        }
                    })

                return promise
            }
        })
    }, []);

    return (
        <div className={"system"}>
            <SystemContext.Provider value={new SystemContextHolder(routes, [windows, setWindows])}>
                <div style={{position: "absolute", zIndex: 9999, top: 0, left: 0, height: "4px", width: "100%"}}>
                    {
                        loading.length > 0 && <Progress/>
                    }
                </div>
                <Router/>
                <ToolBar>
                    <div slot={"left"}>
                        <div style={{display: "flex"}} onClick={(event) => event.stopPropagation()}>
                            {
                                windows.map((window, index) => (
                                    <div key={index}
                                         style={{backgroundColor: "var(--color-background-tertiary)"}}>{window.name}</div>
                                ))
                            }
                        </div>
                    </div>
                    <div slot={"right"}>
                        <div style={{display : "flex", alignItems : "center", gap : "5px", justifyContent : "flex-end"}}>
                            <Input type={"checkbox"} value={darkMode} onChange={(value: any) => setDarkMode(value)}/>
                        </div>
                    </div>
                </ToolBar>
            </SystemContext.Provider>
        </div>
    )
}

namespace System {
    export interface Attributes {

        routes : Router.Route[]

    }
}

export default System