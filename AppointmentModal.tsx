import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, Mail, FileText, CheckCircle2, ShieldAlert, Sparkles, Building2, LogIn, AlertCircle, Lock } from 'lucide-react';
import { DEPARTMENTS, DOCTORS } from '../data';
import { Doctor, Appointment } from '../types';
import { useAuth } from '../context/AuthContext';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredDoctorId?: string | null;
  onBookingSuccess: (appointment: Appointment) => void;
  onViewMyAppointments: () => void;
}

export default function AppointmentModal({
  isOpen,
  onClose,
  preferredDoctorId,
  onBookingSuccess,
  onViewMyAppointments
}: AppointmentModalProps) {
  const { user, userProfile, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();

  // Inline auth states when user is not logged in
  const [authIsSignUp, setAuthIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  
  // Step flow states
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Form Fields State
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // Error validations state
  const [formError, setFormError] = useState('');

  // Prefill patient name and email when logged-in user changes
  useEffect(() => {
    if (user) {
      setPatientName(userProfile?.displayName || user.displayName || '');
      setPatientEmail(user.email || '');
    } else {
      setPatientName('');
      setPatientEmail('');
    }
  }, [user, userProfile, isOpen]);

  // Auth Submit Handler
  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      if (authIsSignUp) {
        if (!authDisplayName.trim()) {
          throw new Error('Please enter your full name');
        }
        await signUpWithEmail(authEmail, authPassword, authDisplayName);
      } else {
        await signInWithEmail(authEmail, authPassword);
      }
    } catch (err: any) {
      console.error(err);
      let readableError = err.message || 'Authentication failed. Please check your details.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        readableError = 'Invalid email or password combination.';
      } else if (err.code === 'auth/email-already-in-use') {
        readableError = 'This email address is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        readableError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        readableError = 'Password must be at least 6 characters.';
      }
      setAuthError(readableError);
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Auth Google Handler
  const handleAuthGoogle = async () => {
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || 'Failed to sign in with Google.');
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Minimum date for booking is tomorrow (cannot book in the past)
  const minBookingDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  }, []);

  // Sync preferred doctor if modal is launched from a specific doctor card
  useEffect(() => {
    if (preferredDoctorId) {
      const doc = DOCTORS.find((d) => d.id === preferredDoctorId);
      if (doc) {
        setSelectedDeptId(doc.departmentId);
        setSelectedDocId(doc.id);
        setSelectedSlot('');
      }
    } else {
      setSelectedDeptId(DEPARTMENTS[0].id);
      setSelectedDocId('');
      setSelectedSlot('');
    }
    // Reset submission views when opening
    setFormSubmitted(false);
    setCreatedAppointment(null);
    setFormError('');
  }, [preferredDoctorId, isOpen]);

  // Filtered lists based on selection
  const filteredDoctors = useMemo(() => {
    if (!selectedDeptId) return [];
    return DOCTORS.filter((doc) => doc.departmentId === selectedDeptId);
  }, [selectedDeptId]);

  // Selected doctor object
  const activeDoctor = useMemo(() => {
    return DOCTORS.find((d) => d.id === selectedDocId) || null;
  }, [selectedDocId]);

  // Handle department changes (resets selected doctor and timeslot)
  const handleDeptChange = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedDocId('');
    setSelectedSlot('');
  };

  // Handle doctor changes (resets timeslot)
  const handleDocChange = (docId: string) => {
    setSelectedDocId(docId);
    setSelectedSlot('');
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!selectedDeptId) return setFormError('Please select a medical department.');
    if (!selectedDocId) return setFormError('Please select an available doctor.');
    if (!bookingDate) return setFormError('Please select an appointment date.');
    if (!selectedSlot) return setFormError('Please select a preferred time slot.');
    if (!patientName.trim()) return setFormError('Please enter the patient’s full name.');
    if (!patientEmail.trim()) return setFormError('Please enter a valid email address.');
    if (!patientPhone.trim()) return setFormError('Please enter a primary phone number.');

    // Generate appointment object
    const doc = DOCTORS.find((d) => d.id === selectedDocId)!;
    const dept = DEPARTMENTS.find((d) => d.id === selectedDeptId)!;
    const appointmentId = `WCH-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAppointment: Appointment = {
      id: appointmentId,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorTitle: doc.title,
      doctorImage: doc.image,
      departmentName: dept.name,
      patientName,
      patientEmail,
      patientPhone,
      date: bookingDate,
      timeSlot: selectedSlot,
      symptoms: symptoms || 'General wellness check',
      status: 'scheduled',
      notes,
      createdAt: new Date().toISOString()
    };

    // Callback to parent to update localStorage
    onBookingSuccess(newAppointment);

    // Update modal state to success
    setCreatedAppointment(newAppointment);
    setFormSubmitted(true);
  };

  // Reset form helper
  const handleResetForm = () => {
    setSelectedDeptId(DEPARTMENTS[0].id);
    setSelectedDocId('');
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setBookingDate('');
    setSelectedSlot('');
    setSymptoms('');
    setNotes('');
    setFormSubmitted(false);
    setCreatedAppointment(null);
    setFormError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative transform overflow-hidden rounded-3xl glass-card-strong text-left shadow-2xl transition-all w-full max-w-2xl flex flex-col"
            >
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/30 text-slate-400 hover:text-slate-600 transition-colors z-10 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Success Screen Confirmation */}
              {formSubmitted && createdAppointment ? (
                <div className="p-8 text-center space-y-6 flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                    className="p-4 bg-emerald-50/70 backdrop-blur-sm text-emerald-500 rounded-full border border-emerald-100 mt-4 relative"
                  >
                    <CheckCircle2 className="h-12 w-12" />
                    <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-500 animate-pulse" />
                  </motion.div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest bg-white/45 border border-white/50 px-3 py-1 rounded-full">
                      Appointment Confirmed
                    </span>
                    <h3 className="font-display text-2xl font-black text-slate-800">
                      Booking Successful!
                    </h3>
                    <p className="text-xs text-slate-400">
                      Your appointment has been registered and scheduled in our clinical records system.
                    </p>
                  </div>

                  {/* Summary ticket card */}
                  <div className="w-full max-w-md bg-white/25 backdrop-blur-sm border border-white/45 rounded-2xl p-5 text-left space-y-4 shadow-md">
                    <div className="flex justify-between items-center border-b border-white/40 pb-3">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Appointment ID</span>
                        <span className="font-mono text-sm font-bold text-slate-800">{createdAppointment.id}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinic Ward</span>
                        <span className="text-xs font-bold text-medical-600 flex items-center justify-end gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          Building B, Room {Math.floor(100 + Math.random() * 400)}
                        </span>
                      </div>
                    </div>

                    {/* Doctor Info Row */}
                    <div className="flex gap-3 items-center">
                      <img
                        src={createdAppointment.doctorImage}
                        alt={createdAppointment.doctorName}
                        className="w-12 h-12 rounded-xl object-cover border border-white/50"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">{createdAppointment.doctorName}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{createdAppointment.doctorTitle}</p>
                        <p className="text-[9px] font-bold text-medical-500 uppercase tracking-widest mt-0.5">{createdAppointment.departmentName} Department</p>
                      </div>
                    </div>

                    {/* Date/Time detail */}
                    <div className="grid grid-cols-2 gap-3 bg-white/40 p-3 rounded-xl border border-white/45 text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4.5 w-4.5 text-medical-500" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Date</span>
                          <span className="font-bold">{createdAppointment.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4.5 w-4.5 text-medical-500" />
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Time Slot</span>
                          <span className="font-bold">{createdAppointment.timeSlot}</span>
                        </div>
                      </div>
                    </div>

                    {/* Patient detail */}
                    <div className="space-y-1 bg-white/40 p-3 rounded-xl border border-white/45 text-xs text-slate-600">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Patient Details</span>
                      <div className="flex justify-between">
                        <span className="font-bold text-slate-700">{createdAppointment.patientName}</span>
                        <span className="text-slate-400">{createdAppointment.patientPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-md pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-white/40 hover:bg-white/60 border border-white/45 text-slate-500 hover:text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Close Window
                    </button>
                    <button
                      onClick={() => {
                        onClose();
                        onViewMyAppointments();
                      }}
                      className="flex-1 py-3 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                    >
                      View My Appointments
                    </button>
                  </div>
                </div>
              ) : !user ? (
                /* Inline Authentication Form */
                <form onSubmit={handleAuthSubmit} className="flex-1 flex flex-col">
                  {/* Modal Header */}
                  <div className="p-6 sm:p-8 pb-4 border-b border-white/40">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-slate-800">
                      Sign In Required
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Please sign in or register a patient profile to book a medical appointment.
                    </p>
                  </div>

                  <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
                    {authError && (
                      <div className="p-3 bg-red-50 border border-red-200/65 rounded-xl text-xs text-red-600 flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed font-sans">{authError}</span>
                      </div>
                    )}

                    {authIsSignUp && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            placeholder="e.g. Eleanor Vance"
                            value={authDisplayName}
                            onChange={(e) => setAuthDisplayName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs text-slate-700 shadow-inner"
                            required={authIsSignUp}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="e.g. name@example.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs text-slate-700 shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <input
                          type="password"
                          placeholder={authIsSignUp ? "Minimum 6 characters" : "••••••••"}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 text-xs text-slate-700 shadow-inner"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={authSubmitting}
                        className="w-full py-3 bg-medical-500 hover:bg-medical-600 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>{authSubmitting ? 'Processing...' : (authIsSignUp ? 'Register Account' : 'Sign In')}</span>
                      </button>
                    </div>

                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-white/40 w-full" />
                      <span className="absolute bg-[#f0f9ff] px-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest rounded-full">
                        or
                      </span>
                    </div>

                    <button
                      onClick={handleAuthGoogle}
                      disabled={authSubmitting}
                      type="button"
                      className="w-full py-2.5 bg-white/40 hover:bg-white/60 border border-white/50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>
                  </div>

                  <div className="p-6 border-t border-white/40 flex flex-col items-center gap-2.5 bg-transparent">
                    <button
                      type="button"
                      onClick={() => setAuthIsSignUp(!authIsSignUp)}
                      className="text-xs font-bold text-medical-600 hover:text-medical-700 transition-colors cursor-pointer"
                    >
                      {authIsSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-500 tracking-wider uppercase cursor-pointer"
                    >
                      Cancel and Return
                    </button>
                  </div>
                </form>
              ) : (
                /* Primary Booking Form */
                <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col">
                  
                  {/* Modal Header */}
                  <div className="p-6 sm:p-8 pb-4 border-b border-white/40">
                    <h3 className="font-display text-xl sm:text-2xl font-black text-slate-800">
                      Schedule an Appointment
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Choose your department, select an active physician, and lock in your convenient date and time.
                    </p>
                  </div>

                  {/* Modal Body Container */}
                  <div className="p-6 sm:p-8 space-y-5 max-h-[60vh] overflow-y-auto">
                    
                    {/* Error Alerts */}
                    {formError && (
                      <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-medium flex items-center gap-2.5">
                        <ShieldAlert className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    {/* Section 1: Clinical Selection */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        1. Select Specialty & Doctor
                      </h4>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Department Select */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Department
                          </label>
                          <select
                            value={selectedDeptId}
                            onChange={(e) => handleDeptChange(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 cursor-pointer shadow-inner appearance-none"
                          >
                            <option value="" disabled>-- Choose specialty --</option>
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Doctor Select */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Specialist Physician
                          </label>
                          <select
                            value={selectedDocId}
                            onChange={(e) => handleDocChange(e.target.value)}
                            disabled={!selectedDeptId}
                            className="w-full px-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 cursor-pointer shadow-inner disabled:bg-white/10 disabled:text-slate-400 appearance-none"
                          >
                            <option value="">
                              {selectedDeptId ? '-- Choose doctor --' : 'Select a department first'}
                            </option>
                            {filteredDoctors.map((doc) => (
                              <option key={doc.id} value={doc.id}>
                                {doc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Date & Slots */}
                    {activeDoctor && (
                      <div className="space-y-3.5 pt-2 border-t border-white/40">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          2. Consultation Schedule
                        </h4>

                        <div className="grid sm:grid-cols-2 gap-4 items-start">
                          
                          {/* Date input */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Preferred Date
                            </label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                              <input
                                type="date"
                                min={minBookingDate}
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 shadow-inner"
                              />
                            </div>
                            
                            {/* Available days list reminder */}
                            <div className="text-[10px] text-slate-400 mt-1 flex flex-wrap gap-1 items-center">
                              <span>Schedules:</span>
                              {activeDoctor.availability.map((day) => (
                                <span key={day} className="font-bold text-medical-600 bg-white/55 border border-white/50 px-1.5 py-0.2 rounded">
                                  {day}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Timeslots display */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Available Time Slots
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {activeDoctor.timeSlots.map((slot) => {
                                const isSelected = selectedSlot === slot;
                                return (
                                  <button
                                    key={slot}
                                    type="button"
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`py-2 text-[10px] font-bold border rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                      isSelected
                                        ? 'bg-medical-500 text-white border-medical-500 shadow-md'
                                        : 'bg-white/40 text-slate-600 border-white/50 hover:bg-white/60'
                                    }`}
                                  >
                                    <Clock className="h-3 w-3" />
                                    <span>{slot}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* Section 3: Patient Information */}
                    <div className="space-y-3 pt-2 border-t border-white/40">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        3. Patient Information
                      </h4>

                      <div className="space-y-3">
                        {/* Patient Name */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Patient Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                              type="text"
                              placeholder="e.g. David Sullivan"
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 shadow-inner"
                              required
                            />
                          </div>
                        </div>

                        {/* Contact details row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          {/* Email */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                              <input
                                type="email"
                                placeholder="e.g. patient@example.com"
                                value={patientEmail}
                                onChange={(e) => setPatientEmail(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 shadow-inner"
                                required
                              />
                            </div>
                          </div>

                          {/* Phone */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                              Phone Number
                            </label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                              <input
                                type="tel"
                                placeholder="e.g. +1 (555) 0199"
                                value={patientPhone}
                                onChange={(e) => setPatientPhone(e.target.value)}
                                className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 shadow-inner"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Symptoms/Notes */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                            Chief Medical Symptoms / Reason for Visit (Optional)
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 text-slate-400 h-4 w-4" />
                            <textarea
                              placeholder="Describe your current symptoms, medical history, or primary concerns..."
                              value={symptoms}
                              onChange={(e) => setSymptoms(e.target.value)}
                              rows={2}
                              className="w-full pl-9 pr-3 py-2.5 bg-white/40 border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-medical-500 text-xs text-slate-700 shadow-inner"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Modal Footer Controls */}
                  <div className="p-6 border-t border-white/40 flex gap-3 bg-transparent">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 bg-white/40 border border-white/45 hover:bg-white/60 text-slate-600 text-xs font-bold rounded-xl shadow-sm cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-medical-600 hover:bg-medical-700 active:bg-medical-800 text-white text-xs font-bold rounded-xl shadow-lg shadow-medical-500/10 hover:shadow-medical-600/20 active:shadow-none transition-all cursor-pointer"
                    >
                      Schedule Appointment
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
