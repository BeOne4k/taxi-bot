import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = join(__dirname, '../../data/whatsapp_registry.json');

let registry = {};

function normalize(phone) {
  return phone.trim().replace(/[\s-]/g, '');
}

function load() {
  try {
    if (existsSync(REGISTRY_PATH)) {
      registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
      console.log(`[Registry] Loaded ${Object.keys(registry).length} entries`);
    }
  } catch (err) {
    console.error('[Registry] Load error:', err.message);
    registry = {};
  }
}

function save() {
  try {
    mkdirSync(dirname(REGISTRY_PATH), { recursive: true });
    writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Registry] Save error:', err.message);
  }
}

export function bind(phone, jid) {
  const key = normalize(phone);
  registry[key] = jid;
  save();
  console.log(`[Registry] Bound phone=${key} → jid=${jid}`);
}

export function getJid(phone) {
  return registry[normalize(phone)] || null;
}

load();
