// import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import StarBg from "../components/StarBg"
import { useState } from "react";
import ExperiencePoint from "../components/ExperiencePoint";

export default function HomePage() {
    const { scrollYProgress } = useScroll()
    const [windowHeight] = useState<number>(window.innerHeight);
    const wavesY = useTransform(scrollYProgress, [0, 0.6], [windowHeight, 0])
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

    return (
        <div className='relative flex flex-col'>
            
            {/* landing */}
            <section className="fixed flex flex-col h-screen w-screen justify-center items-center">
                <StarBg />
                <div className="
                    h-[80%] w-full px-[10%]
                    group/outer relative 
                    flex flex-row justify-center items-center
                    ">
                    <motion.div
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 3, delay: 0.2, ease: "easeInOut" }}
                        className="
                            flex flex-col z-50 pointer-events-none w-[40%] h-[40%] p-[2%] bg-zinc-900 
                            border-1 border-white rounded-lg justify-center
                            transition-transform duration-400 delay-80 
                            group-hover/outer:scale-115 group-hover/outer:-rotate-2 group-hover/outer:-translate-x-[60%] group-hover/outer:-translate-y-20
                            "
                    >
                        <h1 className="text-white text-7xl pb-[5%]">Frontend Developer</h1>
                        <h2 className="text-white text-2xl">Hi! I'm Liam, a Frontend Developer dedicated to making scalable, high-performance, and user-centered web solutions.</h2>
                    </motion.div>
                    <div
                        className="
                            absolute z-40 w-[30%] h-[80%] mb-[20%]
                            opacity-0 translate-x-0
                            group-hover/outer:opacity-100 group-hover/outer:translate-x-[60%] group-hover/outer:translate-y-[20%]
                            transition-translate duration-500 ease-in-out
                            group/inner
                        "
                    >
                        {/* icons */}
                        <a
                            className=" icon-link-github
                            absolute z-0 w-[12%] h-[12%]
                            bottom-[20%] left-[30%]
                            flex justify-center items-center
                            opacity-0
                            cursor-pointer
                            group-hover/outer:opacity-100 group-hover/outer:-translate-y-[14vw] group-hover/outer:-translate-x-[5vw]
                            transition duration-500 group-hover/outer:delay-[400ms]
                            "
                            tabIndex={0}
                            href="https://github.com/huynhli" target="_blank" rel="noreferrer"
                        >
                            <img src='/images/github_logo.png'
                            alt="GitHub logo, opens up to GitHub profile"
                            className="
                            bg-white p-1 w-full
                            border-1 rounded-lg border-black
                            invert
                            hover:scale-115 
                            transition-scale duration-100 ease-in
                            "

                            />
                        </a>
                        <a
                            className=" icon-link
                            absolute z-0 w-[12%] h-[12%]
                            bottom-[20%] left-[45%]
                            flex justify-center items-center
                            opacity-0
                            cursor-pointer
                            group-hover/outer:opacity-100 group-hover/outer:-translate-y-[14vw]
                            transition duration-500 group-hover/outer:delay-[400ms]
                            active:
                            "
                            tabIndex={0}
                            href="https://www.linkedin.com/in/liam-huynh-91aa1a1a1/" target="_blank" rel="noreferrer"
                        >
                            <img src='/images/linkedin_logo.png'
                            alt="LinkedIn logo, opens up to LinkedIn profile"
                            className="
                            w-full
                            border-1 rounded-lg border-white
                            hover:scale-115 
                            transition-scale duration-100 ease-in
                            "
                            />
                            
                        </a>
                        <a
                            className=" icon-link
                            absolute z-0 w-[12%] h-[12%]
                            bottom-[20%] right-[30%]
                            flex justify-center items-center
                            opacity-0
                            cursor-pointer
                            group-hover/outer:opacity-100 group-hover/outer:-translate-y-[14vw] group-hover/outer:translate-x-[5vw]
                            transition duration-500 group-hover/outer:delay-[400ms]
                            hover:scale-115
                            "
                            tabIndex={0}
                            href="https://trachscor.itch.io/" target="_blank" rel="noreferrer"
                        >
                            <img src='/images/itch_logo.png'
                            alt="Itch.io logo, opens up to Itch.io profile"
                            className="
                            bg-red-400 p-1 w-full
                            border-1 rounded-lg border-white
                            hover:scale-115 
                            transition-scale duration-100 ease-in
                            "
                            />
                        </a>

                        {/* txt */}
                        <div
                            className="
                            w-full h-[40%] p-[7%] mt-[60%]
                            absolute flex justify-center items-center bg-zinc-900 
                            border border-white rounded-lg justify-center
                            transition-transform duration-300 ease-in-out group-hover/inner:scale-115
                            hover:scale-115
                            "
                        >
                            <h1 className="text-white text-[clamp(1rem,1.5vw,2rem)]">Combining full-stack and game development experiences, I'm obsessed with seeing ideas come to life and sharing that experience with others.</h1>
                        </div>
                    </div>
                    
                </div>

                {/* TODO resume button */}
                
            </section>

            {/* Roadmap-y section */}
            <motion.section
                style={{ y: wavesY }}
                className="
                min-h-[200vh] z-100 py-[2%]
                border-t-5 rounded-t-4xl border-white bg-[#141414]
                grid grid-cols-1 sm:grid-cols-6
                grid-rows-9
                "
            >
                
                {/* experience */}
                <div className="text-white col-span-4 row-span-2 pt-[2%] px-[10%]">
                    <h1 className="text-4xl">EXPERIENCE</h1>
                    <ExperiencePoint 
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
                <div className="bg-white col-start-3 col-span-4 row-span-2 row-start-4">hiiiiiiiiiiiiiiiiiiiiii

                </div>

                {/* stack */}
                <div className="bg-white col-start-2 col-span-4 row-start-7 row-span-3"></div>
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

    )
}