import { motion } from 'motion/react';
import { ShieldCheck, HeartPulse, Award, ShieldAlert, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const values = [
    {
      title: 'Compassionate Care',
      desc: 'We put our patients first, offering empathetic support and personalized treatment plans at every step of their journey.',
      icon: HeartPulse,
      color: 'text-red-500 bg-red-50 border-red-100'
    },
    {
      title: 'Clinical Excellence',
      desc: 'We uphold the highest clinical standards, recruiting board-certified specialists and continuous training to ensure excellent patient outcomes.',
      icon: Award,
      color: 'text-amber-500 bg-amber-50 border-amber-100'
    },
    {
      title: 'Medical Innovation',
      desc: 'We embrace advanced digital health tools, minimally invasive surgery techniques, and medical technologies to lead in safe therapies.',
      icon: Sparkles,
      color: 'text-medical-500 bg-medical-50 border-medical-100'
    },
    {
      title: 'Trust & Integrity',
      desc: 'Transparency is our signature. We maintain the highest standards of ethics, clear medical costs, and secure patient data privacy.',
      icon: ShieldCheck,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100'
    }
  ];

  const pillars = [
    '24/7 Advanced Emergency & Intensive Care Units (ICU)',
    'Fully Equipped Hybrid Operating Rooms with Robotic-Assisted Surgery',
    'AI-Guided Medical Diagnostics and High-Speed Laboratory Services',
    'Comfortable In-Patient Rooms and Holistic Recovery Programs',
    'State-of-the-Art Cardiovascular and Neurological Catheterization Labs',
    'Patient-Centric Outpatient Clinics with Minimal Wait Times'
  ];

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
            Our Legacy
          </h2>
          <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Leading Healthcare with Deep Empathy and Innovation
          </p>
          <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
          <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
            Since our founding in 2001, We Care Hospitals has set the benchmark for outstanding patient service. We treat everyone who walks through our doors as an extension of our own family.
          </p>
        </div>

        {/* Story & Legacy Panel */}
        <div className="grid lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-xl glass-card p-2.5">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                alt="Our Medical Staff"
                className="w-full h-[360px] object-cover rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-mono tracking-wider bg-medical-500 text-white font-bold uppercase px-2 py-1 rounded">Established 2001</span>
                <p className="mt-2 font-display text-lg font-bold leading-tight">Accredited by Joint Commission International (JCI)</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <h3 className="font-display text-2xl font-bold text-slate-800">
              Our Vision & Mission
            </h3>
            <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              At We Care Hospitals, our mission is to deliver comprehensive, world-class medical services that are both accessible and deeply personal. We strive to pioneer therapeutic innovations while offering a healing atmosphere that respects human dignity.
            </p>
            
            <div className="mt-6 space-y-3">
              {pillars.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-medical-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values Section */}
        <div className="border-t border-white/30 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-800">
              The Principles That Guide Us
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Every clinician, surgeon, and nurse at We Care operates with shared medical objectives.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:bg-white/55 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`p-3 rounded-xl border w-fit ${val.color} mb-4`}>
                  <val.icon className="h-6 w-6" />
                </div>
                <h4 className="font-display font-bold text-base text-slate-800">
                  {val.title}
                </h4>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
