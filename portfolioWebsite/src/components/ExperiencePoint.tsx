type pointProps = {
    position: string
    frameworks: string[]
    company: string
    date: string
    points: string[]
}

export default function ExperiencePoint ({ position, frameworks, company, date, points } : pointProps) {

    return (
        <div className="py-3">
            <div className="flex flex-col sm:flex-row">
                <h2 className="text-2xl block">{position}</h2>
                <h2 className="text-2xl px-2">|</h2>
                <ul className="text-2xl flex flex-row">
                    {frameworks.map((framework, key) => (
                        <li className="px-1" key={key}>{framework}{key < frameworks.length - 1 ? "," : ""}</li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                <h2 className="italic text-2xl">{company}</h2>
                <h2 className="italic text-2xl">{date}</h2>
            </div>
            <div className="leading-relaxed">
                <ul>
                    {points.map((point, key) => (
                        <li key={key}>- {point}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}