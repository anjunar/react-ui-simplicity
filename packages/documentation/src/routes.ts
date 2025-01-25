import {Route} from "react-ui-simplicity";
import App from "./App";
import HomePage from "./pages/home/HomePage";
import FormsPage from "./pages/content/FormsPage";
import InputPage from "./pages/content/input/InputPage";
import EditorPage from "./pages/content/input/EditorPage";
import SelectPage from "./pages/content/input/SelectPage";
import LazySelectPage from "./pages/content/input/LazySelectPage";
import ImagePage from "./pages/content/input/ImagePage";
import LayoutPage from "./pages/content/LayoutPage";
import DrawerPage from "./pages/content/layout/DrawerPage";

export const routes : Route[] = [
    {
        path : "/",
        subRouter : true,
        component : App,
        children : [
            {
                path : "/",
                component : HomePage,
                children : [
                    {
                        path : "/forms",
                        component : FormsPage,
                        children : [
                            {
                                path : "/editor",
                                component : EditorPage
                            },
                            {
                                path : "/input",
                                component : InputPage
                            },
                            {
                                path : "/select",
                                component : SelectPage,
                                children : [
                                    {
                                        path : "/lazy",
                                        component : LazySelectPage
                                    }
                                ]
                            },
                            {
                                path : "/image",
                                component : ImagePage
                            }
                        ]
                    },
                    {
                        path : "/layout",
                        component : LayoutPage,
                        children : [
                            {
                                path: "/drawer",
                                component : DrawerPage
                            }
                        ]
                    }
                ]
            }
        ]
    }
]