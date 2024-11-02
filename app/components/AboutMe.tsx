import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export default function AboutMe() {
	return (
		<div className="flex sm:flex-row h-screen border-black flex-col bg-light-purple p-10 min-h-[70vh]">
			<div className="flex relative w-full h-full">
				<div className="bg-[#60367B] absolute left-[30%] top-[-4%] h-[100vh] w-[100vh] rounded-full" />
				<div className="absolute left-[35%] bottom-[5%] w-[90vh] h-[90vh]">
					<Image
						className="object-contain z-10"
						src="/assets/about/shell_extra_cool.png"
						alt="about me"
						fill
						priority
					/>
				</div>
				<div className="absolute left-[30%] bottom-[-4%] w-[60vh] h-[60vh]">
					<Image
						className="object-contain z-10"
						src="/assets/about/shell_3.png"
						alt="about me"
						fill
					/>
				</div>
				<div className="absolute right-[10%] bottom-[-5%] w-[60vh] h-[60vh]">
					<Image
						className="object-contain z-10"
						src="/assets/about/shell_2.png"
						alt="about me"
						fill
					/>
				</div>

				<span className="flex absolute top-0 left-[0%] flex-col">
					<h1 className="text-[5rem] leading-[6rem] font-super-funky font-outline text-[#A8F584]">Shelsey<br /> Boermans</h1>
					<p className="text-[1.67rem] py-4 font-super-funky text-light-blue">Makeup Artist</p>
				</span>
			</div>
			<div className="absolute bottom-10 left-20">
				<section className="flex mt-auto gap-x-8">
					<a href="https://www.linkedin.com/in/shelsey-boermans-207147200/?originalSubdomain=be" className="bg-white flex justify-center items-center rounded-full text-black font-bold border-2 border-black h-16 w-16">
						<Linkedin size={32} absoluteStrokeWidth />
					</a>
					<a href="https://www.instagram.com/the_shell_sea_/" className="bg-white flex justify-center items-center rounded-full text-black font-bold border-2 border-black h-16 w-16">
						<Instagram size={32} absoluteStrokeWidth />
					</a>
				</section>
			</div>
		</div>
	);
}