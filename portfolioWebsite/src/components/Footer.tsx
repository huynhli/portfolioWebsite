import '../main.css'
import './Footer.css'

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <div className='flex justify-between h-20 bg-purple-400'>
            
            {/* Name */}
            <div className='self-center px-8'>
                <button className="aboveline-hover bg-purple-400 px-2 py-1 duration-400 rounded-b-lg text-white hover:bg-white hover:text-black">
                    © 2025 Liam Huynh
                </button>
            </div>

            {/* Arrow button */}
            <div className="self-center">
                <button onClick={scrollToTop} className="cursor-pointer">
                    <img src="/images/up-arrow.png" title="Up arrow icon" alt="Arrow pointing up" className="invert w-10 h-10 object-contain transition-transform duration-300 hover:scale-125"/>
                </button>
            </div>

            {/* Social links */}
            <div className="self-center px-8">
                <div className="flex justify-evenly aboveline-hover bg-purple-400 px-2 py-1 duration-400 rounded-b-lg hover:bg-white text-white group">
                    <a className="px-4 py-1 duration-400 rounded-b-lg group-hover:text-black hover:text-blue-400 active:text-blue-500 cursor-pointer" href="https://www.linkedin.com/in/liam-huynh-91aa1a1a1/">LinkedIn</a>
                    <a className="px-4 py-1 duration-400 rounded-b-lg group-hover:text-black hover:text-blue-400 active:text-blue-500 cursor-pointer" href="mailto:liamtamh@gmail.com">Email</a>
                </div>
            </div>

        </div>
    )
}