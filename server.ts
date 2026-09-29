import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';

const app = express();
app.use(express.json());

// In-Memory Database for MVP
let departments = [
  { departmentID: 'dept-1', departmentName: 'Computer Science' },
  { departmentID: 'dept-2', departmentName: 'Computer Engineering' },
  { departmentID: 'dept-3', departmentName: 'Statistics' },
  { departmentID: 'dept-4', departmentName: 'Business Administration' },
  { departmentID: 'dept-5', departmentName: 'Information Technology' },
  { departmentID: 'dept-6', departmentName: 'Electrical Engineering' }
];

let skills = [
  { skillID: 'skill-1', skillName: 'Python', description: 'Python programming and scripting' },
  { skillID: 'skill-2', skillName: 'JavaScript', description: 'Modern JavaScript and frontend/backend development' },
  { skillID: 'skill-3', skillName: 'Web Development', description: 'HTML, CSS, React and web standards' },
  { skillID: 'skill-4', skillName: 'Database Management', description: 'SQL, MySQL, PostgreSQL and data storage' },
  { skillID: 'skill-5', skillName: 'Networking', description: 'LAN/WAN, routing, switching and TCP/IP' },
  { skillID: 'skill-6', skillName: 'Cybersecurity', description: 'Information security, threat analysis and cryptography' },
  { skillID: 'skill-7', skillName: 'Data Analysis', description: 'Excel, statistical analysis and data visualization' },
  { skillID: 'skill-8', skillName: 'Project Management', description: 'Agile, Scrum, and technical documentation' },
  { skillID: 'skill-9', skillName: 'Software Engineering', description: 'Design patterns, testing and system architecture' },
  { skillID: 'skill-10', skillName: 'UI/UX Design', description: 'Figma, wireframing and user experience principles' }
];

let organizations = [
  {
    organizationID: 'org-1',
    organizationName: 'Ibom Innovation Hub',
    industry: 'Software & Technology Incubation',
    address: '12 Edet Akpan Avenue, Uyo',
    location: 'Uyo',
    email: 'contact@ibominnovationhub.com',
    phone: '+234 803 123 4567',
    description: 'Premier technology hub fostering tech innovation, software engineering training, and startup incubation in Akwa Ibom State.',
    relevantDepartmentID: 'dept-1',
    requiredSkillIDs: ['skill-1', 'skill-2', 'skill-3', 'skill-10']
  },
  {
    organizationID: 'org-2',
    organizationName: 'Zenith Bank ICT Unit',
    industry: 'Banking & Financial Technology',
    address: '45 Main Street, Ikot Ekpene',
    location: 'Ikot Ekpene',
    email: 'ict.support@zenithbank.com',
    phone: '+234 802 987 6543',
    description: 'Leading financial institution branch deploying robust core banking systems, secure network infrastructure, and data analytics.',
    relevantDepartmentID: 'dept-1',
    requiredSkillIDs: ['skill-4', 'skill-5', 'skill-7', 'skill-6']
  },
  {
    organizationID: 'org-3',
    organizationName: 'Polytechnic ICT Center',
    industry: 'Academic & Institutional IT',
    address: 'Campus Main Gate, Ukana',
    location: 'Ukana',
    email: 'ict@fedpolyukana.edu.ng',
    phone: '+234 805 444 3322',
    description: 'Central ICT Directorate managing campus network, student portal systems, computer laboratories, and e-learning infrastructure.',
    relevantDepartmentID: 'dept-1',
    requiredSkillIDs: ['skill-5', 'skill-4', 'skill-1', 'skill-3']
  },
  {
    organizationID: 'org-4',
    organizationName: 'Akwa Ibom State Ministry of Science & Tech',
    industry: 'E-Governance & Public Sector',
    address: 'State Secretariat Complex, Uyo',
    location: 'Uyo',
    email: 'info@akwair.gov.ng',
    phone: '+234 807 111 2233',
    description: 'Government ministry driving digital transformation, ICT policy implementation, and database management for state agencies.',
    relevantDepartmentID: 'dept-5',
    requiredSkillIDs: ['skill-7', 'skill-3', 'skill-8', 'skill-4']
  },
  {
    organizationID: 'org-5',
    organizationName: 'Excellence Tech Solutions',
    industry: 'Software Engineering & Telecoms',
    address: '18 Marina Road, Eket',
    location: 'Eket',
    email: 'hr@excellencetech.ng',
    phone: '+234 810 555 7788',
    description: 'Specialized software house building custom enterprise applications, mobile solutions, and cybersecurity audits for oil & gas sector.',
    relevantDepartmentID: 'dept-1',
    requiredSkillIDs: ['skill-1', 'skill-2', 'skill-9', 'skill-6']
  },
  {
    organizationID: 'org-6',
    organizationName: 'Canaan Computer Systems',
    industry: 'Enterprise Networking & Hardware',
    address: '88 Aba Road, Port Harcourt',
    location: 'Port Harcourt',
    email: 'support@canaancomputers.com',
    phone: '+234 809 666 4455',
    description: 'Regional distributor and enterprise integration partner for high-performance computing, fiber optics, and structured cabling.',
    relevantDepartmentID: 'dept-2',
    requiredSkillIDs: ['skill-5', 'skill-4', 'skill-8']
  },
  {
    organizationID: 'org-7',
    organizationName: 'Codextreme ICT Academy',
    industry: 'ICT Training & Software Development',
    address: 'Opposite Polytechnic Main Gate, Ukana',
    location: 'Ukana',
    email: 'info@codextremeict.com',
    phone: '+234 901 234 5678',
    description: 'Specialized ICT academy providing hands-on training in web development, mobile app development, and digital literacy. A leading tech hub in the Ukana community.',
    relevantDepartmentID: 'dept-1',
    requiredSkillIDs: ['skill-2', 'skill-3', 'skill-1', 'skill-10']
  }
];

