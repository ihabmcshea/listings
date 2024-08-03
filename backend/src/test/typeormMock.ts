export const mockRepository = {
  findAndCount: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  leftJoinAndMapMany: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  setParameters: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  getRawAndEntities: jest.fn(),
  getRawOne: jest.fn(),
};
jest.mock("typeorm", () => {
  return {
    getRepository: () => mockRepository,
    PrimaryGeneratedColumn: () => {},
    Column: () => {},
    Index: () => {},
    OneToMany: () => {},
    ManyToOne: () => {},
    CreateDateColumn: () => {},
    UpdateDateColumn: () => {},
    JoinColumn: () => {},
    Entity: () => {},
  };
});
