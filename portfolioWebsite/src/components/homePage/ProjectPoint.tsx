import { motion, MotionValue, useTransform } from "framer-motion"

type projectProp = {
    scrollYProgress: MotionValue<number>
    title: string
    desc: string
    stack: string[]
    order: number
    enterProj: (index: number) => void
    leaveProj: () => void
}

export default function ProjectPoint({scrollYProgress, title, desc, stack, order, enterProj, leaveProj}:projectProp) {
    const pointX = useTransform(scrollYProgress, [0.32+(order*0.03), 0.36+(order*0.03)], [200, 0])
    const pointOpacity = useTransform(scrollYProgress, [0.32+(order*0.03), 0.36+(order*0.03)], [0, 1])

    return (
        <motion.div 
            className={`
                h-full row-start-${order} 2xl:col-span-5 col-span-4 col-start-1 flex flex-col justify-center border-white border-t-1 border-s-1 ${order === 3 ? "border-b-1": ""} p-[2%] py-[5%]
                2xl:hover:-translate-x-[15%] transition-all hover:border-l-1 hover:border-y-1
                hover:-translate-x-[5%] hover:-mr-[21%] hover:pr-[21%]
                `}
            style={{x: pointX, opacity: pointOpacity}}
            onMouseEnter={() => enterProj(order)}
            onMouseLeave={() => leaveProj()}
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