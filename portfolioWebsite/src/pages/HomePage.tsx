// import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import StarBg from "../components/StarBg"
import { useState, useEffect } from "react";
import ExperiencePoint from "../components/ExperiencePoint";
import Landing from "../components/Landing";
import ProjectPoint from "../components/ProjectPoint";
import ProjectImage from "../components/ProjectImg";

function useWindowSize() {
    const [size, setSize] = useState({ 
        width: typeof window !== 'undefined' ? window.innerWidth : 0, 
        height: typeof window !== 'undefined' ? window.innerHeight : 0 
    });

    useEffect(() => {
        const handleResize = () => setSize({ 
            width: window.innerWidth, 
            height: window.innerHeight 
        });
        
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return size;
}

export default function HomePage() {
    
    const { scrollYProgress } = useScroll()
    const {width:windowWidth, height:windowHeight} = useWindowSize()
    // const [windowHeight] = useState<number>(window.innerHeight);
    const page2Slide = useTransform(scrollYProgress, [0, 0.6], [windowHeight, 0])
    
    // const [windowWidth] = useState<number>(window.innerWidth)
    const rocketX = useTransform(
        scrollYProgress,
        [0.07, 0.13, 0.18, 0.24, 0.35],
        [0, windowWidth * 0.15, 0, windowWidth * 0.1, -(windowWidth*0.7)]
    );
    const rocketY = useTransform(
        scrollYProgress,
        [0.15, 0.25, 0.35, 0.4, 0.5],
        [0, windowHeight * 0.6, windowHeight * 0.6, windowHeight * 0.85, windowHeight * 1.2]
    );

    const textOpacityExp = useTransform(scrollYProgress, [0, 0.075], [0, 1])
    const textXExp = useTransform(scrollYProgress, [0, 0.075], [300, 0])

    const projectOpacity = useTransform(scrollYProgress, [0.25, 0.3], [0, 1])
    const projectX = useTransform(scrollYProgress, [0.25, 0.35], [300, 0])

    const [hoverIndex, setHoverIndex] = useState<number>(0)

    return (
        <div className='relative flex flex-col'>
            {/* landing */}
            <Landing/>

            {/* Roadmap-y section */}
            <motion.section
                style={{ y: page2Slide }}
                className="
                    min-h-[200vh] z-100 py-[2%]
                    border-t-5 rounded-t-4xl border-white bg-[#141414]
                    flex flex-col items-center
                    2xl:grid 2xl:grid-cols-6 grid-rows-9
                "
            >
                <StarBg/>
                {/* rocketship */}
                <motion.div
                    className="hidden 2xl:flex self-center row-start-1 col-start-5 col-span-2 bg-white h-[50%] w-[50%]"
                    style={{x:rocketX, y:rocketY}}
                >

                </motion.div>

                {/* experience */}
                <div className="text-white col-span-4 col-start-1 row-span-2 pt-[2%] px-[10%]">
                    <motion.h1 className="text-4xl" style={{opacity:textOpacityExp, x:textXExp}}>EXPERIENCE</motion.h1>
                    <ExperiencePoint 
                        scrollYProgress={scrollYProgress}
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
                    <ExperiencePoint 
                        scrollYProgress={scrollYProgress}
                        pointNum={2}
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
                    
                    "
                >
                    <motion.h1 
                        className="text-4xl pb-[1%]"
                        style={{opacity: projectOpacity, x: projectX}}

                    >
                        PROJECTS
                    </motion.h1>
                    <div className="border-1 border-white grid grid-cols-8 grid-rows-3">
                        <ProjectPoint
                            scrollYProgress={scrollYProgress}
                            title="Game Design Blog"
                            desc="Articles I write about game dessign choices I make, love, or both!"
                            stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                            order={1}
                            setter={setHoverIndex}
                        />
                        <ProjectPoint
                            scrollYProgress={scrollYProgress}
                            title="What 2 Eat"
                            desc="Is choosing dinner too overwhelming? Try this."
                            stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                            order={2}
                            setter={setHoverIndex}
                        />
                        <ProjectPoint
                            scrollYProgress={scrollYProgress}
                            title="Spotify Song Recommendations"
                            desc="Recommendations based on your spotify songs, playlists, artists, or albums!"
                            stack={["Typescript","React", "Restful APIs", "Tanstack Query", "TailwindCSS"]}
                            order={3}
                            setter={setHoverIndex}
                        />
                        <div className="z-50 col-start-5 col-span-4 2xl:col-start-6 2xl:col-span-3 row-span-3 row-start-1 border-y-1 border-white">
                            <div className="bg-green-200 w-full h-full border-l-2 rounded-l-[35%] border-white flex justify-items center-items">
                                {/* only need to pass in url */}
                                {hoverIndex === 0 ? (<button>View all Projects!</button>) : 
                                    hoverIndex === 1 ? (<ProjectImage imgUrl="" projectName="Game Design Blog"/>) :
                                        hoverIndex === 2 ? (<ProjectImage imgUrl="" projectName="What 2 Eat"/>) :
                                            (<ProjectImage imgUrl="" projectName="Spotify Song Recommendations"/>)// hoverIndex === 3
                                }
                            </div>
                        </div>
                    </div>
                    
                </div>

                {/* stack */}
                <div className="bg-white h-full w-full 2xl:col-start-2 2xl:col-span-4 2xl:row-start-7 2xl:row-span-3">
                    <p>Hello gang</p>
                </div>
            </motion.section>
            
            {/* <motion.section className="pointer-events-none absolute w-full top-100 z-10 scale-y-50"
                // style = start values, animate = end values, transition for type 
                style={{ y: wavesY, scaleY: wavesScaleY }}
                
            >
                <img src='/images/waves.png' className="w-full h-[400px] object-fill block" />
                <img src='/images/waves2.png' className="w-full h-[400px] object-fill block rotate-180" />
            </motion.section>

            <section className="relative h-200">
                <div className="left-0 w-full top-100 h-400 pointer-events-none z-[-1]">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="light-streak"></div>
                    ))}
                </div>

                
            </section>
            

            <motion.section className="pointer-events-none relative flex-col top-[-400px] w-full z-10 scale-y-50"
                // style = start values, animate = end values, transition for type 
                style={{ y: bottomWavesY }}
                
            >
                <img src='/images/waves2.png' className="w-full h-[400px] object-fill" />
                <img src='/images/waves.png' className="w-full h-[400px] object-fill rotate-180" />
            </motion.section> */}

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
        </div>
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
    )
}