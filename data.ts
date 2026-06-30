import { Department, Doctor, Testimonial } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'Heart',
    description: 'Comprehensive cardiovascular care focusing on prevention, diagnostics, and advanced treatment of heart disorders.',
    longDescription: 'Our Cardiology Department is equipped with state-of-the-art diagnostic and therapeutic technologies. From standard electrocardiograms (ECG) to advanced interventional catheterization and cardiac rehabilitation, we provide full-spectrum care for your cardiovascular health. Our multidisciplinary team is dedicated to safeguarding your heart using evidence-based practices and compassionate attention.',
    symptoms: ['Chest pain or pressure', 'Shortness of breath', 'Irregular heartbeat', 'High blood pressure', 'Dizziness or lightheadedness'],
    services: ['Electrocardiogram (ECG)', 'Echocardiography', 'Cardiac Catheterization', 'Holter Monitoring', 'Heart Failure Management', 'Preventive Cardiology Counseling']
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics',
    iconName: 'Baby',
    description: 'Expert medical care for newborns, infants, children, and adolescents, promoting healthy growth and development.',
    longDescription: 'At We Care Pediatrics, we understand that children require specialized, gentle care. Our department provides comprehensive wellness exams, immunizations, developmental screenings, and treatment for acute and chronic childhood illnesses. We have designed a warm, child-friendly environment to put both our young patients and their parents completely at ease.',
    symptoms: ['Persistent high fever in children', 'Developmental delays', 'Frequent childhood infections', 'Asthma or severe allergies', 'Unusual lethargy or growth concerns'],
    services: ['Well-child Pediatric Exams', 'Routine Immunizations', 'Developmental & Behavioral Assessment', 'Pediatric Allergy Management', 'Newborn Screening & Care', 'Nutrition & Growth Guidance']
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics',
    iconName: 'Activity',
    description: 'Specialized care for bones, joints, ligaments, tendons, and muscles to restore pain-free movement and strength.',
    longDescription: 'Our Orthopedics and Sports Medicine team is dedicated to helping patients regain mobility and live without physical limitation. We diagnose and treat a wide variety of musculoskeletal conditions, including joint arthritis, sports injuries, fractures, and spinal disorders. Our services span non-surgical physical therapies, joint injections, and minimally invasive arthroscopic surgeries.',
    symptoms: ['Chronic joint pain or stiffness', 'Recent sports injury or ligament sprain', 'Difficulty walking or moving joints', 'Suspected bone fractures', 'Severe lower back or neck pain'],
    services: ['Joint Replacement Surgery', 'Arthroscopy & Sports Medicine', 'Fracture & Trauma Care', 'Spinal Disorder Management', 'Physical Therapy & Rehabilitation', 'Osteporosis Screening & Management']
  },
  {
    id: 'neurology',
    name: 'Neurology',
    iconName: 'Brain',
    description: 'Advanced diagnosis and treatment for disorders of the brain, spinal cord, nerves, and neurological systems.',
    longDescription: 'The Neurology Department provides expert evaluations for complex brain and nervous system disorders. We utilize cutting-edge neuro-imaging and diagnostic tests to manage conditions such as migraines, epilepsy, stroke, neuropathy, and neurodegenerative disorders. Our specialized team works in tandem with rehabilitation specialists to maximize cognitive and physical recovery.',
    symptoms: ['Frequent or severe headaches', 'Numbness, tingling, or weakness', 'Unexplained tremors or seizures', 'Memory loss or cognitive decline', 'Balance issues or coordination problems'],
    services: ['Electroencephalogram (EEG)', 'Nerve Conduction Studies', 'Migraine & Headache Management', 'Stroke Prevention & Follow-up', 'Epilepsy & Seizure Care', 'Cognitive Health Evaluations']
  },
  {
    id: 'dermatology',
    name: 'Dermatology',
    iconName: 'Sparkles',
    description: 'Clinical and cosmetic skin care managing conditions affecting the skin, hair, nails, and mucous membranes.',
    longDescription: 'Our Dermatology services protect your skin—your body’s first line of defense. We diagnose and manage a comprehensive array of clinical conditions from acne and eczema to skin cancer screenings, as well as providing medically supervised cosmetic enhancements. We emphasize skin health through personalized treatment regimens, regular checks, and patient education.',
    symptoms: ['New, changing, or irregular moles', 'Severe, persistent acne or scarring', 'Chronic eczema, psoriasis, or rashes', 'Unusual hair loss or nail damage', 'Persistent dry, itchy, or scaling skin'],
    services: ['Comprehensive Skin Cancer Screenings', 'Acne & Rosacea Specialized Therapy', 'Eczema & Psoriasis Management', 'Minor Skin Lesion Removal', 'Cryotherapy for Warts/Keratoses', 'Anti-aging & Cosmetic consultations']
  },
  {
    id: 'gynecology',
    name: 'Gynecology',
    iconName: 'Shield',
    description: 'Empathetic and expert healthcare for women across all stages of life, including prenatal, maternity, and menopause.',
    longDescription: 'Our Gynecology & Obstetrics Department supports women on every milestone of their healthcare journey. We offer compassionate, highly confidential services ranging from routine annual exams and birth control counseling to prenatal maternity supervision and menopause management. Our expert team stands ready to deliver the guidance and treatment you deserve.',
    symptoms: ['Irregular or painful menstrual cycles', 'Prenatal evaluation & maternity support', 'Pelvic pain or discomfort', 'Menopausal hot flashes & hormone shifts', 'Routine annual preventive check-ups'],
    services: ['Annual Wellness & Pap Smear Examinations', 'Comprehensive Prenatal & Postnatal Care', 'Family Planning & Contraception Care', 'Menopause Symptom Management', 'Minimally Invasive Gynecological Surgery', 'Infertility Screening & Guidance']
  }
];

