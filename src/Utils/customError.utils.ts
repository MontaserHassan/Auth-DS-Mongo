class CustomError extends Error {
    path: string;
    statusCode: number;

    constructor(path: string, message: string, statusCode: number) {
        super(message);
        this.path = path;
        this.statusCode = statusCode;
    }
};



export default CustomError;