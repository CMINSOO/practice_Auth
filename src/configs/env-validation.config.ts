import Joi from "joi";

export const configModuleValidationSchema = Joi.object({
    DB_USERNAME: Joi.string().required(),
    DB_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_SYNC: Joi.boolean().required(),
})