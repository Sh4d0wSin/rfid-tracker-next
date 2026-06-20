import { Tag } from '@/types/tag';
import { mockTags } from '@/lib/mock-data';
import { API_BASE } from '@/lib/config';
import TagsClient from '@/components/TagsClient';

async function fetchTags(): Promise<{ tags: Tag[]; usingMock: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/tags`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tags: Tag[] = await res.json();
    return { tags, usingMock: false };
  } catch {
    return { tags: mockTags, usingMock: true };
  }
}

export default async function TagsPage() {
  const { tags, usingMock } = await fetchTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">RFID Tags</h1>
        <p className="mt-1 text-sm text-gray-500">Manage and monitor all tracked assets</p>
      </div>

      {usingMock && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          <span>⚠</span>
          <span>
            Express API at <code className="font-mono">{API_BASE}</code> is unreachable —
            showing mock data. Changes will be local only.
          </span>
        </div>
      )}

      <TagsClient initialTags={tags} />
    </div>
  );
}
