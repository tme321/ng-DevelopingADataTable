export interface Column {
    title: string;
    path: string;
}

export interface TrackedColumn extends Column {
    id: number;
}