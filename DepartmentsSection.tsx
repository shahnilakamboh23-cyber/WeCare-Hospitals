import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Baby, Activity, Brain, Sparkles, Shield, ChevronRight, Star, GraduationCap, Clock } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Department, Doctor } from '../types';

interface DepartmentsSectionProps {
  onOpenBooking: (preferredDoctorId?: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onSwitchTab: (tabId: string) => void;
}

export default function DepartmentsSection({ onOpenBooking, onSelectDoctor, onSwitchTab }: DepartmentsSectionProps) {
  const [selectedDeptId, setSelectedDeptId] = useState(DEPARTMENTS[0].id);

  const selectedDept = useMemo(() => {
    return DEPARTMENTS.find((d) => d.id === selectedDeptId) || DEPARTMENTS[0];
  }, [selectedDeptId]);

  const deptDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => doc.departmentId === selectedDeptId);
  }, [selectedDeptId]);

  const getIcon = (iconName: string, className?: string) => {
    switch (iconName) {
      case 'Heart': return <Heart className={className} />;
      case 'Baby': return <Baby className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Shield': return <Shield className={className} />;
      default: return <Heart className={className} />;
    }
  };

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
            Specialized Care
          </h2>
          <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Core Clinical Departments
          </p>
          <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            We offer expert consultation and therapeutic care across a comprehensive spectrum of clinical disciplines, with dedicated labs and state-of-the-art facilities.
          </p>
        </div>

        {/* Dynamic Split Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Menu Selection (Departments List) */}
          <div className="lg:col-span-4 space-y-3 glass-card p-5 rounded-2xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Select Specialty
            </h3>
            {DEPARTMENTS.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left transition-all duration-250 cursor-pointer border ${
                    isSelected
                      ? 'bg-medical-500 text-white shadow-lg shadow-medical-500/15 font-bold scale-[1.01] border-medical-600'
                      : 'hover:bg-white/40 border-transparent hover:border-white/20 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-medical-50 text-medical-600'
                    }`}>
                      {getIcon(dept.iconName, 'h-5 w-5')}
                    </div>
                    <div>
                      <span className="text-sm block leading-none">{dept.name}</span>
                      <span className={`text-[10px] mt-0.5 block leading-none ${isSelected ? 'text-white/85' : 'text-slate-400'}`}>
                        {DOCTORS.filter((d) => d.departmentId === dept.id).length} Specialists Available
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${
                    isSelected ? 'text-white translate-x-1' : 'text-slate-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Area - Rich Details and Associated Specialists */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Department Details Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDeptId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-card-strong p-6 sm:p-8 rounded-3xl space-y-6"
              >
                {/* Department Name and Headline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/40 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-medical-100 rounded-2xl text-medical-600">
                      {getIcon(selectedDept.iconName, 'h-7 w-7')}
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-slate-800">
                        {selectedDept.name} Department
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Clinical Care & Diagnostics</p>
                    </div>
                  </div>
                </div>

                {/* Narrative Summary */}
                <div className="space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                    {selectedDept.description}
                  </p>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {selectedDept.longDescription}
                  </p>
                </div>

                {/* Symptoms and Services Grid */}
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  
                  {/* Symptoms Column */}
                  <div className="bg-white/30 backdrop-blur-sm p-5 rounded-2xl border border-white/50">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      When To Visit Us
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedDept.symptoms.map((symptom) => (
                        <li key={symptom} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-medical-500 mt-1.5 flex-shrink-0" />
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Services Column */}
                  <div className="bg-white/50 backdrop-blur-sm p-5 rounded-2xl border border-white/60">
                    <h4 className="text-xs font-bold text-medical-800 uppercase tracking-wider mb-3">
                      Advanced Procedures
                    </h4>
                    <ul className="space-y-2.5">
                      {selectedDept.services.map((service) => (
                        <li key={service} className="flex items-start gap-2.5 text-xs text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-medical-600 mt-1.5 flex-shrink-0" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>

            {/* Associated Department Doctors List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="font-display text-lg font-bold text-slate-800">
                  {selectedDept.name} Specialists
                </h3>
                <button
                  onClick={() => onSwitchTab('doctors')}
                  className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  View All Doctors
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                {deptDoctors.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="glass-card p-4 rounded-2xl hover:bg-white/55 flex gap-4 items-start group transition-all duration-300"
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 object-cover rounded-xl border border-white/50"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-display font-bold text-sm text-slate-800 truncate group-hover:text-medical-600 transition-colors">
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium truncate">
                        {doc.title}
                      </p>
                      
                      <div className="flex items-center gap-2.5 text-[11px] text-slate-500 pt-0.5">
                        <span className="flex items-center gap-0.5 font-semibold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          {doc.rating}
                        </span>
                        <span>•</span>
                        <span>{doc.experience} exp</span>
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => onSelectDoctor(doc)}
                          className="px-2.5 py-1 bg-white/40 hover:bg-white/60 border border-white/45 text-[10px] font-bold text-slate-600 rounded-lg transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => onOpenBooking(doc.id)}
                          className="px-2.5 py-1 bg-medical-500 hover:bg-medical-600 active:bg-medical-700 text-[10px] font-bold text-white rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
