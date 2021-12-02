import { StatusCodes } from 'http-status-codes';

export class HttpException extends Error {
    name = 'HttpException';
    constructor(message: string, public status: number = StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message);
    }
}
