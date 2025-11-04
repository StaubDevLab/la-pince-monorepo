import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

// Mock complet du TransactionsService pour isoler le contrôleur
const mockTransactionsService = {
  create: jest.fn().mockResolvedValue({}),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
  findAllByCategoryId: jest.fn().mockResolvedValue([]), // Nécessaire pour les tests de BudgetService
};

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: mockTransactionsService, // Utiliser le mock pour éviter les dépendances
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
