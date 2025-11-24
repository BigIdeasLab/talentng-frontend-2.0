export function RecommendedLearningPaths() {
  const learningPaths = [
    {
      id: 1,
      title: "Whatever the Title",
      duration: "5 classes (4h 56m)",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/4bf01fda474c8d498e63c2e0cb4bc008dca99e0a?width=748",
    },
    {
      id: 2,
      title: "Whatever the Title",
      duration: "5 classes (4h 56m)",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/d380f60a4797c398d705e893eacfb868043112f3?width=748",
    },
    {
      id: 3,
      title: "Whatever the Title",
      duration: "5 classes (4h 56m)",
      backgroundImage: "https://api.builder.io/api/v1/image/assets/TEMP/96ff905aeec3c249a3dc7d41243aadaabdf0a0aa?width=748",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="space-y-2.5">
        <h2 className="text-2xl font-medium text-gray-800 font-geist">
          Recommended Learning Paths
        </h2>
        <div className="flex items-center justify-between">
          <p className="text-base text-gray-500 font-geist">
            Reach your learning goals with hand picked sequesntial classes
          </p>
          <button className="text-base text-gray-600 underline font-geist hover:text-gray-800 transition-colors">
            View more
          </button>
        </div>
      </div>
      
      {/* Learning Path Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <div key={path.id} className="relative group cursor-pointer">
            {/* Course Image */}
            <div 
              className="w-full h-[300px] rounded-[2rem] bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: `url(${path.backgroundImage})` }}
            >
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 bg-black rounded-b-[2rem] p-4">
                <div className="space-y-11">
                  <h3 className="text-base font-bold text-white font-geist">
                    {path.title}
                  </h3>
                  <div className="text-sm text-white font-geist">
                    <span className="font-bold">5 classes </span>
                    <span className="font-normal">(4h 56m)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}