'use client';
import { Camera, LoaderCircle, Pencil, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { apiRequest } from '@/lib/client-api';
import { MAX_BIO_LENGTH, MAX_NAME_LENGTH } from '@/lib/validation';
const AVATAR_SIZE = 256;
// Lets the navbar show the new name/avatar without a page reload.
const announce = (user) => window.dispatchEvent(new CustomEvent('profile-updated', { detail: user }));
// Center-crops the chosen image to a square and re-encodes it as a small JPEG before upload.
async function resizeToSquareJpeg(file) {
    const bitmap = await createImageBitmap(file);
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = AVATAR_SIZE;
    canvas.getContext('2d').drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
    bitmap.close();
    return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not process that image')), 'image/jpeg', 0.85));
}
export function Avatar({ user, className = '' }) {
    return user.avatarUrl
        ? <img src={user.avatarUrl} alt="" className={`rounded-full object-cover ${className}`}/>
        : <span aria-hidden className={`grid place-items-center rounded-full bg-gold font-extrabold text-black ${className}`}>{user.name?.trim().charAt(0).toUpperCase() || '?'}</span>;
}
export default function ProfileHeader({ initialUser, stats }) {
    const [user, setUser] = useState(initialUser);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(initialUser.name);
    const [bio, setBio] = useState(initialUser.bio);
    const [busy, setBusy] = useState();
    const [error, setError] = useState();
    const fileInput = useRef(null);
    function applyUser(next) {
        setUser(current => ({ ...current, ...next }));
        announce(next);
    }
    async function uploadAvatar(event) {
        const file = event.target.files?.[0];
        event.target.value = '';
        if (!file)
            return;
        if (!file.type.startsWith('image/'))
            return setError('Choose an image file');
        setBusy('avatar');
        setError(undefined);
        try {
            const form = new FormData();
            form.append('avatar', await resizeToSquareJpeg(file), 'avatar.jpg');
            const response = await fetch('/api/profile/avatar', { method: 'PUT', body: form });
            const data = await response.json().catch(() => ({ error: 'Invalid server response' }));
            if (!response.ok)
                throw new Error(data.error || 'Upload failed');
            applyUser(data.user);
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Upload failed');
        }
        finally {
            setBusy(undefined);
        }
    }
    async function removeAvatar() {
        setBusy('avatar');
        setError(undefined);
        try {
            const data = await apiRequest('/api/profile/avatar', { method: 'DELETE' });
            applyUser(data.user);
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Could not remove photo');
        }
        finally {
            setBusy(undefined);
        }
    }
    async function saveProfile(event) {
        event.preventDefault();
        if (!name.trim())
            return setError('Name cannot be empty');
        setBusy('profile');
        setError(undefined);
        try {
            const data = await apiRequest('/api/profile', { method: 'PATCH', body: JSON.stringify({ name, bio }) });
            applyUser(data.user);
            setEditing(false);
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Could not save profile');
        }
        finally {
            setBusy(undefined);
        }
    }
    function cancelEdit() {
        setName(user.name);
        setBio(user.bio);
        setEditing(false);
        setError(undefined);
    }
    const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : null;
    const inputClass = 'mt-2 w-full rounded-lg border border-white/10 bg-surface-high p-3 transition focus:border-gold/60';
    return <section className="rounded-2xl border border-white/5 bg-surface p-6 md:p-10"><div className="flex flex-col gap-8 md:flex-row md:items-center"><div className="flex shrink-0 flex-col items-center gap-3"><button type="button" onClick={() => fileInput.current?.click()} disabled={busy === 'avatar'} aria-label="Change profile picture" className="group relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-gold/40 md:h-40 md:w-40"><Avatar user={user} className="h-full w-full text-5xl"/><span className={`absolute inset-0 grid place-items-center bg-black/60 transition ${busy === 'avatar' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>{busy === 'avatar' ? <LoaderCircle className="h-7 w-7 animate-spin text-gold"/> : <Camera className="h-7 w-7"/>}</span></button><input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadAvatar} className="hidden"/>{user.avatarUrl && <button type="button" onClick={removeAvatar} disabled={!!busy} className="flex items-center gap-1 text-xs text-muted hover:text-red-400 disabled:opacity-50"><Trash2 className="h-3 w-3"/>Remove photo</button>}</div><div className="min-w-0 flex-1">{editing ? <form onSubmit={saveProfile} className="max-w-xl"><label className="block text-sm font-semibold">Name<input value={name} maxLength={MAX_NAME_LENGTH} onChange={event => setName(event.target.value)} className={inputClass}/></label><label className="mt-4 block text-sm font-semibold">Bio<textarea value={bio} maxLength={MAX_BIO_LENGTH} rows={3} onChange={event => setBio(event.target.value)} placeholder="Favourite genres, directors, guilty pleasures…" className={`${inputClass} resize-none`}/></label><p className="mt-1 text-right text-xs text-muted">{bio.length}/{MAX_BIO_LENGTH}</p><div className="mt-3 flex gap-3"><button disabled={busy === 'profile'} className="flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 font-bold text-black disabled:opacity-60">{busy === 'profile' && <LoaderCircle className="h-4 w-4 animate-spin"/>}Save</button><button type="button" onClick={cancelEdit} className="rounded-full px-6 py-2.5 font-semibold text-muted hover:bg-white/5 hover:text-white">Cancel</button></div></form> : <><p className="font-bold uppercase tracking-widest text-gold">My Profile</p><h1 className="mt-2 break-words text-4xl font-extrabold md:text-5xl">{user.name}</h1><p className="mt-2 text-sm text-muted">{user.email}{joined && ` • Member since ${joined}`}</p><p className={`mt-4 max-w-2xl leading-7 ${user.bio ? 'text-gray-300' : 'italic text-muted'}`}>{user.bio || 'No bio yet.'}</p><button type="button" onClick={() => setEditing(true)} className="mt-5 flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold hover:border-gold hover:text-gold"><Pencil className="h-4 w-4"/>Edit profile</button></>}{error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}</div></div><div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/5 pt-8">{stats.map(([label, value]) => <div key={label} className="rounded-xl bg-surface-high p-4 text-center"><p className="text-2xl font-extrabold text-gold md:text-3xl">{value}</p><p className="mt-1 text-xs text-muted md:text-sm">{label}</p></div>)}</div></section>;
}
