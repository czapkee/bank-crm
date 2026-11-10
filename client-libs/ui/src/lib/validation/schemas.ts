import { z } from 'zod'

const emailField = z
  .string()
  .trim()
  .min(1, 'Укажите email')
  .min(3, 'Слишком короткий email')
  .max(254, 'Слишком длинный email')
  .email('Некорректный email')

const passwordField = z
  .string()
  .min(1, 'Укажите пароль')
  .min(8, 'Минимум 8 символов')
  .regex(/[a-z]/, 'Добавьте строчную букву')
  .regex(/[A-Z]/, 'Добавьте заглавную букву')
  .regex(/[0-9]/, 'Добавьте цифру')

const nameField = (requiredMessage: string): z.ZodString =>
  z.string().trim().min(1, requiredMessage).min(2, 'Минимум 2 символа').max(90, 'Максимум 90 символов')

const phoneField = z
  .string()
  .trim()
  .min(1, 'Укажите телефон')
  .min(7, 'Слишком короткий номер')
  .max(20, 'Слишком длинный номер')
  .regex(/^\+?[0-9\s()-]+$/, 'Некорректный номер')

const identifCodeField = z
  .string()
  .trim()
  .min(1, 'Укажите идентификационный номер')
  .min(8, 'Минимум 8 символов')
  .max(14, 'Максимум 14 символов')

const numPassField = z
  .string()
  .trim()
  .min(1, 'Укажите номер паспорта')
  .min(5, 'Минимум 5 символов')
  .max(20, 'Максимум 20 символов')

const codeWordField = z
  .string()
  .trim()
  .min(1, 'Укажите кодовое слово')
  .min(3, 'Минимум 3 символа')
  .max(50, 'Максимум 50 символов')

const addressField = z
  .string()
  .trim()
  .min(1, 'Укажите адрес')
  .min(5, 'Минимум 5 символов')
  .max(200, 'Максимум 200 символов')

const fatherNameField = z.string().trim().max(90, 'Максимум 90 символов')

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Укажите пароль'),
})

export const registerSchema = z
  .object({
    email: emailField,
    password: passwordField,
    confirmationPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.confirmationPassword, {
    path: ['confirmationPassword'],
    message: 'Пароли не совпадают',
  })

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirmation: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.confirmation, {
    path: ['confirmation'],
    message: 'Пароли не совпадают',
  })

export const personBaseSchema = z.object({
  email: emailField,
  surname: nameField('Укажите фамилию'),
  name: nameField('Укажите имя'),
  fatherName: fatherNameField,
  phoneNumber: phoneField,
  identifCode: identifCodeField,
  numPass: numPassField,
  codeWord: codeWordField,
  address: addressField,
  isResident: z.boolean(),
})

export const personEditSchema = personBaseSchema

export const personCreateSchema = personBaseSchema
  .extend({
    password: passwordField,
    confirmationPassword: z.string().min(1, 'Повторите пароль'),
  })
  .refine((values) => values.password === values.confirmationPassword, {
    path: ['confirmationPassword'],
    message: 'Пароли не совпадают',
  })

export const employeeCreateSchema = personBaseSchema.extend({
  role: z.string().min(1, 'Выберите роль'),
})

export const profileSchema = personBaseSchema.omit({ email: true })

const cardNumberField = z
  .string()
  .trim()
  .min(1, 'Укажите номер карты')
  .min(16, 'Минимум 16 символов')
  .max(19, 'Максимум 19 символов')
  .regex(/^[0-9 ]+$/, 'Только цифры и пробелы')

const accountNumberField = z
  .string()
  .trim()
  .min(1, 'Укажите номер счёта')
  .min(13, 'Минимум 13 символов')
  .max(34, 'Максимум 34 символа')

const cardBalanceField = z
  .string()
  .trim()
  .min(1, 'Укажите баланс')
  .regex(/^\d+(\.\d{1,2})?$/, 'Некорректная сумма')

