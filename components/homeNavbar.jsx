

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Logo from "../assets/image/logo.png";

export function HomeNavbar() {
    return (
        <nav className="fixed h-[65px] top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-[#202020] dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3 container mx-auto">
                <div className="flex  items-center justify-between">
                    <div className="flex items-center justify-start">
                        <button
                            data-drawer-target="logo-sidebar"
                            data-drawer-toggle="logo-sidebar"
                            aria-controls="logo-sidebar"
                            type="button"
                            className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        >
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                />
                            </svg>
                        </button>
                        <Link href="/" className="flex ml-2 md:mr-24">
                            <img
                                src="https://flowbite.com/docs/images/logo.svg"
                                className="h-8 mr-3"
                                alt="FlowBite Logo"
                            />
                            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                            LinkIt
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Link
                            className="hover:opacity-75 lg:pl-5 lg:pr-5"
                            href="/app/create"
                        >
                            <div className="flex items-center bg-[#f5c2a5] text-black hover:bg-[rgb(80,80,80)] font-normal py-2 px-4 rounded-lg">
                                Launch App
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
