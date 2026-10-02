-- ==============================================================================
-- SIWES Recommendation System - Supabase / PostgreSQL Complete Database Schema
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running
DROP TABLE IF EXISTS recommendations_history CASCADE;
DROP TABLE IF EXISTS placements CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS administrators CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- ------------------------------------------------------------------------------
-- Table 1: Departments
-- ------------------------------------------------------------------------------
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "departmentID" TEXT UNIQUE NOT NULL,
  "departmentName" TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Table 2: Skills
-- ------------------------------------------------------------------------------
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "skillID" TEXT UNIQUE NOT NULL,
  "skillName" TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Table 3: Organizations
-- ------------------------------------------------------------------------------
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "organizationID" TEXT UNIQUE NOT NULL,
  "organizationName" TEXT NOT NULL,
  industry TEXT NOT NULL,
  address TEXT NOT NULL,
  location TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  description TEXT,
  "relevantDepartmentID" TEXT REFERENCES departments("departmentID") ON UPDATE CASCADE ON DELETE SET NULL,
  "requiredSkillIDs" TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Table 4: Placements
-- ------------------------------------------------------------------------------
CREATE TABLE placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "placementID" TEXT UNIQUE NOT NULL,
  "organizationID" TEXT REFERENCES organizations("organizationID") ON UPDATE CASCADE ON DELETE CASCADE,
  position TEXT NOT NULL,
  "departmentID" TEXT REFERENCES departments("departmentID") ON UPDATE CASCADE ON DELETE SET NULL,
  "availableSlots" INTEGER DEFAULT 2,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Table 5: Students
-- ------------------------------------------------------------------------------
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "studentID" TEXT UNIQUE NOT NULL,
  "fullName" TEXT NOT NULL,
  "regNo" TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  "departmentID" TEXT REFERENCES departments("departmentID") ON UPDATE CASCADE ON DELETE SET NULL,
  level TEXT DEFAULT 'ND 2',
  interest TEXT,
  "preferredLocation" TEXT,
  "skillIDs" TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Table 6: Administrators
-- ------------------------------------------------------------------------------
CREATE TABLE administrators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "adminID" TEXT UNIQUE NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- Table 7: Recommendations History
-- ------------------------------------------------------------------------------
CREATE TABLE recommendations_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "recommendationID" TEXT UNIQUE NOT NULL,
  "studentID" TEXT REFERENCES students("studentID") ON UPDATE CASCADE ON DELETE CASCADE,
  "organizationID" TEXT REFERENCES organizations("organizationID") ON UPDATE CASCADE ON DELETE CASCADE,
  "organizationName" TEXT NOT NULL,
  industry TEXT,
  "academicScore" INTEGER DEFAULT 0,
  "skillScore" INTEGER DEFAULT 0,
  "interestScore" INTEGER DEFAULT 0,
  "locationScore" INTEGER DEFAULT 0,
  "totalScore" INTEGER DEFAULT 0,
  "recommendationDate" TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- Row Level Security (RLS) - Enable public read/write or customize as required
-- ==============================================================================
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations_history ENABLE ROW LEVEL SECURITY;

-- Allow public access with anon key (or service role) for backend & client API
CREATE POLICY "Allow public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow public insert departments" ON departments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow public insert skills" ON skills FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Allow public insert organizations" ON organizations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update organizations" ON organizations FOR UPDATE USING (true);

CREATE POLICY "Allow public read placements" ON placements FOR SELECT USING (true);
CREATE POLICY "Allow public insert placements" ON placements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update placements" ON placements FOR UPDATE USING (true);

CREATE POLICY "Allow public all students" ON students FOR ALL USING (true);
CREATE POLICY "Allow public all administrators" ON administrators FOR ALL USING (true);
CREATE POLICY "Allow public all recommendations" ON recommendations_history FOR ALL USING (true);

-- ==============================================================================
-- Initial Seed Data
-- ==============================================================================

-- 1. Seed Academic Departments
INSERT INTO departments ("departmentID", "departmentName") VALUES
('dept-1', 'Computer Science'),
('dept-2', 'Computer Engineering'),
('dept-3', 'Statistics'),
('dept-4', 'Business Administration'),
('dept-5', 'Information Technology'),
('dept-6', 'Electrical Engineering')
ON CONFLICT ("departmentID") DO NOTHING;

-- 2. Seed Skills
INSERT INTO skills ("skillID", "skillName", description) VALUES
('skill-1', 'Python', 'Python programming, data structures and scripting'),
('skill-2', 'JavaScript', 'Modern JavaScript and frontend/backend web development'),
('skill-3', 'Web Development', 'HTML5, CSS3, React and modern web standards'),
('skill-4', 'Database Management', 'SQL, MySQL, PostgreSQL and structured database storage'),
('skill-5', 'Networking', 'LAN/WAN, routing, switching, cabling and TCP/IP protocols'),
('skill-6', 'Cybersecurity', 'Information security, threat assessment and cryptography'),
('skill-7', 'Data Analysis', 'Excel, statistical packages and data visualization'),
('skill-8', 'Project Management', 'Agile workflows, Scrum and technical documentation'),
('skill-9', 'Software Engineering', 'System architecture, design patterns and software testing'),
('skill-10', 'UI/UX Design', 'Figma, interface design and user experience prototyping')
ON CONFLICT ("skillID") DO NOTHING;

