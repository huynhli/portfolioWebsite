import '../main.css'
import './Header.css'

export default function Header() {
    const goToHome = () => {
        window.location.href = '/'
    }
    const goToProjects = () => {
        window.location.href = '/Projects'
    }
    const goToBlog = () => {
        window.location.href = '/Blog'
    }
    const goToAbout = () => {
        window.location.href = '/About'
    }
    const goToResume = () => {
        window.open('/ResumeFeb2025.pdf', '_blank')
    }

    return (
        <div className='flex justify-between h-20 '>
            <div className='self-center px-8'>
                <button className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-300 hover:cursor-pointer active:bg-purple-300" onClick={goToHome}>
                    Liam Huynh
                </button>
            </div>
            <div className=' flex justify-evenly self-center px-8'>
                <div className='px-2'>
                <button className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-300 hover:cursor-pointer active:bg-purple-300" onClick={goToProjects}>
                Projects
                </button>
                </div>
                <div className='px-2'>
                <button className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-300 hover:cursor-pointer active:bg-purple-300" onClick={goToBlog}>
                Blog
                </button>
                </div>
                <div className='px-2'>
                <button className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-300 hover:cursor-pointer active:bg-purple-300" onClick={goToAbout}>
                About
                </button>
                </div>
                <div className='px-2'>
                <button className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-300 hover:cursor-pointer active:bg-purple-300" onClick={goToResume}>
                Resume
                </button>
                </div>
            </div>
        </div>

    )
}