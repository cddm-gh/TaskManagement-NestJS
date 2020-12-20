import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

describe('User Entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.password = 'TestPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });
  describe('validatePassword', () => {
    it('returns true if password is valid', async () => {
      bcrypt.hash.mockReturnValue('TestPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword(user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toEqual(true);
    });
    it('returns false if password is invalid', async () => {
      bcrypt.hash.mockReturnValue('TestWrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword(user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toEqual(false);
    });
  });
});
