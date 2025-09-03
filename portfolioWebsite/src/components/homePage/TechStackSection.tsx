import { motion, MotionValue, useTransform } from "framer-motion"

type FrameworkPair = [string, string?]

type StackSectionProps = {
    scroll: MotionValue<number>
    beginFade: number
    title: string
    frameworks: FrameworkPair[]
}

export default function TechStackSection({scroll, beginFade, title, frameworks} : StackSectionProps) {
    const titleOpacity = useTransform(scroll, [beginFade,beginFade+0.09], [0, 1])
    const titleY = useTransform(scroll, [beginFade,beginFade+0.075], [300,0])

    return (
        // TODO this doesnt need custom optional type, it can just use string
        <div className="flex flex-col sm:flex-row mt-20">
            <motion.h2 className="text-5xl min-w-[50%] md:min-w-[30%] mb-2 sm:mb-0" style={{y:titleY, opacity:titleOpacity}}>
                {title}
            </motion.h2>
            <ul className="text-3xl flex flex-row flex-wrap">
                {frameworks.map((frameworkPair, key) => {
                    const listY = useTransform(
                        scroll,
                        [beginFade, beginFade + 0.075 + key * 0.005],
                        [300, 0]
                    )
                    const listOpacity = useTransform(
                        scroll,
                        [beginFade+0.05, beginFade + 0.075 + key * 0.005],
                        [0, 1]
                    )

                    return (
                        <motion.li
                            key={key}
                            style={{ y: listY, opacity:listOpacity }}
                            className="flex flex-row m-4"
                        >
                            <img
                            src={`/images/stack_logos/${title.toLowerCase()}/logo_${frameworkPair[0]}.png`}
                            className="w-9 mr-2 lazy"
                            alt={`Logo for ${frameworkPair[0]}`}
                            />
                            {frameworkPair[1] ?? frameworkPair[0]}
                        </motion.li>
                    )
                })}
            </ul>
        </div>                    
    )
}