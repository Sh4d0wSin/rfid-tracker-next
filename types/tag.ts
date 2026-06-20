export type TagStatus = 'ACTIVE' | 'INACTIVE' | 'LOST';

export interface Location {
  id: string;
  name: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  label: string;
  status: TagStatus;
  lastScanned: string | null;
  createdAt: string;
  updatedAt: string;
  locationId: string | null;
  location: Location | null;
}
