import { motion, MotionValue, useTransform } from "framer-motion"
import ProjectPoint from "./ProjectPoint" 
import { useNavigate } from "react-router-dom"
import { useRef, useState } from "react"

type projectSectionProps = {
    roadmapWidth: number;
    roadmapYProgress: MotionValue<number>
}

export default function ProjectSection ({ roadmapWidth, roadmapYProgress } : projectSectionProps) {
    const navigate = useNavigate()
    const goToProjects = () => {
        navigate('/projects')
    }
    const goToProject = (hoverIndex: number) => {
        var link
        if (hoverIndex == 1){
            link = "/projects/gameDesignBlog"
        } else if (hoverIndex === 2) {
            link = "/projects/what2Eat"
        } else {
            link = "/projects/spotifySongRecs"
        }
        navigate(link)
    }
    const projectOpacity = useTransform(roadmapYProgress, roadmapWidth < 798 ? [0.2, 0.3] : [0.3, 0.42], [0, 1])
    const projectX = useTransform(roadmapYProgress, roadmapWidth < 798 ? [0.2, 0.3] :[0.3, 0.42], [300, 0])

    const [hoverIndex, setHoverIndex] = useState<number>(0)

    const projImgTimeoutRef = useRef<number | null>(null) 

    const enteringProjPoint = (index: number) => {
        if (projImgTimeoutRef.current) {
            clearTimeout(projImgTimeoutRef.current) 
            projImgTimeoutRef.current = null 
        }
        setHoverIndex(index) 
    }

    const leavingProjPoint = () => {
        if (projImgTimeoutRef.current) clearTimeout(projImgTimeoutRef.current) 
        projImgTimeoutRef.current = window.setTimeout(() => {
            setHoverIndex(0) 
            projImgTimeoutRef.current = null 
        }, 1000)
    }
    const projectImages = ['/images/tempGameBlogImg.png', '/images/tempSpotifyRecsImg.png', '/images/tempSpotifyRecsImg.png']

    return (
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
                Projects
            </motion.h1>
            {roadmapWidth > 798 ? 
                <div className="grid grid-cols-8 grid-rows-3 2xl:h-[700px] h-[900px]">
                    <ProjectPoint
                        scrollYProgress={roadmapYProgress}
                        title="Game Design Blog"
                        desc="Articles I write about game dessign choices I make, love, or both!"
                        stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                        order={1}
                        enterProj={enteringProjPoint}
                        leaveProj={leavingProjPoint}
                        roadmapWidth={roadmapWidth}
                        projectLink="gameDesignBlog"
                    />
                    <ProjectPoint
                        scrollYProgress={roadmapYProgress}
                        title="What 2 Eat"
                        desc="Is choosing dinner too overwhelming? Try this."
                        stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                        order={2}
                        enterProj={enteringProjPoint}
                        leaveProj={leavingProjPoint}
                        roadmapWidth={roadmapWidth}
                        projectLink="what2Eat"
                    />
                    <ProjectPoint
                        scrollYProgress={roadmapYProgress}
                        title="Spotify Song Recs"
                        desc="Recommendations based on your spotify songs, playlists, artists, or albums!"
                        stack={["Typescript","React", "Restful APIs", "Tanstack Query", "TailwindCSS"]}
                        order={3}
                        enterProj={enteringProjPoint}
                        leaveProj={leavingProjPoint}
                        roadmapWidth={roadmapWidth}
                        projectLink="spotifySongRecs"
                    />
                    <div className="z-50 col-start-5 col-span-4 2xl:col-start-6 2xl:col-span-3 row-span-3 row-start-1 border-y-1 border-white">
                        <div className="w-full h-full border-x-2 rounded-l-[35%] border-white flex justify-center items-center">
                            {hoverIndex === 0 
                            ? 
                                <button onClick={goToProjects} className="text-3xl mx-10 2xl:text-4xl text-blue-500 underline cursor-pointer">View all my projects here!</button> 
                            :   
                                <motion.img
                                    className="
                                        h-full w-full object-contain
                                        border-l-2 rounded-l-[35%] border-white
                                        hover:cursor-pointer
                                        "
                                    onMouseEnter={() => {
                                        if (projImgTimeoutRef.current) {
                                            clearTimeout(projImgTimeoutRef.current) 
                                            projImgTimeoutRef.current = null 
                                        }
                                    }}
                                    onClick={() => (goToProject(hoverIndex))}
                                    onMouseLeave={leavingProjPoint}
                                    src={projectImages[hoverIndex-1]}
                                    alt={`An image of the project: ${hoverIndex === 1 ? 'Game Design Blog' : hoverIndex === 2 ? 'What 2 Eat' : 'Spotify Song Recs'}`}
                                />
                            }
                        </div>
                    </div>
                </div> 
            : 
                <div className="grid grid-cols-auto grid-rows-4">
                    <ProjectPoint
                        scrollYProgress={roadmapYProgress}
                        title="Game Design Blog"
                        desc="Articles I write about game dessign choices I make, love, or both!"
                        stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                        order={1}
                        enterProj={enteringProjPoint}
                        leaveProj={leavingProjPoint}
                        roadmapWidth={roadmapWidth}
                        projectLink="gameDesignBlog"
                    />
                    <ProjectPoint
                        scrollYProgress={roadmapYProgress}
                        title="What 2 Eat"
                        desc="Is choosing dinner too overwhelming? Try this."
                        stack={["Typescript","React", "Jest", "Tanstack Query", "Motion", "TailwindCSS"]}
                        order={2}
                        enterProj={enteringProjPoint}
                        leaveProj={leavingProjPoint}
                        roadmapWidth={roadmapWidth}
                        projectLink="what2Eat"
                    />
                    <ProjectPoint
                        scrollYProgress={roadmapYProgress}
                        title="Spotify Song Recs"
                        desc="Recommendations based on your spotify songs, playlists, artists, or albums!"
                        stack={["Typescript","React", "Restful APIs", "Tanstack Query", "TailwindCSS"]}
                        order={3}
                        enterProj={enteringProjPoint}
                        leaveProj={leavingProjPoint}
                        roadmapWidth={roadmapWidth}
                        projectLink="spotifySongRecs"
                    />
                    <button 
                        className="
                            col-span-8 row-start-4 justify-center flex items-center h-[50%]
                            border-1 border-white
                            hover:bg-[rgba(43,43,43,1)]
                            text-2xl underline
                            hover:text-blue-400 hover:cursor-pointer
                        "
                        onClick={goToProjects}
                    >
                        View all my projects here!
                    </button>
                </div>
            }
            
            
        </div>
    )
}