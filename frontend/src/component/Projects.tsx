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
            title: "MarioKartRuns",
            type: "Web Application",
            skills: "React, TypeScript, CSS, Tailwind, HTML5, SQL",
            githubLink: "https://github.com/hugocornellier/mariokartruns",
            description: [
                "A web app that displays and archives Mario Kart world records.",
            ]
        },
        {
            title: "hugocornellier.com",
            type: "Web Application",
            skills: "React, TypeScript, CSS, Tailwind, HTML5, SQL",
            githubLink: "https://github.com/hugocornellier/hugocornellier.com",
            description: [
                "Personal portfolio and resume. "
            ]
        },
        {
            title: "FAT32 Disk Image Browser",
            type: "Utility Tool",
            skills: "C",
            githubLink: "https://github.com/hugocornellier/fat32-reader",
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
