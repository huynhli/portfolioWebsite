type projectImageProps = {
    imgUrl: string
    projectName: string
}
export default function ProjectImage({imgUrl, projectName } : projectImageProps ) {
    return (
        <img
            className="
                h-full w-full bg-blue-200 object-fill
                border-l-2 rounded-l-[35%] border-white
                "
            src={imgUrl}
            alt={`An image of the project: ${projectName}`}
        />
    )
}