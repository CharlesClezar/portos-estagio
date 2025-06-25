
export interface Port {
  id: string;
  name: string;
  code: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface PortActivity {
  id: string;
  portId: string;
  portName: string;
  portCode: string;
  date: string;
  vesselCalls: number;
  containerVolume: number;
  bulkVolume: number;
  liquidVolume: number;
  totalVolume: number;
  vesselTypes: {
    container: number;
    bulk: number;
    tanker: number;
    other: number;
  };
}

export interface PortRanking {
  portId: string;
  portName: string;
  portCode: string;
  totalVolume: number;
  rank: number;
  country: string;
}

export interface ApiFilters {
  portCode?: string;
  portName?: string;
  startDate?: string;
  endDate?: string;
  vesselType?: string;
  sortBy?: 'date' | 'volume' | 'vesselCalls';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
}
