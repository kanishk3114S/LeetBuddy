// Custom Error class
// Used whenever something goes wrong in our API.

class ApiError extends Error {

    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {

        // Call the parent Error constructor
        super(message);

        // HTTP Status Code (404, 500, etc.)
        this.statusCode = statusCode;

        // Errors don't return data
        this.data = null;

        // Error message
        this.message = message;

        // Store extra validation/database errors
        this.errors = errors;

        // If a custom stack trace is provided, use it.
        if (stack) {

            this.stack = stack;

        } else {

            // Otherwise generate the stack trace automatically.
            Error.captureStackTrace(this, this.constructor);
        }
    }

}

export { ApiError };