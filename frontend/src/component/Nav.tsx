import React, { useState } from 'react';
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

interface NavItemProps {
    title: string;
    href: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const NavItem: React.FC<NavItemProps> = ({ title, href, socket }) => {
    const loadSection = (title: string) => {
        if (socket) {
            socket.emit("track_view_data", title);
        }
    };

    return (
        <li className="nav-item">
            <a onClick={() => loadSection(title)} className="nav-link js-scroll-trigger" href={href}>{title}</a>
        </li>
    );
}

interface NavProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
}

const Nav: React.FC<NavProps> = ({ socket }) => {
    const navItems: NavItemProps[] = [
        "About", "Education", "Experience", "Skills", "Awards", "Projects"
    ].map(title => ({
        title,
        href: `#${title.toLowerCase()}`,
        socket
    }));

    const [show, setShow] = useState<boolean>(false);

    const toggleCollapse = () => setShow(prevState => !prevState);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="sideNav">
            <a className="navbar-brand js-scroll-trigger">
                <span className="d-block d-lg-none">Hugo Cornellier</span>
                <span className="d-none d-lg-block">
                    <img
                        src={require('../img/headshot.png')}
                        className="img-fluid img-profile rounded-circle mx-auto mb-2"
                        alt="Headshot"
                    />
                </span>
            </a>
            <button className="navbar-toggler" type="button" onClick={toggleCollapse}>
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className={"collapse navbar-collapse " + (show ? 'show' : '')} id="navbarSupportedContent">
                <ul className="navbar-nav">
                    {navItems.map((item, index) => (
                        <NavItem key={index} {...item} socket={socket} />
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Nav;