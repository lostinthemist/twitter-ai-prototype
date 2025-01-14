import InteractiveForm from "./components/InteractiveForm";
import ParticlesBackground from "../components/ui/particles";
import { TextAnimate } from "../components/ui/text-animate";
import { RiTwitterXLine } from "react-icons/ri";

export default function Home() {

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-[#1a1a1a] pt-6 px-2 w-full">
      <ParticlesBackground className="absolute inset-0 w-full h-full z-0" />
      <div className="relative z-10 flex flex-col justify-center items-center">
        <RiTwitterXLine size={60} color="white" />
        <div className="flex flex-col justify-center items-center mt-7 w-full max-w-4xl py-3">
          <TextAnimate
            animation="fadeIn"
            by="character"
            className="text-white text-opacity-80 text-3xl font-bold text-center mb-4 leading-tight sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl"
          >
            Tweet Gemirator
          </TextAnimate>
          <p className="text-white text-center text-sm sm:text-base lg:text-xl xl:text-xl mt-4">
          Meet Tweet Gemirator (Gemini + Generator) - Gemini AI-powered application built with Next.js and TailwindCSS.
          </p>
          <p className="text-white text-center text-sm sm:text-base lg:text-xl xl:text-xl mt-4">
          This prototype app will help you out when you have an idea for a tweet, but you're not sure how to write a tweet or how to convey your thoughts. Simply enter a description and Tweet Gemirator will generate tweets based on user descriptions.
          </p>
          <InteractiveForm />
        </div>
      </div>
    </div>
  );
}