import { motion } from 'motion/react';
import { Calendar, ChevronRight, Activity, ShieldCheck, Award, HeartPulse } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreDepartments: () => void;
  onExploreDoctors: () => void;
}

export default function Hero({ onOpenBooking, onExploreDepartments, onExploreDoctors }: HeroProps) {
  const stats = [
    { value: '25+', label: 'Years of Excellence', icon: Award, color: 'text-amber-500 bg-amber-50' },
    { value: '150+', label: 'Specialist Doctors', icon: HeartPulse, color: 'text-medical-500 bg-medical-50' },
    { value: '98.6%', label: 'Patient Satisfaction', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' },
    { value: '24/7', label: 'Emergency Support', icon: Activity, color: 'text-red-500 bg-red-50' }
  ];

  return (
    <div className="relative overflow-hidden bg-transparent pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Hero Text Copy */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-medical-100/60 border border-medical-200 rounded-full text-xs font-semibold text-medical-800 uppercase tracking-wider"
            >
              <span className="flex h-2 w-2 rounded-full bg-medical-500" />
              Trusted Healthcare Network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Your Health is Our <br className="hidden sm:block" />
              <span className="text-medical-600 bg-gradient-to-r from-medical-600 to-medical-800 bg-clip-text">
                Absolute Priority
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-sans"
            >
              At We Care Hospitals, we deliver clinical excellence by combining state-of-the-art diagnostic technologies, compassionate patient-centric environments, and world-renowned specialists.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4"
            >
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2.5 px-7 py-4 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white font-semibold rounded-2xl shadow-xl shadow-medical-500/15 hover:shadow-medical-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Calendar className="h-5 w-5" />
                <span>Book an Appointment</span>
              </button>

              <button
                onClick={onExploreDoctors}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-sm hover:border-slate-300 transition-all cursor-pointer"
              >
                <span>Find a Doctor</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </button>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Fully Accredited Care
              </span>
              <span className="h-1 w-1 bg-slate-300 rounded-full" />
              <span className="flex items-center gap-1.5 font-medium">
                <Activity className="h-4 w-4 text-medical-500" /> Advanced Technology
              </span>
            </motion.div>
          </div>

          {/* Hero Media Illustration */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl glass-card p-3.5">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800"
                  alt="We Care Modern Hospital Setup"
                  className="w-full h-[320px] sm:h-[400px] object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float Card 1 */}
                <div className="absolute top-10 left-6 bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                  <div className="p-2.5 bg-medical-500 rounded-xl text-white">
                    <Activity className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">Emergency Care</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">Response in under 10 min</p>
                  </div>
                </div>

                {/* Float Card 2 */}
                <div className="absolute bottom-10 right-6 bg-white/50 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500 rounded-xl text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800">ISO Accredited</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">International Quality Rank</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Dynamic Stats Grid */}
        <div className="mt-20 border-t border-white/30 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card p-5 rounded-2xl flex items-center gap-4 hover:bg-white/55 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl ${stat.color} flex-shrink-0`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-slate-800 leading-none">
                    {stat.value}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 font-medium leading-tight">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