export const DOCTORS: Doctor[] = [
  // Cardiology Doctors
  {
    id: 'dr-sarah-jenkins',
    name: 'Dr. Sarah Jenkins',
    title: 'Senior Interventional Cardiologist',
    departmentId: 'cardiology',
    rating: 4.9,
    reviewsCount: 142,
    experience: '14 years',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Sarah Jenkins is an award-winning interventional cardiologist specializing in minimally invasive catheter procedures. She is passionate about preventive heart health and lectures nationally on reducing cardiovascular risks.',
    education: 'MD - Harvard Medical School; Fellowship in Cardiology - Johns Hopkins Medicine',
    availability: ['Monday', 'Wednesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '03:30 PM'],
    fee: 150
  },
  {
    id: 'dr-marcus-vance',
    name: 'Dr. Marcus Vance',
    title: 'Consultant Cardiologist & Heart Failure Specialist',
    departmentId: 'cardiology',
    rating: 4.8,
    reviewsCount: 98,
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Marcus Vance focuses on chronic cardiovascular conditions, cardiac imaging, and advanced heart failure treatments. He is dedicated to helping patients manage heart health through balanced medical programs and lifestyle modifications.',
    education: 'MD - Stanford University School of Medicine; Residency in Internal Medicine - Mayo Clinic',
    availability: ['Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:15 PM'],
    fee: 135
  },

  // Pediatrics Doctors
  {
    id: 'dr-emily-ross',
    name: 'Dr. Emily Ross',
    title: 'Chief Pediatrician',
    departmentId: 'pediatrics',
    rating: 4.9,
    reviewsCount: 210,
    experience: '16 years',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Emily Ross offers incredibly gentle, child-focused clinical care for infants, toddlers, and teenagers. She coordinates nutritional, emotional, and physical metrics to ensure child developmental milestones are met safely.',
    education: 'MD - Perelman School of Medicine at University of Pennsylvania; Residency in Pediatrics - Boston Children’s Hospital',
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    timeSlots: ['08:30 AM', '09:45 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
    fee: 120
  },
  {
    id: 'dr-alan-thorne',
    name: 'Dr. Alan Thorne',
    title: 'Consultant Pediatric Allergist & Pulmonologist',
    departmentId: 'pediatrics',
    rating: 4.7,
    reviewsCount: 84,
    experience: '9 years',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Alan Thorne specializes in managing pediatric asthma, severe skin allergies, food sensitivities, and childhood chest infections. He works closely with families to establish secure, symptom-free routines.',
    education: 'MD - Yale School of Medicine; Pediatric Fellowship - Children’s Hospital of Philadelphia',
    availability: ['Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['10:00 AM', '11:30 AM', '02:30 PM', '03:45 PM'],
    fee: 110
  },

  // Orthopedics Doctors
  {
    id: 'dr-robert-chen',
    name: 'Dr. Robert Chen',
    title: 'Senior Joint Replacement Surgeon',
    departmentId: 'orthopedics',
    rating: 4.9,
    reviewsCount: 175,
    experience: '18 years',
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Robert Chen is a leading orthopedic surgeon with deep expertise in hip and knee reconstructions. He pioneers minimally invasive muscle-sparing approaches to ensure faster recoveries and long-lasting mobility.',
    education: 'MD - Columbia University Vagelos College of Physicians and Surgeons; Orthopedic Fellowship - Hospital for Special Surgery',
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    fee: 160
  },
  {
    id: 'dr-olivia-martinez',
    name: 'Dr. Olivia Martinez',
    title: 'Sports Medicine & Arthroscopic Specialist',
    departmentId: 'orthopedics',
    rating: 4.8,
    reviewsCount: 115,
    experience: '10 years',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Olivia Martinez focuses on sports injuries, knee ligament tears (ACL), rotator cuff repairs, and joint arthroscopy. She serves as a consultant for local collegiate athletic teams and is passionate about active recovery.',
    education: 'MD - University of California, San Francisco School of Medicine; Residency - Cleveland Clinic',
    availability: ['Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['08:30 AM', '10:15 AM', '11:30 AM', '01:30 PM', '03:15 PM'],
    fee: 140
  },

  // Neurology Doctors
  {
    id: 'dr-julian-forester',
    name: 'Dr. Julian Forester',
    title: 'Chief Neurologist & Stroke Care Director',
    departmentId: 'neurology',
    rating: 4.9,
    reviewsCount: 155,
    experience: '20 years',
    image: 'https://images.unsplash.com/photo-1637059824899-a441006a6875?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Julian Forester provides world-class neurological expertise. He directs our acute stroke response and holds credentials in advanced neuro-diagnostics and neuromuscular treatment protocols.',
    education: 'MD - Cornell University Medical College; Fellowship in Neurology - Massachusetts General Hospital',
    availability: ['Monday', 'Wednesday', 'Friday'],
    timeSlots: ['09:00 AM', '10:45 AM', '02:00 PM', '04:00 PM'],
    fee: 170
  },
  {
    id: 'dr-sophia-patel',
    name: 'Dr. Sophia Patel',
    title: 'Consultant Clinical Neurologist',
    departmentId: 'neurology',
    rating: 4.8,
    reviewsCount: 92,
    experience: '11 years',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Sophia Patel is highly regarded for her patient-centered approach to migraine therapeutics, epilepsy diagnostics, and cognitive health. She is dedicated to exploring innovative therapies for nervous system relief.',
    education: 'MD - Northwestern University Feinberg School of Medicine; Residency - University of Chicago Hospital',
    availability: ['Tuesday', 'Thursday'],
    timeSlots: ['09:30 AM', '11:15 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
    fee: 145
  },

  // Dermatology Doctors
  {
    id: 'dr-laura-bennett',
    name: 'Dr. Laura Bennett',
    title: 'Senior Board-Certified Dermatologist',
    departmentId: 'dermatology',
    rating: 4.9,
    reviewsCount: 188,
    experience: '13 years',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Laura Bennett combines rigorous clinical dermatology with state-of-the-art aesthetic skin consultations. She treats severe eczema, conducts melanoma checks, and provides gentle, effective corrective skin guidelines.',
    education: 'MD - Washington University School of Medicine; Dermatology Residency - University of Michigan',
    availability: ['Monday', 'Tuesday', 'Thursday'],
    timeSlots: ['09:00 AM', '10:15 AM', '11:30 AM', '02:00 PM', '03:15 PM', '04:30 PM'],
    fee: 125
  },
  {
    id: 'dr-michael-thorne',
    name: 'Dr. Michael Thorne',
    title: 'Consultant Pediatric & Cosmetic Dermatologist',
    departmentId: 'dermatology',
    rating: 4.7,
    reviewsCount: 76,
    experience: '8 years',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Michael Thorne offers special clinical insight into pediatric skin outbreaks and advanced laser dermatology procedures. He focuses on restoring skin confidence through meticulous diagnostic care.',
    education: 'MD - Duke University School of Medicine; Fellowship - NYU Langone Medical Center',
    availability: ['Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['10:00 AM', '11:15 AM', '02:00 PM', '03:45 PM'],
    fee: 115
  },

  // Gynecology Doctors
  {
    id: 'dr-helen-rivers',
    name: 'Dr. Helen Rivers',
    title: 'Senior Obstetrician & Gynecologist',
    departmentId: 'gynecology',
    rating: 4.9,
    reviewsCount: 230,
    experience: '17 years',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Helen Rivers provides compassionate care supporting expectant mothers through healthy pregnancies. She is also a recognized expert in menopause counseling, hormonal optimization, and minimally invasive wellness procedures.',
    education: 'MD - University of Washington School of Medicine; Residency - Brigham and Women’s Hospital',
    availability: ['Monday', 'Wednesday', 'Thursday'],
    timeSlots: ['08:30 AM', '10:00 AM', '11:30 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
    fee: 140
  },
  {
    id: 'dr-keith-sterling',
    name: 'Dr. Keith Sterling',
    title: 'Consultant Reproductive Endocrinologist',
    departmentId: 'gynecology',
    rating: 4.8,
    reviewsCount: 112,
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1618498082410-b4aa22193b38?auto=format&fit=crop&q=80&w=400',
    bio: 'Dr. Keith Sterling specializes in reproductive health, ovulation monitoring, fertility treatments, and family planning. He combines warm patient connection with precision diagnostics to navigate paths to parenthood.',
    education: 'MD - Stanford University School of Medicine; Fellowship - UCSF Health Medical Center',
    availability: ['Tuesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '03:30 PM'],
    fee: 150
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    patientName: 'David K. Sullivan',
    rating: 5,
    text: 'The cardiology team at We Care saved my life. Dr. Sarah Jenkins identified a critical arterial blockage during a routine check. Her expertise and calmness throughout the stent procedure was incredible.',
    treatment: 'Heart Catheterization & Stent',
    date: 'May 12, 2026'
  },
  {
    id: 't2',
    patientName: 'Samantha L. Miller',
    rating: 5,
    text: 'Finding Dr. Emily Ross for my daughters was the best decision. She makes pediatrician appointments so playful and stress-free. My children actually look forward to visiting the hospital!',
    treatment: 'Pediatric Well-Child Checkup',
    date: 'June 02, 2026'
  },
  {
    id: 't3',
    patientName: 'Jonathan Reyes',
    rating: 5,
    text: 'Dr. Robert Chen and the orthopedic surgery staff gave me my life back. After years of agonizing arthritis pain, my hip replacement is perfect. I am walking 3 miles a day pain-free!',
    treatment: 'Total Hip Replacement',
    date: 'March 28, 2026'
  },
  {
    id: 't4',
    patientName: 'Aria Thompson',
    rating: 5,
    text: 'The support I received from Dr. Helen Rivers during my pregnancy was unmatched. She listened to every anxiety and delivered my healthy baby boy with the gentlest care imaginable. The maternity ward is phenomenal.',
    treatment: 'Prenatal & Maternity Delivery',
    date: 'April 15, 2026'
  }
];

export const FAQS = [
  {
    question: 'How do I book an appointment at We Care Hospitals?',
    answer: 'You can easily book an appointment using our online booking portal directly on this website. Simply click "Book Appointment", choose your desired department, select a doctor, pick an available date and timeslot, and fill in your details. You will receive an immediate reservation confirmation.'
  },
  {
    question: 'What insurance providers do you accept?',
    answer: 'We Care Hospitals accepts most major health insurance plans, including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare, and various local providers. Please contact our billing helpdesk prior to your visit to verify your specific coverage and benefits.'
  },
  {
    question: 'What are We Care Hospitals’ emergency hours?',
    answer: 'Our state-of-the-art Emergency Department and Trauma Center are open 24 hours a day, 7 days a week, 365 days a year. Our emergency hotline is always active at +1 (800) 555-0199 for immediate medical assistance.'
  },
  {
    question: 'Can I reschedule or cancel a booked appointment?',
    answer: 'Yes. You can manage, reschedule, or cancel your appointments directly through the "My Appointments" panel in the booking section, or by calling our helpdesk at least 24 hours prior to your scheduled time to ensure free slots are available for other patients.'
  },
  {
    question: 'Are visitors allowed inside the inpatient wards?',
    answer: 'Yes, visiting hours for in-patient units are daily from 10:00 AM to 08:00 PM. To protect patients’ recoveries and ensure sterile environments, we limit visitors to two at a time per bedside, and children under 12 must be accompanied by an adult.'
  }
];
