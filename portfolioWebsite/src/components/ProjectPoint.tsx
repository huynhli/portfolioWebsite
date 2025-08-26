import { motion, MotionValue, useTransform } from "framer-motion"

type projectProp = {
    scrollYProgress: MotionValue<number>
    title: string
    desc: string
    stack: string[]
    order: number
}

export default function ProjectPoint({scrollYProgress, title, desc, stack, order}:projectProp) {
    const pointX = useTransform(scrollYProgress, [0.2+(order*0.05), 0.25+(order*0.05)], [40, 0])
    const pointOpacity = useTransform(scrollYProgress, [0.2+(order*0.05), 0.25+(order*0.05)], [0, 1])

    return (
        <motion.div 
            className={`
                h-full row-start-${order} col-span-5 col-start-1 flex flex-col justify-center border-white border-t-1 border-s-1 ${order === 3 ? "border-b-1": ""} p-[2%] py-[5%]
                2xl:hover:-translate-x-[15%] transition-all 2xl:hover:-mr-[21%] 2xl:hover:pr-[21%] bg-purple-200 hover:border-l-1 hover:border-y-1
                hover:-translate-x-[5%] hover:-mr-[7%] hover:pr-[7%]
                `}
            style={{x: pointX, opacity: pointOpacity}}
        >
            <div className="flex flex-row">
                <h1 className="text-2xl pr-2">{title}</h1>
                <div className="h-full bg-white w-[3px] mx-1"/>
                <ul>{stack.map((framework, key) => (
                    <li key={key} className="italic text-xl inline-block mx-1">{framework}{key != stack.length-1 ? ", ": ""}</li>
                ))}</ul>
            </div>
            <p className="pt-2">{desc}</p>
        </motion.div>
    )
}