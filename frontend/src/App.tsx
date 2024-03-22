import { useState } from "react";
import Skills from "./component/Skills";
import Experience from "./component/Experience";
import Nav from "./component/Nav";
import Education from "./component/Education";
import Awards from "./component/Awards";
import Projects from "./component/Projects";
import About from "./component/About";
import Header from "./component/Header";

export default function App() {
    const [activeSidebar, setActiveSidebar] = useState(true);
    const onToggleSidebar = () => setActiveSidebar(!activeSidebar)

    return (
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
    );
}
