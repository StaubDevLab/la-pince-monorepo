import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetchWithAuth = vi.fn()
const mockAuth = vi.fn()
const mockRevalidateTag = vi.fn()

vi.mock('@/lib/fetch-with-auth', () => ({ fetchWithAuth: (...a: unknown[]) => mockFetchWithAuth(...a) }))
vi.mock('@/auth', () => ({ auth: (...a: unknown[]) => mockAuth(...a) }))
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => mockRevalidateTag(...a) }))

import {
  getTransactionsForUser,
  revalidateUserTransactionsCache,
  createTransaction,
  deleteTransaction,
  updateTransaction,
  stopRecurringTransaction,
} from '@/actions/transactions.actions'

// helpers
const successResp = <T>(data: T) => ({ success: true as const, data })
const failResp = (error?: string) => ({ success: false as const, error })

describe('transactions.actions', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    mockAuth.mockResolvedValue({ user: { id: 'u1' } })
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('getTransactionsForUser', () => {
    it('returns unauthorized without session', async () => {
      mockAuth.mockResolvedValueOnce(null)
      const res = await getTransactionsForUser()
      expect(res.success).toBe(false)
      expect(res.error).toContain('Non autorisé')
    })

    it('returns data and maps dates on success', async () => {
      const apiData = {
        data: [
          {
            id: 't1',
            amount: 10,
            userAccountId: 'acc',
            transactionType: 1,
            description: null,
            categoryId: 'c1',
            isRecurring: false,
            recurringFrequency: null,
            recurringStartDate: null,
            recurringEndDate: null,
            isDeleted: false,
            isOrphaned: false,
            date: '2025-01-02T00:00:00.000Z',
            createdAt: '2025-01-02T00:00:00.000Z',
            updatedAt: '2025-01-02T00:00:00.000Z',
            category: { id: 'c1', name: 'Cat', color: '#fff', icon: 'i' },
          },
        ],
        limit: 10,
        page: 1,
        total: 1,
      }
      mockFetchWithAuth.mockResolvedValueOnce(successResp(apiData))
      const res = await getTransactionsForUser(10, 1)
      expect(res.success).toBe(true)
      expect(res.data?.data[0].id).toBe('t1')
      expect(res.data?.data[0].date instanceof Date).toBe(true)
      expect(res.data?.total).toBe(1)
    })

    it('returns failure on fetch error', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('boom'))
      const res = await getTransactionsForUser()
      expect(res.success).toBe(false)
      expect(res.error).toBe('boom')
    })
  })

  describe('revalidateUserTransactionsCache', () => {
    it('unauthorized without user', async () => {
      mockAuth.mockResolvedValueOnce(null)
      const res = await revalidateUserTransactionsCache()
      expect(res.success).toBe(false)
      expect(mockRevalidateTag).not.toHaveBeenCalled()
    })

    it('revalidates tags when authenticated', async () => {
      const res = await revalidateUserTransactionsCache()
      expect(res.success).toBe(true)
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions')
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions-user-u1')
    })
  })

  describe('mutations', () => {
    it('createTransaction success and revalidates', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(successResp({ totalUserAccountAmount: 42 }))
      const res = await createTransaction({
        amount: 10,
        transactionType: 1,
        description: 'd',
        categoryId: 'c1',
        date: '2025-01-02T00:00:00.000Z',
      })
      expect(res).toEqual({ success: true, data: { amount: 42 }, message: 'Transaction créée.' })
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions')
    })

    it('createTransaction failure', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('bad'))
      const res = await createTransaction({
        amount: 10,
        transactionType: 1,
        description: 'd',
        categoryId: 'c1',
        date: '2025-01-02T00:00:00.000Z',
      })
      expect(res.success).toBe(false)
      expect(res.error).toBe('bad')
    })

    it('deleteTransaction success calls revalidate cache', async () => {
      mockFetchWithAuth.mockResolvedValueOnce({ success: true })
      const res = await deleteTransaction('t1')
      expect(res.success).toBe(true)
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions')
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions-user-u1')
    })

    it('deleteTransaction failure', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('nope'))
      const res = await deleteTransaction('t1')
      expect(res.success).toBe(false)
      expect(res.error).toBe('nope')
    })

    it('updateTransaction success calls revalidate cache', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(successResp({ totalUserAccountAmount: 77 }))
      const res = await updateTransaction('t1', {
        amount: 11,
        transactionType: 1,
        description: 'u',
        categoryId: 'c1',
        date: '2025-01-02T00:00:00.000Z',
      })
      expect(res).toEqual({ success: true, data: { amount: 77 }, message: 'Transaction modifiée avec succès' })
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions')
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions-user-u1')
    })

    it('updateTransaction failure', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp())
      const res = await updateTransaction('t1', {
        amount: 11,
        transactionType: 1,
        description: 'u',
        categoryId: 'c1',
        date: '2025-01-02T00:00:00.000Z',
      })
      expect(res.success).toBe(false)
      expect(res.error).toBe('Erreur inconnue')
    })

    it('stopRecurringTransaction success', async () => {
      mockFetchWithAuth.mockResolvedValueOnce({ success: true })
      const res = await stopRecurringTransaction('t9')
      expect(res.success).toBe(true)
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions')
      expect(mockRevalidateTag).toHaveBeenCalledWith('transactions-user-u1')
    })

    it('stopRecurringTransaction failure', async () => {
      mockFetchWithAuth.mockResolvedValueOnce({ success: false, error: 'err' })
      const res = await stopRecurringTransaction('t9')
      expect(res.success).toBe(false)
      expect(res.error).toBe('err')
    })
  })
})
