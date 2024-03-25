import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faYoutube, IconDefinition } from "@fortawesome/free-brands-svg-icons";

interface Project {
    title: string;
    type: string;
    skills: string;
    githubLink: string | null;
    ytLink: string | null;
    playLink: string | null;
    description: string[];
}

interface ProjectItemProps {
    project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
    const { title, type, skills, githubLink, ytLink, playLink, description } = project;
    const socialLinks = [
        { icon: faGithub, link: githubLink },
        { icon: faYoutube, link: ytLink },
        { icon: faPlay, link: playLink }
    ];

    return (
        <div className="resume-item d-flex flex-column flex-md-row mb-5">
            <div className="resume-content mr-auto">
                <h3 className="mb-0 w-full">{title}</h3>
                <div className="subheading mb-3 block w-full">{type}<br /> Skills Used: {skills}</div>
                <div className="d-flex flex-row project-icons">
                    {socialLinks.map((link, index) => (
                        link.link && (
                            <a key={index} href={link.link}
                               className="social-icons d-flex justify-content-center align-items-center rounded-circle project-icon">
                                <FontAwesomeIcon icon={link.icon as IconDefinition}/>
                            </a>
                        )
                    ))}
                </div>
                <br/>
                <ul>
                    {description.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const Projects: React.FC = () => {
    const projectData: Project[] = [
        {
            title: "MarioKartRuns",
            type: "Web Application",
            skills: "React, TypeScript, CSS, Tailwind, HTML5, SQL",
            githubLink: "https://github.com/hugocornellier/mariokartruns",
            ytLink: null,
            playLink: "https://mariokartruns.com/",
            description: [
                "A web app that displays and archives Mario Kart world records.",
            ]
        },
        {
            title: "Hugo Cornellier (YouTube) - 500,000+ Subscribers",
            type: "YouTube Channel",
            skills: "",
            githubLink: null,
            playLink: null,
            ytLink: "https://youtube.com/hugocornellie",
            description: [
                "A passion photography project turned viral led to a channel of 500K+ subscribers. ",
                "Led to local and international media attention. "
            ]
        },
        {
            title: "hugocornellier.com",
            type: "Web Application",
            skills: "React, TypeScript, CSS, Tailwind, HTML5, SQL",
            githubLink: "https://github.com/hugocornellier/hugocornellier.com",
            ytLink: null,
            playLink: null,
            description: [
                "Personal portfolio and resume. "
            ]
        },
        {
            title: "FAT32 Disk Image Browser",
            type: "Utility Tool",
            skills: "C",
            githubLink: "https://github.com/hugocornellier/fat32-reader",
            ytLink: null,
            playLink: null,
            description: [
                "A FAT32 disk image browser: capable of reading, browsing, extracting and writing"
            ]
        }
    ];

    return (
        <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="projects">
            <div className="my-auto">
                <h2 className="mb-5">Projects</h2>
                {projectData.map((project, index) => (
                    <ProjectItem key={index} project={project} />
                ))}
            </div>
        </section>
    );
}

export default Projects;
