import AppError from "../utils/AppError";

const UNIQUE_MESSAGES = {
    users_email_key: 'Email already in use',
    users_username_key: 'Username already taken',
};

function normalizeError(err){
    if (err instanceof AppError) return err;

    if (err.type === 'entity.parse.failed') return new AppError(400, 'Invalid JSON in request body');
    if (err.type === 'entitty.too.large') return new AppError(413, 'Request body too large');

    switch (err.code){
        case '23505': //unique_violation
            return new AppError(409, UNIQUE_MESSAGES[err.constraint] || 'Resource already exists');
        case '23503': //foreign_key_violation
            return new AppError(409, 'Related resource does not exist');
        case'23514': //check_violation
            return new AppError(400, 'Value not allowed');
        case '22P02': //invalid_text_representation
        case '22007': //invalid_datetime_format
            return new AppError(400, 'Invalid input format');
    }
    return null;
}

export const notFound = (req, res) => {
    res.status(404).json({ message: 'Not found' });
}

export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) return next(err);

    const known = normalizeError(err);
    if(known) {
        return res.status(known.statusCode).json({ message: known.message });
    }

    console.error(err);
    res.status(500).json({ message: 'Something went wrong'});
}