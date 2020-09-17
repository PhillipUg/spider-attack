import Userdetails from '../src/modules/scoreBoard';

describe('checks scores on score class object', () => {
  const user = new Userdetails();

  test('it checks the right user name input', () => {
    expect(user.setUser('mike')).toEqual('mike');
  });

  test('it checks that score is accurate', () => {
    expect(user.getScore()).toEqual(0);
  });

  test('it increases the score of user', () => {
    user.increaseScore();
    expect(user.getScore()).toEqual(50);
  });
});
