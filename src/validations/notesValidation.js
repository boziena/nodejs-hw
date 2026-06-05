import { Joi, Segments } from 'celebrate';
// перевірка ID
import { isValidObjectId } from 'mongoose';
import { TAGS } from '../constants/tags.js';

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required().messages({
      'string.base': 'Title must be a string',
      'string.min': 'Title should have at least {#limit} characters',
      'string.max': 'Title should have at most {#limit} characters',
      'any.required': 'Title is required',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
      'string.min': 'Content should have at least {#limit} characters',
      'string.max': 'Content should have at most {#limit} characters',
    }),
    tag: Joi.string()
      .valid(...TAGS)
      .messages({
        'string.base': 'Tag must be a string',
        'any.only':
          'Tag must be one of: Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo',
      }),
  }),
};

// валідатор для Id
const objectIdValidator = (value, helpers) => {
  return !isValidObjectId(value) ? helpers.message('Invalid id format') : value;
};

// Схема перевірки Id
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().allow(''),
    tag: Joi.string().valid(...TAGS),
    // не дозволяємо порожнє тіло
  })
    .min(1)
    .unknown(false),
};

// Валідація-Пагінація
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().allow(''),
  }),
};
