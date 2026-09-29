export function BackgroundCanvas() {
  return (
    <div className="absolute inset-0 bg-[#1e1e24] overflow-hidden">
      {/* Simple Pixel Art Stars */}
      <div className="absolute top-10 left-10 w-1 h-1 bg-white opacity-50 shadow-[20px_40px_0_white,100px_10px_0_white,150px_60px_0_white,250px_20px_0_white,320px_80px_0_white]" />
      {/* Distant City Silhouette (Flat Pixel Art) */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#111115]">
        <div className="absolute bottom-16 left-4 w-12 h-20 bg-[#111115]" />
        <div className="absolute bottom-16 left-20 w-8 h-12 bg-[#111115]" />
        <div className="absolute bottom-16 left-32 w-16 h-24 bg-[#111115]" />
        <div className="absolute bottom-16 left-60 w-10 h-16 bg-[#111115]" />
        <div className="absolute bottom-16 left-80 w-14 h-28 bg-[#111115]" />
      </div>
    </div>
  );
}
