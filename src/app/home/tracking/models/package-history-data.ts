interface Avoir {
  id: number;
  STATUS_ID: number;
  PACKAGE_ID: number;
  STATUS_DESCRIPTION: string;
  DATE_TIME: Date;
  CHECK_OUT: 0;
  created_at: Date;
  updated_at: Date;
  AGENCE_ID: 3;
  CITY_ID: 6;
  AGENCE_NAME: string;
  AGENCE_LOCALISATION: string;
  PACKAGE_LABEL: string;
  PACKAGE_DESTINATION_CITY: string;
  TYPE_LABEL: string;
  STATUS_LABEL: string;
}

interface AgenceDestination {
  AGENCE_ID: number;
  CITY_ID: number;
  AGENCE_NAME: string;
  AGENCE_LOCALISATION: string;
  created_at: Date;
  updated_at: Date;
}

export class PackageHistoryData {
  avoir: Avoir;
  agence_destination: AgenceDestination;
}
