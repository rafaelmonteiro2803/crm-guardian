/**
 * Share using native Share API or fallback to clipboard
 */
export async function shareData({ title, text, url }) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: title || 'Guardian CRM',
        text: text || '',
        url: url || window.location.href,
      });
      return { success: true };
    } catch (err) {
      // User dismissed share sheet
      if (err.name === 'AbortError') {
        return { success: false, cancelled: true };
      }
      console.warn('Share failed:', err);
      return { success: false, error: err.message };
    }
  } else {
    // Fallback: copy URL to clipboard
    return copyToClipboard(url || window.location.href);
  }
}

/**
 * Copy text to clipboard with feedback
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, copied: true };
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
      return { success: false, error: err.message };
    }
  } else {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return { success: true, copied: true };
    } catch (err) {
      document.body.removeChild(textarea);
      return { success: false, error: err.message };
    }
  }
}

/**
 * Generate WhatsApp deep link
 */
export function generateWhatsAppLink(phone, message = '') {
  // Clean phone (remove non-digits)
  const cleaned = phone.replace(/\D/g, '');

  // Ensure it starts with country code (55 for Brazil)
  const withCountry = cleaned.startsWith('55') ? cleaned : `55${cleaned}`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${withCountry}?text=${encoded}`;
}

/**
 * Generate phone call deep link
 */
export function generatePhoneLink(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return `tel:+${cleaned.startsWith('55') ? '' : '55'}${cleaned}`;
}

/**
 * Open WhatsApp or fallback
 */
export async function openWhatsApp(phone, message = '') {
  const link = generateWhatsAppLink(phone, message);

  // Try WhatsApp app first
  const appLink = `whatsapp://send?phone=${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;

  try {
    window.location.href = appLink;
    // Fallback to web after short delay if app doesn't open
    setTimeout(() => {
      window.open(link, '_blank');
    }, 2000);
  } catch {
    window.open(link, '_blank');
  }
}

/**
 * Open phone call dialog
 */
export function openPhoneCall(phone) {
  window.location.href = generatePhoneLink(phone);
}
