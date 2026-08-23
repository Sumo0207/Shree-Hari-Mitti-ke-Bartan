const ADMIN_EMAILS = ['sumitkatakiya922@gmail.com', 'sumitkatakiya96@gmail.com'];

export const isAdminEmail = (email?: string | null) => {
  if (!email) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((candidate) => candidate.toLowerCase() === normalizedEmail);
};

export const isAdminUser = (role?: string | null, email?: string | null) => {
  return role === 'admin' || isAdminEmail(email);
};
