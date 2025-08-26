import { motion } from "framer-motion"
import { useState, type Dispatch, type SetStateAction } from "react"


type projectImageProps = {
    imgUrl: string
    projectName: string
    order: number
    setter: Dispatch<SetStateAction<number>>
}
export default function ProjectImage({imgUrl, projectName, order, setter } : projectImageProps ) {
    const [ projResetTimeout, setProjResetTimeout ] = useState<number>(0)
    
    const enteringProjImg = () => {
        setter(order)
        clearInterval(projResetTimeout)
    }

    const leavingProjImg = () => {
        setProjResetTimeout(setTimeout(() => {setter(0)}, 1000))
    }

    return (
        <motion.img
            className="
                h-full w-full bg-blue-200 object-fill
                border-l-2 rounded-l-[35%] border-white
                
                "
            whileHover={{}}
            onMouseEnter={enteringProjImg}
            onMouseLeave={leavingProjImg}
            src={imgUrl}
            alt={`An image of the project: ${projectName}`}
        />
    )
}