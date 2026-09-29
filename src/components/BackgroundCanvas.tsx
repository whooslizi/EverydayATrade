export function BackgroundCanvas() {
  return (
    <div 
       className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
       style={{ backgroundImage: "url('/sprites/title_bg.jpg')" }}
    >
       <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
