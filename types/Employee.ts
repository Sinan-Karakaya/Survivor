export interface Employee {
    id: number;
    name: string;
    surname: string;
    email: string;
}

export interface EmployeeFull {
    id: number;
    name: string;
    surname: string;
    email: string;
    birth_date: string;
    gender: string;
    work: string;
    subordinates: Array<number>
}