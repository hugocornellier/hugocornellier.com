import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const About = () => {
    return (
        <section className="resume-section p-3 p-lg-5 d-flex d-column" id="about">
            <div className="my-auto">
                <h1 className="mb-0">Hugo <span className="text-primary">Cornellier</span></h1>
                <h3>Junior Software Developer</h3>
                <div className="subheading mb-5">Fredericton, Canada · <a href="mailto:hugo.cornellier@gmail.com">hugo.cornellier@gmail.com</a></div>
                <p className="mb-5">
                    <p>My name is Hugo Cornellier, and I am a passionate and driven Junior Software Developer.</p>
                    <p>I have a B. Sc. in Computer Science from UNB, graduating in the First Division & on the Dean’s List with a GPA of 3.7.</p>
                    <p>I am currently working as a Web Developer at Off-Grid Distribution.</p>
                </p>
                <a href="/client/data/pdf/cv.pdf" target="_blank" rel="noopener noreferrer">View Resume as PDF</a>
                <br />
                <br />
                <div className="d-flex flex-row social-icons">
                    <SocialIcon link="https://linkedin.com/in/hugocornellier" icon={faLinkedin} />
                    <SocialIcon link="https://github.com/hugocornellier" icon={faGithub} />
                </div>
            </div>
        </section>
    );
}

interface SocialIconProps {
    link: string;
    icon: any; // or FontAwesomeIconProps
}

const SocialIcon: React.FC<SocialIconProps> = ({ link, icon }) => {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center align-items-center rounded-circle social-icon project-icon">
            <FontAwesomeIcon icon={icon} />
        </a>
    );
}

export default About;
