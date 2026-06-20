'use client';

import { useState, useEffect } from 'react';
import { Tag, TagStatus, Location } from '@/types/tag';
import { API_BASE } from '@/lib/config';

interface Props {
  tag?: Tag;
  onSave: (tag: Tag) => void;
  onClose: () => void;
}

const STATUSES: { value: TagStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'LOST', label: 'Lost' },
];

const FIELD =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

export default function TagForm({ tag, onSave, onClose }: Props) {
  const isEdit = !!tag;

  const [label, setLabel] = useState(tag?.label ?? '');
  const [status, setStatus] = useState<TagStatus>(tag?.status ?? 'ACTIVE');
  const [locationId, setLocationId] = useState(tag?.locationId ?? '');
  const [newLocationName, setNewLocationName] = useState('');
  const [availableLocations, setAvailableLocations] = useState<Location[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isNewLocation = locationId === '__new__';

  useEffect(() => {
    fetch(`${API_BASE}/api/locations`, { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then(setAvailableLocations)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) { setError('Label is required.'); return; }
    if (isNewLocation && !newLocationName.trim()) {
      setError('Enter a name for the new location.');
      return;
    }

    setLoading(true);
    setError('');

    let finalLocationId: string | null = isNewLocation ? null : (locationId || null);
    let finalLocation: Location | null =
      availableLocations.find((l) => l.id === finalLocationId) ?? null;

    try {
      if (isNewLocation && newLocationName.trim()) {
        const locRes = await fetch(`${API_BASE}/api/locations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newLocationName.trim() }),
          signal: AbortSignal.timeout(5000),
        });
        if (locRes.ok) {
          const loc: Location = await locRes.json();
          finalLocationId = loc.id;
          finalLocation = loc;
        }
      }

      const payload = { label: label.trim(), status, locationId: finalLocationId };
      const url = isEdit ? `${API_BASE}/api/tags/${tag.id}` : `${API_BASE}/api/tags`;

      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const saved: Tag = await res.json();
      onSave(saved);
    } catch {
      // Standalone fallback: apply optimistically to local state
      const now = new Date().toISOString();
      const saved: Tag = {
        id: tag?.id ?? crypto.randomUUID(),
        label: label.trim(),
        status,
        lastScanned: tag?.lastScanned ?? null,
        createdAt: tag?.createdAt ?? now,
        updatedAt: now,
        locationId: finalLocationId,
        location: isNewLocation
          ? { id: 'local-' + Date.now(), name: newLocationName.trim(), createdAt: now }
          : finalLocation,
      };
      onSave(saved);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Tag' : 'Add New Tag'}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
          )}

          {isEdit && (
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-400">
                ID
              </label>
              <p className="font-mono text-xs text-gray-500">{tag.id}</p>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Label <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Server Rack A1"
              className={FIELD}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
            <select
              value={locationId}
              onChange={(e) => {
                setLocationId(e.target.value);
                if (e.target.value !== '__new__') setNewLocationName('');
              }}
              className={FIELD}
            >
              <option value="">No location</option>
              {availableLocations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
              <option value="__new__">+ New location…</option>
            </select>
            {isNewLocation && (
              <input
                type="text"
                value={newLocationName}
                onChange={(e) => setNewLocationName(e.target.value)}
                placeholder="Location name"
                className={`${FIELD} mt-2`}
                autoFocus
              />
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TagStatus)}
              className={FIELD}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Tag'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
