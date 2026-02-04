import LOGO from "../Assets/LOGO.png";

export default function Services() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-blue-900 to-blue-800 text-white py-12 px-4 relative mt-16">
      {/* Fixed Logo - stays in place during scroll */}
      <div className="hidden md:block fixed top-1/2 right-6 transform -translate-y-1/2 z-10 pointer-events-none md:mt-10">
        <img
          src={LOGO}
          alt="Assembled Tutoring"
          className="h-160 w-auto object-contain opacity-19"
        />
      </div>

      {/* Scrollable Content - MOVED DOWN */}
      <div className="max-w-4xl mx-auto relative z-0"> 
        <div className="pr-0 md:pr-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center md:text-left">
            SERVICES
          </h1>

          {/* Pricing Rows */}
          <div className="space-y-4">
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