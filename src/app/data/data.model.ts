export interface Entry {
    _id: string;
    index: number;
    guid: string;
    isActive: boolean;
    balance: string;
    picture: string;
    age: number;
    eyeColor: string;
    name: {
        first: string,
        last: string
    };
    company: string;
    email: string;
    phone: string;
    address: string;
}

export type Data = Entry[];