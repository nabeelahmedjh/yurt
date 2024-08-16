import multer from 'multer'


function multerErrorHandler(err, req, res, next) 
{
    if (err instanceof multer.MulterError) {
        let errorMessage;
        switch (err.code) {
            case 'LIMIT_PART_COUNT':
                errorMessage = "Too many parts in the request.";
                break;
            case 'LIMIT_FILE_SIZE':
                errorMessage = "One or more files are too large.";
                break;
            case 'LIMIT_FILE_COUNT':
                errorMessage = "Too many files uploaded. Maximum allowed is 5.";
                break;
            case 'LIMIT_FIELD_KEY':
                errorMessage = "Field name is too long.";
                break;
            case 'LIMIT_FIELD_VALUE':
                errorMessage = "Field value is too long.";
                break;
            case 'LIMIT_FIELD_COUNT':
                errorMessage = "Too many fields in the request.";
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                errorMessage = `Unexpected file field "${err.field}". Expected field is "attachment".`;
                break;
            case 'MISSING_FIELD_NAME':
                errorMessage = "Field name is missing.";
                break;
            default:
                errorMessage = "An error occurred during file upload.";
                break;
        }

        return res.status(400).json({
            error: errorMessage,
            details: err
        });
    } else if (err) {
        
        return res.status(500).json({
            error: "An unknown error occurred.",
            details: err.message
        });
    }
    next();
}

 
export default  multerErrorHandler;