import {
  ForbiddenException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { ShareLinkEntity, NoteEntity } from '@common/database/entities';

import { SharedLinksService } from '../shared-links.service';

jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  hash: jest.fn().mockResolvedValue('hashed-token'),
  compare: jest.fn(),
}));

describe('SharedLinksService', () => {
  let service: SharedLinksService;
  let noteRepo: jest.Mocked<Repository<NoteEntity>>;
  let sharedLinkRepo: jest.Mocked<Repository<ShareLinkEntity>>;

  const mockNote = {
    id: 'note-id',
    user: { id: 'user-id' },
  } as unknown as NoteEntity;

  const mockLink = {
    id: 'link-id',
    tokenHash: 'hashed-token',
    expiresAt: new Date(Date.now() + 60000),
    isUsed: false,
    note: mockNote,
  } as unknown as ShareLinkEntity;

  beforeEach(async () => {
    sharedLinkRepo = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<ShareLinkEntity>>;

    noteRepo = {
      findOne: jest.fn(),
    } as unknown as jest.Mocked<Repository<NoteEntity>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharedLinksService,
        {
          provide: getRepositoryToken(ShareLinkEntity),
          useValue: sharedLinkRepo,
        },
        {
          provide: getRepositoryToken(NoteEntity),
          useValue: noteRepo,
        },
      ],
    }).compile();

    service = module.get<SharedLinksService>(SharedLinksService);
  });

  describe('create', () => {
    it('should create a share link', async () => {
      noteRepo.findOne.mockResolvedValue(mockNote);
      sharedLinkRepo.save.mockResolvedValue(undefined);

      const result = await service.create('note-id', 'user-id', {
        ttlMinutes: 10,
      });

      expect(result.token).toBeDefined();
      expect(typeof result.token).toBe('string');
      expect(sharedLinkRepo.save).toHaveBeenCalled();
    });

    it('should throw ForbiddenException if note not found or not owned', async () => {
      noteRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create('note-id', 'wrong-user', { ttlMinutes: 10 }),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findPublic', () => {
    it('should return note and mark link as used', async () => {
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);
      sharedLinkRepo.find.mockResolvedValue([mockLink]);
      sharedLinkRepo.save.mockResolvedValue(undefined);

      const result = await service.findPublic('valid-token');

      expect(result).toBe(mockNote);
      expect(sharedLinkRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ isUsed: true }),
      );
    });

    it('should throw GoneException if link is already used', async () => {
      sharedLinkRepo.find.mockResolvedValue([{ ...mockLink, isUsed: true }]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.findPublic('token')).rejects.toThrow(GoneException);
    });

    it('should throw GoneException if link is expired', async () => {
      sharedLinkRepo.find.mockResolvedValue([
        { ...mockLink, expiresAt: new Date(Date.now() - 1000) },
      ]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.findPublic('token')).rejects.toThrow(GoneException);
    });

    it('should throw NotFoundException if token is invalid', async () => {
      sharedLinkRepo.find.mockResolvedValue([mockLink]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.findPublic('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('list', () => {
    it('should return share links for a note', async () => {
      noteRepo.findOne.mockResolvedValue(mockNote);
      sharedLinkRepo.find.mockResolvedValue([mockLink]);

      const result = await service.list('note-id', 'user-id');
      expect(result).toEqual([mockLink]);
    });

    it('should throw ForbiddenException for wrong user', async () => {
      noteRepo.findOne.mockResolvedValue(null);

      await expect(service.list('note-id', 'wrong-user')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('revoke', () => {
    it('should mark share link as used', async () => {
      sharedLinkRepo.findOne.mockResolvedValue(mockLink);
      sharedLinkRepo.save.mockResolvedValue(undefined);

      await service.revoke('note-id', 'link-id', 'user-id');

      expect(sharedLinkRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ isUsed: true }),
      );
    });

    it('should throw ForbiddenException for invalid token or user', async () => {
      sharedLinkRepo.findOne.mockResolvedValue(null);

      await expect(
        service.revoke('note-id', 'invalid-id', 'user-id'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
