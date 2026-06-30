import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, User, Phone, Mail, FileText, XCircle, AlertCircle, Sparkles, Building2, Trash2 } from 'lucide-react';
import { Appointment } from '../types';

interface AppointmentsListProps {
  appointments: Appointment[];
  onCancelAppointment: (id: string) => void;
  onOpenBooking: () => void;
}

export default function AppointmentsList({
  appointments,
  onCancelAppointment,
  onOpenBooking
}: AppointmentsListProps) {
  const [selectedApptDetails, setSelectedApptDetails] = useState<Appointment | null>(null);
  const [apptToCancelId, setApptToCancelId] = useState<string | null>(null);

  const activeAppointments = appointments.filter((appt) => appt.status === 'scheduled');
  const pastAppointments = appointments.filter((appt) => appt.status !== 'scheduled');

  const handleCancelClick = (id: string) => {
    setApptToCancelId(id);
  };

  const confirmCancellation = () => {
    if (apptToCancelId) {
      onCancelAppointment(apptToCancelId);
      setApptToCancelId(null);
      // Update details modal if open
      if (selectedApptDetails && selectedApptDetails.id === apptToCancelId) {
        setSelectedApptDetails({ ...selectedApptDetails, status: 'cancelled' });
      }
    }
  };

  return (
    <section className="py-20 bg-transparent relative z-10 min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold tracking-widest text-medical-600 uppercase bg-white/45 border border-white/50 px-3 py-1 rounded-full w-fit mx-auto">
            Patient Portal
          </h2>
          <p className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Scheduled Clinic Appointments
          </p>
          <div className="mt-4 h-1 w-12 bg-medical-500 mx-auto rounded-full" />
          <p className="mt-3 text-slate-500 text-xs sm:text-sm">
            Review, cancel, or track your dynamic clinical visits and consultation slots. All data is saved securely on your browser.
          </p>
        </div>

        {appointments.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-10 sm:p-16 text-center max-w-lg mx-auto space-y-6"
          >
            <div className="h-20 w-20 bg-white/40 text-medical-500 rounded-full flex items-center justify-center mx-auto border border-white/50 shadow-inner">
              <Calendar className="h-10 w-10" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display text-lg font-bold text-slate-800">
                No Appointments Scheduled Yet
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                We couldn't detect any active appointments recorded in your browser session. Ready to schedule a visit with our board-certified specialists?
              </p>
            </div>

            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-medical-500 hover:bg-medical-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Book Your First Appointment</span>
            </button>
          </motion.div>
        ) : (
          /* Appointments List content */
          <div className="space-y-8">
            
            {/* Active/Scheduled Appointments */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                Active Consultations ({activeAppointments.length})
              </h3>

              {activeAppointments.length > 0 ? (
                <div className="space-y-4">
                  {activeAppointments.map((appt) => (
                    <motion.div
                      key={appt.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-2xl p-5 hover:bg-white/55 transition-all duration-300 flex flex-col md:flex-row justify-between gap-5"
                    >
                      {/* Left: Doctor & Patient Summary */}
                      <div className="flex gap-4 items-start">
                        <img
                          src={appt.doctorImage}
                          alt={appt.doctorName}
                          className="w-14 h-14 rounded-xl object-cover border border-white/50 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-medical-600 bg-white/45 border border-white/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {appt.departmentName}
                          </span>
                          <h4 className="font-display text-base font-bold text-slate-800 pt-1">
                            {appt.doctorName}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-semibold">
                            {appt.doctorTitle}
                          </p>
                          <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>Patient: <span className="font-semibold text-slate-700">{appt.patientName}</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Right/Middle: Date, Time & CTAs */}
                      <div className="flex flex-col sm:flex-row md:flex-col justify-between items-start sm:items-center md:items-end gap-4 border-t sm:border-t-0 md:border-t-0 pt-4 sm:pt-0 md:pt-0 border-white/30">
                        <div className="space-y-1.5 md:text-right">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 md:justify-end">
                            <Calendar className="h-4 w-4 text-medical-500" />
                            <span>{appt.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 md:justify-end">
                            <Clock className="h-4 w-4 text-medical-500" />
                            <span>{appt.timeSlot}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setSelectedApptDetails(appt)}
                            className="px-3 py-2 bg-white/40 hover:bg-white/60 border border-white/45 text-[11px] font-bold text-slate-600 rounded-xl transition-all flex-1 text-center cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleCancelClick(appt.id)}
                            className="px-3 py-2 bg-white/20 hover:bg-red-500 hover:text-white border border-red-200/50 hover:border-red-500 text-[11px] font-bold text-red-600 rounded-xl transition-all flex-1 text-center cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/20 border border-white/30 rounded-2xl text-xs text-slate-400">
                  No active appointments currently scheduled.
                </div>
              )}
            </div>

            {/* Past/Cancelled History */}
            {pastAppointments.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                  History & Inactive ({pastAppointments.length})
                </h3>

                <div className="space-y-3.5 opacity-80">
                  {pastAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs"
                    >
                      <div className="flex gap-3 items-center">
                        <img
                          src={appt.doctorImage}
                          alt={appt.doctorName}
                          className="w-10 h-10 rounded-lg object-cover grayscale border border-white/40"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-display font-bold text-slate-800">{appt.doctorName}</h4>
                          <p className="text-[10px] text-slate-400">{appt.departmentName} Department</p>
                        </div>
                      </div>

                      <div className="flex sm:items-center gap-6 justify-between">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-600">{appt.date}</p>
                          <p className="text-slate-400 text-[10px]">{appt.timeSlot}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            appt.status === 'cancelled'
                              ? 'bg-red-50/60 text-red-600 border-red-100/50'
                              : 'bg-white/40 text-slate-500 border-white/50'
                          }`}>
                            {appt.status.toUpperCase()}
                          </span>
                          <button
                            onClick={() => setSelectedApptDetails(appt)}
                            className="px-2 py-1 bg-white/40 hover:bg-white/60 border border-white/45 rounded-lg font-bold text-slate-500 cursor-pointer transition-all"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Appointment Detail Drawer/Modal */}
      <AnimatePresence>
        {selectedApptDetails && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApptDetails(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            />

            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative transform overflow-hidden rounded-3xl glass-card-strong p-6 sm:p-8 text-left shadow-2xl transition-all w-full max-w-md space-y-5"
              >
                <div className="flex justify-between items-center border-b border-white/40 pb-4">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Appointment Record</span>
                    <h3 className="font-display text-lg font-black text-slate-800">
                      ID: {selectedApptDetails.id}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold uppercase tracking-wider border ${
                    selectedApptDetails.status === 'scheduled'
                      ? 'bg-emerald-50/60 text-emerald-600 border-emerald-100/50'
                      : 'bg-red-50/60 text-red-600 border-red-100/50'
                  }`}>
                    {selectedApptDetails.status}
                  </span>
                </div>

                {/* Doctor profile card inside */}
                <div className="flex gap-3.5 items-center bg-white/20 p-3 rounded-xl border border-white/40">
                  <img
                    src={selectedApptDetails.doctorImage}
                    alt={selectedApptDetails.doctorName}
                    className="w-11 h-11 object-cover rounded-lg border border-white/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{selectedApptDetails.doctorName}</h4>
                    <p className="text-[10px] text-slate-400">{selectedApptDetails.doctorTitle}</p>
                    <p className="text-[9px] font-bold text-medical-600 uppercase tracking-widest">{selectedApptDetails.departmentName} Department</p>
                  </div>
                </div>

                {/* Schedule details */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white/20 rounded-xl border border-white/40 flex items-center gap-2">
                    <Calendar className="h-4.5 w-4.5 text-medical-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">DATE</span>
                      <span className="font-bold text-slate-700">{selectedApptDetails.date}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl border border-white/40 flex items-center gap-2">
                    <Clock className="h-4.5 w-4.5 text-medical-500" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block">TIME</span>
                      <span className="font-bold text-slate-700">{selectedApptDetails.timeSlot}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Profile */}
                <div className="space-y-2 text-xs border-y border-white/40 py-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Patient Credentials</span>
                  <div className="grid grid-cols-3 gap-1">
                    <span className="text-slate-400">Full Name:</span>
                    <span className="col-span-2 font-bold text-slate-800">{selectedApptDetails.patientName}</span>
                    
                    <span className="text-slate-400">Email:</span>
                    <span className="col-span-2 font-bold text-slate-800 truncate">{selectedApptDetails.patientEmail}</span>
                    
                    <span className="text-slate-400">Phone:</span>
                    <span className="col-span-2 font-bold text-slate-800">{selectedApptDetails.patientPhone}</span>
                  </div>
                </div>

                {/* Symptoms notes */}
                <div className="space-y-1.5 text-xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Logged Symptoms / Notes</span>
                  <div className="p-3.5 bg-white/30 rounded-xl border border-white/40 text-slate-600 leading-relaxed font-sans max-h-[100px] overflow-y-auto">
                    {selectedApptDetails.symptoms}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setSelectedApptDetails(null)}
                    className="flex-1 py-3 bg-white/40 hover:bg-white/60 border border-white/45 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Close Record
                  </button>
                  {selectedApptDetails.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        handleCancelClick(selectedApptDetails.id);
                      }}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Prompt Modal */}
      <AnimatePresence>
        {apptToCancelId && (
          <div className="fixed inset-0 z-55 overflow-y-auto" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApptToCancelId(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            />
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative transform overflow-hidden rounded-3xl glass-card-strong p-6 text-left shadow-2xl transition-all w-full max-w-sm space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50/70 text-red-500 rounded-full border border-red-100/50 flex-shrink-0">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-800">
                      Cancel This Appointment?
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                      Are you absolutely sure you want to cancel appointment <span className="font-mono font-bold text-slate-700">{apptToCancelId}</span>? Cancelled slots cannot be instantly restored.
                    </p>
                  </div>
                </div>

                <div className="pt-3 flex gap-3 justify-end">
                  <button
                    onClick={() => setApptToCancelId(null)}
                    className="px-4 py-2 bg-white/40 hover:bg-white/60 border border-white/45 rounded-lg text-xs font-bold text-slate-500 cursor-pointer"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={confirmCancellation}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                  >
                    Yes, Cancel Visit
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
