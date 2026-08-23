const ADMIN_EMAILS = ['sumitkatakiya922@gmail.com'];

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  return ADMIN_EMAILS.some((candidate) => candidate.toLowerCase() === email.trim().toLowerCase());
};

export const isAdminUser = (role?: string | null, email?: string | null) => {
  return role === 'admin' || isAdminEmail(email);
};
