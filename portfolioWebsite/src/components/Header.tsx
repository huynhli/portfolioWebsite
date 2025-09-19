import { motion } from 'framer-motion'
import '../main.css'
import './Header.css'
import { Link } from 'react-router-dom'

export default function Header() {

    return (
        <motion.div 
            className='flex justify-between h-20 text-white text-lg'
            initial={{opacity: 0, y: -100}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 2.5, ease: "easeInOut"}}    
        >
            <div className='self-center px-8'>
                <Link className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-800 active:bg-purple-400" to={``}>
                    Liam Huynh
                </Link>
            </div>
            <div className=' flex justify-evenly self-center px-8'>
                <div className='px-2'>
                    <Link className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-800 active:bg-purple-400" to={``}>
                    Home
                    </Link>
                </div>
                <div className='px-2'>
                    <a className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-800 active:bg-purple-400" href={`/LiamHuynh_Resume_SWE-portfolio.pdf`} target='_blank'>
                    Resume
                    </a>
                </div>
                <div className='px-2'>
                    <Link className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-800 active:bg-purple-400" to={`/projects`}>
                    Projects
                    </Link>
                </div>
                <div className='px-2'>
                    <Link className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-800 active:bg-purple-400" to={`/projects/gameDesignBlog`}>
                    Blog
                    </Link>
                </div>
                <div className='px-2'>
                    <Link className="underline-hover px-2 py-1 duration-400 rounded-t-lg hover:bg-purple-800 active:bg-purple-400" to={'/about'}>
                    About
                    </Link>
                </div>
            </div>
        </motion.div>

    )
}