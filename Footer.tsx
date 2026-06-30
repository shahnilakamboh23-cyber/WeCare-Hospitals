import { Stethoscope, Phone, Mail, MapPin, Clock, Calendar } from 'lucide-react';

interface FooterProps {
  onSwitchTab: (tabId: string) => void;
}

export default function Footer({ onSwitchTab }: FooterProps) {
  
  const quickLinks = [
    { id: 'home', label: 'Home Page' },
    { id: 'about', label: 'Who We Are' },
    { id: 'departments', label: 'Clinical Specialities' },
    { id: 'doctors', label: 'Our Medical Staff' },
    { id: 'my-appointments', label: 'Patient Portal' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Column 1: Brand & Logo */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onSwitchTab('home')}>
              <div className="p-2.5 bg-medical-500 rounded-xl text-white shadow-md shadow-medical-500/10">
                <Stethoscope className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-extrabold tracking-tight text-white">
                We Care <span className="text-medical-400">Hospitals</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Setting the international benchmarks of clinical excellence, diagnostic innovation, and deep clinical empathy to create a healthier future for all.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <a href="tel:+18005550199" className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors w-fit">
                <span className="flex h-2 w-2 rounded-full bg-red-400 animate-ping" />
                <span>24/7 ER Hotline: +1 (800) 555-0199</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-medical-500 pl-2.5">
              Portal Directory
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      onSwitchTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-medical-400 transition-colors cursor-pointer text-left font-medium"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contacts */}
          <div className="md:col-span-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-medical-500 pl-2.5">
              Contact & Location
            </h4>
            
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="h-4.5 w-4.5 text-medical-400 flex-shrink-0 mt-0.5" />
                <p>
                  We Care Clinical Plaza, 123 Health Science Boulevard,<br />
                  Medical District, New York, NY 10016
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4.5 w-4.5 text-medical-400 flex-shrink-0" />
                <p>Support Desk: +1 (212) 555-0144</p>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4.5 w-4.5 text-medical-400 flex-shrink-0" />
                <p>helpdesk@wecarehospitals.com</p>
              </div>

              <div className="flex items-start gap-3 border-t border-slate-800 pt-3 mt-1">
                <Clock className="h-4.5 w-4.5 text-medical-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-300">Outpatient Consultation Hours</p>
                  <p className="mt-0.5">Monday – Friday: 09:00 AM – 05:00 PM</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} We Care Hospitals Group. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
