import Link from "next/link";

export default function Home() {
  return (
    <div className="relative h-screen max-h-full flex flex-col justify-start text-center">
      <p className="mt-60">Pay and Manage Your Maintenance Easily !!!</p>
      <div className="login buttons mt-10 sm:flex-col">
        <Link href="/signin">
          <button className="bg-blue-600 text-white hover:bg-[#3f83f8] px-8 py-2 mr-5 rounded-md focus:outline-none focus:ring focus-border-blue-500">
            Sign In
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-blue-600 text-white hover:bg-[#3f83f8] px-8 py-2 rounded-md focus:outline-none focus:ring focus-border-blue-500">
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}
