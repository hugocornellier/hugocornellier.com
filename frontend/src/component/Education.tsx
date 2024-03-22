import React from 'react';

interface EducationProps {}

const Education: React.FC<EducationProps> = () => {
    return (
        <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="education">
            <div className="my-auto">
                <h2 className="mb-5">Education</h2>
                <EducationItem
                    title="B. Sc in Computer Science"
                    institution="University of New Brunswick"
                    GPA="3.7"
                    details={[
                        "Dean's List 2022/23",
                        "Graduated in First Division"
                    ]}
                    date="Sept 2019 — Aug 2023"
                />
            </div>
        </section>
    );
}

interface EducationItemProps {
    title: string;
    institution: string;
    GPA: string;
    details: string[];
    date: string;
}

const EducationItem: React.FC<EducationItemProps> = ({ title, institution, GPA, details, date }) => {
    return (
        <div className="resume-item d-flex flex-column flex-md-row mb-5">
            <div className="resume-content mr-auto">
                <h3 className="mb-0">{title}</h3>
                <div className="subheading mb-3">{institution}</div>
                <p>GPA: {GPA}</p>
                {details.map((detail, index) => (
                    <div key={index}>{detail}</div>
                ))}
            </div>
            <div className="resume-date text-md-right">
                <span className="text-primary">{date}</span>
            </div>
        </div>
    );
}

export default Education;
