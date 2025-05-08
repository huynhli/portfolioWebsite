import './main.css'

export default function Header() {
    return (
        <div className='flex justify-center items-center bg-blue-800 h-20 
        border-b border-blue-900'>
            <div className="flex space-x-8 py-4 bg-blue-800 h-20 
        border-b border-blue-900">
                <button className="text-lg px-6 py-3 text-white 
                transition-all duration-300 hover:text-2xl hover:bg-blue-700 
                rounded-lg hover:cursor-pointer bg-blue-800 h-20 
        border-b border-blue-900">
                    Home
                </button>
                <button className="text-lg px-6 py-3 text-white 
                transition-all duration-300 hover:text-2xl hover:bg-blue-700 
                rounded-lg hover:cursor-pointer">
                    Docs
                </button>
            </div>
        </div>

    )
}