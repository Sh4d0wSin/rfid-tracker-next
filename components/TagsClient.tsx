'use client';

import { useState, useMemo, useCallback } from 'react';
import { Tag, TagStatus } from '@/types/tag';
import TagForm from './TagForm';
import {API_BASE} from '@/lib/config';

const STATUS_BADGE: Record<TagStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  INACTIVE: 'bg-yellow-100 text-yellow-700',
  LOST: 'bg-red-100 text-red-700',
};

const STATUS_LABEL: Record<TagStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LOST: 'Lost',
};

interface Props {
  initialTags: Tag[];
}

export default function TagsClient({ initialTags }: Props) {
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'' | TagStatus>('');
  // undefined = closed, null = add new, Tag = edit existing
  const [formTag, setFormTag] = useState<Tag | null | undefined>(undefined);

  const locations = useMemo(
    () =>
      Array.from(
        new Set(tags.map((t) => t.location?.name).filter((n): n is string => Boolean(n)))
      ).sort(),
    [tags]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tags.filter((tag) => {
      if (q && !tag.label.toLowerCase().includes(q) && !tag.id.toLowerCase().includes(q))
        return false;
      if (locationFilter && tag.location?.name !== locationFilter) return false;
      if (statusFilter && tag.status !== statusFilter) return false;
      return true;
    });
  }, [tags, search, locationFilter, statusFilter]);

  const handleSave = useCallback((saved: Tag) => {
    setTags((prev) => {
      const idx = prev.findIndex((t) => t.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [saved, ...prev];
    });
    setFormTag(undefined);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/api/tags/${id}`, { method: 'DELETE' });
    if (res.ok) {
    setTags((prev) => prev.filter((t) => t.id !== id));
    } else {
    alert('Failed to delete tag');
    }
  }, []);



  const handleScan = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/api/tags/${id}/scan`, { method: 'POST' });
    if (res.ok) {
      const scan = await res.json();
      setTags((prev) =>
        prev.map((t) => (t.id === id ? { ...t, lastScanned: scan.scannedAt } : t))
      );
    }
}, []);



  const SELECT =
    'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search by label or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={SELECT}
        >
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | TagStatus)}
          className={SELECT}
        >
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOST">Lost</option>
        </select>
        <button
          onClick={() => setFormTag(null)}
          className="whitespace-nowrap rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          + Add Tag
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              {['ID', 'Label', 'Location', 'Last Scanned', 'Status', ''].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                  No tags match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((tag) => (
                <tr key={tag.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {tag.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{tag.label}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {tag.location?.name ?? <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {tag.lastScanned
                      ? new Date(tag.lastScanned).toLocaleString('en-GB')
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[tag.status]}`}
                    >
                      {STATUS_LABEL[tag.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-4">
                    <button
                        onClick={() => handleScan(tag.id)}
                        className="text-sm font-medium text-green-600 hover:text-green-800"
                      >
                        Scan
                    </button>

                    <button
                      onClick={() => setFormTag(tag)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this tag?')) handleDelete(tag.id);
                      }}
                        className="text-sm font-medium text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400">
        {filtered.length} of {tags.length} tags
      </p>

      {formTag !== undefined && (
        <TagForm
          tag={formTag ?? undefined}
          onSave={handleSave}
          onClose={() => setFormTag(undefined)}
        />
      )}
    </div>
  );
}
