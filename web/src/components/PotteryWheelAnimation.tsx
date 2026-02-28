const PotteryWheelAnimation = () => {
  return (
    <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 opacity-30">
      <div className="relative w-40 h-40 md:w-56 md:h-56">
        {/* Spinning Wheel Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-12 md:h-16 animate-spin-slow">
          {/* Outer wheel rim */}
          <div className="absolute inset-0 rounded-full border-4 border-primary-foreground/50 bg-primary-foreground/10" />
          {/* Wheel texture rings */}
          <div className="absolute inset-2 rounded-full border-2 border-primary-foreground/30" />
          <div className="absolute inset-4 rounded-full border border-primary-foreground/20" />
          {/* Center hub */}
          <div className="absolute inset-[35%] rounded-full bg-primary-foreground/40" />
          {/* Wheel spokes */}
          {[0, 45, 90, 135].map((rotation) => (
            <div
              key={rotation}
              className="absolute inset-0 flex items-center justify-center"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="w-full h-0.5 bg-primary-foreground/30" />
            </div>
          ))}
        </div>

        {/* Clay Pot Being Formed */}
        <div className="absolute bottom-10 md:bottom-14 left-1/2 -translate-x-1/2 animate-spin-slow">
          {/* Pot container with forming animation */}
          <div className="relative animate-pot-form">
            {/* Pot base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 md:w-16 h-2 md:h-3 bg-gradient-to-t from-primary-foreground/60 to-primary-foreground/40 rounded-b-full" />
            
            {/* Pot body - lower section */}
            <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 w-14 md:w-20 h-8 md:h-12 bg-gradient-to-t from-primary-foreground/50 to-primary-foreground/35 rounded-b-[40%] animate-pot-body" />
            
            {/* Pot body - middle bulge */}
            <div className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 w-16 md:w-24 h-10 md:h-14 bg-gradient-to-t from-primary-foreground/40 to-primary-foreground/30 rounded-[50%] animate-pot-bulge" />
            
            {/* Pot neck */}
            <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 w-10 md:w-14 h-6 md:h-8 bg-gradient-to-t from-primary-foreground/35 to-primary-foreground/25 rounded-t-[30%] animate-pot-neck" />
            
            {/* Pot rim */}
            <div className="absolute bottom-20 md:bottom-30 left-1/2 -translate-x-1/2 w-12 md:w-16 h-2 md:h-3 bg-primary-foreground/45 rounded-t-full animate-pot-rim" />
            
            {/* Clay texture lines */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 w-12 md:w-18 opacity-30">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-px bg-primary-foreground/40 my-1 md:my-1.5 rounded-full"
                  style={{ width: `${70 + i * 8}%`, marginLeft: `${15 - i * 4}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Potter's hands silhouette */}
        <div className="absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-10 md:gap-14 animate-hands-shape">
          {/* Left hand */}
          <div className="w-4 md:w-6 h-12 md:h-16 bg-primary-foreground/20 rounded-full transform -rotate-12 origin-bottom" />
          {/* Right hand */}
          <div className="w-4 md:w-6 h-12 md:h-16 bg-primary-foreground/20 rounded-full transform rotate-12 origin-bottom" />
        </div>

        {/* Clay splash particles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-12 md:bottom-16 rounded-full bg-primary-foreground/20 animate-clay-splash"
            style={{
              left: `${40 + i * 8}%`,
              width: `${3 + (i % 2)}px`,
              height: `${3 + (i % 2)}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PotteryWheelAnimation;
