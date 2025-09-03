import { motion, MotionValue, useTransform } from "framer-motion"


type pointProps = {
    scrollYProgress: MotionValue<number>
    pointNum: number
    position: string
    frameworks: string[]
    company: string
    companyLink: string
    date: string
    points: string[]
    roadmapWidth: number
}

export default function ExperiencePoint ({ scrollYProgress, pointNum, position, frameworks, company, companyLink, date, points, roadmapWidth } : pointProps) {
    const offset = (pointNum-1) / (roadmapWidth < 798 ? 100 : 20)
    const posOpacity= useTransform(scrollYProgress, roadmapWidth < 798 ? [0.11+offset, 0.14+offset] : [0.25+offset, 0.33+offset], [0, 1])
    const posY= useTransform(scrollYProgress, roadmapWidth < 798 ? [0.11+offset, 0.16+offset] : [0.25+offset, 0.33+offset], [100, 0])

    const projTitleOpacity = useTransform(scrollYProgress, roadmapWidth < 798 ? [0.11+offset, 0.16+offset] : [0.25+offset, 0.32+offset], [0, 1])
    const projTitleY = useTransform(scrollYProgress, roadmapWidth < 798 ? [0.11+offset, 0.175+offset] : [0.26+offset, 0.31+offset], [150, 0])

    const pointsOpacity = useTransform(scrollYProgress, roadmapWidth < 798 ? [0.11+offset, 0.18+offset] : [0.25+offset, 0.33+offset], [0, 1])
    const pointsY = useTransform(scrollYProgress, roadmapWidth < 798 ? [0.11+offset, 0.195+offset] : [0.28+offset, 0.33+offset], [200, 0])

    
    return (
        <div className="py-3">
            <motion.div 
                className="flex flex-col lg:flex-row lg:my-2"
                style={{y:posY, opacity:posOpacity}}
            >
                <h2 className="text-2xl block lg:border-r-1 lg:border-b-0 border-b-1 lg:pr-2 lg:mr-1 mb-1 pb-2 lg:pb-0 2xl:">{position}</h2>
                <ul className="text-2xl flex flex-row flex-wrap">
                    {frameworks.map((framework, key) => (
                        <li className="px-1" key={key}>{framework}{key < frameworks.length - 1 ? "," : ""}</li>
                    ))}
                </ul>
            </motion.div>
            <motion.div 
                className="flex flex-col lg:flex-row lg:justify-between py-1 lg:mb-2"
                style={{y:projTitleY, opacity:projTitleOpacity}}
            >
                <a href={companyLink} target="_blank" rel="noreferrer" className="italic text-2xl underline text-blue-400 hover:text-blue-500 active:text-blue-600">{company}</a>
                <h2 className="italic text-2xl">{date}</h2>
            </motion.div>
            <motion.div 
                className="leading-[1.75] flex-wrap"
                style={{opacity: pointsOpacity, y: pointsY}}
            >
                <ul>
                    {points.map((point, key) => (
                        <li key={key}>- {point}</li>
                    ))}
                </ul>
            </motion.div>
        </div>
    )
}