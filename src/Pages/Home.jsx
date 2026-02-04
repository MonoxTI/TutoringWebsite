import LOGO from "../Assets/LOGO.png";
import pic1 from "../assets/pic1.png";
import pic2 from "../assets/pic2.jpg";
import pic4 from "../assets/pic4.jpg";

export default function CombinedPage() {
  return (
    <div>
      {/* SECTION 1: HOME (Hero Banner) */}
      <div className="min-h-screen bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-12 px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-10 md:mb-0 pt-16 pr-4 md:pr-8">
            <p className="text-3xl md:text-4xl font-bold mb-2 text-justify">GRADE 12</p>
            <p 
              className="text-4xl md:text-5xl font-normal mb-4 italic text-justify"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              Mathematics
            </p>
            <p className="text-2xl md:text-3xl font-bold mb-2 text-justify">Monthly Subscription</p>
            <p className="text-xl md:text-2xl font-bold text-yellow-300 mb-1 text-justify">15% OFF</p>
            <p className="text-lg font-bold mb-6 text-justify">valid only for February</p>
            <p className="text-lg md:text-xl font-bold mb-4 leading-relaxed text-justify">
              Mathematics is a language that requires understanding the fundamentals & the underlying basics of all its topics - post psychological transformation
            </p>
            <p className="text-xl md:text-2xl font-bold text-justify shadow-md border-b-2 border-white">Making education fashionable</p>
          </div>
          <div className="md:w-1/2 flex justify-end items-start mt-8 md:mt-10">
            <img
              src={LOGO}
              alt="Assembled Tutoring"
              className="h-160 w-auto object-contain opacity-19"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT MISSION */}
      <div className="min-h-screen bg-white text-gray-800 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-1">ABOUT</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6">Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            The barrier encountered in learning is often not a lack of "logic," but a psychological block. 
            Our aim commences with addressing the Cognitive, Affective, and Metacognitive layers of learning.
            Simply, <strong>Psychological Transformation</strong> is a technique we use to psychologically infiltrate & remove 
            the thought(s) that certain subjects are unattainable (e.g., "Mathematics is hard"). Once the learner’s psychological 
            thoughts are realigned, constant engagement with the work is required.
          </p>
          <p className="text-lg leading-relaxed mb-6">
            Mathematics requires memory — the ability to hold multiple pieces of information (like a formula, a carry-over digit, 
            and a negative sign) all at once. Thus, for better interaction, we offer monthly subscription. We have noted in the past 
            that the more interaction with the work, the easier it is for their minds to absorb fundamental underlying principles.
          </p>
          <p className="text-lg leading-relaxed">
            We use <strong>cognitive offloading</strong> to ‘offload’ the mental agony into intermediate steps that are constantly practiced, 
            and free up the ‘mental script’ for complex problem-solving.
          </p>
        </div>
      </div>

      {/* SECTION 3: ABOUT FOUNDER */}
      <div className="min-h-screen bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8 mt-16">
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
          <div className="md:w-1/2 flex flex-col items-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-2">
              <img
                src={pic1}
                alt="Founder of Assembled Tutoring"
                className="h-100 w-auto object-contain"
              />
            </div>
            <blockquote className="mt-4 text-center italic text-blue-100 border-l-4 border-blue-300 pl-4 py-2 max-w-xs">
              “Mathematics is a language that requires understanding the fundamentals & the underlying basics of all its topics.”
            </blockquote>
          </div>
        </div>
      </div>

      {/* SECTION 4: ALUMNI */}
      <div className="bg-white min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <img
              src={pic2}
              alt="Assembled Tutoring Alumni"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto mb-10">
          <h4 className="text-xl md:text-2xl font-semibold mb-4">Why Psychometric test?</h4>
          <p className="text-lg leading-relaxed mb-6">
            To assess whether the learner is to the standard of their grade, by identifying their loopholes from past Grades, to ensure
            underlying principles are understood. We cannot move forward without addressing previous loopholes, a loopholed
            foundation collapses the next phase - the root problems from past grades.
          </p>
          <h4 className="text-xl md:text-2xl font-semibold mb-4">Why weekly Test?</h4>
          <p className="text-lg leading-relaxed mb-6">
            Engagement is crucial, constant practice leads to success. We have noted that teaching requires emphasis. Hence, when
            learners write weekly tests - they become more engaged with the work, they study weekly and personalized feedback on their
            test are sent to parents/ guardian(s)
          </p>
          <h3 className="text-xl md:text-2xl font-semibold mb-4">ADDITIONAL SERVICES</h3>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <img
              src={pic4}
              alt="Assembled Tutoring Additional Services"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: SERVICES */}
      <div className="min-h-screen bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-12 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
            SERVICES
          </h1>
          <div className="space-y-4 -ml-4 md:-ml-8">
            {[
              {grade: "", monthly: "Monthly Subscription: 2 hours per week (4 sessions monthly):", perLesson: "Rate per lesson (2 hours):"},
              { grade: "GRADE 4–7", monthly: "R1500", perLesson: "R500" },
              { grade: "GRADE 8–9", monthly: "R1800", perLesson: "R600" },
              { grade: "GRADE 10", monthly: "R2000", perLesson: "R650" },
              { grade: "GRADE 11–12", monthly: "R2300", perLesson: "R700" }
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-black/20 rounded-lg p-4 border border-blue-500/30"
              >
                <span className="text-lg font-medium">{item.grade}</span>
                <span className="text-lg font-medium">{item.monthly}</span>
                <span className="text-lg font-medium">{item.perLesson}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}