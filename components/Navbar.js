import Link from 'next/link'

export default function Navbar() {
    return (
        <header>
                <nav className="border-solid border-b-2 border-white-900 p-3 shadow-sm">  
                    <ul>
                        <li><Link href="/">Maintenance Manager</Link></li>
                    </ul>
                </nav>
    </header>
    )
}
