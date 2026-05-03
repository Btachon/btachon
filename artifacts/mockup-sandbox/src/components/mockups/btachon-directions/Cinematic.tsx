import React from 'react';
import { Flame, Star, CheckCircle2, Circle, Clock, TrendingUp, BookOpen, ShieldAlert, ChevronRight } from "lucide-react";

export function Cinematic() {
  return (
    <div className="w-[430px] min-h-screen bg-[#0a0806] font-sans overflow-hidden relative text-slate-100 mx-auto border border-white/10 shadow-2xl">
      {/* Floating Aura */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-amber-900/40 blur-[80px] pointer-events-none" />

      {/* Deep gradient background overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{ background: 'radial-gradient(ellipse 120% 50% at 50% 0%, #3d2208 0%, #1a1005 40%, #0a0806 100%)' }}
      />

      <div className="relative z-10 px-6 py-12 flex flex-col gap-6 h-full overflow-y-auto pb-24">
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mt-4 mb-2">
          <span className="text-[#C9973F] text-sm font-medium tracking-widest uppercase mb-2">Boker Tov</span>
          <h1 className="text-4xl font-light tracking-tight text-white drop-shadow-md">Eliyahu</h1>
        </header>

        {/* Growth Level Card */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all hover:bg-white/10 shadow-lg">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#C9973F]" />
              <span className="text-[#C9973F] text-xs font-semibold tracking-wider uppercase">Current Level</span>
            </div>
            <span className="text-white/40 text-xs font-medium">Lvl 12</span>
          </div>
          <h2 className="text-3xl font-semibold text-white mt-2 tracking-tight">Ohev Yisrael</h2>
          <p className="text-white/60 text-sm mt-2">1,240 sparks until next level</p>
          
          {/* Bottom Glow Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5">
            <div className="h-full w-2/3 bg-[#C9973F] shadow-[0_0_12px_#C9973F]" />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-4">
          <div className="flex-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white/50" />
              </div>
              <span className="text-white/60 text-sm font-medium">Time</span>
            </div>
            <span className="text-xl font-semibold text-[#C9973F] drop-shadow-[0_0_8px_rgba(201,151,63,0.5)]">42m</span>
          </div>
          <div className="flex-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-4 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                <Flame className="w-4 h-4 text-white/50" />
              </div>
              <span className="text-white/60 text-sm font-medium">Streak</span>
            </div>
            <span className="text-xl font-semibold text-[#C9973F] drop-shadow-[0_0_8px_rgba(201,151,63,0.5)]">18</span>
          </div>
        </div>

        {/* Today's Practice */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-lg">
          <h3 className="text-white/90 text-sm font-medium mb-5 flex items-center justify-between">
            <span>Today's Practice</span>
            <span className="text-[#C9973F] text-xs font-semibold">2/3 Complete</span>
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 group cursor-pointer">
              <CheckCircle2 className="w-6 h-6 text-[#C9973F] drop-shadow-[0_0_5px_rgba(201,151,63,0.5)]" />
              <div className="flex-1">
                <p className="text-white/50 text-base font-medium line-through decoration-white/30">Morning Brachos</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <CheckCircle2 className="w-6 h-6 text-[#C9973F] drop-shadow-[0_0_5px_rgba(201,151,63,0.5)]" />
              <div className="flex-1">
                <p className="text-white/50 text-base font-medium line-through decoration-white/30">Daf Yomi</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <Circle className="w-6 h-6 text-white/20 group-hover:text-white/40 transition-colors" />
              <div className="flex-1">
                <p className="text-white text-base font-medium">10 Min Hitbodedut</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mitzvah Card */}
        <div 
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-lg"
          style={{ boxShadow: 'inset 4px 0 0 #C9973F' }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-[#C9973F]" />
              <span className="text-[#C9973F] text-xs font-semibold tracking-wider uppercase">Mitzvah of the Day</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ahavas Yisroel</h3>
          <p className="text-white/60 text-sm leading-relaxed">
            Love your fellow as yourself. Today, try to find one positive trait in someone you usually find difficult to deal with.
          </p>
        </div>

        {/* Quote */}
        <div className="mt-8 px-6 text-center pb-8">
          <span className="text-[#C9973F] text-5xl font-serif leading-none block mb-[-15px] drop-shadow-[0_0_8px_rgba(201,151,63,0.4)]">"</span>
          <p className="text-white/80 italic text-lg font-light leading-relaxed">
            The day is short, the work is much, the workers are lazy, the reward is great, and the Master of the house is pressing.
          </p>
          <p className="text-[#C9973F] text-xs font-medium uppercase tracking-widest mt-6">Pirkei Avot 2:20</p>
        </div>
      </div>
    </div>
  );
}
