const validate= (schema) => {
    return (req, res, next)=> {
        const {error, value}= schema.validate (req.body, {aboutEarly: false});
        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details.map((detail) => detail.message).join(', ')
            });
        }
        req.body = value;
        next();
    };
    };
    module.exports = validate;