let placements = [
  {
    placementID: 'place-1',
    organizationID: 'org-1',
    position: 'Full Stack Web Developer Intern',
    departmentID: 'dept-1',
    availableSlots: 3,
    status: 'active'
  },
  {
    placementID: 'place-2',
    organizationID: 'org-1',
    position: 'UI/UX Design Trainee',
    departmentID: 'dept-1',
    availableSlots: 2,
    status: 'active'
  },
  {
    placementID: 'place-3',
    organizationID: 'org-2',
    position: 'Bank IT Support & Networking Intern',
    departmentID: 'dept-1',
    availableSlots: 2,
    status: 'active'
  },
  {
    placementID: 'place-4',
    organizationID: 'org-2',
    position: 'Data Analysis & Records Assistant',
    departmentID: 'dept-3',
    availableSlots: 1,
    status: 'active'
  },
  {
    placementID: 'place-5',
    organizationID: 'org-3',
    position: 'Campus Network & Lab Assistant',
    departmentID: 'dept-2',
    availableSlots: 4,
    status: 'active'
  },
  {
    placementID: 'place-6',
    organizationID: 'org-4',
    position: 'E-Governance Database Trainee',
    departmentID: 'dept-5',
    availableSlots: 3,
    status: 'active'
  },
  {
    placementID: 'place-7',
    organizationID: 'org-5',
    position: 'Software Engineering Intern',
    departmentID: 'dept-1',
    availableSlots: 2,
    status: 'active'
  },
  {
    placementID: 'place-8',
    organizationID: 'org-5',
    position: 'Cybersecurity Analyst Trainee',
    departmentID: 'dept-1',
    availableSlots: 2,
    status: 'active'
  },
  {
    placementID: 'place-9',
    organizationID: 'org-6',
    position: 'Enterprise Networking Technician',
    departmentID: 'dept-2',
    availableSlots: 3,
    status: 'active'
  },
  {
    placementID: 'place-10',
    organizationID: 'org-7',
    position: 'Junior Web Instructor & Developer',
    departmentID: 'dept-1',
    availableSlots: 2,
    status: 'active'
  }
];

