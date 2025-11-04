import { Test, TestingModule } from '@nestjs/testing';
import { TransactionFinderService } from './transaction-finder.service';
import { DrizzleAsyncProvider } from 'src/db/drizzle/drizzle.provider';
import { UserAccountService } from 'src/user-account/user-account.service';
import { createMockDb } from '../../../__mock__/helpers/mockDb.helper';
import { NotFoundException } from '@nestjs/common';
import * as schema from 'src/db/schema';

describe('TransactionFinderService', () => {
  let service: TransactionFinderService;
  let mockDb: any;
  let mockUserAccountService: any;

  // Définition d'un mock robuste pour les méthodes de chaînage Drizzle
  const mockDrizzleChain = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    // get() est la méthode pour récupérer le résultat dans Drizzle
    get: jest.fn(), 
    // getMany() est la méthode pour récupérer une liste de résultats dans Drizzle
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    // createMockDb doit retourner l'objet mock chainé pour Drizzle
    mockDb = createMockDb();
    
    // Assurez-vous que mockDb.select, .from, etc. retournent le mockDrizzleChain
    Object.assign(mockDb, mockDrizzleChain);
    
    // Réinitialisation de l'état des mocks avant chaque test
    jest.clearAllMocks();
    
    // Réinitialisation des retours des méthodes de chaînage pour être configurées dans les tests
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.leftJoin.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.offset.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.get.mockClear();
    mockDb.getMany.mockClear();

    mockUserAccountService = {
      findOneByUserId: jest.fn().mockResolvedValue({ id: 'user-account-id', amount: 1000 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionFinderService,
        {
          provide: DrizzleAsyncProvider,
          useValue: mockDb,
        },
        {
          provide: UserAccountService,
          useValue: mockUserAccountService,
        },
      ],
    }).compile();

    service = module.get<TransactionFinderService>(TransactionFinderService);
    // Ensure mock is present on the instance in case DI token mismatch occurs
    (service as any).userAccountService = mockUserAccountService;
    (service as any).db = mockDb;
  });

  afterEach(() => {
    // Si vous utilisez jest.clearAllMocks() dans beforeEach, afterEach n'est pas strictement nécessaire ici.
    // Mais on le garde par précaution si vous l'utilisez ailleurs dans le projet.
  });

  describe('getUserAccount', () => {
    it('should return user account when it exists', async () => {
      const result = await (service as any).getUserAccount('user-id');
      expect(result).toEqual({ id: 'user-account-id', amount: 1000 });
      expect(mockUserAccountService.findOneByUserId).toHaveBeenCalledWith('user-id');
    });

    it('should throw NotFoundException when user account not found', async () => {
      // Correction : utiliser undefined à la place de null pour une meilleure conformité des types TypeScript
      mockUserAccountService.findOneByUserId.mockResolvedValueOnce(undefined); 
      
      await expect((service as any).getUserAccount('user-id'))
        .rejects
        .toThrow(new NotFoundException('User account not found'));
    });
  });

  describe('findAll', () => {
    it('should return paginated transactions', async () => {
      // Les mocks de chaînage sont déjà configurés dans beforeEach, pas besoin de les répéter ici.
      
      const mockTransactions = [
        {
          transaction: { id: 'tx-1', amount: 100, categoryId: 'category-1' },
          category: { id: 'category-1', name: 'Category 1' }
        },
        {
          transaction: { id: 'tx-2', amount: 200, categoryId: 'category-2' },
          category: { id: 'category-2', name: 'Category 2' }
        }
      ];

      const mockCount = [{ count: 2 }];

      // Configuration des retours pour les deux requêtes de Promise.all
      // Note : La première requête (transactions) devrait utiliser .getMany()
      // La seconde requête (count) devrait probablement utiliser .get() ou .execute() selon l'implémentation Drizzle.
      // Dans ce mock, nous allons simuler le comportement de Promise.all:
      
      jest.spyOn(Promise, 'all').mockImplementation(() => {
        // Le premier élément est la liste des transactions, le second est le count
        return Promise.resolve([mockTransactions, mockCount]) as any;
      });

      const result = await service.findAll('user-id', 10, 0);
      
      expect(result).toEqual({
        data: expect.any(Array),
        limit: 10,
        page: 0,
        total: 2,
        lastPage: 0
      });

      expect(result.data.length).toBe(2);
      expect(result.data[0].id).toBe('tx-1');
      expect(result.data[0].categoryId).toBe('category-1');
      
      // On s'attend à ce que les méthodes de Drizzle aient été appelées pour les deux requêtes (transactions et count)
      // Le mockDb représente l'objet Drizzle.
      // Il est probable que le service appelle .select() une fois, puis exécute deux chemins de requêtes distincts.
      // Pour ce test, l'important est de vérifier que Promise.all a été appelé et a résolu correctement les données.
      expect(mockDb.select).toHaveBeenCalledTimes(2);
      expect(mockDb.from).toHaveBeenCalledTimes(2);
      expect(mockDb.where).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAllByCategoryId', () => {
    it('should return transactions filtered by category', async () => {
      // Pour une recherche simple qui retourne des transactions
      mockDb.getMany.mockResolvedValue([]);

      await service.findAllByCategoryId('category-id', 'user-id');
      
      expect(mockUserAccountService.findOneByUserId).toHaveBeenCalledWith('user-id');
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.transactions);
      expect(mockDb.where).toHaveBeenCalled();
    });

    it('should include startDate in where condition when provided', async () => {
      // Pour une recherche simple qui retourne des transactions
      mockDb.getMany.mockResolvedValue([]);

      const startDate = new Date('2025-01-01');
      await service.findAllByCategoryId('category-id', 'user-id', startDate);
      
      expect(mockUserAccountService.findOneByUserId).toHaveBeenCalledWith('user-id');
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalledWith(schema.transactions);
      expect(mockDb.where).toHaveBeenCalled();
      // On pourrait ajouter un test plus précis sur le contenu de mockDb.where
    });
  });

  describe('findOne', () => {
    it('should return a transaction with category when found', async () => {
      const mockResult = [
        {
          transaction: { id: 'tx-1', amount: 100, categoryId: 'category-1' },
          category: { id: 'category-1', name: 'Category 1' }
        }
      ];

      // Le service attend la promesse sur l'appel chainé (après .limit(1))
      mockDb.limit.mockResolvedValue(mockResult);

      const result = await service.findOne('tx-1', 'user-id');
      
      expect(result.id).toBe('tx-1');
      expect(result.categoryId).toBe('category-1');
      
      expect(mockUserAccountService.findOneByUserId).toHaveBeenCalledWith('user-id');
      expect(mockDb.select).toHaveBeenCalled();
      expect(mockDb.from).toHaveBeenCalled();
      expect(mockDb.leftJoin).toHaveBeenCalled();
      expect(mockDb.where).toHaveBeenCalled();
      expect(mockDb.limit).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when transaction not found', async () => {
      // La requête retourne un tableau vide via .limit(1)
      mockDb.limit.mockResolvedValue([]);

      await expect(service.findOne('tx-1', 'user-id'))
        .rejects
        .toThrow(new NotFoundException('Transaction not found'));
    });
  });
});
