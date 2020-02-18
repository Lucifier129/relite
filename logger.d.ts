export declare type LoggerOptions = {
    name?: string;
    filter?: Filter;
};
export declare type Filter = (data: DraftData) => DraftData;
export interface DraftData {
    actionType: string;
    actionPayload: any;
    previousState: object;
    currentState: object;
    start: Date;
    end: Date;
}
export default function createLogger(customeOptions?: LoggerOptions): (data: DraftData) => void;
