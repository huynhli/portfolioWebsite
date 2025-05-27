import '../main.css'
export default function AboutPage() {

    return (
        <div className='flex flex-col'>
            {/* Photo */}
            <div className='flex justify-center'>
                    <div className='flex items-center justify-center mt-3 mb-5'>
                        <div className='p-2 rounded-lg bg-purple-300'>
                            <img className='rounded-lg max-w-100 max-h-80 object-contain' alt='Photo of me' src='/images/mainPhotoOfMe.jpg'/>
                        </div>
                    </div>
            </div>

            {/* Description section */}
            <div className='flex justify-center'> 
                <div className='flex flex-col justify-left text-3xl w-200 mx-5 bg-purple-300 rounded-md my-2'>
                    <p className='my-5 mx-5'>Hi, I'm Liam.</p>
                    <p className='my-5 mx-5'>I'm an aspiring game designer and developer with a background as a full-stack web developer with a growing passion for creating interactive web and mobile experiences.</p>
                    <p className='my-5 mx-5'>I enjoy coding and seeing my code come to life.</p>
                    <p className='my-5 mx-5'>I like working.</p>
                    <p className='my-5 mx-5'>Find me <a className='text-blue-500 underline hover:text-blue-400 active:text-blue-600' href='https://www.linkedin.com/in/liam-huynh-91aa1a1a1/'>here on LinkedIn</a>!</p>
                </div>
            </div>

            {/* Tri-panel section --> webdev experience, game experience, app experience */}
            <div className='flex justify-center my-2'>
                    <div className='grid grid-cols-1 xl:grid-cols-3 gap-6 w-full mx-8 my-6 max-w-8xl'>
                        <div className='rounded-lg flex flex-col justify-center items-center p-4 text-3xl bg-purple-300 transition-transform duration-300 hover:scale-104'>
                            {/*  p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors */}
                            <p className='flex items-center text-center mb-4 min-h-25'>Web Development</p>
                            <div className='rounded-lg bg-purple-300 h-full w-full p-3'>
                                <ul className='list-disc pl-6 text-blue-600'>
                                    <li><a href='https://liamhuynh.pages.dev/' className='hover:text-blue-500'>My Portfolio</a></li>
                                    <li><a href='https://4e3c7797.song-recommendations-web-app.pages.dev/' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500'>Spotify Song Recommendation Web App</a></li>
                                    <li><a href='' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500'>Youtube Channel Saver (soon)</a></li>
                                    <li><a href='https://frontend-blog.pages.dev/' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500'>My Other Portfolio Website</a></li>
                                    <li><a href='' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500'>Canada clone of </a><a href='' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500'>https://makemydrivefun.com/</a></li>
                                </ul>
                            </div>   
                        </div>
                        <div className='rounded-lg flex flex-col items-center p-4 text-3xl bg-purple-300 transition-transform duration-300 hover:scale-104'>
                            {/*  p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors */}
                            <p className='flex items-center text-center mb-4 min-h-25'>Game Development <br/>and Design</p>
                            <div className='rounded-lg bg-purple-300 h-full w-full p-3'>
                                <ul className='list-disc pl-6 text-blue-600'>
                                    <li><a href='https://liamhuynh.pages.dev/Blog' className='hover:text-blue-500'>My Game Design Blog</a></li>
                                    <li><a href='https://trachscor.itch.io/' target='_blank' rel='noopener noreferrer' className='hover:text-blue-500'>My Itch.io profile</a>
                                        <ul className='list-disc pl-10'>
                                            <li><a href='https://trachscor.itch.io/jester'  className='hover:text-blue-500' target='_blank' rel='noopener noreferrer'>Jester</a></li>
                                        </ul>
                                    </li>
                                    <li><a className=''>Licht - The Game (coming soon)</a></li>
                                </ul>
                            </div>   
                        </div>
                        <div className='rounded-lg flex flex-col justify-center items-center p-4 text-3xl bg-purple-300 transition-transform duration-300 hover:scale-104'>
                            {/*  p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors */}
                            <p className='flex items-center text-center mb-4 min-h-25'>Mobile Apps</p>
                            <div className='rounded-lg bg-purple-300 h-full w-full p-3'>
                                <ul className='list-disc pl-6'>
                                    <li>Coming soon!</li>
                                </ul>
                            </div>   
                        </div>
                    </div>
            </div>

            {/* Download Resume */}
            <div className='flex justify-center'>
                    <div className='flex items-center justify-center m-3 text-2xl mx-5 '>
                        <button onClick={() => window.open('/ResumeFeb2025.pdf', '_blank')} className='cursor-pointer bg-purple-300 hover:bg-purple-300 rounded-lg py-6 px-14  transition-transform duration-300 hover:scale-110'>
                            Download my resume here!
                        </button>
                    </div>
            </div>

            {/* Education */}
            <div className='flex justify-center my-5'>
                    <h2 className='flex items-center justify-center my-3 text-3xl h-10 p-8 bg-purple-400 rounded-l-lg'>
                        Education
                    </h2>
                    <h2 className='flex items-center justify-center my-3 text-3xl h-10 p-8 bg-purple-300 rounded-r-lg'>
                        University of Toronto 2023-2027
                    </h2>
            </div>

            {/* Photo gallery */}
            <div className='flex justify-center'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 max-w-6xl w-full bg-purple-300 rounded-md mb-10'>
                    {['aboutMe1.jpg', 'aboutMe3.jpg', 'aboutMe4.jpg', 'aboutMe5.JPEG', 'aboutMe6.JPG'].map((file, i) => (
                    <div className='relative overflow-hidden w-full rounded-md mb-3'>
                        <img
                            key={i}
                            className='w-full h-100 object-cover'
                            src={`/images/${file}`}
                            alt={`About me ${i + 1}`}
                        />
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}