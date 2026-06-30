import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, User, Mail, Phone, HeartPulse, Search, 
  Filter, Plus, Edit2, Trash2, X, Check, CheckCircle2, 
  XCircle, AlertCircle, FileText, BarChart3, Users, Clock3,
  CalendarDays, Trash
} from 'lucide-react';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Appointment, Doctor } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data';

interface AdminPortalProps {
  onBackToHome: () => void;
}

export default function AdminPortal({ onBackToHome }: AdminPortalProps) {
  const [bookings, setBookings] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  
  // Create / Edit modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states (shared between add & edit)
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(DOCTORS[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'scheduled' | 'cancelled' | 'completed'>('scheduled');

  // Fetch all bookings
  const fetchAllBookings = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const list: Appointment[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Appointment);
      });
      // Sort by newest created
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(list);
    } catch (error) {
      console.warn('Admin: Error querying all bookings, falling back to local storage:', error);
      try {
        const stored = localStorage.getItem('we_care_appointments');
        if (stored) {
          setBookings(JSON.parse(stored));
        } else {
          setBookings([]);
        }
      } catch (e) {
        console.error('Failed to read fallback bookings:', e);
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Sync selected doctor's timeslots
  const currentDoctor = DOCTORS.find(d => d.id === selectedDoctorId);
  useEffect(() => {
    if (currentDoctor && !appointmentTimeSlot) {
      setAppointmentTimeSlot(currentDoctor.timeSlots[0] || '');
    }
  }, [selectedDoctorId, currentDoctor]);

  // Open forms helper
  const openAddModal = () => {
    setErrorMsg(null);
    setPatientName('');
    setPatientEmail('');
    setPatientPhone('');
    setSelectedDoctorId(DOCTORS[0]?.id || '');
    setAppointmentDate(new Date().toISOString().split('T')[0]);
    setAppointmentTimeSlot(DOCTORS[0]?.timeSlots[0] || '');
    setSymptoms('');
    setNotes('');
    setBookingStatus('scheduled');
    setIsAddModalOpen(true);
  };

  const openEditModal = (booking: Appointment) => {
    setErrorMsg(null);
    setSelectedBooking(booking);
    setPatientName(booking.patientName);
    setPatientEmail(booking.patientEmail);
    setPatientPhone(booking.patientPhone);
    setSelectedDoctorId(booking.doctorId);
    setAppointmentDate(booking.date);
    setAppointmentTimeSlot(booking.timeSlot);
    setSymptoms(booking.symptoms);
    setNotes(booking.notes || '');
    setBookingStatus(booking.status);
    setIsEditModalOpen(true);
  };

  // Create Booking Action
  const handleCreateBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !appointmentDate || !appointmentTimeSlot) {
      setErrorMsg('Please populate all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const doctor = DOCTORS.find(d => d.id === selectedDoctorId);
    if (!doctor) {
      setErrorMsg('Selected doctor is invalid.');
      setIsSubmitting(false);
      return;
    }

    const bookingId = 'appt_' + Math.random().toString(36).substring(2, 11);
    const newBooking: Appointment = {
      id: bookingId,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      doctorImage: doctor.image,
      departmentName: DEPARTMENTS.find(d => d.id === doctor.departmentId)?.name || 'General Medicine',
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      date: appointmentDate,
      timeSlot: appointmentTimeSlot,
      symptoms: symptoms.trim() || 'Scheduled by administrator',
      notes: notes.trim(),
      status: bookingStatus,
      createdAt: new Date().toISOString()
    };

    try {
      // Create document in Firestore (admin overrides standard userId rules)
      const fullBooking = {
        ...newBooking,
        userId: 'admin_created_' + Math.random().toString(36).substring(2, 6)
      };
      await setDoc(doc(db, 'bookings', bookingId), fullBooking);
      setSuccessMsg('Booking created successfully!');
      setIsAddModalOpen(false);
      fetchAllBookings();
    } catch (err: any) {
      console.warn('Error creating booking on Firestore, using local storage:', err);
      try {
        const stored = localStorage.getItem('we_care_appointments');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newBooking);
        localStorage.setItem('we_care_appointments', JSON.stringify(list));
        setSuccessMsg('Booking created successfully (Local Storage)!');
        setIsAddModalOpen(false);
        setBookings(list);
      } catch (fallbackErr) {
        console.error('Failed to save booking locally:', fallbackErr);
        setErrorMsg('Failed to save booking.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Booking Action
  const handleUpdateBooking = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    if (!patientName.trim() || !patientEmail.trim() || !patientPhone.trim() || !appointmentDate || !appointmentTimeSlot) {
      setErrorMsg('Please populate all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const doctor = DOCTORS.find(d => d.id === selectedDoctorId);
    if (!doctor) {
      setErrorMsg('Selected doctor is invalid.');
      setIsSubmitting(false);
      return;
    }

    const updatedData = {
      ...selectedBooking,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorTitle: doctor.title,
      doctorImage: doctor.image,
      departmentName: DEPARTMENTS.find(d => d.id === doctor.departmentId)?.name || 'General Medicine',
      patientName: patientName.trim(),
      patientEmail: patientEmail.trim(),
      patientPhone: patientPhone.trim(),
      date: appointmentDate,
      timeSlot: appointmentTimeSlot,
      symptoms: symptoms.trim(),
      notes: notes.trim(),
      status: bookingStatus
    };

    try {
      await updateDoc(doc(db, 'bookings', selectedBooking.id), updatedData);
      setSuccessMsg('Booking updated successfully!');
      setIsEditModalOpen(false);
      fetchAllBookings();
    } catch (err: any) {
      console.warn('Error updating booking on Firestore, updating local storage:', err);
      try {
        const stored = localStorage.getItem('we_care_appointments');
        if (stored) {
          const list = JSON.parse(stored) as Appointment[];
          const idx = list.findIndex(b => b.id === selectedBooking.id);
          if (idx !== -1) {
            list[idx] = updatedData;
            localStorage.setItem('we_care_appointments', JSON.stringify(list));
          }
          setBookings(list);
        } else {
          setBookings(prev => prev.map(b => b.id === selectedBooking.id ? updatedData : b));
        }
        setSuccessMsg('Booking updated successfully (Local Storage)!');
        setIsEditModalOpen(false);
      } catch (fallbackErr) {
        console.error('Failed to update booking locally:', fallbackErr);
        setErrorMsg('Failed to update booking.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick Quick Status Transition Helper
  const handleQuickStatusChange = async (bookingId: string, status: 'scheduled' | 'cancelled' | 'completed') => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status });
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      setSuccessMsg(`Status updated to ${status}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.warn('Quick status change failed on Firestore, updating local storage:', err);
      try {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
        const stored = localStorage.getItem('we_care_appointments');
        if (stored) {
          const list = JSON.parse(stored) as Appointment[];
          const idx = list.findIndex(b => b.id === bookingId);
          if (idx !== -1) {
            list[idx].status = status;
            localStorage.setItem('we_care_appointments', JSON.stringify(list));
          }
        }
        setSuccessMsg(`Status updated to ${status} (Local Storage).`);
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (fallbackErr) {
        console.error('Failed to update status locally:', fallbackErr);
      }
    }
  };

  // Delete Booking Action
  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this booking record permanently? This cannot be undone.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      setSuccessMsg('Booking deleted permanently.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.warn('Error deleting booking on Firestore, deleting from local storage:', err);
      try {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        const stored = localStorage.getItem('we_care_appointments');
        if (stored) {
          const list = JSON.parse(stored) as Appointment[];
          const filtered = list.filter(b => b.id !== bookingId);
          localStorage.setItem('we_care_appointments', JSON.stringify(filtered));
        }
        setSuccessMsg('Booking deleted permanently (Local Storage).');
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (fallbackErr) {
        console.error('Failed to delete booking locally:', fallbackErr);
      }
    }
  };

  // Filters & Search calculations
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.patientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.symptoms && b.symptoms.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesDoctor = doctorFilter === 'all' || b.doctorId === doctorFilter;

    return matchesSearch && matchesStatus && matchesDoctor;
  });

  // Calculate Metrics stats
  const totalCount = bookings.length;
  const scheduledCount = bookings.filter(b => b.status === 'scheduled').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header and Back Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
              Administrative Portal
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Clinical Booking Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access secure database schedules, review patient notes, manage clinic appointments, and register new patients.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-medical-600 hover:bg-medical-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-medical-500/10 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Appointment</span>
          </button>
          <button
            onClick={onBackToHome}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
          >
            Go to Patient View
          </button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1 */}
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800">{totalCount}</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Clock3 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled</p>
            <p className="text-xl sm:text-2xl font-black text-amber-600">{scheduledCount}</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</p>
            <p className="text-xl sm:text-2xl font-black text-emerald-600">{completedCount}</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="glass-card p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cancelled</p>
            <p className="text-xl sm:text-2xl font-black text-rose-600">{cancelledCount}</p>
          </div>
        </div>
      </div>

      {/* Notifications banner */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200/60 rounded-xl text-xs text-emerald-700 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="h-4 w-4 hover:opacity-75" />
          </button>
        </motion.div>
      )}

      {/* Filter and Search Bar Card */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <h3 className="font-display font-bold text-sm text-slate-800 flex items-center gap-2">
          <Filter className="h-4 w-4 text-medical-500" />
          <span>Filters & Lookup Tools</span>
        </h3>
        
        <div className="grid md:grid-cols-12 gap-4">
          {/* Search bar input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patient Name, Patient Email, Doctor Name, Symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/50 border border-white/60 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500"
            />
          </div>

          {/* Status Filter select */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/50 border border-white/60 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Doctor Filter select */}
          <div className="md:col-span-3">
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="w-full px-3 py-2.5 bg-white/50 border border-white/60 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-medical-500"
            >
              <option value="all">All Doctors</option>
              {DOCTORS.map((doc) => (
                <option key={doc.id} value={doc.id}>{doc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table / Cards View */}
      {loading ? (
        <div className="glass-card p-20 rounded-3xl text-center space-y-4">
          <div className="h-8 w-8 border-4 border-medical-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Querying live records from Firestore database...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
          <p className="font-display font-bold text-sm text-slate-700">No Booking Records Found</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Try resetting your search query or filters. You can also manually register a new booking.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Showing {filteredBookings.length} of {totalCount} records
            </span>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block overflow-hidden bg-white/35 backdrop-blur-md rounded-3xl border border-white/35 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/60 border-b border-white/40 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <th className="py-4 px-6">Patient</th>
                  <th className="py-4 px-6">Specialist</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Details / Notes</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/40 transition-colors">
                    {/* Patient detail */}
                    <td className="py-4 px-6 max-w-[200px]">
                      <p className="font-bold text-slate-800">{b.patientName}</p>
                      <div className="mt-1 space-y-0.5 font-mono text-[10px] text-slate-400 font-semibold">
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span>{b.patientEmail}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Phone className="h-3 w-3 flex-shrink-0" />
                          <span>{b.patientPhone}</span>
                        </p>
                      </div>
                    </td>

                    {/* Doctor details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={b.doctorImage} 
                          alt={b.doctorName} 
                          className="h-9 w-9 rounded-full object-cover border border-white/70"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{b.doctorName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{b.departmentName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date / Time */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <p className="flex items-center gap-1 font-semibold text-slate-700">
                          <Calendar className="h-3.5 w-3.5 text-medical-500" />
                          <span>{b.date}</span>
                        </p>
                        <p className="flex items-center gap-1 font-mono text-[10px] text-slate-500 font-bold">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{b.timeSlot}</span>
                        </p>
                      </div>
                    </td>

                    {/* Symptoms and internal notes */}
                    <td className="py-4 px-6 max-w-[240px]">
                      <div className="space-y-1">
                        <p className="line-clamp-2 text-slate-600 font-sans" title={b.symptoms}>
                          <span className="font-bold text-slate-400 text-[10px] uppercase">Symptoms:</span> {b.symptoms}
                        </p>
                        {b.notes ? (
                          <p className="line-clamp-2 text-slate-500 italic font-sans" title={b.notes}>
                            <span className="font-bold text-slate-400 text-[10px] uppercase font-sans">Notes:</span> {b.notes}
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 italic font-sans">No internal notes added.</p>
                        )}
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        {/* Status Label */}
                        <div>
                          {b.status === 'scheduled' && (
                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-full text-[10px] uppercase tracking-wide border border-amber-200">
                              Scheduled
                            </span>
                          )}
                          {b.status === 'completed' && (
                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px] uppercase tracking-wide border border-emerald-200">
                              Completed
                            </span>
                          )}
                          {b.status === 'cancelled' && (
                            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-full text-[10px] uppercase tracking-wide border border-rose-200">
                              Cancelled
                            </span>
                          )}
                        </div>

                        {/* Quick toggle dropdown actions */}
                        <div className="flex gap-1">
                          {b.status !== 'completed' && (
                            <button
                              onClick={() => handleQuickStatusChange(b.id, 'completed')}
                              title="Mark as Completed"
                              className="p-1 hover:bg-emerald-50 text-emerald-600 rounded-md hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleQuickStatusChange(b.id, 'cancelled')}
                              title="Cancel Appointment"
                              className="p-1 hover:bg-rose-50 text-rose-600 rounded-md hover:text-rose-700 transition-colors cursor-pointer"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                          {b.status !== 'scheduled' && (
                            <button
                              onClick={() => handleQuickStatusChange(b.id, 'scheduled')}
                              title="Re-schedule"
                              className="p-1 hover:bg-amber-50 text-amber-600 rounded-md hover:text-amber-700 transition-colors cursor-pointer"
                            >
                              <Clock3 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions button */}
                    <td className="py-4 px-6">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-2 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl transition-all cursor-pointer"
                          title="Edit booking"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-2 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                          title="Delete booking permanently"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout */}
          <div className="grid sm:grid-cols-2 lg:hidden gap-4">
            {filteredBookings.map((b) => (
              <div key={b.id} className="glass-card p-5 rounded-3xl space-y-4 relative">
                {/* Header block */}
                <div className="flex justify-between items-start border-b border-white/30 pb-3">
                  <div>
                    <span className="font-mono text-[9px] font-bold text-slate-400 bg-white/40 px-2 py-0.5 rounded-md">ID: {b.id.substring(0, 10)}</span>
                    <h4 className="font-display font-bold text-sm text-slate-800 mt-1">{b.patientName}</h4>
                  </div>
                  <div>
                    {b.status === 'scheduled' && <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded-full text-[9px] uppercase tracking-wide">Scheduled</span>}
                    {b.status === 'completed' && <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded-full text-[9px] uppercase tracking-wide">Completed</span>}
                    {b.status === 'cancelled' && <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-full text-[9px] uppercase tracking-wide">Cancelled</span>}
                  </div>
                </div>

                {/* Patient/Contact */}
                <div className="space-y-1 text-slate-500 font-sans text-xs">
                  <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" /> {b.patientEmail}</p>
                  <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" /> {b.patientPhone}</p>
                </div>

                {/* Clinic Specialist */}
                <div className="flex items-center gap-2 bg-white/40 p-2.5 rounded-xl border border-white/25">
                  <img src={b.doctorImage} alt={b.doctorName} className="h-8 w-8 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-[11px] text-slate-800">{b.doctorName}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{b.departmentName}</p>
                  </div>
                </div>

                {/* Date slot */}
                <div className="flex justify-between items-center text-xs">
                  <p className="flex items-center gap-1 font-semibold text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-medical-500" />
                    <span>{b.date}</span>
                  </p>
                  <p className="flex items-center gap-1 font-mono text-[10px] text-slate-500 font-semibold">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{b.timeSlot}</span>
                  </p>
                </div>

                {/* Symptoms and notes */}
                <div className="space-y-1 text-xs text-slate-500 border-t border-white/30 pt-3">
                  <p><span className="font-bold text-slate-400 text-[10px] uppercase">Symptoms:</span> {b.symptoms}</p>
                  {b.notes && <p><span className="font-bold text-slate-400 text-[10px] uppercase">Notes:</span> <span className="italic">{b.notes}</span></p>}
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-3 border-t border-white/30">
                  {/* Quick status change */}
                  <div className="flex gap-2">
                    {b.status !== 'completed' && (
                      <button
                        onClick={() => handleQuickStatusChange(b.id, 'completed')}
                        className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleQuickStatusChange(b.id, 'cancelled')}
                        className="px-2 py-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold rounded-lg text-[10px] cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Edit / Delete */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEditModal(b)}
                      className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(b.id)}
                      className="p-1.5 hover:bg-rose-50 text-rose-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ==================================== */}
      {/* 1. ADD BOOKING MODAL (DIALOG OVERLAY) */}
      {/* ==================================== */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white/95 backdrop-blur-md border border-white/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                  <CalendarDays className="h-5 w-5 text-medical-500" />
                  <span>Administrative Appointment Entry</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content Scrollable */}
              <form onSubmit={handleCreateBooking} className="flex-1 overflow-y-auto p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="font-sans">{errorMsg}</span>
                  </div>
                )}

                {/* Patient Information Grid */}
                <div className="bg-slate-50/75 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details (Required)</p>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Full Patient Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Eleanor Vance"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="name@domain.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Phone Contact</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+1 555-0199"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduling Specialist Dropdown */}
                <div className="space-y-3 bg-slate-50/75 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Details</p>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Select Doctor Specialist</label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => {
                        setSelectedDoctorId(e.target.value);
                        const doc = DOCTORS.find(d => d.id === e.target.value);
                        if (doc) setAppointmentTimeSlot(doc.timeSlots[0] || '');
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                    >
                      {DOCTORS.map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.title})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Appointment Date</label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Preferred Timeslot</label>
                      <select
                        value={appointmentTimeSlot}
                        onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
                        required
                      >
                        {currentDoctor?.timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        )) || <option value="">No timeslots available</option>}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Symptoms Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Medical Symptoms</label>
                  <textarea
                    rows={2}
                    placeholder="Describe patient symptoms or complaints..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-medical-500 font-sans"
                  />
                </div>

                {/* Internal Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Internal Administrative Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Add special notes, room numbers, medication hints, or clinical requests..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-medical-500 font-sans"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Initial Booking Status</label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Registering...' : 'Register Booking'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== */}
      {/* 2. EDIT BOOKING MODAL (DIALOG OVERLAY) */}
      {/* ==================================== */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-white/95 backdrop-blur-md border border-white/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-display font-extrabold text-base text-slate-800 flex items-center gap-1.5">
                  <Edit2 className="h-4 w-4 text-medical-500" />
                  <span>Update Clinical Record</span>
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form Content Scrollable */}
              <form onSubmit={handleUpdateBooking} className="flex-1 overflow-y-auto p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="font-sans">{errorMsg}</span>
                  </div>
                )}

                <p className="text-[10px] font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-md w-fit font-bold">
                  Editing Record ID: {selectedBooking?.id}
                </p>

                {/* Patient Information Grid */}
                <div className="bg-slate-50/75 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Details (Required)</p>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Full Patient Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="e.g. Eleanor Vance"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="email"
                          placeholder="name@domain.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Phone Contact</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="tel"
                          placeholder="+1 555-0199"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scheduling Specialist Dropdown */}
                <div className="space-y-3 bg-slate-50/75 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Details</p>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500">Select Doctor Specialist</label>
                    <select
                      value={selectedDoctorId}
                      onChange={(e) => {
                        setSelectedDoctorId(e.target.value);
                        const doc = DOCTORS.find(d => d.id === e.target.value);
                        if (doc) setAppointmentTimeSlot(doc.timeSlots[0] || '');
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                    >
                      {DOCTORS.map((doc) => (
                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.title})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Appointment Date</label>
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Preferred Timeslot</label>
                      <select
                        value={appointmentTimeSlot}
                        onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none"
                        required
                      >
                        {currentDoctor?.timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        )) || <option value="">No timeslots available</option>}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Symptoms Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Medical Symptoms</label>
                  <textarea
                    rows={2}
                    placeholder="Describe symptoms..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-medical-500 font-sans"
                  />
                </div>

                {/* Internal Notes Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Internal Administrative Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Add room numbers, dosage details, custom notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-medical-500 font-sans"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Booking Status</label>
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 focus:outline-none focus:ring-1.5 focus:ring-medical-500"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Footer buttons */}
                <div className="pt-4 border-t border-slate-100 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 rounded-xl hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Record'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
