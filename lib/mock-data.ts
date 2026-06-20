import { Tag, Location } from '@/types/tag';

const TS = '2026-01-01T00:00:00Z';

export const mockLocations: Location[] = [
  { id: 'loc-1', name: 'Data Center', createdAt: TS },
  { id: 'loc-2', name: 'Warehouse A', createdAt: TS },
  { id: 'loc-3', name: 'Warehouse B', createdAt: TS },
  { id: 'loc-4', name: 'Office Building', createdAt: TS },
  { id: 'loc-5', name: 'Clinic Wing', createdAt: TS },
];

const L = mockLocations;

export const mockTags: Tag[] = [
  { id: 'tag-001', label: 'Server Rack A1',          status: 'ACTIVE',   lastScanned: '2026-06-20T08:14:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-1', location: L[0] },
  { id: 'tag-002', label: 'Forklift #3',             status: 'ACTIVE',   lastScanned: '2026-06-20T07:55:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-3', location: L[2] },
  { id: 'tag-003', label: 'Fire Extinguisher – F2',  status: 'ACTIVE',   lastScanned: '2026-06-19T15:30:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-4', location: L[3] },
  { id: 'tag-004', label: 'Pallet Jack #7',          status: 'INACTIVE', lastScanned: '2026-06-18T11:00:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-2', location: L[1] },
  { id: 'tag-005', label: 'Network Switch SW-12',    status: 'ACTIVE',   lastScanned: '2026-06-20T09:01:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-1', location: L[0] },
  { id: 'tag-006', label: 'Hydraulic Lift #2',       status: 'LOST',     lastScanned: '2026-06-15T14:22:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-3', location: L[2] },
  { id: 'tag-007', label: 'Medical Cart 4B',         status: 'ACTIVE',   lastScanned: '2026-06-20T06:45:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-5', location: L[4] },
  { id: 'tag-008', label: 'Backup Generator #1',     status: 'INACTIVE', lastScanned: '2026-06-17T09:10:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-1', location: L[0] },
  { id: 'tag-009', label: 'Laptop LAP-089',          status: 'ACTIVE',   lastScanned: '2026-06-20T08:59:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-4', location: L[3] },
  { id: 'tag-010', label: 'Cargo Container CC-44',   status: 'LOST',     lastScanned: '2026-06-10T13:00:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-2', location: L[1] },
  { id: 'tag-011', label: 'IV Pump Unit #6',         status: 'ACTIVE',   lastScanned: '2026-06-20T07:30:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-5', location: L[4] },
  { id: 'tag-012', label: 'AED Device – Lobby',      status: 'INACTIVE', lastScanned: '2026-06-19T10:15:00Z', createdAt: TS, updatedAt: TS, locationId: 'loc-4', location: L[3] },
];
