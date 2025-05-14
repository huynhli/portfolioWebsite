import '../main.css'
export default function AboutPage() {

    return (
        <div className='flex flex-col'>
            {/* Photo */}
            <div className="flex justify-center">
                    <div className="flex items-center justify-center my-30 text-3xl h-50 w-200 mx-5 bg-green-400">
                        <img className="rounded-lg" src=''/>Photo of me
                    </div>
            </div>

            {/* Description section */}
            <div className="flex justify-center"> 
                <div className='flex flex-col justify-left text-3xl w-200 mx-5 bg-green-400'>
                    <p className='my-5 mx-5'>Hi, I'm Liam.</p>
                    <p className='my-5 mx-5'>I'm an aspiring game designer and developer with a growing passion for creating interactive web and mobile experiences.</p>
                    <p className='my-5 mx-5'>I enjoy coding and seeing my code come to life.</p>
                    <p className='my-5 mx-5'>I like working.</p>
                    <p className='my-5 mx-5'>Find me on <a className='text-blue-800 underline active:text-blue-600' href='https://www.linkedin.com/in/liam-huynh-91aa1a1a1/'>LinkedIn</a></p>
                </div>
            </div>

            {/* Tri-panel section --> webdev experience, game experience, app experience */}
            <div className="flex justify-center bg-purple-400">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-8 my-6 max-w-6xl'>
                        <div className='flex flex-col items-center p-4 text-3xl bg-green-400'>
                            {/*  p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors */}
                            <p className='text-center'>Web dev</p>
                            <p>Web stuff</p>
                        </div>
                        <div className='flex flex-col items-center p-4 text-3xl bg-green-400'>
                            <p className='text-center'>Game dev and design</p>
                            <p>Game stuff</p>
                        </div>
                        <div className='flex flex-col items-center p-4 text-3xl bg-green-400'>
                            <p className='text-center'>App experience</p>
                            <p>Apps</p>
                        </div>
                    </div>
            </div>

            {/* Education */}
            <div className="flex justify-center">
                    <h2 className="flex items-center justify-center my-30 text-2xl h-50 w-200 mx-5 bg-green-400">
                        Education
                    </h2>
                    <h2 className="flex items-center justify-center my-30 text-2xl h-50 w-200 mx-5 bg-green-400">
                        University of Toronto 2023-2027
                    </h2>
            </div>

            {/* Download Resume */}
            <div className="flex justify-center">
                    <div className="flex items-center justify-center my-30 text-3xl h-50 w-200 mx-5 bg-green-400">
                        <button onClick={() => window.open('/ResumeFeb2025.pdf', '_blank')} className='cursor-pointer bg-purple-400 hover:bg-purple-600 rounded-lg p-2'>
                            Download my resume here!
                        </button>
                    </div>
            </div>

            {/* Photo gallery (?) */}
            <div className="flex justify-center">
                    <h2 className="flex items-center justify-center my-30 text-3xl h-50 w-200 mx-5 bg-green-400">
                        Photos
                    </h2>
                    <img src=""/>
                    <img src=""/>
                    <img src=""/>
                    <img src=""/>
                    <img src=""/>
                    <img src=""/>
                    <img src=""/>
                    <img src=""/>
            </div>
        </div>
    )
}