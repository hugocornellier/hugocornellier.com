import React from "react";
import pdf from '../data/resume.pdf';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const viewResume = () => {
        window.open(pdf, '_blank'); // Open the PDF in a new tab
    };

    return (
        <div className="container">
            <header className="top">
                <a className="text--lg" href="/">
                    <strong>hugo cornellier</strong>
                </a>
            </header>
            <main>
                {children}
            </main>
            <footer className="bottom deemphasized prose top-border-4px">
                <hr />
                <aside className="float-left">
                    hugo cornellier,<br />
                    <span className="label">father, developer, time lapse enthusiast</span>
                </aside>
                <nav className="float-right align-right">
                    <a href="/contact">contact</a>
                    <br/>
                    {/* Adding the onClick handler to call viewResume */}
                    <a href="#" onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        viewResume(); // Call the viewResume method
                    }}>resume</a>
                    <br/>
                </nav>
                <div className="clear"></div>
            </footer>
        </div>
    );
};

export default Layout;
