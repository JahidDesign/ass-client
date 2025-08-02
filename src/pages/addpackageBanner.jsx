
const HeroSection = () => {
  return (
    <div className="bg-white text-black">
      {/* Hero Banner Section */}
      <section
        className="relative h-[50vh] bg-cover bg-bottom flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://i.ibb.co/DxqQXHg/561766903.jpg')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0  bg-opacity-60"></div>

        {/* Text Content */}
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
           Why<span className="text-yellow-400">Travel</span> With Us ?
          </h1>
          <p className="text-lg mb-6">
            Beyond Borders, Beyond Expectations
          </p>
        </div>
      </section>
     
    </div>
  );
};

export default HeroSection;
