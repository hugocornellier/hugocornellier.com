import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, IconDefinition } from "@fortawesome/free-brands-svg-icons";

interface Project {
    title: string;
    type: string;
    skills: string;
    githubLink: string;
    description: string[];
}

interface ProjectItemProps {
    project: Project;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ project }) => {
    const { title, type, skills, githubLink, description } = project;

    return (
        <div className="resume-item d-flex flex-column flex-md-row mb-5">
            <div className="resume-content mr-auto">
                <h3 className="mb-0">{title}</h3>
                <div className="subheading mb-3">{type} <br/> Skills Used: {skills}</div>
                <div className="d-flex flex-row project-icons">
                    <a href={githubLink}
                         className="social-icons d-flex justify-content-center align-items-center rounded-circle project-icon">
                        <FontAwesomeIcon icon={faGithub as IconDefinition}/>
                    </a>
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
            title: "Orc Rush Tower Defense",
            type: "Web Application",
            skills: "HTML, CSS, JS",
            githubLink: "https://github.com/hugocornellier/orc-rush-tower-defense",
            description: [
                "Tower defense application developed as a team-based Agile project",
                "Application written in vanilla JS, with the UI provided through HTML/CSS"
            ]
        },
        {
            title: "UNB Live Poker (2-5 Players)",
            type: "Web Application",
            skills: "Node.js, HTML, CSS, JS",
            githubLink: "https://github.com/hugocornellier/unb-poker",
            description: [
                "Online Texas Holdem game with HTTPS & HTTP functionality",
                "Server written in Node.js. UI is provided through HTML/CSS and JS. Developed as a team-based Agile project"
            ]
        },
        {
            title: "FAT32 Disk Image Browser",
            type: "Utility Program",
            skills: "C",
            githubLink: "https://github.com/hugocornellier/fat32-reader",
            description: [
                "Wrote a program that performs operations to FAT32 disk images: read, browse, extract and write",
                "Program written in C"
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
