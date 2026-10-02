import { Department, Skill, Organization, Placement, Student } from '../types';

async function safeJsonFetch(res: Response, defaultErrorMessage = 'Request failed') {
  const contentType = res.headers.get('content-type') || '';
  let data: any = null;
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }
  if (!res.ok) {
    const message = data?.message || data?.error || (res.status === 404 ? 'Resource not found' : defaultErrorMessage);
    throw new Error(message);
  }
  return data ?? {};
}

export async function loginUser(emailOrReg: string, password: string, role: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrReg, password, role })
  });
  return safeJsonFetch(res, 'Login failed');
}

export async function registerStudent(studentData: Partial<Student> & { password?: string }) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData)
  });
  return safeJsonFetch(res, 'Registration failed');
}

export async function getDepartments(): Promise<Department[]> {
  const res = await fetch('/api/departments');
  return safeJsonFetch(res, 'Failed to fetch departments');
}

export async function getSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills');
  return safeJsonFetch(res, 'Failed to fetch skills');
}

export async function getOrganizations(): Promise<Organization[]> {
  const res = await fetch('/api/organizations');
  return safeJsonFetch(res, 'Failed to fetch organizations');
}

export async function getPlacements(): Promise<Placement[]> {
  const res = await fetch('/api/placements');
  return safeJsonFetch(res, 'Failed to fetch placements');
}

export async function updateStudentProfile(studentID: string, data: Partial<Student>) {
  const res = await fetch(`/api/students/${studentID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return safeJsonFetch(res, 'Update failed');
}

export async function generateRecommendations(studentID: string) {
  const res = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentID })
  });
  const data = await safeJsonFetch(res, 'Failed to generate recommendations');
  return data.recommendations || [];
}

export async function getRecommendationHistory(studentID: string) {
  const res = await fetch(`/api/recommendations/${studentID}`);
  return safeJsonFetch(res, 'Failed to fetch recommendation history');
}

export async function getAdminStats() {
  const res = await fetch('/api/admin/stats');
  return safeJsonFetch(res, 'Failed to fetch admin stats');
}

export async function createOrganization(orgData: Partial<Organization>) {
  const res = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orgData)
  });
  return safeJsonFetch(res, 'Failed to create organization');
}

export async function createPlacement(placementData: Partial<Placement>) {
  const res = await fetch('/api/placements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(placementData)
  });
  return safeJsonFetch(res, 'Failed to create placement');
}

export async function updatePlacementStatus(placementID: string, status: 'active' | 'inactive', availableSlots?: number) {
  const res = await fetch(`/api/placements/${placementID}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, availableSlots })
  });
  return safeJsonFetch(res, 'Failed to update placement');
}

export async function addDepartment(departmentName: string) {
  const res = await fetch('/api/departments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ departmentName })
  });
  return safeJsonFetch(res, 'Failed to add department');
}

export async function addSkill(skillName: string, description: string) {
  const res = await fetch('/api/skills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillName, description })
  });
  return safeJsonFetch(res, 'Failed to add skill');
}

