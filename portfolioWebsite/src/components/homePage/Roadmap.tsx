import { motion, MotionValue, useScroll, useTransform } from "framer-motion"
import StarBg from "../StarBg"
import { useState, useEffect, useRef } from "react" 
import ExperiencePoint from "./ExperiencePoint" 
import TechStackSection from "./TechStackSection" 
import ProjectSection from "./ProjectSection"

type roadmapProp = {
    slideTransform: MotionValue<number>
}

export default function Roadmap ({slideTransform} : roadmapProp) {
    const roadmapRef = useRef<HTMLElement | null>(null)
    // Roadmap animations code
    const { scrollYProgress: roadmapYProgress} = useScroll({
        target: roadmapRef,
        offset: ["start end", "end start"],

    })
    const [roadmapSize, setRoadmapSize] = useState({width: 0, height: 0})
    useEffect(() => {
        if (!roadmapRef.current) return
        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect
            setRoadmapSize({ width, height })
        })

        observer.observe(roadmapRef.current)
        return () => observer.disconnect()
    }, [])

    const rocketX = useTransform(
        roadmapYProgress, [0.25, 0.27, 0.3, 0.34, 0.4, 0.45, 0.5, 0.52, 0.6], [0, roadmapSize.width * 0.05, -(roadmapSize.width * 0.13), roadmapSize.width * 0.04, -(roadmapSize.width * 0.7), -(roadmapSize.width*0.67), -(roadmapSize.width*0.5), -(roadmapSize.width*0.33), -(roadmapSize.width*0.25)]
        // [0.05, 0.12, 0.14, 0.18, 0.23, 0.28, 0.37, 0.4, 0.43],
        // [0, roadmapSize.width * 0.05, -(roadmapSize.width * 0.15), roadmapSize.width * 0.1, -(roadmapSize.width*0.7), -(roadmapSize.width*0.75), -(roadmapSize.width*0.67), -(roadmapSize.width*0.77), -(roadmapSize.width*0.35)]
    ) 
    const rocketY = useTransform(
        roadmapYProgress, 
        [0.16, 0.38, 0.4, 0.5, 0.90, 0.95],
        [0, roadmapSize.height * 0.12, roadmapSize.height * 0.11, roadmapSize.height * 0.44, roadmapSize.height * 0.45, roadmapSize.height * 0.5]
    ) 
    // const rocketRotate = useTransform(
    //     scrollYProgress,
    //     [],
    //     []
    // )

    

    // Roadmap text animations
    const textOpacityExp = useTransform(roadmapYProgress, roadmapSize.width < 798 ? [0.05, 0.12] : [0.16, 0.33], [0, 1])
    const textXExp = useTransform(roadmapYProgress, roadmapSize.width < 798 ? [0.05, 0.12] : [0.16, 0.3], [300, 0])

    const stackOpacity = useTransform(roadmapYProgress, [0.35, 0.42], [0, 1])
    const stackX = useTransform(roadmapYProgress, [0.35, 0.42], [300, 0])
    return (
        <motion.section
            ref={roadmapRef}
            style={{ y: slideTransform }}
            className="
                z-100 py-[2%] pb-[5%]
                border-y-5 rounded-t-4xl rounded-b-4xl border-white bg-[#141414]
                flex flex-col items-center
                2xl:grid 2xl:grid-cols-6 grid-rows-[auto]
                relative
            "
        >
            <StarBg/>

            {/* rocketship */}
            <motion.div
                className="absolute top-10 right-[10%] hidden 2xl:flex self-center h-[200px] w-[200px]"
                style={{x:rocketX, y:rocketY}}
            >
                {/* <img src="/images/rocket.png"/> */}

            </motion.div>
            

            {/* experience */}
            <div className="text-white col-span-4 col-start-1 row-span-2 pt-[5%] lg:pt-0 mt-[3px] px-[10%]">
                <motion.h1 className="text-6xl" style={{opacity:textOpacityExp, x:textXExp}}>Experience</motion.h1>
                <ExperiencePoint 
                    scrollYProgress={roadmapYProgress}
                    pointNum={1}
                    position="Full-stack Developer" 
                    company="TBSP Games"
                    companyLink = "https://tablespoongames.pages.dev/"
                    date="Jul 2025 - Aug 2025" 
                    frameworks={["React", "Redux", "Tanstack Query", "Motion", "Jest", "Docker"]} 
                    points={[
                        "Reduced client-side latency by over 600 ms by optimizing RESTful API data fetching workflows and server state management with Tanstack Query and Axios", 
                        "Doubled interactive visual effects and improved perceived app responsiveness by enhancing user engagement and loweringperceived latency with Framer Motion animation", 
                        "Improved DevOps efficiency and deployment reliability by containerizing frontend applications with Docker and orchestrating clusters via Kubernetes, streamlining CI/CD workflows and reducing environment-related errors by 40%"]} 
                    roadmapWidth={roadmapSize.width}
                />
            </div>

            {/* projects */}
            <ProjectSection roadmapWidth={roadmapSize.width} roadmapYProgress={roadmapYProgress}/>

            {/* stack */}
            <div className="2xl:mt-60 text-white flex flex-col 2xl:w-full w-[80%] 2xl:col-start-2 2xl:col-span-4 2xl:mt-0 mt-[10%] 2xl:row-start-7 2xl:row-span-7">
                <motion.h1 className="text-6xl lg:text-7xl" style={{x: stackX, opacity:stackOpacity}}>Stack</motion.h1>
                {/* Frontend */}
                <TechStackSection 
                    scroll={roadmapYProgress}
                    beginFade={roadmapSize.width < 798 ? 0.41 : 0.52}
                    title="Frontend"
                    frameworks={[
                        ["react","React"], 
                        ["tanstackQuery","Tanstack Query"], 
                        ["redux","Redux"], 
                        ["zustand","Zustand"],
                        ["reactRouter","React Router"], 
                        ["motion","Motion"],  
                        ["tailwindcss","Tailwind CSS"], 
                        ["sass","SASS"], 
                        ["shadcn","Shadcn"], 
                        ["jest","Jest"], 
                        ["vitest","Vitest"]
                    ]}
                />            
                {/* Backend */}
                <TechStackSection 
                    scroll={roadmapYProgress}
                    beginFade={0.55}
                    title="Backend"
                    frameworks={[
                        ["fiber", "Fiber"],
                        ["express", "Express"],
                        ["mongodb", "MongoDB"],
                        ["postgresql", "PostgreSQL"],
                        ["supabase", "Supabase"],
                    ]}
                /> 
                {/* Languages */}
                <TechStackSection 
                    scroll={roadmapYProgress}
                    beginFade={0.58}
                    title="Languages"
                    frameworks={[
                        ["html","HTML"], 
                        ["css","CSS"], 
                        ["js","Javascript"], 
                        ["typescript","Typescript"],
                        ["golang", "Golang"]
                    ]}
                />
                {/* Tools */}
                <TechStackSection 
                    scroll={roadmapYProgress}
                    beginFade={0.61}
                    title="Tools"
                    frameworks={[
                        ["docker", "Docker"],
                        ["kubernetes", "Kubernetes"],
                        ["npm", "NPM"],
                        ["vite", "Vite"],
                        ["git", "Git"],
                        ["github", "Github"],
                        ["bash", "Bash"],
                    ]}
                />
            </div>
            
        </motion.section>
    )
}