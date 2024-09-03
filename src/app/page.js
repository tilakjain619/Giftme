import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import Link from "next/link";
// import '@/components/index.css'

export default function Home() {
  return (
    <div className="grid justify-center text-center px-3 py-2">
      <div className="min-h-[80vh] flex flex-col justify-center gap-3 md:gap-4">
        <h1 className="text-4xl text-zinc-800 sm:text-6xl lg:text-8xl font-bold">Turn Your Creativity into Gifts</h1>
        <p className="text-zinc-800 md:text-xl text-pretty max-w-[700px] mx-auto">Let your fans support you with thoughtful gifts and turn your passion into a sustainable journey.</p>
        <Link href="#" className="bg-[#ed5a6b] hover:bg-[#f68e7e] px-7 text-xl lg:text-2xl py-2.5 w-fit mx-auto rounded-full text-white">Start my page</Link>
        <span className="text-zinc-700">It's free, always!</span>
      </div>
      <section className="w-full mt-4 relative overflow-x-hidden">
      <div className="absolute w-full h-full z-10 inset-0 bg-gradient-to-r from-[#f7f7ed] via-transparent to-[#f7f7ed] pointer-events-none"></div>
        <VelocityScroll

          text="Earn Gifts"
          default_velocity={5}
          className="font-display text-center text-5xl font-bold tracking-[-0.02em] text-zinc-700 drop-shadow-sm md:text-7xl md:leading-[5rem]"
        />
      </section>
    </div>
  );
}
