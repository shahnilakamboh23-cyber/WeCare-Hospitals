import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Baby, Activity, Brain, Sparkles, Shield, 
  ChevronDown, ChevronUp, Clock3, Users, Award, 
  ShieldCheck, Quote, ArrowRight, Calendar, HeartPulse, Building2 
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import DepartmentsSection from './components/DepartmentsSection';
import DoctorsSection from './components/DoctorsSection';
import AppointmentsList from './components/AppointmentsList';
import AppointmentModal from './components/AppointmentModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import AdminPortal from './components/AdminPortal';

import { DEPARTMENTS, TESTIMONIALS, FAQS, DOCTORS } from './data';
import { Appointment, Doctor } from './types';
import { useAuth } from './context/AuthContext';
import { collection, query, where, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [preferredDoctorId, setPreferredDoctorId] = useState<string | null>(null);
  
  // Doctor profile modal state
  const [selectedDoctorForProfileModal, setSelectedDoctorForProfileModal] = useState<Doctor | null>(null);

  // FAQ Expanded index state
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const { user } = useAuth();

  // Sync appointments from Firestore (when authenticated) or localStorage (guest fallback)
  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem('we_care_appointments');
        if (stored) {
          setAppointments(JSON.parse(stored));
        } else {
          setAppointments([]);
        }
      } catch (e) {
        console.error('Error reading localStorage appointments', e);
      }
      return;
    }

    // Authenticated user: Load live bookings from Firestore!
    const fetchFirestoreBookings = async () => {
      try {
        const q = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const list: Appointment[] = [];
        querySnapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Appointment);
        });

        // Sort by newest created first
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAppointments(list);
      } catch (error) {
        console.warn('Failed to query bookings, falling back to local storage:', error);
        try {
          const stored = localStorage.getItem('we_care_appointments');
          if (stored) {
            setAppointments(JSON.parse(stored));
          } else {
            setAppointments([]);
          }
        } catch (e) {
          console.error('Failed to read fallback appointments:', e);
          setAppointments([]);
        }
      }
    };

    fetchFirestoreBookings();
  }, [user]);

  const bookedCount = useMemo(() => {
    return appointments.filter((a) => a.status === 'scheduled').length;
  }, [appointments]);

  // Appointment Handlers
  const handleOpenBooking = (preferredDocId: string | null = null) => {
    setPreferredDoctorId(preferredDocId);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = async (newAppt: Appointment) => {
    const fullBooking = {
      ...newAppt,
      userId: user ? user.uid : 'guest'
    };
    if (user) {
      // Save appointment under the authenticated user's profile
      try {
        const docRef = doc(db, 'bookings', newAppt.id);
        await setDoc(docRef, fullBooking);
        setAppointments((prev) => [fullBooking, ...prev]);
      } catch (error) {
        console.warn('Error storing booking on Firestore, falling back to local storage:', error);
        const updated = [fullBooking, ...appointments];
        setAppointments(updated);
        localStorage.setItem('we_care_appointments', JSON.stringify(updated));
      }
    } else {
      // Offline fallback
      const updated = [newAppt, ...appointments];
      setAppointments(updated);
      localStorage.setItem('we_care_appointments', JSON.stringify(updated));
    }
  };

  const handleCancelAppointment = async (apptId: string) => {
    if (user) {
      try {
        const docRef = doc(db, 'bookings', apptId);
        await updateDoc(docRef, { status: 'cancelled' });
        setAppointments((prev) => prev.map((appt) => {
          if (appt.id === apptId) {
            return { ...appt, status: 'cancelled' as const };
          }
          return appt;
        }));
      } catch (error) {
        console.warn('Error soft cancelling booking on Firestore, updating local storage:', error);
        const updated = appointments.map((appt) => {
          if (appt.id === apptId) {
            return { ...appt, status: 'cancelled' as const };
          }
          return appt;
        });
        setAppointments(updated);
        localStorage.setItem('we_care_appointments', JSON.stringify(updated));
      }
    } else {
      // Guest local update
      const updated = appointments.map((appt) => {
        if (appt.id === apptId) {
          return { ...appt, status: 'cancelled' as const };
        }
        return appt;
      });
      setAppointments(updated);
      localStorage.setItem('we_care_appointments', JSON.stringify(updated));
    }
  };

  const getDeptIcon = (iconName: string, className?: string) => {
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
    <div className="min-h-screen flex flex-col justify-between bg-[#f0f9ff] text-slate-800 relative overflow-x-hidden font-sans">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-100 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-30 pointer-events-none"></div>
      
      {/* Navigation Bar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenBooking={() => handleOpenBooking(null)} 
        bookedCount={bookedCount}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-20 pb-20"
            >
              {/* Hero Banner Section */}
              <Hero 
                onOpenBooking={() => handleOpenBooking(null)} 
                onExploreDepartments={() => setActiveTab('departments')}
                onExploreDoctors={() => setActiveTab('doctors')}
              />

              {/* Home Highlight Bento: Why Patients Trust Us */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
                    Our Distinction
                  </h2>
                  <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    Why Choose We Care Hospitals?
                  </p>
                  <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
                  <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
                    We offer patient-centric clinical experiences driven by safety, empathy, high diagnostics precision, and digital convenience.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                  {/* Card 1 */}
                  <div className="glass-card p-8 rounded-3xl hover:-translate-y-1 hover:bg-white/55 transition-all duration-300 flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="p-3.5 bg-medical-100 rounded-2xl text-medical-600 w-fit">
                        <Users className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-800">
                        Renowned Medical Specialists
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Our board-certified clinicians bring years of specialized training from globally accredited institutions, working in interdisciplinary teams to optimize treatments.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('doctors')}
                      className="mt-6 flex items-center gap-1.5 text-xs font-bold text-medical-600 hover:text-medical-700 transition-all cursor-pointer w-fit"
                    >
                      <span>Meet the Doctors</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="glass-card p-8 rounded-3xl hover:-translate-y-1 hover:bg-white/55 transition-all duration-300 flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="p-3.5 bg-amber-100 rounded-2xl text-amber-500 w-fit">
                        <Clock3 className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-800">
                        Efficient Digital Access
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        Skip long wait times and hectic telephone queues. Use our transparent online platform to pick your slot, book instantly, and manage your scheduled visits.
                      </p>
                    </div>
                    <button 
                      onClick={() => handleOpenBooking(null)}
                      className="mt-6 flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 transition-all cursor-pointer w-fit"
                    >
                      <span>Book Online Visit</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="glass-card p-8 rounded-3xl hover:-translate-y-1 hover:bg-white/55 transition-all duration-300 flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="p-3.5 bg-emerald-100 rounded-2xl text-emerald-500 w-fit">
                        <Award className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-bold text-lg text-slate-800">
                        Pristine Diagnostic Facilities
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-sans">
                        From AI-guided cardiac scans to high-speed pathological analysis, our in-house medical laboratories guarantee rapid, clear, and highly dependable diagnostic insights.
                      </p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('departments')}
                      className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-all cursor-pointer w-fit"
                    >
                      <span>Explore Specialties</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Homepage specialties preview list */}
              <section className="py-20 bg-white/20 backdrop-blur-sm border-y border-white/30 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
                    <div>
                      <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
                        Our Services
                      </h2>
                      <p className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        Explore Our Specialized Departments
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('departments')}
                      className="text-xs font-bold text-medical-600 hover:text-medical-700 flex items-center gap-1 cursor-pointer"
                    >
                      View Detailed Services
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DEPARTMENTS.slice(0, 6).map((dept) => (
                      <div
                        key={dept.id}
                        onClick={() => {
                          setActiveTab('departments');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="glass-card p-6 rounded-2xl hover:bg-white/60 hover:-translate-y-0.5 cursor-pointer group transition-all duration-300 space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-medical-50 text-medical-600 rounded-xl group-hover:bg-medical-500 group-hover:text-white transition-colors">
                            {getDeptIcon(dept.iconName, 'h-5 w-5')}
                          </div>
                          <h3 className="font-display font-bold text-sm text-slate-800">
                            {dept.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-2">
                          {dept.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Testimonials section */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
                    Patient Testimonials
                  </h2>
                  <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Caring Stories from Our Patients
                  </p>
                  <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {TESTIMONIALS.map((test) => (
                    <div 
                      key={test.id}
                      className="glass-card p-8 rounded-3xl relative space-y-5 hover:bg-white/55 transition-all duration-300"
                    >
                      <Quote className="absolute top-6 right-6 h-8 w-8 text-slate-300/40 flex-shrink-0" />
                      <p className="text-xs text-slate-600 italic leading-relaxed font-sans relative z-10">
                        "{test.text}"
                      </p>
                      <div className="pt-4 border-t border-white/40 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{test.patientName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Therapy: {test.treatment}</p>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">{test.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Accordion FAQ Section */}
              <section className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase">
                    Got Questions?
                  </h2>
                  <p className="mt-2 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Frequently Asked Questions
                  </p>
                  <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
                </div>

                <div className="glass-card rounded-3xl overflow-hidden divide-y divide-white/40">
                  {FAQS.map((faq, idx) => {
                    const isExpanded = expandedFaqIndex === idx;
                    return (
                      <div key={idx} className="transition-colors duration-250">
                        <button
                          onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/35 transition-colors cursor-pointer"
                        >
                          <span className="font-display font-bold text-sm sm:text-base text-slate-800">
                            {faq.question}
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-medical-500 flex-shrink-0 ml-4" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                          )}
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-500 leading-relaxed font-sans border-t border-white/30">
                                {faq.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* CTA Booking Banner banner */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-br from-medical-600 to-medical-800 text-white p-8 sm:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-white/5 rounded-full blur-2xl -z-1" />
                  
                  <div className="space-y-3 max-w-xl text-center md:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full w-fit">
                      Online Doctor Booking
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                      Schedule Your Health Evaluation Today
                    </h3>
                    <p className="text-xs text-medical-100 leading-relaxed max-w-md font-sans">
                      Our secure portal registers your preferred timeslot immediately in our records database. Don't delay your clinical checkup.
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(null)}
                    className="flex-shrink-0 px-8 py-4 bg-white text-medical-700 font-extrabold rounded-2xl shadow-lg hover:shadow-xl hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer text-sm"
                  >
                    Book An Appointment Now
                  </button>
                </div>
              </section>

            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AboutSection />
            </motion.div>
          )}

          {activeTab === 'departments' && (
            <motion.div
              key="departments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DepartmentsSection 
                onOpenBooking={handleOpenBooking} 
                onSelectDoctor={(doc) => setSelectedDoctorForProfileModal(doc)}
                onSwitchTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === 'doctors' && (
            <motion.div
              key="doctors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DoctorsSection 
                onOpenBooking={handleOpenBooking}
                selectedDoctorForModal={selectedDoctorForProfileModal}
                setSelectedDoctorForModal={setSelectedDoctorForProfileModal}
              />
            </motion.div>
          )}

          {activeTab === 'my-appointments' && (
            <motion.div
              key="my-appointments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AppointmentsList 
                appointments={appointments} 
                onCancelAppointment={handleCancelAppointment} 
                onOpenBooking={() => handleOpenBooking(null)}
              />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AdminPortal onBackToHome={() => setActiveTab('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Booking Form Dialog Modal Overlay */}
      <AppointmentModal 
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        preferredDoctorId={preferredDoctorId}
        onBookingSuccess={handleBookingSuccess}
        onViewMyAppointments={() => setActiveTab('my-appointments')}
      />

      {/* Standalone Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Footer component */}
      <Footer onSwitchTab={setActiveTab} />

    </div>
  );
}
