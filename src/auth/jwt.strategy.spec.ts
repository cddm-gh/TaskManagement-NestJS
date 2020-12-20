import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { JwtStrategy } from './jwt.strategy';
import { UnauthorizedException } from '@nestjs/common';
import { User } from './user.entity';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});
describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [JwtStrategy, { provide: UserRepository, useFactory: mockUserRepository }],
    }).compile();
    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('returns the user', async () => {
      const user = new User();
      user.username = 'TestUser';
      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
      expect(result).toEqual(user);
    });

    it('throws Unauthorized Exception as the user does not exists', async () => {
      userRepository.findOne.mockResolvedValue(null);
      await expect(jwtStrategy.validate({ username: 'Test' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
