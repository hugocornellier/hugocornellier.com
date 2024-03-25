import React, { useEffect, useRef } from 'react';
import { Typed } from "react-typed";
import "../styles/terminal.css";

const TerminalComponent = () => {
    const terminalRef = useRef(null);

    useEffect(() => {
        const terminalTyped = new Typed(terminalRef.current, {
            strings: [
                `My name is Hugo Cornellier, and I am a passionate and driven full-stack developer.
                <br/><br/>
                While at Off-Grid Distribution and Bulletproof Solutions, I’ve built my web development skills using technologies 
                such as React, TypeScript, HTML5/CSS, along with libraries such as Tailwind. I am well-versed in both 
                SQL and NoSQL, particularly MongoDB.
                <br/><br/>
                I am well versed in the latest software development methodologies - task estimation, prioritization, 
                testing, code review, devops. My projects have involved both backend code optimization - where 
                improvements are measured in milliseconds - and frontend user experience. I have strong communication 
                skills, and I work well collaboratively or independently.
                <br/><br/>
                 Let's connect! My LinkedIn and Github profiles, as well as my email address, can be found above.`
            ],
            typeSpeed: 24,
            backSpeed: 0,
            backDelay: 3000,
            loop: false,
            onComplete: function (self) {
                setTimeout(function () {
                    self.reset();
                }, 1000);
            }
        });

        return () => {
            terminalTyped.destroy();
        };
    }, []);

    return (
        <div className="terminal-outer">
            <div className="terminal-container">
                <div className="terminal-section terminal-header">
                    <div className="terminal-controls">
                        <span className="elem elem-close"></span>
                        <span className="elem elem-minimize"></span>
                        <span className="elem elem-fullscreen"></span>
                    </div>
                </div>
                <div className="terminal-section terminal-body">
                    <div className="terminal-section terminal-body-inner">
                        <p>
                            <span className="terminal-user">Hello! </span>
                            <span ref={terminalRef}></span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminalComponent;
