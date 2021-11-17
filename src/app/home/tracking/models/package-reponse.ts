import { Package } from "./package";
import { PackageHistoryData } from "./package-history-data";
import { PackageStatus } from "./package-status";
import { PaymentDetail } from "./payment-detail";
import { PaymentTotal } from "./payment-total";
import { Remise } from "./remise";


export class PackageReponse {
  message: string;
  tracking_history: Array<PackageHistoryData>;
  final_status: number;
  package_information:Package;
  status_package: PackageStatus;
  payment_total: PaymentTotal;
  detail_payment: PaymentDetail;
  amount_paid: number;
  name_departure_agence: string;
  name_arrival_agence: string;
  format_date_package: Date;
  format_date_arrival_estimation: Date;
  remises: Array<Remise>
  total_remise: number;
}
