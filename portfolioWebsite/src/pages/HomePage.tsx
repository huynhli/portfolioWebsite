import { motion, useScroll, useTransform } from "framer-motion"
import StarBg from "../components/StarBg"
import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react" 
import ExperiencePoint from "../components/ExperiencePoint" 
import Landing from "../components/Landing" 
import ProjectPoint from "../components/ProjectPoint" 
import ProjectImage from "../components/ProjectImg" 
import TechStackSection from "../components/TechStackSection" 
import { useNavigate } from "react-router-dom"

export default function HomePage() {
    const navigate = useNavigate()
    const goToProjects = () => {
        navigate('/projects')
    }
    

    const { scrollYProgress } = useScroll()
    const page2Slide = useTransform(scrollYProgress, [0, 0.6], [window.innerHeight, 0])
    
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
    const textOpacityExp = useTransform(roadmapYProgress, [0.26, 0.35], [0, 1])
    const textXExp = useTransform(roadmapYProgress, [0.22, 0.35], [300, 0])

    const projectOpacity = useTransform(roadmapYProgress, [0.3, 0.4], [0, 1])
    const projectX = useTransform(roadmapYProgress, [0.3, 0.38], [300, 0])

    const [hoverIndex, setHoverIndex] = useState<number>(0)
    const [projImgTimeout, setProjImgTimeout] = useState<number>(0)

    const projImgTimeoutRef = useRef<number | null>(null);

    const enteringProjPoint = (index: number) => {
        if (projImgTimeoutRef.current) {
            clearTimeout(projImgTimeoutRef.current);
            projImgTimeoutRef.current = null;
        }
        setHoverIndex(index);
    }

    const leavingProjPoint = () => {
        if (projImgTimeoutRef.current) clearTimeout(projImgTimeoutRef.current);
        projImgTimeoutRef.current = window.setTimeout(() => {
            setHoverIndex(0);
            projImgTimeoutRef.current = null;
        }, 1000);
    }
    const projectImages = ['/images/tempGameBlogImg.png', '/images/tempSpotifyRecsImg.png', '/images/tempSpotifyRecsImg.png']

    const stackOpacity = useTransform(roadmapYProgress, [0.45, 0.5], [0, 1])
    const stackX = useTransform(roadmapYProgress, [0.45, 0.5], [300, 0])

    return (
        <div className='relative flex flex-col'>
            {/* landing */}
            <Landing/>

            {/* Roadmap-y section */}
            <motion.section
                ref={roadmapRef}
                style={{ y: page2Slide }}
                className="
                    z-100 py-[2%]
                    border-t-5 rounded-t-4xl border-white bg-[#141414]
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
                    <img src="/images/rocket.png"/>

                </motion.div>
                

                {/* experience */}
                <div className="text-white col-span-4 col-start-1 row-span-2 pt-[5px] px-[10%]">
                    <motion.h1 className="text-6xl" style={{opacity:textOpacityExp, x:textXExp}}>EXPERIENCE</motion.h1>
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
                    />
                </div>

                {/* projects */}
                <div className="
                    relative 2xl:col-start-3 2xl:col-span-4 2xl:row-span-2 2xl:row-start-4 text-white mt-[10%] 2xl:mt-0 mx-[5%]
                    2xl:mt-60
                    "
                >
                    <motion.h1 
                        className="text-6xl pb-[1%]"
                        style={{opacity: projectOpacity, x: projectX}}
                        onClick={goToProjects}
                    >
                        PROJECTS
                    </motion.h1>
                    <div className="grid grid-cols-8 grid-rows-3 2xl:h-[700px] h-[900px]">
                        <ProjectPoint
                            scrollYProgress={roadmapYProgress}
                            title="Game Design Blog"
                            desc="Articles I write about game dessign choices I make, love, or both!"
                            stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                            order={1}
                            enterProj={enteringProjPoint}
                            leaveProj={leavingProjPoint}
                        />
                        <ProjectPoint
                            scrollYProgress={roadmapYProgress}
                            title="What 2 Eat"
                            desc="Is choosing dinner too overwhelming? Try this."
                            stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                            order={2}
                            enterProj={enteringProjPoint}
                            leaveProj={leavingProjPoint}
                        />
                        <ProjectPoint
                            scrollYProgress={roadmapYProgress}
                            title="Spotify Song Recs"
                            desc="Recommendations based on your spotify songs, playlists, artists, or albums!"
                            stack={["Typescript","React", "Restful APIs", "Tanstack Query", "TailwindCSS"]}
                            order={3}
                            enterProj={enteringProjPoint}
                            leaveProj={leavingProjPoint}
                        />
                        <div className="z-50 col-start-5 col-span-4 2xl:col-start-6 2xl:col-span-3 row-span-3 row-start-1 border-y-1 border-white">
                            <div className="w-full h-full border-x-2 rounded-l-[35%] border-white flex justify-center center-items">
                                {hoverIndex === 0 
                                ? 
                                    <button onClick={goToProjects} className="text-3xl mx-10 2xl:text-6xl text-blue-500 underline cursor-pointer">View all my projects here!</button> 
                                :   
                                    <motion.img
                                        className="
                                            h-full w-full bg-blue-200 object-contain
                                            border-l-2 rounded-l-[35%] border-white
                                            
                                            "
                                        whileHover={{}}
                                        onMouseEnter={() => {
                                            if (projImgTimeoutRef.current) {
                                                clearTimeout(projImgTimeoutRef.current);
                                                projImgTimeoutRef.current = null;
                                            }
                                        }}
                                        onMouseLeave={leavingProjPoint}
                                        src={projectImages[hoverIndex-1]}
                                        alt={`An image of the project: ${hoverIndex === 1 ? 'Game Design Blog' : hoverIndex === 2 ? 'What 2 Eat' : 'Spotify Song Recs'}`}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* stack + contact */}
                <div className="2xl:mt-60 text-white flex flex-col 2xl:w-full w-[80%] 2xl:col-start-2 2xl:col-span-4 2xl:mt-0 mt-[10%] 2xl:row-start-7 2xl:row-span-7">
                    <motion.h1 className="lg:mb-8 text-6xl lg:text-7xl" style={{x: stackX, opacity:stackOpacity}}>My Stack</motion.h1>
                    {/* Frontend */}
                    <TechStackSection 
                        scroll={roadmapYProgress}
                        beginFade={0.4525}
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
                        beginFade={0.5}
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
                        beginFade={0.53}
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
                        beginFade={0.56}
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

                    {/* contact info */}
                    <div className="h-50 flex flex-col items-center text-5xl xl:text-6xl 2xl:text-7xl 2xl:w-full 2xl:mx-0 mx-[10%] mt-[10%]">
                        Find me:
                        <div className="mt-3 xl:mt-12 mb-2 text-3xl xl:text-4xl 2xl:text-5xl flex flex-col justify-center items-center xl:flex-row xl:justify-between w-full italic">
                            <a className='text-blue-400 hover:underline mb-2' href='mailto:liamtamh@gmail.com'>liamtamh@gmail.com</a>
                            <a className='text-blue-400 hover:underline mb-2 flex flex-row' href='https://www.linkedin.com/in/liam-huynh-91aa1a1a1/' target="_blank" rel='_noreferrer'><img className='w-9 2xl:w-12 mr-2' src='/images/linkedin_logo.png'/>LinkedIn</a>
                            <a className='text-blue-400 hover:underline flex flex-row' href='https://github.com/huynhli' target="_blank" rel='_noreferrer'><img className='w-9 2xl:w-12 mr-2' src='/images/stack_logos/tools/logo_github.png'/>Github</a>
                            {/* TODO fill in txt fx liquid lef to right */}
                        </div>
                    </div>
                </div>
                
            </motion.section>
            
            
        </div>
    )
}
        {/* 
            <div className="flex justify-center p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold"><p>{loadingText} If nothing loads for a while, please load <a href='https://liamportfolioweb.onrender.com/' className='text-blue-400 hover:text-blue-500 underline'>this page</a> and come back.</p></div>
                        ) : allArticles.length > 0 ? (
                            allArticles.map((article, i) => (
                                <div key={i} onClick={goToArticle(article.id)} className="group relative hover:cursor-pointer transition-transform duration-300 hover:scale-104 flex flex-col bg-purple-400 p-4 min-h-20 mb-30 items-center justify-center font-bold rounded-md shadow-md">
          
                                    <div className="absolute inset-0 bg-white bg-opacity-40 opacity-0 active:opacity-30 transition-opacity duration-200 z-20 rounded-md"></div>

     
                                    <div className="relative overflow-hidden w-full rounded-md mb-3">
                                        <img src={article.cover} className="w-full h-80 object-cover z-10" />
                                    </div>
                                    <p className="z-10 relative">{article.title}</p>
                                    <p className="z-10 relative">{article.date}</p>
                                </div>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">No articles found</div>
                    )}
                </div>
            </div> */}

     // const bottomWavesSpring = useSpring(bottomWavesY, { stiffness: 100, damping: 10})
    // stiffness = spring force, damping = resistance 

    // const [allArticles, setAllArticles] = useState<{
    //     id: string
    //     title: string
    //     date: string
    //     cover: string
    // }[]>([])
    // const [isLoading, setIsLoading] = useState(true)
    // const [loadingText, setLoadingText] = useState<string>("Loading main page.")

    // const getArticleBanners = async () => {
    //     try {
    //         setIsLoading(true)  
    //         const responseObj = await fetch('https://liamportfolioweb.onrender.com/api/articleBanners')
    //         const articleBanners = await responseObj.json()
    //         setAllArticles(articleBanners)
    //     } catch(error) {
    //         console.error('Error fetching: ', error)
    //         setAllArticles([
    //         {
    //             id: "error",
    //             title: "Something went wrong",
    //             date: new Date().toISOString().split('T')[0],
    //             cover: ''
    //         }
    //         ])
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }
    
    // const goToArticle = (article_id: String) => {
    //     // string windowToGoTo = backendcall(pagenum)
    //     return () => {
    //         window.location.href = `/BlogArticle/Article?artid=${article_id}` 
    //     }
    // }

    // useEffect(() => {
    //     getArticleBanners()
    // }, [])

    // useEffect(() => {
    //     if (!isLoading) return
    //     const loadingTextArray = ["Loading main page.", "Loading main page..", "Loading main page..."]
    //     let index = 0

    //     const interval = setInterval(() => {
    //         index = (index + 1) % loadingTextArray.length
    //         setLoadingText(loadingTextArray[index])
    //     }, 500)

    //     return () => clearInterval(interval)
    // }, [isLoading])
