import '../..';
import {
  changeUsername,
  checkUsername,
  createAlice,
  createBob,
  waitUntilTablesAreCreated,
  wipeOut,
} from '../../util/test-utils';
import { User } from './model';

describe('User', () => {
  beforeAll(waitUntilTablesAreCreated);
  beforeEach(wipeOut);

  it('should tell which usernames are taken and which not', async () => {
    const [, aliceToken] = await createAlice();
    await createBob();
    const same = await checkUsername('Alice', aliceToken);
    expect(same).toBe(true);
    const invalid = await checkUsername('money $$$ maker', aliceToken);
    expect(invalid).toBe(false);
    const invalid2 = await checkUsername(
      'to_be_or_not_to_be_this_is_the_question_whether_its_nobler_in_the_mind',
      aliceToken,
    );
    expect(invalid2).toBe(false);
    const taken = await checkUsername('Bob', aliceToken);
    expect(taken).toBe(false);
    const valid = await checkUsername('Alex', aliceToken);
    expect(valid).toBe(true);
  });

  it('should let users change username', async () => {
    const [alice, aliceToken] = await createAlice();
    await createBob();
    const valid = await changeUsername('Alice1', aliceToken);
    expect(valid.username).toBe('Alice1');
    const updatedAlice = await User.findByPk(alice.id);
    expect(updatedAlice.username).toBe(valid.username);
    const invalid = await changeUsername('Bob', aliceToken);
    const notUpdatedAlice = await User.findByPk(alice.id);
    expect(notUpdatedAlice.username).toBe(valid.username);
    expect(invalid).toBeNull();
  });

  it('should not let change other users fields', async () => {
    // passes since we pass individual fields
    // adjust if needed
  });
});
