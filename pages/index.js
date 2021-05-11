import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative h-screen max-h-full flex flex-col justify-start text-center">
      <p className="mt-60">Pay and Manage Your Maintenance Easily !!!</p>
      <div className="login buttons mt-10 sm:flex-col">
        <Link href="/login"><button className="bg-blue-300 hover:bg-blue-400 px-8 py-2 mr-5 rounded-md focus:outline-none focus:ring focus-border-blue-500">Log In</button></Link>
        <button className="bg-blue-300 hover:bg-blue-400 px-8 py-2 rounded-md focus:outline-none focus:ring focus-border-blue-500">Register</button>
      </div>
      
      
      </div>
  )}
