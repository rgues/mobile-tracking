import { Package } from "./package";

export class PackageListReponse {

  message: string;
  liste_avoir: Array<{avoir:Package}>
}
