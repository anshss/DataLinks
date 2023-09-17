import Link from "next/link";

export default function Footer() {
  return (
    <div className="hero-wrapper !h-auto  relative mt-4">
      <div className="relative mt-8 flex items-center justify-between overflow-hidden rounded-[36px] p-8 ">
        <div className="hero-bg h-auto absolute inset-0 -z-10 rounded-[36px] bg-gel-black md:block [&>div]:absolute [&>div]:inset-0 [&>div]:rounded-[36px]"></div>
        <div className="">Linko</div>
        <div>
          <p>anshsaxena4190@gmail.com</p>
          <p>sarthakvaish@something.com</p>
        </div>

        <Link href="https://github.com/anshss/Linko">
          <div className="flex flex-row gap-2">
            <img src="./github.svg"></img>
            <p>Star us</p>
          </div>
        </Link>
      </div>
    </div>
  );
}