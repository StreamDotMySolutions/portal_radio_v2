const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/frontend';

function getChatUser() {
  try {
    const raw = localStorage.getItem('chat_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setChatUser(user) {
  if (user) {
    localStorage.setItem('chat_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('chat_user');
  }
}

async function chatRegister(username, email, password) {
  const res = await fetch(`${API_URL}/chat/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  setChatUser(data.user);
  return data.user;
}

async function chatLogin(username, password) {
  const res = await fetch(`${API_URL}/chat/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  setChatUser(data.user);
  return data.user;
}

// Google sign-in step 1: returns { user } for an existing account, or
// { needs_username, suggested_username, signup_token } for a new one
async function chatGoogleLogin(credential) {
  const res = await fetch(`${API_URL}/chat/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ credential }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  if (data.user) setChatUser(data.user);
  return data;
}

// Google sign-in step 2 for a new user: create the account with the chosen username
async function chatGoogleComplete(signupToken, username) {
  const res = await fetch(`${API_URL}/chat/google/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ signup_token: signupToken, username }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  setChatUser(data.user);
  return data.user;
}

async function fetchMessages({ after, before, limit = 50 } = {}) {
  const params = new URLSearchParams();
  if (after) params.set('after', after);
  if (before) params.set('before', before);
  params.set('limit', String(limit));

  const res = await fetch(`${API_URL}/chat/messages?${params}`, {
    headers: { 'Accept': 'application/json' },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw { status: res.status };
  }

  const data = await res.json();
  return { messages: data.messages || [], hasMore: !!data.has_more };
}

async function sendMessage(text, clientId) {
  const user = getChatUser();
  if (!user?.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Chat-Token': user.token,
    },
    body: JSON.stringify({ message: text, client_id: clientId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data.message;
}

async function chatForgotPassword(email) {
  const res = await fetch(`${API_URL}/chat/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data;
}

async function chatResetPassword(token, email, password, password_confirmation) {
  const res = await fetch(`${API_URL}/chat/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ token, email, password, password_confirmation }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data;
}

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

function getAvatarUrl(filename) {
  if (!filename) return null;
  return `${SERVER_URL}/storage/chat-avatars/${filename}`;
}

async function chatSendActivation() {
  const user = getChatUser();
  if (!user?.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/chat/send-activation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Chat-Token': user.token,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data;
}

async function chatGetProfile() {
  const user = getChatUser();
  if (!user?.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/chat/profile`, {
    headers: {
      'Accept': 'application/json',
      'X-Chat-Token': user.token,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data.user;
}

async function chatUpdateProfile(formData) {
  const user = getChatUser();
  if (!user?.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/chat/profile`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'X-Chat-Token': user.token,
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  // Update local storage with new avatar info
  if (data.user) {
    const current = getChatUser();
    if (current) {
      setChatUser({ ...current, avatar_filename: data.user.avatar_filename, email_verified_at: data.user.email_verified_at });
    }
  }

  return data;
}

async function chatRemoveAvatar() {
  const user = getChatUser();
  if (!user?.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/chat/profile/avatar`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'X-Chat-Token': user.token,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  // Update local storage
  const current = getChatUser();
  if (current) {
    setChatUser({ ...current, avatar_filename: null });
  }

  return data;
}

async function chatGetPublicProfile(userId) {
  const res = await fetch(`${API_URL}/chat/profile/${userId}`, {
    headers: { 'Accept': 'application/json' },
  });

  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, data };
  }

  return data.user;
}

// @mention autocomplete: up to 6 { id, username, color, avatar_filename } whose username starts with q
async function searchChatUsers(q) {
  const user = getChatUser();
  if (!user?.token) return [];

  const res = await fetch(`${API_URL}/chat/users?q=${encodeURIComponent(q)}`, {
    headers: { 'Accept': 'application/json', 'X-Chat-Token': user.token },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data.users || [];
}

export {
  searchChatUsers,
  getChatUser, setChatUser, chatRegister, chatLogin, chatGoogleLogin, chatGoogleComplete, chatForgotPassword, chatResetPassword,
  fetchMessages, sendMessage, getAvatarUrl,
  chatSendActivation, chatGetProfile, chatUpdateProfile, chatRemoveAvatar, chatGetPublicProfile,
};
