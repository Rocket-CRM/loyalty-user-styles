/**
 * loyalty-user-styles / theme.js
 *
 * Runtime theming utility for WeWeb loyalty components.
 *
 * Display settings are bound to WeWeb variable 05d7ab66-c90e-400b-a672-a3e6504f0851
 * and read via: variables['05d7ab66-c90e-400b-a672-a3e6504f0851']
 *
 * Components call applyMerchantTheme(rootEl, settings) to set CSS custom
 * properties from the merchant's display configuration.
 */

const DISPLAY_SETTINGS_VAR_ID = '05d7ab66-c90e-400b-a672-a3e6504f0851';

/**
 * Read display settings from the WeWeb variable.
 * Returns the settings object or null if not available.
 */
export function getDisplaySettings() {
  try {
    const settings = wwLib?.wwFormula?.getValue?.(`variables['${DISPLAY_SETTINGS_VAR_ID}']`);
    return settings || null;
  } catch {
    return null;
  }
}

/**
 * Hex color to rgba string at given alpha.
 */
function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== 'string') return null;
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Apply merchant display settings as CSS custom properties on an element.
 *
 * @param {HTMLElement} el - The root element to apply theme to
 * @param {Object} settings - Display settings object from the WeWeb variable
 */
export function applyMerchantTheme(el, settings) {
  if (!el || !settings) return;

  const s = el.style;

  if (settings.primary_color) {
    s.setProperty('--loyalty-primary', settings.primary_color);
    const tint = hexToRgba(settings.primary_color, 0.08);
    if (tint) s.setProperty('--loyalty-primary-tint', tint);
  }

  if (settings.secondary_color) {
    s.setProperty('--loyalty-secondary', settings.secondary_color);
    const secTint = hexToRgba(settings.secondary_color, 0.08);
    if (secTint) s.setProperty('--loyalty-secondary-tint', secTint);
  }

  if (settings.border_radius_cards) {
    s.setProperty('--loyalty-radius-cards', settings.border_radius_cards);
  }
  if (settings.border_radius_buttons) {
    s.setProperty('--loyalty-radius-buttons', settings.border_radius_buttons);
  }
  if (settings.border_radius_inputs) {
    s.setProperty('--loyalty-radius-inputs', settings.border_radius_inputs);
  }
  if (settings.border_radius_modals) {
    s.setProperty('--loyalty-radius-modals', settings.border_radius_modals);
  }
  if (settings.border_button_radius_small) {
    s.setProperty('--loyalty-radius-button-sm', settings.border_button_radius_small);
  }

  if (settings.logo) {
    s.setProperty('--loyalty-logo', `url(${settings.logo})`);
  }
  if (settings.background_image) {
    s.setProperty('--loyalty-bg-image', `url(${settings.background_image})`);
  }
}

/**
 * Reactive theme watcher for Vue 3 components.
 * Call in setup() to auto-apply theme whenever display settings change.
 *
 * Usage:
 *   import { useTheme } from 'loyalty-user-styles/js/theme'
 *
 *   setup(props) {
 *     const rootRef = ref(null)
 *     useTheme(rootRef)
 *     return { rootRef }
 *   }
 */
export function useTheme(rootRef) {
  const { watch, onMounted, computed } = wwLib.getFrontWindow().Vue || {};
  if (!watch || !onMounted) return;

  const displaySettings = computed(() => {
    try {
      return wwLib?.wwFormula?.getValue?.(`variables['${DISPLAY_SETTINGS_VAR_ID}']`) || null;
    } catch {
      return null;
    }
  });

  const apply = () => {
    const el = rootRef?.value;
    const settings = displaySettings?.value;
    if (el && settings) applyMerchantTheme(el, settings);
  };

  onMounted(apply);
  watch(displaySettings, apply, { deep: true });
}

/**
 * Common Supabase RPC caller for loyalty components.
 * Anon key must be passed in — it is a bindable prop on each component.
 *
 * @param {string} supabaseUrl - Supabase project URL
 * @param {string} anonKey - Supabase anon key (bindable prop)
 * @param {string} functionName - RPC function name
 * @param {Object} params - RPC parameters
 * @param {string} [jwt] - Optional JWT override (from wwLib.wwAuth)
 */
export async function callRpc(supabaseUrl, anonKey, functionName, params = {}, jwt) {
  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase URL and anon key are required');
  }

  const token = jwt || wwLib?.wwAuth?.getToken?.() || anonKey;

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message || `RPC ${functionName} failed: ${response.status}`);
  }

  return response.json();
}
