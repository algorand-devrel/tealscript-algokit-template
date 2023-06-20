import {
  describe, test, expect, beforeAll,
} from '@jest/globals';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk from 'algosdk';
import { algodClient, kmdClient } from './common';
import { MyAppClient } from '../contracts/clients/MyApp';

let myApp: MyAppClient;

describe('MyApp', () => {
  beforeAll(async () => {
    const sender = algosdk.generateAccount();

    await algokit.ensureFunded(
      {
        accountToFund: sender,
        minSpendingBalance: algokit.algos(1),
      },
      algodClient,
      kmdClient,
    );

    myApp = new MyAppClient(
      {
        sender: { signer: algosdk.makeBasicAccountTransactionSigner(sender), addr: sender.addr },
        resolveBy: 'id',
        id: 0,
      },
      algodClient,
    );

    await myApp.appClient.create();
  });

  test('sum', async () => {
    const a = 13;
    const b = 37;
    const sum = await myApp.doMath({ a, b, operation: 'sum' });
    expect(sum.return?.valueOf()).toBe(BigInt(a + b));
  });

  test('difference', async () => {
    const a = 13;
    const b = 37;
    const diff = await myApp.doMath({ a, b, operation: 'difference' });
    expect(diff.return?.valueOf()).toBe(BigInt(a >= b ? a - b : b - a));
  });
});
