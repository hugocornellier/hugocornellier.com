import React from 'react';

interface Award {
    title: string;
    description: string;
}

const AwardItem: React.FC<Award> = ({ title, description }) => {
    return (
        <div>
            <ul className="fa-ul mb-0 ml-0">
                <li>
                    <div className="subheading mb-3">{title}</div>
                </li>
            </ul>
            <ul>
                <li>{description}</li>
            </ul>
        </div>
    );
}

const Awards: React.FC = () => {
    const awards: Award[] = [
        {
            title: "Dean’s List 2022/23",
            description: "Received Dean’s List honours"
        },
        {
            title: "First Division",
            description: "Graduated in First Division from UNB"
        }
    ];

    return (
        <section className="resume-section p-3 p-lg-5 d-flex flex-column" id="awards">
            <div className="my-auto">
                <h2 className="mb-5">Awards</h2>
                {awards.map((award, index) => (
                    <AwardItem key={index} {...award} />
                ))}
            </div>
        </section>
    );
}

export default Awards;
