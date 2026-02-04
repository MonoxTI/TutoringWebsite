import pic2 from "../assets/pic2.jpg";
import pic4 from "../assets/pic4.jpg";

export default function Alumni() {
  return (
    <div className="bg-white min-h-screen py-12 px-4">
      {/* Image 1 */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <img
            src={pic2}
            alt="Assembled Tutoring Alumni"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Text Content */}
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

      {/* Image 2 */}
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
  );
}