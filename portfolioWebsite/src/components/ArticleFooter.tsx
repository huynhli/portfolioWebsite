import '../main.css'

export default function ArticleFooter () {
    return (
        <div className='flex flex-col'>
            <div className='flex justify-center my-5 mx-10'> 
                <p className='text-center font-bold text-lg italic'>Thanks for reading! Theres no comment section up yet, so if you have any comments please email me <a className='text-blue-400 hover:text-blue-500 underline' href='mailto:liamtamh@gmail.com'> here</a>
                !</p>
            </div>
        </div>
    )
}