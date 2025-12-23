import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Sparkles, Zap } from "lucide-react";

const WelcomePage = ({ onEnter }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#020617] text-white flex flex-col items-center justify-center font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,_var(--tw-gradient-stops))] from-blue-900/50 via-[#020617] to-[#020617]"></div>
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      {/* Floating Orbs - Irregular & Intense */}
      <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-blue-600/30 rounded-full blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: '0s', animationDuration: '12s' }}></div>
      <div className="absolute bottom-0 right-1/3 w-[35rem] h-[35rem] bg-purple-600/30 rounded-full blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: '2s', animationDuration: '15s' }}></div>
      <div className="absolute top-1/2 right-0 w-[25rem] h-[40rem] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: '4s', animationDuration: '10s' }}></div>
      <div className="absolute bottom-1/4 left-[-10%] w-[40rem] h-[20rem] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: '1s', animationDuration: '18s' }}></div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col items-center text-center space-y-8 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* Logo/Icon Area */}
        <div className="relative mb-4 group">
           <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-40 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
           <div className="relative flex items-center justify-center w-32 h-32 bg-slate-900 ring-1 ring-slate-900/5 rounded-full shadow-xl border border-slate-700/50">
              <img src={`${import.meta.env.BASE_URL}logo.png?v=3`} alt="LimiX Logo" className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-blue-400 to-purple-400 drop-shadow-lg">
            LimiX | 通用数据分析平台
          </h1>
        </div>

        {/* Description */}
        <p className="max-w-2xl text-slate-400 text-lg md:text-xl leading-relaxed">
          新一代智能预测与决策支持系统
        </p>

        {/* Features Preview */}
        <div className="flex gap-6 pt-4 text-slate-500 text-sm uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-500" /> 极速推理
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" /> 高精预测
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" /> 智能分析
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-8">
          <button 
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-transparent border border-blue-500/30 rounded-full overflow-hidden transition-all duration-300 hover:border-blue-500/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] focus:outline-none cursor-pointer"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative flex items-center gap-2">
              进入系统
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-8 text-slate-600 text-xs tracking-widest uppercase">
        LimiX Intelligence &copy; 2025
      </div>
    </div>
  );
};

export default WelcomePage;
