import axios from "axios";

export interface Stats {
  response: {
    stats: {
      totalQueries: number;
      totalNoError: number;
      totalServerFailure: number;
      totalNxDomain: number;
      totalRefused: number;
      totalAuthoritative: number;
      totalRecursive: number;
      totalCached: number;
      totalBlocked: number;
      totalClients: number;
      zones: number;
      cachedEntries: number;
      allowedZones: number;
      blockedZones: number;
      allowListZones: number;
      blockListZones: number;
    };
    mainChartData: {
      labelFormat: string;
      labels: string[];
      dataSets: {
        label: string;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        fill: boolean;
        data: number[];
      }[];
    };
    topClients: {
      name: string;
      hits: number;
      rateLimited: boolean;
    }[];
    topDomains: {
      name: string;
      hits: number;
    }[];
    topBlockedDomains: {
      name: string;
      hits: number;
    }[];
  };
  status: string;
}

export class TechnitiumClient {
  private _host: string;
  private _token: string;

  constructor(host: string, token: string) {
    this._host = host;
    this._token = token;
  }

  getStats(): Promise<Stats> {
    const url = `${this._host}/api/dashboard/stats/get?token=${this._token}`;
    return axios.get<Stats>(url).then((res) => res.data);
  }
}
