export interface Department {
  departmentID: string;
  departmentName: string;
}

export interface Skill {
  skillID: string;
  skillName: string;
  description: string;
}

export interface Placement {
  placementID: string;
  organizationID: string;
  organizationName?: string;
  position: string;
  departmentID: string;
  departmentName?: string;
  availableSlots: number;
  status: 'active' | 'inactive';
  location?: string;
}

export interface Organization {
  organizationID: string;
  organizationName: string;
  industry: string;
  address: string;
  location: string;
  email: string;
  phone: string;
  description: string;
  relevantDepartmentID: string;
  departmentName?: string;
  requiredSkillIDs: string[];
  requiredSkills?: Skill[];
  placements?: Placement[];
}

export interface Student {
  studentID: string;
  fullName: string;
  regNo: string;
  email: string;
  departmentID: string;
  departmentName?: string;
  level: string;
  interest: string;
  preferredLocation: string;
  skillIDs: string[];
  skills?: Skill[];
  role?: 'student';
}

export interface Admin {
  adminID: string;
  fullName: string;
  email: string;
  role: 'admin';
}

export type User = (Student & { role: 'student' }) | (Admin & { role: 'admin' });

export interface Recommendation {
  recommendationID: string;
  studentID: string;
  organizationID: string;
  organizationName: string;
  industry: string;
  address: string;
  location: string;
  email: string;
  phone: string;
  description: string;
  departmentName: string;
  academicScore: number;
  skillScore: number;
  interestScore: number;
  locationScore: number;
  totalScore: number;
  recommendationDate: string;
  requiredSkills: Skill[];
  matchedSkills: Skill[];
  placements: Placement[];
}
