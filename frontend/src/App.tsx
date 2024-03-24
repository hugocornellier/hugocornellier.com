import {useEffect, useState} from "react";
import Skills from "./component/Skills";
import Experience from "./component/Experience";
import Nav from "./component/Nav";
import Education from "./component/Education";
import Awards from "./component/Awards";
import Projects from "./component/Projects";
import About from "./component/About";
import Header from "./component/Header";
import {Socket} from "socket.io-client";
import {SocketHelper} from "./context/SocketHelper";
import {
    createBrowserRouter,
    RouterProvider,
    useParams
} from "react-router-dom"
import Views from "./component/Views";

export default function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <>
                    <Header />
                    <Nav />
                    <div className="container-fluid p-0">
                        <About />
                        <Education />
                        <Experience />
                        <Skills />
                        <Awards />
                        <Projects />
                    </div>
                </>
            ),

        },
        {
            path: "/test",
            element: (
                <>
                    <Views />
                </>
            ),
        }
    ])

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}
