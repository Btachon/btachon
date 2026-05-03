import React from "react";
import { 
  Flame, 
  Star, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  ChevronRight 
} from "lucide-react";

export function Editorial() {
  return (
    <div className="flex justify-center bg-black min-h-screen py-8">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        `}
      </style>
      
      <div className="w-[430px] min-h-screen bg-[#0e0c09] text-[#f4eee6] font-sans overflow-hidden relative shadow-2xl">
        {/* Glow behind hero */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C9973F]/10 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Hero Section */}
        <div className="px-8 pt-20 pb-12 bg-gradient-to-b from-[#1a1208] via-[#241a10] to-[#0e0c09] relative">
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] tracking-[0.25em] text-[#C9973F]/80 uppercase mb-6 font-medium">
              Thursday • 12 Elul 5784
            </span>
            
            <h1 className="font-['Playfair_Display'] text-[#C9973F] flex flex-col items-center">
              <span className="text-2xl italic mb-1 font-normal opacity-90">Boker Tov,</span>
              <span className="text-7xl font-medium leading-none tracking-tight">Ephraim</span>
            </h1>
          </div>
        </div>

        {/* Fading Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9973F]/40 to-transparent w-full opacity-60" />

        <div className="px-6 py-10 space-y-8 relative z-10">
          
          {/* Growth Level */}
          <div className="border border-[#3d2f1a] bg-[#1c1610] p-8 rounded-sm relative overflow-hidden flex flex-col items-center text-center">
            <div className="absolute top-0 right-0 p-3 opacity-20">
              <Star className="w-24 h-24 text-[#C9973F]" strokeWidth={1} />
            </div>
            
            <h2 className="text-[10px] tracking-[0.25em] text-[#C9973F] uppercase mb-4 relative z-10">
              Current Status
            </h2>
            <div className="font-['Playfair_Display'] text-3xl text-white mb-6 relative z-10">
              Seeker of Truth
            </div>
            
            <div className="w-full relative z-10">
              <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#a39a8c] mb-3">
                <span>Level 4</span>
                <span className="text-[#C9973F]">1,240 / 2,000 XP</span>
              </div>
              <div className="h-[2px] w-full bg-[#2a2218] rounded-full overflow-hidden">
                <div className="h-full bg-[#C9973F] w-[62%]" />
              </div>
            </div>
          </div>

          {/* Mitzvah of the Day */}
          <div className="border border-[#3d2f1a] bg-[#1c1610] p-8 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[10px] tracking-[0.25em] text-[#C9973F] uppercase">
                Mitzvah of the Day
              </h2>
              <BookOpen className="w-4 h-4 text-[#C9973F]/70" strokeWidth={1.5} />
            </div>
            
            <div className="border-l-2 border-[#C9973F] pl-5 py-1">
              <h3 className="font-['Playfair_Display'] text-2xl text-[#f4eee6] mb-3">
                Judging Favorably
              </h3>
              <p className="text-[#a39a8c] text-sm leading-relaxed italic font-['Playfair_Display']">
                "When you judge any person favorably, you are tipping the scales of heaven in their favor, and in yours."
              </p>
            </div>
          </div>

          {/* Today's Practice */}
          <div className="border border-[#3d2f1a] bg-[#1c1610] p-8 rounded-sm">
            <h2 className="text-[10px] tracking-[0.25em] text-[#C9973F] uppercase mb-6">
              Today's Practice
            </h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 group cursor-pointer">
                <CheckCircle2 className="w-5 h-5 text-[#C9973F] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-[#f4eee6] text-sm font-medium line-through decoration-[#a39a8c]/50 text-[#a39a8c]">Morning Tefillah</p>
                  <p className="text-[11px] text-[#a39a8c]/60 mt-1">Completed at 7:30 AM</p>
                </div>
              </div>
              
              <div className="h-px bg-[#3d2f1a]/50 w-full ml-9" />
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <Circle className="w-5 h-5 text-[#594833] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-[#f4eee6] text-sm font-medium">Daf Yomi</p>
                  <p className="text-[11px] text-[#a39a8c] mt-1">Bava Batra 42</p>
                </div>
              </div>
              
              <div className="h-px bg-[#3d2f1a]/50 w-full ml-9" />
              
              <div className="flex items-start gap-4 group cursor-pointer">
                <Circle className="w-5 h-5 text-[#594833] mt-0.5 shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-[#f4eee6] text-sm font-medium">Review Halacha</p>
                  <p className="text-[11px] text-[#a39a8c] mt-1">15 minutes required</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-[#3d2f1a] bg-[#1c1610] p-6 rounded-sm flex flex-col items-center text-center justify-center">
              <Flame className="w-5 h-5 text-[#C9973F] mb-3" strokeWidth={1.5} />
              <div className="font-['Playfair_Display'] text-4xl text-white mb-1">14</div>
              <div className="text-[9px] tracking-[0.2em] text-[#a39a8c] uppercase">Day Streak</div>
            </div>
            
            <div className="border border-[#3d2f1a] bg-[#1c1610] p-6 rounded-sm flex flex-col items-center text-center justify-center">
              <Clock className="w-5 h-5 text-[#C9973F] mb-3" strokeWidth={1.5} />
              <div className="font-['Playfair_Display'] text-4xl text-white mb-1">2.5</div>
              <div className="text-[9px] tracking-[0.2em] text-[#a39a8c] uppercase">Hours Logged</div>
            </div>
          </div>

        </div>

        {/* Fading Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9973F]/30 to-transparent w-full opacity-60 mt-4 mb-12" />

        {/* Closing Quote */}
        <div className="px-10 pb-20 text-center relative">
          <div className="text-4xl font-['Playfair_Display'] text-[#C9973F]/20 absolute top-0 left-1/2 -translate-x-1/2 -mt-4">"</div>
          <p className="font-['Playfair_Display'] text-lg text-[#a39a8c] italic leading-loose">
            It is not incumbent upon you to complete the work, but neither are you at liberty to desist from it.
          </p>
          <p className="text-[10px] tracking-[0.25em] text-[#C9973F] uppercase mt-6">
            Pirkei Avot 2:21
          </p>
        </div>
        
      </div>
    </div>
  );
}