let students = [
  {
    studentID: 'stu-1',
    fullName: 'SIWES Student',
    regNo: '2024/ND/CS/001',
    email: 'student@fedpolyukana.edu.ng',
    password: 'password123',
    departmentID: 'dept-1',
    level: 'ND 2',
    interest: 'Software Development',
    preferredLocation: 'Uyo',
    skillIDs: ['skill-1', 'skill-2', 'skill-3']
  }
];

let administrators = [
  {
    adminID: 'admin-1',
    fullName: 'Dr. SIWES Coordinator',
    email: 'admin@fedpolyukana.edu.ng',
    password: 'adminpassword'
  }
];

let recommendationsHistory: any[] = [];

// API Endpoints

// Auth
app.post('/api/auth/login', (req, res) => {
  const { emailOrReg, password, role } = req.body;
  if (role === 'student') {
    const student = students.find(s => (s.email === emailOrReg || s.regNo === emailOrReg) && s.password === password);
    if (student) {
      return res.json({ success: true, user: { ...student, role: 'student' } });
    }
  } else if (role === 'admin') {
    const admin = administrators.find(a => a.email === emailOrReg && a.password === password);
    if (admin) {
      return res.json({ success: true, user: { ...admin, role: 'admin' } });
    }
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials or role.' });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, regNo, email, password, departmentID, level, interest, preferredLocation, skillIDs } = req.body;
  if (students.some(s => s.regNo === regNo || s.email === email)) {
    return res.status(400).json({ success: false, message: 'Student with this Registration Number or Email already exists.' });
  }
  const newStudent = {
    studentID: `stu-${Date.now()}`,
    fullName,
    regNo,
    email,
    password: password || 'password123',
    departmentID: departmentID || 'dept-1',
    level: level || 'ND 2',
    interest: interest || 'Software Development',
    preferredLocation: preferredLocation || 'Uyo',
    skillIDs: skillIDs || ['skill-1', 'skill-3']
  };
  students.push(newStudent);
  res.json({ success: true, user: { ...newStudent, role: 'student' } });
});

// Departments & Skills
app.get('/api/departments', (req, res) => {
  res.json(departments);
});

app.post('/api/departments', (req, res) => {
  const { departmentName } = req.body;
  const newDept = { departmentID: `dept-${Date.now()}`, departmentName };
  departments.push(newDept);
  res.json(newDept);
});

app.get('/api/skills', (req, res) => {
  res.json(skills);
});

app.post('/api/skills', (req, res) => {
  const { skillName, description } = req.body;
  const newSkill = { skillID: `skill-${Date.now()}`, skillName, description: description || '' };
  skills.push(newSkill);
  res.json(newSkill);
});

// Organizations
app.get('/api/organizations', (req, res) => {
  const orgsWithDetails = organizations.map(org => {
    const orgPlacements = placements.filter(p => p.organizationID === org.organizationID);
    const dept = departments.find(d => d.departmentID === org.relevantDepartmentID);
    const reqSkills = skills.filter(s => org.requiredSkillIDs?.includes(s.skillID));
    return {
      ...org,
      departmentName: dept ? dept.departmentName : 'General',
      requiredSkills: reqSkills,
      placements: orgPlacements
    };
  });
  res.json(orgsWithDetails);
});

app.get('/api/organizations/:id', (req, res) => {
  const org = organizations.find(o => o.organizationID === req.params.id);
  if (!org) return res.status(404).json({ message: 'Organization not found' });
  const orgPlacements = placements.filter(p => p.organizationID === org.organizationID);
  const dept = departments.find(d => d.departmentID === org.relevantDepartmentID);
  const reqSkills = skills.filter(s => org.requiredSkillIDs?.includes(s.skillID));
  res.json({
    ...org,
    departmentName: dept ? dept.departmentName : 'General',
    requiredSkills: reqSkills,
    placements: orgPlacements
  });
});

app.post('/api/organizations', (req, res) => {
  const { organizationName, industry, address, location, email, phone, description, relevantDepartmentID, requiredSkillIDs } = req.body;
  const newOrg = {
    organizationID: `org-${Date.now()}`,
    organizationName,
    industry,
    address,
    location,
    email,
    phone,
    description,
    relevantDepartmentID,
    requiredSkillIDs: requiredSkillIDs || []
  };
  organizations.push(newOrg);
  res.json(newOrg);
});

// Placements
app.get('/api/placements', (req, res) => {
  const detailedPlacements = placements.map(p => {
    const org = organizations.find(o => o.organizationID === p.organizationID);
    const dept = departments.find(d => d.departmentID === p.departmentID);
    return {
      ...p,
      organizationName: org ? org.organizationName : 'Unknown',
      location: org ? org.location : 'Unknown',
      departmentName: dept ? dept.departmentName : 'Unknown'
    };
  });
  res.json(detailedPlacements);
});

app.post('/api/placements', (req, res) => {
  const { organizationID, position, departmentID, availableSlots, status } = req.body;
  const newPlacement = {
    placementID: `place-${Date.now()}`,
    organizationID,
    position,
    departmentID,
    availableSlots: availableSlots ? Number(availableSlots) : 2,
    status: status || 'active'
  };
  placements.push(newPlacement);
  res.json(newPlacement);
});

app.put('/api/placements/:id', (req, res) => {
  const { status, availableSlots } = req.body;
  const placement = placements.find(p => p.placementID === req.params.id);
  if (!placement) return res.status(404).json({ message: 'Placement not found' });
  if (status !== undefined) placement.status = status;
  if (availableSlots !== undefined) placement.availableSlots = Number(availableSlots);
  res.json(placement);
});

// Students
app.get('/api/students', (req, res) => {
  const detailedStudents = students.map(s => {
    const dept = departments.find(d => d.departmentID === s.departmentID);
    const studentSkills = skills.filter(sk => s.skillIDs?.includes(sk.skillID));
    return {
      ...s,
      departmentName: dept ? dept.departmentName : 'Unknown',
      skills: studentSkills
    };
  });
  res.json(detailedStudents);
});

app.put('/api/students/:id', (req, res) => {
  const student = students.find(s => s.studentID === req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  const { fullName, departmentID, level, interest, preferredLocation, skillIDs } = req.body;
  if (fullName) student.fullName = fullName;
  if (departmentID) student.departmentID = departmentID;
  if (level) student.level = level;
  if (interest) student.interest = interest;
  if (preferredLocation) student.preferredLocation = preferredLocation;
  if (skillIDs) student.skillIDs = skillIDs;
  res.json({ success: true, user: { ...student, role: 'student' } });
});

// Recommendation Engine (Weighted Scoring Algorithm)
// Criteria:
// Academic/Department Match: 30% (100 if student department matches organization relevant department, else 0)
// Skill Match: 30% (% of required skills matched by student skills)
// Interest Match: 20% (100 if student interest matches industry or keywords, else 50)
// Location Match: 20% (100 if preferred location matches org location, else 40)
app.post('/api/recommendations', (req, res) => {
  const { studentID } = req.body;
  const student = students.find(s => s.studentID === studentID);
  if (!student) {
    return res.status(404).json({ message: 'Student not found for recommendations' });
  }

  const activePlacements = placements.filter(p => p.status === 'active');
  const results: any[] = [];

  organizations.forEach(org => {
    // Check if org has active placements
    const orgPlacements = activePlacements.filter(p => p.organizationID === org.organizationID);
    if (orgPlacements.length === 0) return;

    // 1. Academic Match (30%)
    let academicScore = 0;
    if (org.relevantDepartmentID === student.departmentID) {
      academicScore = 100;
    } else {
      // Check if any placement matches student department
      const hasDeptMatch = orgPlacements.some(p => p.departmentID === student.departmentID);
      academicScore = hasDeptMatch ? 80 : 30;
    }

    // 2. Skill Match (30%)
    let skillScore = 0;
    const reqSkills: string[] = org.requiredSkillIDs || [];
    const studSkills: string[] = student.skillIDs || [];
    if (reqSkills.length === 0) {
      skillScore = 70;
    } else {
      const matchedSkills = reqSkills.filter(sk => studSkills.includes(sk));
      skillScore = Math.round((matchedSkills.length / reqSkills.length) * 100);
    }

    // 3. Interest Match (20%)
    let interestScore = 60;
    const studInterest = (student.interest || '').toLowerCase();
    const orgIndustry = (org.industry || '').toLowerCase();
    const orgDesc = (org.description || '').toLowerCase();
    if (orgIndustry.includes(studInterest.split(' ')[0]) || orgDesc.includes(studInterest.split(' ')[0])) {
      interestScore = 100;
    } else if (studInterest.includes('software') && (orgIndustry.includes('software') || orgIndustry.includes('technology'))) {
      interestScore = 100;
    } else if (studInterest.includes('networking') && orgIndustry.includes('networking')) {
      interestScore = 100;
    } else if (studInterest.includes('data') && orgIndustry.includes('data')) {
      interestScore = 100;
    }

    // 4. Location Match (20%)
    let locationScore = 40;
    const prefLoc = (student.preferredLocation || '').toLowerCase().trim();
    const orgLoc = (org.location || '').toLowerCase().trim();
    if (orgLoc === prefLoc) {
      locationScore = 100;
    } else if (orgLoc.includes(prefLoc) || prefLoc.includes(orgLoc)) {
      locationScore = 80;
    } else {
      locationScore = 50; // neighboring state/region
    }

    // Weighted Total Score Formula
    // Academic (0.30) + Skill (0.30) + Interest (0.20) + Location (0.20)
    const totalScore = Math.round(
      (academicScore * 0.30) +
      (skillScore * 0.30) +
      (interestScore * 0.20) +
      (locationScore * 0.20)
    );

    const dept = departments.find(d => d.departmentID === org.relevantDepartmentID);
    const requiredSkillsObjects = skills.filter(s => reqSkills.includes(s.skillID));
    const matchedSkillObjects = requiredSkillsObjects.filter(s => studSkills.includes(s.skillID));

    results.push({
      recommendationID: `rec-${Date.now()}-${org.organizationID}`,
      studentID: student.studentID,
      organizationID: org.organizationID,
      organizationName: org.organizationName,
      industry: org.industry,
      address: org.address,
      location: org.location,
      email: org.email,
      phone: org.phone,
      description: org.description,
      departmentName: dept ? dept.departmentName : 'General',
      academicScore,
      skillScore,
      interestScore,
      locationScore,
      totalScore,
      recommendationDate: new Date().toISOString(),
      requiredSkills: requiredSkillsObjects,
      matchedSkills: matchedSkillObjects,
      placements: orgPlacements
    });
  });

  // Sort descending by total score
  results.sort((a, b) => b.totalScore - a.totalScore);

  // Store in history
  recommendationsHistory = recommendationsHistory.filter(r => r.studentID !== studentID);
  recommendationsHistory.push(...results);

  res.json({ success: true, recommendations: results });
});

app.get('/api/recommendations/:studentID', (req, res) => {
  const studentRecs = recommendationsHistory.filter(r => r.studentID === req.params.studentID);
  studentRecs.sort((a, b) => b.totalScore - a.totalScore);
  res.json(studentRecs);
});

// Admin Dashboard stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalStudents: students.length,
    totalOrganizations: organizations.length,
    totalPlacements: placements.length,
    totalDepartments: departments.length,
    totalSkills: skills.length,
    totalRecommendationsRun: recommendationsHistory.length
  });
});

// Vite Middleware for Development
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SIWES Placement Recommendation System running on http://localhost:${PORT}`);
});
