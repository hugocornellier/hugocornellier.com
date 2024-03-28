import React, { useState } from 'react';
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {Link, useLocation} from "react-router-dom";
import pdf from '../data/CV.pdf'

interface NavItemProps {
    title: string;
    href: string;
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;
    collapseSidebar: any;
    show: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ title, href, socket, collapseSidebar, show }) => {
    const loadSection = (title: string) => {
        if (socket) {
            socket.emit("track_view_data", title);
        }
        if (show) {
            collapseSidebar();
        }
    };

    let location = useLocation();
    let test = new URL(href, window.origin + location.pathname);
    console.log();

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

    const [show, setShow] = useState<boolean>(false);

    const toggleCollapse = () => setShow(prevState => !prevState);

    const collapseSidebar = () => setShow(false);

    const navItems: NavItemProps[] = [
        "About", "Education", "Experience", "Skills", "Awards", "Projects"
    ].map(title => ({
        title,
        href: `#${title.toLowerCase()}`,
        socket,
        collapseSidebar,
        show
    }));

    const viewResume = () => {
        window.open(pdf, '_blank');
    };

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
            <div className={"flex flex-column justify-content-center items-center collapse navbar-collapse " + (show ? 'show' : '')} id="navbarSupportedContent">
                <ul className="navbar-nav">
                    {navItems.map((item, index) => (
                        <NavItem key={index} {...item} socket={socket} collapseSidebar={collapseSidebar} show={show} />
                    ))}
                </ul>
                <div className="dl-resume-btn" onClick={viewResume}>
                    <span>
                        View Resume as PDF
                    </span>
                </div>
            </div>
        </nav>
    );
}

export default Nav;