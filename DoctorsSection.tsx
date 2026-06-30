import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Star, Filter, Calendar, Clock, GraduationCap, X, Award, MapPin, Check, DollarSign } from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data';
import { Doctor } from '../types';

interface DoctorsSectionProps {
  onOpenBooking: (preferredDoctorId?: string) => void;
  selectedDoctorForModal?: Doctor | null;
  setSelectedDoctorForModal: (doctor: Doctor | null) => void;
}

export default function DoctorsSection({ onOpenBooking, selectedDoctorForModal, setSelectedDoctorForModal }: DoctorsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');

  const daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            doc.bio.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
      
      const matchesDay = selectedDayFilter === 'all' || doc.availability.includes(selectedDayFilter);
      
      return matchesSearch && matchesDept && matchesDay;
    });
  }, [searchQuery, selectedDeptFilter, selectedDayFilter]);

  const getDepartmentName = (deptId: string) => {
    return DEPARTMENTS.find((d) => d.id === deptId)?.name || 'General';
  };

  return (
    <section className="py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
            Meet Our Experts
          </h2>
          <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            World-Class Medical Specialists
          </p>
          <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            Our medical staff consists of board-certified clinicians, surgeons, and researchers representing the best in modern medical practices.
          </p>
        </div>

        {/* Filters Controls Panel */}
        <div className="glass-card p-6 rounded-3xl space-y-5 mb-10">
          <div className="grid md:grid-cols-12 gap-4 items-center">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by specialist name, title, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/40 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-sm text-slate-700 shadow-inner"
              />
            </div>

            {/* Department Filter Selector */}
            <div className="md:col-span-4 relative">
              <select
                value={selectedDeptFilter}
                onChange={(e) => setSelectedDeptFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-sm text-slate-700 cursor-pointer shadow-inner appearance-none"
              >
                <option value="all">🏥 All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Filter Selector */}
            <div className="md:col-span-3 relative">
              <select
                value={selectedDayFilter}
                onChange={(e) => setSelectedDayFilter(e.target.value)}
                className="w-full px-4 py-3 bg-white/40 border border-white/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-sm text-slate-700 cursor-pointer shadow-inner appearance-none"
              >
                <option value="all">📅 Any Availability Day</option>
                {daysList.map((day) => (
                  <option key={day} value={day}>
                    Available on {day}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Clear Filter Link */}
          {(searchQuery || selectedDeptFilter !== 'all' || selectedDayFilter !== 'all') && (
            <div className="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-white/30">
              <span>Showing {filteredDoctors.length} doctors matching filters</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDeptFilter('all');
                  setSelectedDayFilter('all');
                }}
                className="text-medical-600 hover:text-medical-700 font-bold hover:underline cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Doctors Grid Display */}
        {filteredDoctors.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map((doc, idx) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                className="glass-card rounded-3xl hover:bg-white/55 transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Card Top: Image & Overlay */}
                <div className="relative h-60 overflow-hidden bg-white/10">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-medical-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase px-3 py-1.5 rounded-full shadow-md">
                    {getDepartmentName(doc.departmentId)}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-slate-500 text-[10px] font-normal">({doc.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-display font-bold text-lg text-slate-800 leading-snug group-hover:text-medical-600 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 leading-none">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1.5 font-medium">
                      <Award className="h-4 w-4 text-medical-500" />
                      <span>{doc.experience} of medical practice</span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                    {doc.bio}
                  </p>

                  <div className="border-t border-white/40 pt-4 flex gap-3">
                    <button
                      onClick={() => setSelectedDoctorForModal(doc)}
                      className="flex-1 py-3 bg-white/40 hover:bg-white/60 border border-white/45 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => onOpenBooking(doc.id)}
                      className="flex-1 py-3 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white text-xs font-bold rounded-xl shadow-md shadow-medical-500/10 hover:shadow-medical-600/20 active:shadow-none transition-all cursor-pointer"
                    >
                      Book Clinic Visit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/20 backdrop-blur-sm rounded-3xl border border-dashed border-white/40">
            <span className="text-4xl">🧑‍⚕️</span>
            <h3 className="text-base font-bold text-slate-700 mt-4">No Specialists Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-2">
              We couldn't find any doctor matching "{searchQuery}" under the selected filters. Please adjust your criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDeptFilter('all');
                setSelectedDayFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-medical-500 text-white text-xs font-bold rounded-xl hover:bg-medical-600 shadow-sm cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* Doctor Profile Details Dialog / Modal Overlay */}
      <AnimatePresence>
        {selectedDoctorForModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDoctorForModal(null)}
              className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs transition-opacity"
            />

            <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="relative transform overflow-hidden rounded-3xl glass-card-strong text-left shadow-2xl transition-all w-full max-w-2xl flex flex-col md:flex-row"
              >
                {/* Modal Left Image Panel */}
                <div className="w-full md:w-5/12 bg-white/20 relative min-h-[220px] md:min-h-full">
                  <img
                    src={selectedDoctorForModal.image}
                    alt={selectedDoctorForModal.name}
                    className="w-full h-full object-cover absolute inset-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent md:hidden" />
                  
                  {/* Floating Specs */}
                  <div className="absolute bottom-4 left-4 right-4 text-white md:hidden">
                    <span className="text-[10px] font-bold uppercase bg-medical-500 text-white px-2 py-1 rounded">
                      {getDepartmentName(selectedDoctorForModal.departmentId)}
                    </span>
                    <h3 className="font-display font-extrabold text-lg mt-1">{selectedDoctorForModal.name}</h3>
                  </div>
                </div>

                {/* Modal Right Info Panel */}
                <div className="w-full md:w-7/12 p-6 sm:p-8 space-y-5 relative">
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedDoctorForModal(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/30 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  {/* Header details (Desktop only) */}
                  <div className="hidden md:block space-y-1">
                    <span className="text-[10px] font-bold text-medical-600 uppercase tracking-widest bg-medical-100/60 border border-medical-200 px-2.5 py-1 rounded-full w-fit block">
                      {getDepartmentName(selectedDoctorForModal.departmentId)}
                    </span>
                    <h3 className="font-display text-2xl font-black text-slate-800">
                      {selectedDoctorForModal.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">
                      {selectedDoctorForModal.title}
                    </p>
                  </div>

                  {/* Rating / Experience Row */}
                  <div className="grid grid-cols-2 gap-4 border-y border-white/40 py-3.5">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Experience</span>
                      <span className="text-sm font-bold text-slate-700">{selectedDoctorForModal.experience}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Consultation Fee</span>
                      <span className="text-sm font-bold text-medical-600">${selectedDoctorForModal.fee}</span>
                    </div>
                  </div>

                  {/* Bio Description */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Professional Bio</span>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      {selectedDoctorForModal.bio}
                    </p>
                  </div>

                  {/* Educational Credentials */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Education & Credentials</span>
                    <div className="flex gap-2 items-start">
                      <GraduationCap className="h-4.5 w-4.5 text-medical-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-600 font-medium">
                        {selectedDoctorForModal.education}
                      </p>
                    </div>
                  </div>

                  {/* Available Days and Hours */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Consultation Days</span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDoctorForModal.availability.map((day) => (
                          <span key={day} className="text-[9px] font-bold bg-white/45 border border-white/50 text-slate-600 px-2 py-0.5 rounded-md">
                            {day.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Daily Hours</span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Clock className="h-4 w-4 text-medical-500" />
                        <span>09:00 AM - 05:00 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 border-t border-white/40 flex gap-3">
                    <button
                      onClick={() => setSelectedDoctorForModal(null)}
                      className="flex-1 py-3 bg-white/40 hover:bg-white/60 border border-white/45 text-slate-500 hover:text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Close Profile
                    </button>
                    <button
                      onClick={() => {
                        const docId = selectedDoctorForModal.id;
                        setSelectedDoctorForModal(null);
                        onOpenBooking(docId);
                      }}
                      className="flex-1 py-3 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-medical-500/10 transition-all cursor-pointer"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
