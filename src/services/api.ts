import { Department, Skill, Organization, Placement, Student } from '../types';

export async function loginUser(emailOrReg: string, password: string,role: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrReg, password, role })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function registerStudent(studentData: Partial<Student> & { password?: string }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  return data;
}

export async function getDepartments(): Promise<Department[]> {
  const res = await fetch('/api/departments');
  return res.json();
}

export async function getSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills');
  return res.json();
}

export async function getOrganizations(): Promise<Organization[]> {
  const res = await fetch('/api/organizations');
  return res.json();
}

export async function getPlacements(): Promise<Placement[]> {
  const res = await fetch('/api/placements');
  return res.json();
}

export async function updateStudentProfile(studentID: string, data: Partial<Student>) {
  const res = await fetch(`/api/students/${studentID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || 'Update failed');
  return result;
}

export async function generateRecommendations(studentID: string) {
  const res = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentID })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to generate recommendations');
  return data.recommendations;
}

export async function getRecommendationHistory(studentID: string) {
  const res = await fetch(`/api/recommendations/${studentID}`);
  return res.json();
}

export async function getAdminStats() {
  const res = await fetch('/api/admin/stats');
  return res.json();
}

export async function createOrganization(orgData: Partial<Organization>) {
  const res = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orgData)
  });
  return res.json();
}

export async function createPlacement(placementData: Partial<Placement>) {
  const res = await fetch('/api/placements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(placementData)
  });
  return res.json();
}

export async function updatePlacementStatus(placementID: string, status: 'active' | 'inactive', availableSlots?: number) {
  const res = await fetch(`/api/placements/${placementID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, availableSlots })
  });
  return res.json();
}

export async function addDepartment(departmentName: string) {
  const res = await fetch('/api/departments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ departmentName })
  });
  return res.json();
}

export async function addSkill(skillName: string, description: string) {
  const res = await fetch('/api/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillName, description })
  });
  return res.json();
}
