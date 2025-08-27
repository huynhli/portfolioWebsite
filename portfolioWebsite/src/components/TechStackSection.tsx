import { motion } from "framer-motion"

type FrameworkPair = [string, string?]

type StackSectionProps = {
    title: string
    frameworks: FrameworkPair[]
}

export default function TechStackSection({title, frameworks} : StackSectionProps) {
    return (
        // TODO this doesnt need custom optional type, it can just use string
        <div className="flex flex-col sm:flex-row mt-10">
            <h2 className="text-6xl min-w-[30%]">
                {title}
            </h2>
            <ul className="text-5xl flex flex-row flex-wrap">
                {frameworks.map((frameworkPair, key) => (
                    <motion.li 
                        key={key}
                        style={{}}
                        className="flex flex-row m-4"
                    >
                        <img 
                            src={`/images/stack_logos/${title.toLowerCase()}/logo_${frameworkPair[0]}.png`}
                            className="w-12 mr-2 lazy"
                            alt={`Logo for ${frameworkPair[0]}`}
                        />
                        {frameworkPair[1] ?? frameworkPair[0]}
                    </motion.li>
                ))}
            </ul>
        </div>                    
    )
}