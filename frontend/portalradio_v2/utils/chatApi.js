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

async function fetchMessages(afterId) {
  const params = new URLSearchParams();
  if (afterId) params.set('after', afterId);
  params.set('limit', '50');

  const res = await fetch(`${API_URL}/chat/messages?${params}`);
  const data = await res.json();
  return data.messages || [];
}

async function sendMessage(text) {
  const user = getChatUser();
  if (!user?.token) throw new Error('Not authenticated');

  const res = await fetch(`${API_URL}/chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Chat-Token': user.token,
    },
    body: JSON.stringify({ message: text }),
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

export {
  getChatUser, setChatUser, chatRegister, chatLogin, chatForgotPassword, chatResetPassword,
  fetchMessages, sendMessage, getAvatarUrl,
  chatSendActivation, chatGetProfile, chatUpdateProfile, chatRemoveAvatar, chatGetPublicProfile,
};
