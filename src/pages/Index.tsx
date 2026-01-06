const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100 overflow-auto relative">
      {/* Background Layer */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"
        style={{ opacity: 0.5 }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-6">
        {/* Logo Placeholder */}
        <div className="h-10 flex items-center justify-center mb-8">
          <div className="text-2xl font-bold tracking-tight text-slate-800">
            WAIWARN
          </div>
        </div>
        
        {/* Glass Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-[1120px] flex-1 overflow-hidden flex items-center justify-center">
          <p className="text-slate-500 text-lg">Two Column Layout Here</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
