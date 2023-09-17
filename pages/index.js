import animationData from "../assets/lottie/animation-1.json";
import Lottie from "react-lottie";
import { useRouter } from "next/router";
import Footer from "@/components/footer";
import Link from "next/link";
import { HomeNavbar } from "@/components/homeNavbar";

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
};

export default function Home() {
    const router = useRouter();
    return (
        <>
            <HomeNavbar />
            <div className="min-h-screen mt-28 mb-14 mx-20 ">
                <div className="hero-wrapper !h-auto pb-0 relative">
                    <div className="relative mt-8 flex flex-1 flex-col justify-end overflow-hidden rounded-[36px] p-8 px-12">
                        <div className="hero-bg absolute inset-0 -z-10 rounded-[36px] bg-gel-black md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
                        {/**/}
                        <h1 className="hero-title lg:leading[72px] leading-[52px] tracking-[-1.5px] md:leading-[60px] lg:tracking-[-4.5px] pt-40">
                            <span className="gel-gradient-text-peach inline-block pr-[4px] pb-1">
                                Streamlined
                                <br />
                                Link{" "}
                                <br className="xs:hidden sm:hidden md:inline-block lg:inline-block" />{" "}
                                Control
                            </span>
                        </h1>
                        <p className="hero-text mb-8">
                            <span>
                                Unleash the Power of Dynamic Link Control <br />
                                and Streamline Your Online Navigation.
                            </span>
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-4 md:flex-row">
                            <button
                                onClick={() => router.push("/app/create")}
                                id="mainpage-cover-cta-1"
                                className="hero-button px-8 solid-gradient gradient-peach w-full md:w-auto text-black"
                            >
                                <span className="relative z-10 text-[#202020]">
                                    Create a Linko
                                </span>
                            </button>
                            {/* <a
              href="/developers"
              className="hero-button solid-gradient gradient-peach outlined w-full md:w-auto"
              id="mainpage-cover-cta-2"
            >
              <span className="relative z-10">&gt; Start Building</span>
            </a> */}
                        </div>
                    </div>
                    <div className="absolute right-20 top-14">
                        <Lottie
                            options={defaultOptions}
                            height={500}
                            width={550}
                        />
                    </div>
                </div>
                <div className="py-4">
                    <i className="m-auto block w-4">
                        <svg
                            width={16}
                            height={16}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="m2 5 6 6 6-6"
                                stroke="#EFE0E0"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </i>
                </div>
                <div className="mt-20">
                    <h2 className="mx-auto mb-2 max-w-[360px] text-center text-lg font-bold">
                        <span className="gel-gradient-text-peach">
                            Create and Manage
                        </span>
                    </h2>
                    <h3 className="gel-section-title mb-16 text-4xl font-semibold text-center">
                        <span>Redirects for your links</span>
                        {/* <span>Explore how you can use Gatify</span> */}
                    </h3>

                    <div className="use-cases-list grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-20">
                        <Link
                            href="/app/create"
                            className="relative flex h-[280px] flex-col rounded-3xl bg-gel-black p-8 text-sm"
                        >
                            <div className="flex flex-1 flex-col">
                                <i className="absolute right-5 flex w-5">
                                    <svg
                                        width={9}
                                        height={9}
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6.784 1.333H2.31V.04h6.68v6.68H7.7V2.248L1.906 8.04.99 7.126l5.793-5.793Z"
                                        />
                                    </svg>
                                </i>
                                <div className="font-semibold text-gel-gray transition-all duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                                    <span>Generate Links</span>
                                </div>
                                <div className="mt-6 flex-1 text-lg font-bold transition-all delay-75 duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                                    Linko is the platform that allows you to
                                    create links and then add redirects to them.
                                    This way you can always give that one link
                                    without any hesitation of malfunctioning to
                                    anywhere.
                                </div>
                            </div>
                        </Link>
                        <Link
                            href="/app/manage"
                            className="relative flex h-[280px] flex-col rounded-3xl bg-gel-black p-8 text-sm"
                        >
                            <div className="flex flex-1 flex-col">
                                <i className="absolute right-5 flex w-5">
                                    <svg
                                        width={9}
                                        height={9}
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6.784 1.333H2.31V.04h6.68v6.68H7.7V2.248L1.906 8.04.99 7.126l5.793-5.793Z"
                                        />
                                    </svg>
                                </i>
                                <div className="font-semibold text-gel-gray transition-all duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                                    <span>Manage versions</span>
                                </div>
                                <div className="mt-6 flex-1 text-lg font-bold transition-all delay-75 duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                                    Link allows you to manage versions of your
                                    link. You can update the redirect link or
                                    switch it to the previous version, we keep
                                    records for you!
                                </div>
                            </div>
                        </Link>
                        <Link
                            href="/app/view"
                            className="relative flex h-[280px] flex-col rounded-3xl bg-gel-black p-8 text-sm"
                        >
                            <div className="flex flex-1 flex-col">
                                <i className="absolute right-5 flex w-5">
                                    <svg
                                        width={9}
                                        height={9}
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6.784 1.333H2.31V.04h6.68v6.68H7.7V2.248L1.906 8.04.99 7.126l5.793-5.793Z"
                                        />
                                    </svg>
                                </i>
                                <div className="font-semibold text-gel-gray transition-all duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                                    <span>Paid view links</span>
                                </div>
                                <div className="mt-6 flex-1 text-lg font-bold transition-all delay-75 duration-200 group-hover:-translate-y-5 group-hover:scale-105 group-hover:opacity-0">
                                    Get exclusive paid view links where you can
                                    upload any file and the users will have to
                                    pay in order to access that file.
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
