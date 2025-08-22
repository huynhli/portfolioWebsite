// import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export default function HomePage() {
    const { scrollYProgress } = useScroll()

    const wavesY = useTransform(scrollYProgress, [0, 0.4], [100, 0])
    const wavesScaleY = useTransform(scrollYProgress, [0, 0.2], [2, 1])
    const bottomWavesY = useTransform(scrollYProgress, [0.4, 0.6], [-100, 700])
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

            <section className="relative flex flex-col h-200 justify-center items-center">
                <motion.div className="absolute pointer-events-none z-[-1] w-[100%] h-[100%] z-10 "
                    style={{ opacity: 0}}
                    animate={{ opacity: 1 }}
                    // x, y, scale(x/y), rotate, rotateX, rotateY, skewX, skewY, opacity, colours, width, height, padding,margin, border radius, filter, zindex

                    transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
                    // duration, delay, ease, repeat, repeatType, spring. per property transition
                >
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="snowflake"></div>
                    ))}
                </motion.div>

                <div className="
                    bg-white h-100 pb-10 px-[20%] pt-30 w-[80%]
                    group relative flex flex-row justify-center items-center
                    ">
                    <motion.div
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 4, delay: 0.2, ease: "easeInOut" }}
                        className="
                            flex flex-col z-50 pointer-events-none w-[25%] min-w-90 max-w-100 h-50 px-5 bg-zinc-900 border-1 border-white rounded-lg justify-center
                            transition duration-400 delay-80 group-hover:scale-115 group-hover:-rotate-3 group-hover:-translate-x-50 group-hover:-translate-y-10
                            "
                    >
                        <h1 className="text-white text-[clamp(2rem,2vw,2rem)]">Frontend Developer</h1>
                        <h2 className="text-white text-[clamp(1rem,1vw,1rem)] mb-5">Hi! I'm Liam, a Frontend Developer dedicated to making scalable, high-performance user-centered web solutions.</h2>
                    </motion.div>
                    <div
                        className="
                            absolute flex-col z-40 w-[25%] min-w-90 max-w-100 h-50 px-5 bg-zinc-900 border border-white rounded-lg justify-center
                            opacity-0 translate-x-0
                            group-hover:opacity-100 group-hover:translate-x-60
                            transition-all duration-400 ease-in-out
                        "
                    >
                        <h1 className="text-white text-[clamp(2rem,2vw,2rem)]">Second section</h1>
                        <h2 className="text-white text-[clamp(1rem,1vw,1rem)] mb-5">Here is more info about me.</h2>
                    </div>
                </div>

                {/* resume button that follows you */}

                
            </section>
            
            <motion.section className="pointer-events-none absolute w-full top-100 z-10 scale-y-50"
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
            </motion.section>

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