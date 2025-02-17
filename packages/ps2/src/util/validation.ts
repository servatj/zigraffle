import * as yup from 'yup';
import BigNumber from 'bignumber.js';

export const decimalsValidation = (maxDecimals: number) =>
  yup.string().test('int', 'common:validation.max-decimals', (val) => {
    // will be checked by .required()
    if (!val) return true;

    const splitValueDot = val.split('.');
    // Handle incorrect number
    if (splitValueDot.length > 2) return false;

    const decimals = splitValueDot.length === 1 ? 0 : splitValueDot[1].length;

    return decimals <= maxDecimals;
  });

const inputAmountNumberValidation = yup
  .string()
  .required('common:validation.invalid-amount')
  .test('int', 'common:validation.invalid-value', (val) => {
    return String(val)[String(val).length - 1] !== '.';
  })
  .test('max', 'common:validation.invalid-value', function (val) {
    return !new BigNumber(val).isNaN();
  });

const inputAmountNumberValidationGt0 = inputAmountNumberValidation.test(
  'min',
  'common:validation.negative-amount',
  function (val) {
    return new BigNumber(val).gt(0);
  },
);

const inputAmountNumberValidationGte0 = inputAmountNumberValidation.test(
  'min',
  'common:validation.negative-zeroable-amount',
  function (val) {
    return new BigNumber(val).gte(0);
  },
);

const inputAmountNumberValidationMaxToken = inputAmountNumberValidationGt0.test(
  'number',
  'common:validation.insufficient-amount',
  function (val) {
    const tokenBalance = new BigNumber(this.parent?.token?.balance);
    const currentValue = new BigNumber(val);
    return !currentValue.isGreaterThan(tokenBalance);
  },
);

const inputAmountNumberValidationMinToken = inputAmountNumberValidationGt0.test(
  'number',
  'common:validation.insufficient-amount-min',
  function (val) {
    const minValue = new BigNumber(this.parent?.token?.min);
    const currentValue = new BigNumber(val);
    return !currentValue.isLessThan(minValue);
  },
);

export const inputAmountTokenValidation = yup.object().shape({
  value: inputAmountNumberValidationGt0,
});

export const inputAmountZeroableValidation = yup.object().shape({
  value: inputAmountNumberValidationGte0,
});

export const inputAmountTokenMaxValidation = yup.object().shape({
  value: inputAmountNumberValidationMaxToken,
});

export const inputAmountTokenMinValidation = yup.object().shape({
  value: inputAmountNumberValidationMinToken,
});

export const inputAmountTokenDecimalsValidation = yup.object().shape({
  value: decimalsValidation(8),
});
