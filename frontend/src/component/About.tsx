import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pdf from '../data/CV.pdf'
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Terminal from "./Terminal";

const About = () => {
    return (
        <section className="resume-section p-3 p-lg-5 d-flex d-column" id="about">
            <div className="my-auto w-full">
                <h1 className="mb-0">Hugo <span className="text-primary">Cornellier</span></h1>
                <h3>
                    Full-Stack Developer
                </h3>
                <div className="subheading mb-1">Fredericton, Canada · <a
                    href="mailto:hugo.cornellier@gmail.com">hugo.cornellier@gmail.com</a></div>
                <div className="d-flex flex-row social-icons mb-5">
                    <SocialIcon link="https://linkedin.com/in/hugocornellier" icon={faLinkedin}/>
                    <SocialIcon link="https://github.com/hugocornellier" icon={faGithub}/>
                </div>
                <Terminal/>
                <a href={pdf} target="_blank" rel="noopener noreferrer">
                    View Resume as PDF
                </a>
                <br/>
                <br/>
            </div>
        </section>
    );
}

interface SocialIconProps {
    link: string;
    icon: any; // or FontAwesomeIconProps
}

const SocialIcon: React.FC<SocialIconProps> = ({link, icon}) => {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center align-items-center rounded-circle social-icon project-icon">
            <FontAwesomeIcon icon={icon} />
        </a>
    );
}

export default About;
