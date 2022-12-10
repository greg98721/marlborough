import { PlainDate } from "./timetableFlight";

export interface Customer {
    firstName: string;
    lastName: string;
    birthDate: PlainDate;
    address: string;
    email: string | undefined;
    customerCode: string;
}
