import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mocks for external dependencies
const mockFetchWithAuth = vi.fn()
const mockAuth = vi.fn()
const mockRevalidateTag = vi.fn()

vi.mock('@/lib/fetch-with-auth', () => ({
  fetchWithAuth: (...args: unknown[]) => mockFetchWithAuth(...args),
}))

vi.mock('@/auth', () => ({
  auth: (...args: unknown[]) => mockAuth(...args),
}))

vi.mock('next/cache', () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
}))

// Import after mocks
import {
  createBudget,
  deleteBudget,
  updateBudget,
  updateGlobalBudget,
  revalidateUserBudgetsCache,
} from '@/actions/budget.actions'

// Helpers
const successResp = <T>(data: T) => ({ success: true as const, data })
const failResp = (error?: string) => ({ success: false as const, error })

describe('budget.actions', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    mockAuth.mockResolvedValue({ user: { id: 'u1', firstLogin: false } })
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('createBudget', () => {
    it('returns success with amount and revalidates cache on success', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(successResp({ totalUserAccountAmount: 123.45 }))

      const res = await createBudget({
        categoryId: 'cat1',
        totalAmount: 50,
        recurringFrequency: 'monthly',
        recurringStartDate: '2025-01-01',
      })

      expect(res).toEqual({ success: true, data: { amount: 123.45 }, message: 'Budget créé avec succès' })
      // revalidateUserBudgetsCache -> revalidateTag called for 'budget' and user tag
      expect(mockRevalidateTag).toHaveBeenCalledWith('budget')
      expect(mockRevalidateTag).toHaveBeenCalledWith('budgets-user-u1')
    })

    it('returns failure when fetchWithAuth fails', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('Nope'))

      const res = await createBudget({
        categoryId: 'cat1',
        totalAmount: 50,
        recurringFrequency: 'monthly',
        recurringStartDate: '2025-01-01',
      })

      expect(res.success).toBe(false)
      expect(res.error).toBe('Nope')
    })
  })

  describe('deleteBudget', () => {
    it('returns success and revalidates cache on success', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(successResp({ totalUserAccountAmount: 200 }))

      const res = await deleteBudget('b1')

      expect(res).toEqual({ success: true, message: 'Budget supprimé avec succès' })
      expect(mockRevalidateTag).toHaveBeenCalledWith('budget')
      expect(mockRevalidateTag).toHaveBeenCalledWith('budgets-user-u1')
    })

    it('returns failure when fetchWithAuth fails', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('Nope'))

      const res = await deleteBudget('b1')

      expect(res.success).toBe(false)
      expect(res.error).toBe('Nope')
    })
  })

  describe('updateBudget', () => {
    it('returns success and revalidates cache on success', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(successResp({ totalUserAccountAmount: 300 }))

      const res = await updateBudget('b2', {
        categoryId: 'cat2',
        totalAmount: 80,
        recurringFrequency: 'monthly',
        recurringStartDate: '2025-02-01',
      })

      expect(res).toEqual({ success: true, message: 'Budget modifié avec succès' })
      expect(mockRevalidateTag).toHaveBeenCalledWith('budget')
      expect(mockRevalidateTag).toHaveBeenCalledWith('budgets-user-u1')
    })

    it('returns failure when fetchWithAuth fails', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp())

      const res = await updateBudget('b2', {
        categoryId: 'cat2',
        totalAmount: 80,
        recurringFrequency: 'monthly',
        recurringStartDate: '2025-02-01',
      })

      expect(res.success).toBe(false)
      expect(res.error).toBe('Erreur inconnue')
    })
  })

  describe('updateGlobalBudget', () => {
    it('returns success on success', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(successResp({ id: 'u1', amount: 500 }))

      const res = await updateGlobalBudget({ userId: 'u1', amount: 500 })

      expect(res).toEqual({ success: true, message: 'Budget global modifié avec succès' })
    })

    it('returns failure when fetchWithAuth fails', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('Bad'))

      const res = await updateGlobalBudget({ userId: 'u1', amount: 500 })

      expect(res.success).toBe(false)
      expect(res.error).toBe('Bad')
    })
  })

  describe('revalidateUserBudgetsCache', () => {
    it('fails if user not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null)

      const res = await revalidateUserBudgetsCache()

      expect(res.success).toBe(false)
      expect(res.error).toContain('Non autorisé')
      expect(mockRevalidateTag).not.toHaveBeenCalled()
    })

    it('revalidates tags when user is authenticated', async () => {
      const res = await revalidateUserBudgetsCache()

      expect(res.success).toBe(true)
      expect(mockRevalidateTag).toHaveBeenCalledWith('budget')
      expect(mockRevalidateTag).toHaveBeenCalledWith('budgets-user-u1')
    })
  })
})
