import { motion } from "framer-motion"
import { type Dispatch, type SetStateAction } from "react"


type projectImageProps = {
    imgUrl: string
    projectName: string
    order: number
    imgSetter: Dispatch<SetStateAction<number>>
    setImgTimeout: Dispatch<SetStateAction<number>>
    imgTimeout: number
}
export default function ProjectImage({imgUrl, projectName, order, imgSetter, setImgTimeout, imgTimeout } : projectImageProps ) {
    const enteringProjImg = () => {
        imgSetter(order)
        clearTimeout(imgTimeout)
    }

    const leavingProjImg = () => {
        setImgTimeout(setTimeout(() => {imgSetter(0)}, 1500))
    }

    return (
        <motion.img
            className="
                h-full w-full bg-blue-200 object-contain
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