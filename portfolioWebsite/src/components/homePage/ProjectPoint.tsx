import { motion, MotionValue, useTransform } from "framer-motion"
import { useNavigate } from "react-router-dom"

type projectProp = {
    scrollYProgress: MotionValue<number>
    title: string
    desc: string
    stack: string[]
    order: number
    enterProj: (index: number) => void
    leaveProj: () => void
    roadmapWidth: number
    projectLink: string
}

export default function ProjectPoint({scrollYProgress, title, desc, stack, order, enterProj, leaveProj, roadmapWidth, projectLink}:projectProp) {
    const pointX = useTransform(scrollYProgress, roadmapWidth < 798 ? [0,0] : [0.32+(order*0.04), 0.36+(order*0.04)], [200, 0])
    const pointOpacity = useTransform(scrollYProgress, roadmapWidth < 798 ? [0,0] : [0.32+(order*0.04), 0.36+(order*0.04)], [0, 1])
    const navigate = useNavigate()
    const goToProject = () => {
        navigate(`/projects/${projectLink}`)
    }
    return (
        <motion.div 
            className={`
                h-full row-start-${order} 2xl:col-span-5 col-span-4 col-start-1 flex flex-col justify-center border-white border-t-1 border-s-1 ${roadmapWidth < 798 ? "border-r-1 hover:-translate-x-[5%] hover:-mr-[5%] hover:pr-[5%]" : "hover:-translate-x-[5%] hover:-mr-[21%] hover:pr-[21%]" } ${order === 3 ? "border-b-1": ""} p-[2%] py-[5%]
                2xl:hover:-translate-x-[15%] transition-all hover:border-l-1 hover:border-y-1
                hover:cursor-pointer
                `}
            style={{x: pointX, opacity: pointOpacity}}
            onMouseEnter={() => enterProj(order)}
            onMouseLeave={() => leaveProj()}
            onClick={goToProject}
        >
            <div className="flex flex-row">
                <h1 className="text-4xl pr-2">{title}</h1>
                <div className="h-full bg-white w-[3px] mx-1"/>
                <ul>{stack.map((framework, key) => (
                    <li key={key} className="italic text-xl inline-block mx-1">{framework}{key != stack.length-1 ? ", ": ""}</li>
                ))}</ul>
            </div>
            <p className="pt-2">{desc}</p>
        </motion.div>
    )
}