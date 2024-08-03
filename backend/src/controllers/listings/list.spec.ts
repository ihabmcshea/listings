import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { CustomError } from 'utils/response/custom-error/CustomError';

import { showListings } from './list';

jest.mock('typeorm', () => ({
  getRepository: jest.fn(),
  PrimaryGeneratedColumn: () => {},
  Column: () => {},
  Index: () => {},
  OneToMany: () => {},
  ManyToOne: () => {},
  CreateDateColumn: () => {},
  UpdateDateColumn: () => {},
  JoinColumn: () => {},
  Entity: () => {},
}));

describe('list', () => {
  describe('showListings', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;
    let mockRepository: any;

    beforeEach(() => {
      res = {
        customSuccess: jest.fn(),
      };

      next = jest.fn();

      mockRepository = {
        findAndCount: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnThis(),
          leftJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          addOrderBy: jest.fn().mockReturnThis(),
          innerJoin: jest.fn().mockReturnThis(),
          setParameters: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          getRawAndEntities: jest.fn(),
          getRawOne: jest.fn(),
        }),
      };

      (getRepository as jest.Mock).mockReturnValue(mockRepository);
    });

    it('should handle city search with pagination', async () => {
      req = {
        query: {
          city: '1',
        },
      };
      mockRepository.findAndCount.mockResolvedValue([
        [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            photos: [],
            user: {},
            city: {},
          },
        ],
        1,
      ]);

      await showListings(req as Request, res as Response, next);

      expect(res.customSuccess).toHaveBeenCalledWith(200, 'Listings retrieved', {
        total: 1,
        listings: [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            photos: [],
            user: {},
            city: {},
          },
        ],
        page: 1,
        pages: 1,
        limit: 10,
      });
    });

    it('should handle coordinate search with pagination', async () => {
      req = {
        query: {
          long: '73.935242',
          lat: '40.73061',
          radius: '5',
          page: '1',
        },
      };
      // Mocking the expected return values for the query
      mockRepository.createQueryBuilder().getRawAndEntities.mockResolvedValue({
        raw: [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            coordinates: 'POINT(73.935242 40.73061)',
            distance: 5000,
            'user.name': 'User 1',
            'user.description': 'User Desc 1',
            'city.name': 'City 1',
            'photo.id': 1,
            'photo.url': 'photo1.jpg',
          },
        ],
        entities: [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            photos: [],
            user: { name: 'User 1', description: 'User Desc 1' },
            city: { name: 'City 1' },
            coordinates: 'POINT(73.935242 40.73061)',
          },
        ],
      });
      mockRepository.createQueryBuilder().getRawOne.mockResolvedValue({ count: 1 });

      await showListings(req as Request, res as Response, next);

      expect(res.customSuccess).toHaveBeenCalledWith(200, 'Listings retrieved', {
        total: 1,
        listings: [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            photos: [],
            user: { name: 'User 1', description: 'User Desc 1' },
            city: { name: 'City 1' },
            coordinates: 'POINT(73.935242 40.73061)',
            distance: 5,
          },
        ],
        page: 1,
        pages: 1,
        limit: 10,
      });
    });

    it('should handle search with no filters', async () => {
      req.body = { page: 1 };

      mockRepository.findAndCount.mockResolvedValue([
        [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            photos: [],
            user: {},
            city: {},
          },
        ],
        1,
      ]);

      await showListings(req as Request, res as Response, next);

      console.log('Called res.customSuccess:', res.customSuccess); // Debugging line

      expect(res.customSuccess).toHaveBeenCalledWith(200, 'Listings retrieved', {
        total: 1,
        listings: [
          {
            id: 1,
            title: 'Listing 1',
            description: 'Desc 1',
            photos: [],
            user: {},
            city: {},
          },
        ],
        page: 1,
        pages: 1,
        limit: 10,
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      mockRepository.findAndCount.mockRejectedValue(error);

      await showListings(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(CustomError));
    });
  });
});
