import * as yup from 'yup';

const nameRegex = /^[a-zA-Z0-9 $._#&|()\[\]%-]*$/;

export const successFeeValidation = yup
  .number()
  .typeError('service:edit.validation.success-fee-range')
  .required('error:error.required')
  .test('integer', 'service:edit.validation.success-fee-range', (v) =>
    Number.isInteger(v),
  )
  .test(
    'range',
    'service:edit.validation.success-fee-range',
    (v) => !v || (v >= 10 && v < 75),
  );

export const serviceNameValidation = yup
  .string()
  .required('error:error.required')
  .matches(nameRegex, 'common:validation.invalid-characters')
  .min(5, 'service:edit.validation.name-length')
  .max(50, 'service:edit.validation.name-length');

export const EditServiceValidation = yup
  .object({
    name: serviceNameValidation,
    successFee: successFeeValidation,
    // maximumSbt: yup
    //   .number()
    //   .typeError('error:error.required')
    //   .required('error:error.required')
    //   .positive('common:validation.negative-zeroable-amount'),
  })
  .required();
