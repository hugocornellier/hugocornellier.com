import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./component/About";
import Awards from "./component/Awards";
import Education from "./component/Education";
import Experience from "./component/Experience";
import Header from "./component/Header";
import Nav from "./component/Nav";
import Projects from "./component/Projects";
import Skills from "./component/Skills";
import Views from "./component/Views";

const App: React.FC = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <>
                    <div className={"content"}>
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
                    </div>
                </>
            )
        },
        {
            path: "/test",
            element: (
                <>
                    <Views />
                </>
            )
        }
    ]);

    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default App;
