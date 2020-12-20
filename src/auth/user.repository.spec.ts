import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
import { TypeOrmEnumErrors } from '../shared/enums/typeorm-errors.enum';
import { InternalServerErrorException } from '@nestjs/common/exceptions';

const mockCredentialsDto = { username: 'TestUsername', password: 'TestPassword' };

describe('UserRepository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('signUp', () => {
    const save = jest.fn();
    beforeEach(() => {
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('successfully signs up the user', async () => {
      save.mockResolvedValue(undefined);
      await expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it('throws a conflict exception on create as username already exist', async () => {
      save.mockRejectedValue({ code: TypeOrmEnumErrors.ON_DUPLICATE });
      await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(ConflictException);
    });

    it('throws an internal server exception on create as username already exist', async () => {
      save.mockRejectedValue({ code: '123' });
      await expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'TestUsername';
      user.password = 'TestPassword';
      user.validatePassword = jest.fn();
    });

    it('returns the username as validation is successful', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(result).toEqual('TestUsername');
    });

    it('returns null as user cannot be found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('returns null as password is invalid', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockReturnValue(false);
      const result = await userRepository.validateUserPassword(mockCredentialsDto);
      expect(user.validatePassword).toHaveBeenCalledWith(user.password);
      expect(result).toBeNull();
    });
  });

  describe('hashPassword', () => {
    it('calls bcrypt.hash to generate a hash', async () => {
      bcrypt.hash = jest.fn().mockReturnValue('testHash');
      const testPassword = 'testPassword';
      const testSalt = 'testSalt';
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.hashPassword(testPassword, testSalt);
      expect(bcrypt.hash).toHaveBeenCalledWith(testPassword, testSalt);
      expect(result).toEqual('testHash');
    });
  });
});
