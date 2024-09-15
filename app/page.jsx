// src/pages/index.js


export default function Home() {
  return (
    <>
    
      <header className="bg-blue-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Doctor AI</h1>
          <p className="text-lg mb-8">
            AI-driven health diagnostics. Fast, accurate, and available anytime.
          </p>
          <a
            href="#services"
            className="bg-white text-blue-500 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Learn More
          </a>
        </div>
      </header>

      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">AI Transcription</h3>
              <p>
                Automatically transcribe medical conversations, saving time and
                improving accuracy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Diagnosis Support</h3>
              <p>
                Get AI-driven diagnosis suggestions based on patient data and
                transcriptions.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Health Records Analysis</h3>
              <p>
                Analyze and interpret patient records to deliver quick, actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">Why Choose Doctor AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-500 text-white rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Accuracy</h3>
              <p>
                Our advanced AI models provide diagnostic accuracy you can trust.
              </p>
            </div>
            <div className="p-6 bg-blue-500 text-white rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Efficiency</h3>
              <p>
                Speed up your diagnostic process with automated solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 py-8">
        <div className="container mx-auto text-center text-white">
          <p>&copy; 2024 Doctor AI. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
