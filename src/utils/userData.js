/**
 * In-memory store for user language and FSM state.
 * Shape: { [jid]: { lang, state, stateData } }
 */
const users = {};

export function getUser(jid) {
  if (!users[jid]) users[jid] = { lang: 'en', state: 'idle', stateData: {} };
  return users[jid];
}

export function getLang(jid) {
  return getUser(jid).lang;
}

export function setLang(jid, lang) {
  getUser(jid).lang = lang;
}

export function getState(jid) {
  return getUser(jid).state;
}

export function setState(jid, state, data = {}) {
  const u = getUser(jid);
  u.state = state;
  u.stateData = data;
}

export function getStateData(jid) {
  return getUser(jid).stateData || {};
}

export function updateStateData(jid, patch) {
  const u = getUser(jid);
  u.stateData = { ...(u.stateData || {}), ...patch };
}

export function clearState(jid) {
  const u = getUser(jid);
  u.state = 'idle';
  u.stateData = {};
}
