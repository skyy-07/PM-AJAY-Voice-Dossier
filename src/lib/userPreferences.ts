import { SupportedLanguage, User } from '../types.js';

const LANG_KEY = 'pmajay_selected_language';
const CONSENT_KEY = 'pmajay_consent_granted';
const CONSENT_TIME_KEY = 'pmajay_consent_timestamp';
const SESSION_TOKEN_KEY = 'pmajay_session_token';
const ADMIN_TOKEN_KEY = 'pmajay_admin_token';
const ADMIN_USER_KEY = 'pmajay_admin_user';

export interface UserPreferences {
  language: SupportedLanguage;
  consentGranted: boolean;
  consentTimestamp: string | null;
  sessionToken: string | null;
}

export const userPreferences = {
  getAdminSession(): { token: string | null; user: User | null } {
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      const userRaw = localStorage.getItem(ADMIN_USER_KEY);
      const user = userRaw ? JSON.parse(userRaw) as User : null;
      return { token, user };
    } catch {
      return { token: null, user: null };
    }
  },

  setAdminSession(token: string, user: User): void {
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('pmajay_admin_auth_change', {
        detail: { authenticated: true, user }
      }));
    } catch {
      // ignore
    }
  },

  clearAdminSession(): void {
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      window.dispatchEvent(new CustomEvent('pmajay_admin_auth_change', {
        detail: { authenticated: false, user: null }
      }));
    } catch {
      // ignore
    }
  },
  getLanguage(): SupportedLanguage {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved) return saved as SupportedLanguage;
    } catch {
      // ignore
    }
    return 'hi';
  },

  setLanguage(lang: SupportedLanguage): void {
    try {
      localStorage.setItem(LANG_KEY, lang);
      window.dispatchEvent(new CustomEvent('pmajay_preference_change', {
        detail: { type: 'language', value: lang }
      }));
    } catch {
      // ignore
    }
  },

  getConsent(): boolean {
    try {
      return localStorage.getItem(CONSENT_KEY) === 'true';
    } catch {
      return false;
    }
  },

  setConsent(granted: boolean): void {
    try {
      if (granted) {
        localStorage.setItem(CONSENT_KEY, 'true');
        const ts = new Date().toISOString();
        localStorage.setItem(CONSENT_TIME_KEY, ts);
        const token = `PMAJAY-AUTH-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        localStorage.setItem(SESSION_TOKEN_KEY, token);
      } else {
        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_TIME_KEY);
        localStorage.removeItem(SESSION_TOKEN_KEY);
      }
      window.dispatchEvent(new CustomEvent('pmajay_preference_change', {
        detail: { type: 'consent', value: granted }
      }));
    } catch {
      // ignore
    }
  },

  getAll(): UserPreferences {
    try {
      return {
        language: this.getLanguage(),
        consentGranted: this.getConsent(),
        consentTimestamp: localStorage.getItem(CONSENT_TIME_KEY),
        sessionToken: localStorage.getItem(SESSION_TOKEN_KEY)
      };
    } catch {
      return {
        language: 'hi',
        consentGranted: false,
        consentTimestamp: null,
        sessionToken: null
      };
    }
  },

  reset(): void {
    try {
      localStorage.removeItem(LANG_KEY);
      localStorage.removeItem(CONSENT_KEY);
      localStorage.removeItem(CONSENT_TIME_KEY);
      localStorage.removeItem(SESSION_TOKEN_KEY);
      window.dispatchEvent(new CustomEvent('pmajay_preference_change', {
        detail: { type: 'reset' }
      }));
    } catch {
      // ignore
    }
  }
};
