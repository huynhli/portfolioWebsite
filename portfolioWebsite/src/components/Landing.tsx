import StarBg from "./StarBg"
import {motion} from "framer-motion"

export default function Landing() {
    return(
        <section className="fixed flex flex-col h-screen w-screen justify-center items-center">
                <StarBg />
                <div className="
                    h-[40%] w-full max-px-[10%] min-px-[5%]
                    group/outer relative 
                    flex flex-row justify-center items-center
                    bg-[rgba(39,39,42,0.2)]
                    ">

                    {/* main card */}
                    <motion.div
                        style={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 3, delay: 0.2, ease: "easeInOut" }}
                        className="
                            flex flex-col z-50 min-w-[30%] max-w-[40%] min-h-[80%] p-[2%] bg-zinc-900
                            border-1 border-white rounded-lg justify-center
                            transition-transform duration-400 delay-40 
                            group-hover/outer:scale-110 group-hover/outer:-rotate-2
                            lg:group-hover/outer:-translate-x-[50%] lg:group-hover/outer:-translate-y-20
                            group-hover/outer:-translate-y-[20%]
                            "
                    >
                        <h1 className="text-white text-[clamp(1.5rem,3.5vw,3rem)]">Hi! I'm <b className="font-extrabold">Liam</b>, <br/>a frontend developer</h1>
                        <h2 className="text-white text-[clamp(1rem,2.5vw,1.75rem)]">dedicated to making scalable, high-performance, and user-centered web solutions.</h2>
                    </motion.div>
                    
                    
                    {/* icons + card 2 */}
                    <div
                        className="
                            absolute z-600 w-[110%] lg:w-[30%] h-[50%] top-[20%]
                            opacity-0 translate-x-0
                            group-hover/outer:opacity-100 
                            lg:group-hover/outer:translate-x-[60%] lg:group-hover/outer:translate-y-[20%] lg:p-r-0
                            p-r-[20%]
                            group-hover/outer:-translate-x-[20%] group-hover/outer:translate-y-[150%]
                            transition-translate duration-500 ease-in-out
                            group/inner
                            flex justify-center
                        "
                    >
                        
                        <a
                            className="
                            absolute z-0 w-[100px] h-[100px]
                            flex
                            opacity-100
                            cursor-pointer
                            group-hover/outer:opacity-100 
                            top-[30%] lg:top-0
                            lg:group-hover/outer:-translate-y-[120%] lg:group-hover/outer:-translate-x-[10vw]
                            group-hover/outer:-translate-y-[10vh] group-hover/outer:translate-x-[49vw]
                            transition duration-500 group-hover/outer:delay-[200ms]
                            "
                            tabIndex={0}
                            href="https://github.com/huynhli" target="_blank" rel="noreferrer"
                        >
                            <img src='/images/github_logo.png'
                            alt="GitHub logo, opens up to GitHub profile"
                            className="
                            bg-white p-1 lg:w-full w-[70%] lg:h-full h-[70%]
                            border-1 rounded-lg border-black
                            invert
                            hover:scale-115 
                            transition-scale duration-100 ease-in
                            "

                            />
                        </a>
                        <a
                            className=" 
                            absolute z-0 w-[100px] h-[100px]
                            flex
                            opacity-100
                            cursor-pointer
                            group-hover/outer:opacity-100 
                            top-[30%] lg:top-0
                            lg:group-hover/outer:-translate-y-[120%] lg:group-hover/outer:translate-x-0
                            group-hover/outer:translate-x-[38vw]
                            transition duration-500 group-hover/outer:delay-[200ms]
                            bg-
                            "
                            tabIndex={0}
                            href="https://www.linkedin.com/in/liam-huynh-91aa1a1a1/" target="_blank" rel="noreferrer"
                        >
                            <img src='/images/linkedin_logo.png'
                            alt="LinkedIn logo, opens up to LinkedIn profile"
                            className="
                            lg:w-full w-[70%] lg:h-full h-[70%]
                            border-1 rounded-lg border-white
                            hover:scale-115 
                            transition-scale duration-100 ease-in
                            bg-[#2b80bf]
                            "
                            />
                            
                        </a>
                        <a
                            className="  
                            absolute z-0 w-[100px] h-[100px]
                            flex
                            opacity-100
                            cursor-pointer
                            group-hover/outer:opacity-100 
                            top-[30%] lg:top-0
                            lg:group-hover/outer:-translate-y-[120%] lg:group-hover/outer:translate-x-[10vw]
                            group-hover/outer:translate-y-[10vh] group-hover/outer:translate-x-[49vw]
                            transition duration-500 group-hover/outer:delay-[200ms]
                            hover:scale-115
                            "
                            tabIndex={0}
                            href="https://trachscor.itch.io/" target="_blank" rel="noreferrer"
                        >
                            <img src='/images/itch_logo.png'
                            alt="Itch.io logo, opens up to Itch.io profile"
                            className="
                            bg-red-400 p-1 lg:w-full w-[70%] lg:h-full h-[70%] object-full
                            border-1 rounded-lg border-white
                            hover:scale-115 
                            transition-scale duration-100 ease-in
                            "
                            />
                        </a>

                        {/* txt */}
                        <div
                            className="
                            lg:w-[110%] lg:min-h-[130%] min-h-[110%] w-[40%] p-[2%] lg:p-[7%]
                            absolute flex justify-center items-center bg-zinc-900 
                            border border-white rounded-lg justify-center
                            transition-transform duration-300 ease-in-out lg:group-hover/inner:scale-105
                            "
                        >
                            <h1 className="text-white text-[clamp(1rem,2vw,1.5rem)]">Combining full-stack and game development experiences, I'm obsessed with seeing ideas come to life and sharing that experience with others.</h1>
                        </div>
                    </div>
                    
                </div>

                {/* TODO resume button */}
                {/* TODO floating arrow animate pointing down + onclick scrolls down a bit */}
            </section>
    )
}