import React from "react"
import { Flame, Star, CheckCircle2, Circle, Clock, TrendingUp, BookOpen, ShieldAlert, ChevronRight } from "lucide-react"

export function Mosaic() {
  return (
    <div className="w-[430px] min-h-screen bg-[#0d0c08] font-sans p-3 text-white overflow-hidden flex flex-col gap-3 selection:bg-[#C9973F]/30">
      
      {/* Greeting Bar */}
      <div className="flex items-center justify-between px-2 pt-2 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C9973F] animate-pulse" />
          <span className="text-[#C9973F] text-sm font-semibold tracking-wide">TUESDAY, 12 KISLEV</span>
        </div>
        <span className="text-[#8a7b66] text-sm font-medium">Boker Tov, Yaakov</span>
      </div>

      {/* Growth Level Card - Full Width */}
      <div className="group relative bg-gradient-to-b from-[#2a1d0a] to-[#1a1208] border border-[#2d2010] rounded-2xl p-6 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 hover:border-[#C9973F]/50">
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9973F]/30 to-transparent" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#C9973F]/10 rounded-full blur-3xl" />
        
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-[#C9973F] fill-[#C9973F]" />
          <span className="text-[#C9973F]/80 text-xs font-bold uppercase tracking-widest">Current Level</span>
          <Star className="w-4 h-4 text-[#C9973F] fill-[#C9973F]" />
        </div>
        
        <h2 className="text-4xl font-black text-[#C9973F] tracking-tight mb-1">Amud HaEsh</h2>
        <p className="text-[#8a7b66] text-sm font-medium">Pillar of Fire</p>
        
        <div className="w-full mt-6">
          <div className="flex justify-between text-[10px] font-bold text-[#C9973F]/70 mb-1.5 uppercase tracking-wider">
            <span>Level 4</span>
            <span>240 / 500 XP</span>
          </div>
          <div className="w-full h-1.5 bg-[#0d0c08] rounded-full overflow-hidden border border-[#2d2010]">
            <div className="h-full bg-gradient-to-r from-[#8b6522] to-[#C9973F] w-[48%] rounded-full shadow-[0_0_10px_rgba(201,151,63,0.5)]" />
          </div>
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          
          {/* Mitzvah of the Day (Tall) */}
          <div className="group relative bg-[#1f1710] border border-[#2d2010] rounded-2xl p-5 flex flex-col h-[220px] transition-all duration-300 hover:border-[#C9973F]/40 hover:bg-[#251b13]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#C9973F] rounded-t-2xl" />
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BookOpen className="w-16 h-16 text-[#C9973F]" />
            </div>
            
            <span className="text-[#C9973F] text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" /> Mitzvah of the Day
            </span>
            
            <h3 className="text-white text-lg font-bold leading-tight mb-2">
              Bikur Cholim
            </h3>
            <p className="text-[#a1907b] text-sm leading-relaxed line-clamp-3">
              Visiting the sick removes 1/60th of their illness. Send a message to someone recovering today.
            </p>
            
            <div className="mt-auto pt-4 flex items-center text-[#C9973F] text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Learn more <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Time Today (Short) */}
          <div className="group bg-[#110e0a] border border-[#2d2010] rounded-2xl p-5 flex flex-col justify-between h-[130px] transition-all duration-300 hover:border-[#C9973F]/30">
            <div className="flex justify-between items-start">
              <span className="text-[#8a7b66] text-xs font-bold uppercase tracking-wider">Learning Today</span>
              <div className="p-1.5 bg-[#C9973F]/10 rounded-lg">
                <Clock className="w-4 h-4 text-[#C9973F]" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white tracking-tighter">45</span>
              <span className="text-[#8a7b66] font-medium">min</span>
            </div>
          </div>
          
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          
          {/* Today's Score (Tall) */}
          <div className="group bg-[#110e0a] border border-[#2d2010] rounded-2xl p-5 flex flex-col h-[200px] transition-all duration-300 hover:border-[#C9973F]/30">
            <span className="text-[#8a7b66] text-xs font-bold uppercase tracking-wider mb-2">Daily Practice</span>
            
            <div className="flex items-baseline gap-1 mt-1 mb-5">
              <span className="text-4xl font-black text-[#C9973F] tracking-tighter">5</span>
              <span className="text-[#8a7b66] text-xl font-bold">/7</span>
            </div>
            
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9973F]" />
                <span className="text-sm text-white font-medium">Shacharis</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9973F]" />
                <span className="text-sm text-white font-medium">Daf Yomi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Circle className="w-4 h-4 text-[#4a3b2c]" />
                <span className="text-sm text-[#8a7b66] font-medium">Mincha</span>
              </div>
            </div>
          </div>

          {/* Time Total (Short) */}
          <div className="group bg-[#110e0a] border border-[#2d2010] rounded-2xl p-5 flex flex-col justify-between h-[150px] transition-all duration-300 hover:border-[#C9973F]/30">
            <div className="flex justify-between items-start">
              <span className="text-[#8a7b66] text-xs font-bold uppercase tracking-wider">All Time</span>
              <div className="p-1.5 bg-[#C9973F]/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-[#C9973F]" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-black text-white tracking-tighter">124</span>
                <span className="text-[#8a7b66] font-medium">hrs</span>
              </div>
              <span className="text-xs text-[#C9973F] font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Top 10%
              </span>
            </div>
          </div>
          
        </div>
      </div>

      {/* Quote - Full Width */}
      <div className="relative bg-[#090806] border border-[#2d2010] rounded-2xl p-6 py-8 flex flex-col items-center text-center mt-1 overflow-hidden">
        <span className="absolute -top-4 left-4 text-[#C9973F]/10 text-8xl font-serif leading-none">"</span>
        
        <p className="font-serif italic text-[#d4c8b8] text-[1.1rem] leading-relaxed relative z-10 px-2">
          "A little bit of light dispels a lot of darkness."
        </p>
        
        <div className="mt-4 flex flex-col items-center gap-1">
          <div className="w-4 h-[1px] bg-[#C9973F]/30 mb-1" />
          <span className="text-[#8a7b66] text-xs font-bold uppercase tracking-widest">Rabbi Schneur Zalman</span>
        </div>
      </div>

    </div>
  )
}