const cardStatusField = z.string().min(1, 'Выберите статус')

const cardDateOfExpireField = z
  .string()
  .min(1, 'Укажите срок действия')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Некорректная дата')

export const cardCreateSchema = z.object({
  cardNumber: cardNumberField,
  accountNumber: accountNumberField,
  dateOfExpire: cardDateOfExpireField,
  balance: cardBalanceField,
  status: cardStatusField,
  userId: z.string({ error: 'Выберите клиента' }).uuid('Выберите клиента'),
})

export const cardEditSchema = z.object({
  accountNumber: accountNumberField,
  dateOfExpire: cardDateOfExpireField,
  balance: cardBalanceField,
  status: cardStatusField,
})

export const paymentSchema = z.object({
  cardId: z.string({ error: 'Выберите карту' }).uuid('Выберите карту'),
  sum: z
    .string()
    .trim()
    .min(1, 'Укажите сумму')
    .regex(/^\d+(\.\d{1,2})?$/, 'Некорректная сумма')
    .refine((value) => Number(value) >= 0.01, 'Сумма должна быть больше нуля'),
  service: z.string().trim().min(1, 'Укажите сервис').min(2, 'Минимум 2 символа').max(120, 'Максимум 120 символов'),
  reference: z.string().min(1, 'Выберите назначение'),
  status: z.string().min(1, 'Выберите статус'),
  dateAndTime: z.string().min(1, 'Укажите дату и время'),
})

export const paymentWriteOffSchema = paymentSchema.omit({ status: true, dateAndTime: true })

export const themeSchema = z.object({
  name: z.string().trim().min(1, 'Укажите название').min(2, 'Минимум 2 символа').max(90, 'Максимум 90 символов'),
  description: z.string().trim().max(500, 'Максимум 500 символов'),
  parentId: z.string().optional(),
})

export const reportSchema = z.object({
  title: z.string().trim().min(1, 'Укажите тему').min(3, 'Минимум 3 символа').max(150, 'Максимум 150 символов'),
  content: z.string().trim().min(1, 'Опишите обращение').min(10, 'Минимум 10 символов').max(5000, 'Максимум 5000 символов'),
  feedbackContact: z.string().trim().max(200, 'Максимум 200 символов'),
  themeId: z.string().optional(),
  feedbackType: z.string().min(1, 'Выберите тип обратной связи'),
})

export const reportEditSchema = reportSchema.extend({
  status: z.string().min(1, 'Выберите статус'),
  priority: z.string().min(1, 'Выберите приоритет'),
  assignedToId: z.string().optional(),
})

export type PersonFormValues = z.infer<typeof personCreateSchema> & { role: string }

export type CardFormValues = z.infer<typeof cardCreateSchema>

export type ReportFormValues = z.infer<typeof reportEditSchema>

export const reportClientSchema = z
  .object({
    parentId: z.string({ error: 'Выберите тему' }).min(1, 'Выберите тему'),
    themeId: z.string().optional(),
    feedbackType: z.string().min(1, 'Выберите тип обратной связи'),
    feedbackContact: z.string().trim().max(200, 'Максимум 200 символов'),
    content: z.string().trim().min(1, 'Опишите обращение').min(10, 'Минимум 10 символов').max(5000, 'Максимум 5000 символов'),
  })
  .superRefine((values, context) => {
    const needsContact = values.feedbackType === 'EMAIL' || values.feedbackType === 'PHONE_NUMBER'

    if (needsContact && values.feedbackContact.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['feedbackContact'],
        message: 'Укажите контакт для обратной связи',
      })
    }

    if (values.feedbackType === 'EMAIL' && values.feedbackContact.length > 0 && !/^\S+@\S+\.\S+$/.test(values.feedbackContact)) {
      context.addIssue({
        code: 'custom',
        path: ['feedbackContact'],
        message: 'Некорректный email',
      })
    }
  })
