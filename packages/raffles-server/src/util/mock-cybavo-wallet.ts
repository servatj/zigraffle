import { User } from '../entities/users/model';
import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../cybavo';
export const mock = new MockAdapter(axiosInstance, {
  onNoMatch: 'throwException',
});

const randomString = (len: number) =>
  Math.random()
    .toString(36)
    .substring(2, len + 2);

export type MockedCybavo = {
  balance: number;
  setBalance: (b: number) => void;
};

const mockCybavoWallet = (user: User, initialBalance = 0): MockedCybavo => {
  let balance = initialBalance;

  const setBalance = (b: number) => {
    balance = b;
  };

  // Mock balance
  mock.onGet(`/balance/all/${user.publicAddress}`).reply(() => {
    return [
      200,
      {
        ZIG: {
          balance: balance.toString(),
        },
      },
    ];
  });

  // Mock internal transfers
  mock
    .onPost('/transfer/internal', {
      asymmetricMatch: (actual: any) => actual.user_id === user.publicAddress,
    })
    .reply((config) => {
      const { amount } = JSON.parse(config.data);
      if (balance - parseFloat(amount) < 0) {
        return [
          400,
          {
            error: 'Balance is not enough',
          },
        ];
      }
      balance -= parseFloat(amount);
      return [200, { transaction_id: randomString(8) }];
    });

  mock
    .onPost('/transfer/internal', {
      asymmetricMatch: (actual: any) =>
        actual.to_user_id === user.publicAddress,
    })
    .reply((config) => {
      const { amount } = JSON.parse(config.data);
      balance += parseFloat(amount);
      return [200, { transaction_id: randomString(8) }];
    });

  return { balance, setBalance };
};

export default mockCybavoWallet;
