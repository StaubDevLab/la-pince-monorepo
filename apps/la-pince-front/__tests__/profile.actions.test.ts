import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetchWithAuth = vi.fn()
const mockAuth = vi.fn()
const mockRevalidateTag = vi.fn()

vi.mock('@/lib/fetch-with-auth', () => ({ fetchWithAuth: (...a: unknown[]) => mockFetchWithAuth(...a) }))
vi.mock('@/auth', () => ({ auth: (...a: unknown[]) => mockAuth(...a) }))
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => mockRevalidateTag(...a) }))

import {
  updateProfileAndSession,
  getProfile,
  changePasswordAction,
  revalidateProfileCache,
  completeProfileSetup,
} from '@/actions/profile.actions'

describe('profile.actions', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    mockAuth.mockResolvedValue({ user: { id: 'u1' } })
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  it('updateProfileAndSession success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: {} })
    const res = await updateProfileAndSession({ firstName: 'A', lastName: 'B', email: 'a@b.c' })
    expect(res).toEqual({ success: true, data: null })
  })

  it('updateProfileAndSession failure', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: false, error: 'x' })
    const res = await updateProfileAndSession({ firstName: 'A', lastName: 'B', email: 'a@b.c' })
    expect(res.success).toBe(false)
    expect(res.error).toBe('x')
  })

  it('getProfile success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: { id: 'u1' } })
    const res = await getProfile()
    expect(res.success).toBe(true)
    expect(res.data).toEqual({ id: 'u1' })
  })

  it('getProfile failure', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: false, error: 'nope' })
    const res = await getProfile()
    expect(res.success).toBe(false)
    expect(res.error).toBe('nope')
  })

  it('changePasswordAction success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: { accountName: 'x', firstName: 'y', lastName: 'z', email: 'e' } })
    const res = await changePasswordAction({ currentPassword: 'a', newPassword: 'b', confirmNewPassword: 'b' })
    expect(res.success).toBe(true)
  })

  it('revalidateProfileCache unauthorized', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const res = await revalidateProfileCache()
    expect(res.success).toBe(false)
  })

  it('revalidateProfileCache success', async () => {
    const res = await revalidateProfileCache()
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('profile')
  })

  it('completeProfileSetup success revalidates tag', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: {} })
    const res = await completeProfileSetup({ accountName: 'acc', currency: 'EUR', locale: 'fr-FR', totalAmount: 100 })
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('profile')
  })

  it('completeProfileSetup failure', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: false, error: 'boom' })
    const res = await completeProfileSetup({ accountName: 'acc', currency: 'EUR', locale: 'fr-FR', totalAmount: 100 })
    expect(res.success).toBe(false)
    expect(res.error).toBe('boom')
  })
})
