import React from 'react';

interface NavItemProps {
    title: string;
    href: string;
}

const NavItem: React.FC<NavItemProps> = ({ title, href }) => {
    return (
        <li className="nav-item">
            <a className="nav-link js-scroll-trigger" href={href}>{title}</a>
        </li>
    );
}

const Nav: React.FC = () => {
    const navItems: NavItemProps[] = [
        { title: "About", href: "#about" },
        { title: "Education", href: "#education" },
        { title: "Experience", href: "#experience" },
        { title: "Skills", href: "#skills" },
        { title: "Awards", href: "#awards" },
        { title: "Projects", href: "#projects" }
    ];

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="sideNav">
            <a className="navbar-brand js-scroll-trigger">
                <span className="d-block d-lg-none">Hugo Cornellier</span>
                <span className="d-none d-lg-block">
                    <img
                        src={require('../img/headshot.png')}
                        className="img-fluid img-profile rounded-circle mx-auto mb-2"
                        alt={"Headshot"}
                    />
                </span>
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav">
                    {navItems.map((item, index) => (
                        <NavItem key={index} title={item.title} href={item.href} />
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default Nav;
