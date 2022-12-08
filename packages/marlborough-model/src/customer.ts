import { PlainDate } from "./scheduleFlight";

export interface Customer {
    firstName: string;
    lastName: string;
    birthDate: PlainDate;
    address: string;
    email: string | undefined;
    customerCode: string;
}