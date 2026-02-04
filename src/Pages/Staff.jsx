import pic1 from '../assets/pic1.png';
export default function Staff() {
  return (
     <div className="min-h-screen bg-gradient-to-r from-black via-blue-900 to-blue-500 text-white py-12 px-4">
      <div className="max-w-4xl mx-auto ">
        <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold ">STAFF</h1>
        </div>

      {/* Image with imported asset */}
        
          <img
            src={pic1}
            alt="Assembled Tutoring Alumni"
            className="w-30 h-auto object-cover mt-20"
          />
       <h3 className="text-3xl md:text-4xl text-white mt-6">
        Founder
      </h3>
 
    </div>
    </div>
  );
}

