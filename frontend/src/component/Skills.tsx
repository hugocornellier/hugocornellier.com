function SkillHeader(props: any) {
    return (
        <div className="subheading mb-3 mt-4">
            {props.header}
        </div>
    );
}

function SkillList(props: { items: string[] }) {
    return (
        <ul className="list-inline">
            {props.items.map((item: string) => (
                <li key={item} className="list-inline-item">{item}</li>
            ))}
        </ul>
    );
}

export default function Skills() {
    const skillData = [
        {
            header: "Languages",
            skills: ["JavaScript", "TypeScript", "HTML5/CSS", "Python"]
        },
        {
            header: "Frameworks and Libraries",
            skills: ["React", "Node.js", "Bootstrap"]
        },
        {
            header: "Database",
            skills: ["SQL/SQLite", "MariaDB", "MongoDB"]
        },
        { header: "Tools",
            skills: ["Git", "Jira", "Bash"]
        },
        {
            header: "Other",
            skills: ["Bilingualism"]
        }
    ];

    return (
        <section className="resume-section p-3 p-lg-5 d-flex flex-column my-auto" id="skills">
            <div className="my-auto">
                <h2 className="mb-5">
                    Skills
                </h2>

                {skillData.map((data) => (
                    <div key={data.header}>
                        <SkillHeader header={data.header} />
                        <SkillList items={data.skills} />
                    </div>
                ))}
            </div>
        </section>
    );
}
