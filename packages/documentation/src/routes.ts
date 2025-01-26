import {Dialog, Route, Window} from "react-ui-simplicity";
import App from "./App";
import HomePage from "./pages/home/HomePage";
import FormsPage from "./pages/component/FormsPage";
import InputPage from "./pages/component/input/InputPage";
import EditorPage from "./pages/component/input/EditorPage";
import SelectPage from "./pages/component/input/SelectPage";
import LazySelectPage from "./pages/component/input/LazySelectPage";
import ImagePage from "./pages/component/input/ImagePage";
import LayoutPage from "./pages/component/LayoutPage";
import DrawerPage from "./pages/component/layout/DrawerPage";
import TabsPage from "./pages/component/layout/TabsPage";
import ToolbarPage from "./pages/component/layout/ToolbarPage";
import PagesPage from "./pages/component/layout/PagesPage";
import ListPage from "./pages/component/lists/ListPage";
import TablePage from "./pages/component/lists/TablePage";
import SchemaFormPage from "./pages/component/meta/SchemaFormPage";
import SchemaTablePage from "./pages/component/meta/SchemaTablePage";
import WindowPage from "./pages/component/modal/WindowPage";
import DialogPage from "./pages/component/modal/DialogPage";
import LinkPage from "./pages/component/navigation/LinkPage";
import RouterPage from "./pages/component/navigation/RouterPage";
import UseArrayHookPage from "./pages/platform/hooks/UseArrayHookPage";

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
                            },
                            {
                                path: "/tabs",
                                component : TabsPage
                            },
                            {
                                path: "/pages",
                                component : PagesPage
                            },
                            {
                                path: "/toolbar",
                                component : ToolbarPage
                            }
                        ]
                    },
                    {
                        path : "/lists",
                        children : [
                            {
                                path: "/list",
                                component : ListPage
                            },
                            {
                                path: "/table",
                                component : TablePage
                            }
                        ]
                    },
                    {
                        path : "/meta",
                        children : [
                            {
                                path: "/form",
                                component : SchemaFormPage
                            },
                            {
                                path : "/table",
                                component : SchemaTablePage
                            }
                        ]
                    },
                    {
                        path : "/modal",
                        children : [
                            {
                                path: "/window",
                                component : WindowPage
                            },
                            {
                                path: "/dialog",
                                component : DialogPage
                            }

                        ]
                    },
                    {
                        path : "/navigation",
                        children : [
                            {
                                path: "/link",
                                component : LinkPage
                            },
                            {
                                path: "/router",
                                component : RouterPage
                            }
                        ]
                    },
                    {
                        path : "/hooks",
                        children : [
                            {
                                path: "/use-array",
                                component : UseArrayHookPage
                            }
                        ]
                    }
                ]
            }
        ]
    }
]