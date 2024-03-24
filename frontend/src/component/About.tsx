import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pdf from '../data/CV.pdf'
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const About = () => {
    return (
        <section className="resume-section p-3 p-lg-5 d-flex d-column" id="about">
            <div className="my-auto">
                <h1 className="mb-0">Hugo <span className="text-primary">Cornellier</span></h1>
                <h3>
                    Full-Stack Developer
                </h3>
                <div className="subheading mb-5">Fredericton, Canada · <a href="mailto:hugo.cornellier@gmail.com">hugo.cornellier@gmail.com</a></div>
                <p className="about-me mb-5 max-w-0">
                    <p>My name is Hugo Cornellier, and I am a passionate and driven developer. I am currently
                        working as a Full-Stack Developer at Off-Grid Distribution.</p>
                    <p>I have a B. Sc. in Computer Science from UNB, graduating in August 2023 in the First Division.
                        I'm proud of my academic record: I received a final GPA of 3.7, and earned a spot on the Dean's
                        List in 2023.</p>
                </p>
                <a href={pdf} target="_blank" rel="noopener noreferrer">
                    View Resume as PDF
                </a>
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
