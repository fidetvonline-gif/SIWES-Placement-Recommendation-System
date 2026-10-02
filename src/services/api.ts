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
  const cleanId = (emailOrReg || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrReg: cleanId, password: cleanPass, role })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }

    if (res.status === 401) {
      const errorData = await res.json().catch(() => ({ message: 'Invalid credentials or role' }));
      throw new Error(errorData.message || 'Invalid credentials or role. Please check your username/password.');
    }
  } catch (err: any) {
    if (err.message && err.message.includes('Invalid credentials')) {
      throw err;
    }
    console.warn('Backend server unavailable or returned 404, using local verification fallback:', err);
  }

  // Client-side fallback authentication for default demo accounts & offline mode
  if (role === 'student') {
    if (
      (cleanId === 'student@fedpolyukana.edu.ng' || cleanId === '2024/nd/cs/001' || cleanId === 'stu-1' || cleanId === 'student') &&
      cleanPass === 'password123'
    ) {
      return {
        success: true,
        user: {
          studentID: 'stu-1',
          fullName: 'SIWES Student',
          regNo: '2024/ND/CS/001',
          email: 'student@fedpolyukana.edu.ng',
          password: 'password123',
          departmentID: 'dept-1',
          level: 'ND 2',
          interest: 'Software Development',
          preferredLocation: 'Uyo',
          skillIDs: ['skill-1', 'skill-2', 'skill-3'],
          role: 'student'
        }
      };
    }
  } else if (role === 'admin') {
    if (
      (cleanId === 'admin@fedpolyukana.edu.ng' || cleanId === 'admin-1' || cleanId === 'admin') &&
      (cleanPass === 'adminpassword' || cleanPass === 'password123')
    ) {
      return {
        success: true,
        user: {
          adminID: 'admin-1',
          fullName: 'Dr. SIWES Coordinator',
          email: 'admin@fedpolyukana.edu.ng',
          password: 'adminpassword',
          role: 'admin'
        }
      };
    }
  }

  throw new Error('Invalid credentials or role. Please check your username/password.');
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

