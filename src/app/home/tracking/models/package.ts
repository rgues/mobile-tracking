export class Package {

  PACKAGE_ID ?: number;
  AGENCE_ID: number;
  TYPE_ID: number;
  CLIENT_ID: number;
  PACKAGE_CODE: string;
  PACKAGE_LABEL: string;
  PACKAGE_DESCRIPTION: string;
  PACKAGE_WEIGHT: number;
  PACKAGE_VOLUME: any;
  PACKAGE_SHIPPING_DATE: string;
  PACKAGE_RECEPTION_DATE: string;
  PACKAGE_ARRIVAL_ESTIMATION_DATE: string;
  PACKAGE_DESTINATION_CITY: string;
  PACKAGE_START_CITY: string;
  RECEIVER_NAME: string;
  RECEIVER_LAST_NAME: string;
  RECEIVER_PHONE_NUMBER: string;
  SENDER_NAME: string;
  SENDER_FIRST_NAME: string;
  SENDER_PHONE_NUMBER ?: string;
  DATE_TIME: string;
  CONFIRM ?: number;
  PREFIX_SENDER_PHONE ?: number;
  PREFIX_RECEIVER_PHONE: number;
  created_at?: string;
  updated_at?: string;
}
