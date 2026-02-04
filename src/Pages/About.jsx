import pic1 from "../assets/pic1.png";

export default function AboutFounder() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-12 px-4">
      {/* Main container with top margin to move content down */}
      <div className="flex flex-col md:flex-row gap-8 mt-16"> {/* Added mt-16 */}
        {/* Left: Text Content - closer to left edge + justified */}
        <div className="md:w-1/2 pr-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-1 text-justify">ABOUT</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-justify">Founder</h2>

          <p className="text-lg leading-relaxed mb-6 text-justify">
            A proud alumna of Pretoria High School for Girls, a BCom Law and LLB graduate from the University of Pretoria. 
            She aspires to become an Advocate of the Republic, driven by her passion for justice and commitment to guiding 
            the youth beyond the courtroom — offering career mentorship and transforming the belief that mathematics is complicated.
            She strongly upholds the ethos of rewiring, instilling confidence and unlocking the capability of any learner, 
            especially those deemed inattentive.
          </p>
        </div>

        {/* Right: Image + blockquote - CENTERED */}
        <div className="md:w-1/2 flex flex-col items-center"> {/* Changed to items-center */}
          {/* Image with lighter background */}
          <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2">
            <img
              src={pic1}
              alt="Founder of Assembled Tutoring"
              className="h-100 w-auto object-contain"
            />
          </div>
          
          {/* Blockquote directly below the image - centered */}
          <blockquote className="mt-4 text-center italic text-blue-100 border-l-4 border-blue-300 pl-4 py-2 max-w-xs">
            “Mathematics is a language that requires understanding the fundamentals & the underlying basics of all its topics.”
          </blockquote>
        </div>
      </div>
    </div>
  );
}