-- 3. Seed Organizations
INSERT INTO organizations ("organizationID", "organizationName", industry, address, location, email, phone, description, "relevantDepartmentID", "requiredSkillIDs") VALUES
('org-1', 'Ibom Innovation Hub', 'Software & Technology Incubation', '12 Edet Akpan Avenue, Uyo', 'Uyo', 'contact@ibominnovationhub.com', '+234 803 123 4567', 'Premier technology hub fostering tech innovation, software engineering training, and startup incubation in Akwa Ibom State.', 'dept-1', ARRAY['skill-1', 'skill-2', 'skill-3', 'skill-10']),
('org-2', 'Zenith Bank ICT Unit', 'Banking & Financial Technology', '45 Main Street, Ikot Ekpene', 'Ikot Ekpene', 'ict.support@zenithbank.com', '+234 802 987 6543', 'Leading financial institution branch deploying robust core banking systems, secure network infrastructure, and data analytics.', 'dept-1', ARRAY['skill-4', 'skill-5', 'skill-7', 'skill-6']),
('org-3', 'Polytechnic ICT Center', 'Academic & Institutional IT', 'Campus Main Gate, Ukana', 'Ukana', 'ict@fedpolyukana.edu.ng', '+234 805 444 3322', 'Central ICT Directorate managing campus network, student portal systems, computer laboratories, and e-learning infrastructure.', 'dept-1', ARRAY['skill-5', 'skill-4', 'skill-1', 'skill-3']),
('org-4', 'Akwa Ibom State Ministry of Science & Tech', 'E-Governance & Public Sector', 'State Secretariat Complex, Uyo', 'Uyo', 'info@akwair.gov.ng', '+234 807 111 2233', 'Government ministry driving digital transformation, ICT policy implementation, and database management for state agencies.', 'dept-5', ARRAY['skill-7', 'skill-3', 'skill-8', 'skill-4']),
('org-5', 'Excellence Tech Solutions', 'Software Engineering & Telecoms', '18 Marina Road, Eket', 'Eket', 'hr@excellencetech.ng', '+234 810 555 7788', 'Specialized software house building custom enterprise applications, mobile solutions, and cybersecurity audits for oil & gas sector.', 'dept-1', ARRAY['skill-1', 'skill-2', 'skill-9', 'skill-6']),
('org-6', 'Canaan Computer Systems', 'Enterprise Networking & Hardware', '88 Aba Road, Port Harcourt', 'Port Harcourt', 'support@canaancomputers.com', '+234 809 666 4455', 'Regional distributor and enterprise integration partner for high-performance computing, fiber optics, and structured cabling.', 'dept-2', ARRAY['skill-5', 'skill-4', 'skill-8']),
('org-7', 'Codextreme ICT Academy', 'ICT Training & Software Development', 'Opposite Polytechnic Main Gate, Ukana', 'Ukana', 'info@codextremeict.com', '+234 901 234 5678', 'Specialized ICT academy providing hands-on training in web development, mobile app development, and digital literacy. A leading tech hub in the Ukana community.', 'dept-1', ARRAY['skill-2', 'skill-3', 'skill-1', 'skill-10'])
ON CONFLICT ("organizationID") DO NOTHING;

-- 4. Seed Placement Opportunities
INSERT INTO placements ("placementID", "organizationID", position, "departmentID", "availableSlots", status) VALUES
('place-1', 'org-1', 'Full Stack Web Developer Intern', 'dept-1', 3, 'active'),
('place-2', 'org-1', 'UI/UX Design Trainee', 'dept-1', 2, 'active'),
('place-3', 'org-2', 'Bank IT Support & Networking Intern', 'dept-1', 2, 'active'),
('place-4', 'org-2', 'Data Analysis & Records Assistant', 'dept-3', 1, 'active'),
('place-5', 'org-3', 'Campus Network & Lab Assistant', 'dept-2', 4, 'active'),
('place-6', 'org-4', 'E-Governance Database Trainee', 'dept-5', 3, 'active'),
('place-7', 'org-5', 'Software Engineering Intern', 'dept-1', 2, 'active'),
('place-8', 'org-5', 'Cybersecurity Analyst Trainee', 'dept-1', 2, 'active'),
('place-9', 'org-6', 'Enterprise Networking Technician', 'dept-2', 3, 'active'),
('place-10', 'org-7', 'Junior Web Instructor & Developer', 'dept-1', 2, 'active')
ON CONFLICT ("placementID") DO NOTHING;

-- 5. Seed Default Student User
INSERT INTO students ("studentID", "fullName", "regNo", email, password, "departmentID", level, interest, "preferredLocation", "skillIDs") VALUES
('stu-1', 'SIWES Student', '2024/ND/CS/001', 'student@fedpolyukana.edu.ng', 'password123', 'dept-1', 'ND 2', 'Software Development', 'Uyo', ARRAY['skill-1', 'skill-2', 'skill-3'])
ON CONFLICT ("studentID") DO NOTHING;

-- 6. Seed Default Administrator User
INSERT INTO administrators ("adminID", "fullName", email, password) VALUES
('admin-1', 'Dr. SIWES Coordinator', 'admin@fedpolyukana.edu.ng', 'adminpassword')
ON CONFLICT ("adminID") DO NOTHING;
