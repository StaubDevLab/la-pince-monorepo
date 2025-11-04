import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetchWithAuth = vi.fn()
const mockAuth = vi.fn()
const mockRevalidateTag = vi.fn()

vi.mock('@/lib/fetch-with-auth', () => ({ fetchWithAuth: (...a: unknown[]) => mockFetchWithAuth(...a) }))
vi.mock('@/auth', () => ({ auth: (...a: unknown[]) => mockAuth(...a) }))
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => mockRevalidateTag(...a) }))

import {
  getDashboardData,
  getBudgetsForUser,
  revalidateUserBudgetsCache,
  revalidateUserDashboardCache,
} from '@/actions/dashboard.actions'

describe('dashboard.actions', () => {
  const OLD_ENV = process.env
  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    mockAuth.mockResolvedValue({ user: { id: 'u1' } })
  })
  afterEach(() => { process.env = OLD_ENV })

  it('getDashboardData success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: { total: 1 } })
    const res = await getDashboardData()
    expect(res).toEqual({ success: true, data: { total: 1 } })
  })
  it('getDashboardData failure', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: false, error: 'x' })
    const res = await getDashboardData()
    expect(res.success).toBe(false)
    expect(res.error).toBe('x')
  })

  it('getBudgetsForUser success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: [{ id: 'b1' }] })
    const res = await getBudgetsForUser()
    expect(res.success).toBe(true)
    expect(res.data).toEqual([{ id: 'b1' }])
  })
  it('getBudgetsForUser failure', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: false, error: 'nope' })
    const res = await getBudgetsForUser()
    expect(res.success).toBe(false)
    expect(res.error).toBe('nope')
  })

  it('revalidateUserBudgetsCache unauthorized', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const res = await revalidateUserBudgetsCache()
    expect(res.success).toBe(false)
  })
  it('revalidateUserBudgetsCache success', async () => {
    const res = await revalidateUserBudgetsCache()
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('budgets')
    expect(mockRevalidateTag).toHaveBeenCalledWith('budgets-user-u1')
  })

  it('revalidateUserDashboardCache unauthorized', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const res = await revalidateUserDashboardCache()
    expect(res.success).toBe(false)
  })
  it('revalidateUserDashboardCache success', async () => {
    const res = await revalidateUserDashboardCache()
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('dashboard-data')
    expect(mockRevalidateTag).toHaveBeenCalledWith('dashboard-user-u1')
  })
})
