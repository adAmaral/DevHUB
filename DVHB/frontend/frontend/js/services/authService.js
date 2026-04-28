import { login, register } from './api.js';

const SESSION_KEY = 'devhub:session';

export async function loginUsuario(email, senha) {
  const session = await login(email, senha);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function cadastrarUsuario(usuario) {
  return register(usuario);
}

export function obterSessao() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logoutUsuario() {
  localStorage.removeItem(SESSION_KEY);
}
