export function isContentType(value) { return value === 'movie' || value === 'tv'; }
export function isPositiveInteger(value) { return typeof value === 'number' && Number.isInteger(value) && value > 0; }
export function isValidRating(value) { return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 10; }
export function isNonEmptyString(value) { return typeof value === 'string' && value.trim().length > 0; }
export function parseJsonError(error) {
    return error instanceof SyntaxError ? 'Request body must be valid JSON' : 'Unexpected server error';
}
export function isValidEmail(value) { return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()); }
export const MIN_PASSWORD_LENGTH = 8;
export function isValidPassword(value) { return typeof value === 'string' && value.length >= MIN_PASSWORD_LENGTH && value.length <= 128; }
// Only allow same-site relative paths, so ?next= cannot redirect to another website.
export function safeRedirectPath(value) { return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/\\') ? value : '/'; }
export const MAX_NAME_LENGTH = 60;
export const MAX_BIO_LENGTH = 200;
// Avatars are resized in the browser before upload, so 300 KB is generous for a 256px JPEG.
export const MAX_AVATAR_BYTES = 300 * 1024;
export const AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
