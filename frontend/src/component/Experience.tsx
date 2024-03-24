import React from 'react';

interface Responsibility {
    title: string;
    company: string;
    date: string;
    responsibilities: string[];
}

const ExperienceItem: React.FC<Responsibility> = ({ title, company, date, responsibilities }) => {
    return (
        <div className="resume-item d-flex flex-column flex-md-row mb-5">
            <div className="resume-content mr-auto">
                <h3 className="mb-0">{title}</h3>
                <div className="subheading mb-3">{company}</div>
                <ul>
                    {responsibilities.map((responsibility: string, index: number) => (
                        <li key={index}>{responsibility}</li>
                    ))}
                </ul>
            </div>
            <div className="resume-date text-md-right">
                <span className="text-primary">{date}</span>
            </div>
        </div>
    );
}

const Experience: React.FC = () => {
    const experienceData: Responsibility[] = [
        {
            title: "Full Stack Developer",
            company: "Off-Grid Distribution",
            date: "Apr 2023 - Present",
            responsibilities: [
                ""
            ]
        },
        {
            title: "Software Engineer Intern",
            company: "Bulletproof",
            date: "Sep 2022 - Jan 2023",
            responsibilities: [
                "Design, develop, and debug responsive web applications.",
                "Utilize React, Node.JS, NoSQL, TypeScript and other technologies.",
                "Engage in code reviews, design discussions and testing."
            ]
        },
        {
            title: "Math & Calculus Tutor",
            company: "John Abbott College",
            date: "Sept 2012 - June 2016",
            responsibilities: [
                "Mentoring High School and College students on topics related to Math.",
                "Topics include Algebra, Calculus, and more."
            ]
        }
    ];

    return (
        <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="experience">
            <div className="my-auto">
                <h2 className="mb-5">Experience</h2>
                {experienceData.map((experience: Responsibility, index: number) => (
                    <ExperienceItem
                        key={index}
                        title={experience.title}
                        company={experience.company}
                        date={experience.date}
                        responsibilities={experience.responsibilities}
                    />
                ))}
            </div>
        </section>
    );
}

export default Experience;
