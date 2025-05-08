import './main.css'
import './Footer.css'

export default function Footer() {
    const goToHome = () => {
        window.location.href = '/'
    }

    return (
        <div className='flex justify-between h-20 '>
            <div className='self-center px-8'>
                <button className="aboveline-hover px-2 py-1 duration-400 rounded-b-lg hover:bg-purple-400 hover:cursor-pointer" onClick={goToHome}>
                    Liam Huynh
                </button>
            </div>
            <div className=' flex justify-evenly self-center px-8'>
                <button className="aboveline-hover bg-purple-400 px-2 py-1 duration-400 rounded-b-lg hover:bg-white">
                Thanks for stopping by!
                </button>
            </div>
        </div>

    )
}