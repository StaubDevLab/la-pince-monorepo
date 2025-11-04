import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockAuth = vi.fn()
const mockRevalidateTag = vi.fn()
const mockFetchWithAuth = vi.fn()

vi.mock('@/auth', () => ({ auth: (...a: unknown[]) => mockAuth(...a) }))
vi.mock('next/cache', () => ({ revalidateTag: (...a: unknown[]) => mockRevalidateTag(...a) }))
vi.mock('@/lib/fetch-with-auth', () => ({ fetchWithAuth: (...a: unknown[]) => mockFetchWithAuth(...a) }))

// Use real global.fetch for categories create/update/delete, but we will mock it per test

import {
  fetchCategories,
  getCategories,
  getCategoriesForForm,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  revalidateCategoriesCache,
} from '@/actions/categories.actions'

// Minimal Category type to satisfy tests
type Category = { id: string; name: string; color: string; icon: string }

describe('categories.actions', () => {
  const OLD_ENV = process.env
  const originalFetch = global.fetch

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    mockAuth.mockResolvedValue({ accessToken: 'jwt' })
  })

  afterEach(() => {
    process.env = OLD_ENV
    global.fetch = originalFetch as typeof fetch
  })

  it('fetchCategories success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: [{ id: 'c1' }] as Category[] })
    const res = await fetchCategories()
    expect(res.success).toBe(true)
    expect(res.data).toEqual([{ id: 'c1' }])
  })

  it('getCategories delegates to fetchCategories', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: [{ id: 'c2' }] as Category[] })
    const res = await getCategories()
    expect(res.success).toBe(true)
    expect(res.data?.[0]).toEqual({ id: 'c2' })
  })

  it('getCategoriesForForm simplifies items', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({
      success: true,
      data: [{ id: 'c1', name: 'Food', color: '#fff', icon: '🍔' } as Category],
    })
    const res = await getCategoriesForForm()
    expect(res.success).toBe(true)
    expect(res.data).toEqual([{ id: 'c1', name: 'Food' }])
  })

  it('getCategoryById success', async () => {
    mockFetchWithAuth.mockResolvedValueOnce({ success: true, data: { id: 'c1' } as Category })
    const res = await getCategoryById('c1')
    expect(res.success).toBe(true)
    expect(res.data?.id).toBe('c1')
  })

  it('createCategory success with jwt and revalidates', async () => {
    const fakeResp: Category = { id: 'c9', name: 'New', color: '#000', icon: '⭐' }
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => fakeResp }) as unknown as typeof fetch

    const res = await createCategory({ name: 'New', color: '#000', icon: '⭐' })
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('categories')
  })

  it('updateCategory success and revalidates both tags', async () => {
    const fakeResp: Category = { id: 'c1', name: 'Upd', color: '#111', icon: '✅' }
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => fakeResp }) as unknown as typeof fetch

    const res = await updateCategory({ id: 'c1', name: 'Upd', color: '#111', icon: '✅' })
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('categories')
    expect(mockRevalidateTag).toHaveBeenCalledWith('category-c1')
  })

  it('deleteCategory success and revalidates', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch
    const res = await deleteCategory('c1')
    expect(res.success).toBe(true)
    expect(mockRevalidateTag).toHaveBeenCalledWith('categories')
  })

  it('revalidateCategoriesCache unauthorized when no session', async () => {
    mockAuth.mockResolvedValueOnce(null)
    const res = await revalidateCategoriesCache()
    expect(res.success).toBe(false)
  })
})
