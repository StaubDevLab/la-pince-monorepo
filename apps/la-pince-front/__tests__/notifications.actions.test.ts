import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockFetchWithAuth = vi.fn()

vi.mock('@/lib/fetch-with-auth', () => ({ fetchWithAuth: (...a: unknown[]) => mockFetchWithAuth(...a) }))
let getNotifications: typeof import('@/actions/notifications.actions').getNotifications
let markAsReadNotifications: typeof import('@/actions/notifications.actions').markAsReadNotifications

// helpers
const successResp = <T>(data: T) => ({ success: true as const, data })
const failResp = (error?: string) => ({ success: false as const, error })

describe('notifications.actions', () => {
  const OLD_ENV = process.env

  beforeEach(async () => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    vi.resetModules()
    const mod = await import('@/actions/notifications.actions')
    getNotifications = mod.getNotifications
    markAsReadNotifications = mod.markAsReadNotifications
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('getNotifications', () => {
    it('builds query params and returns data on success', async () => {
      const apiData = { data: [], limit: 10, page: 2, total: 0 }
      mockFetchWithAuth.mockResolvedValueOnce(successResp(apiData))

      const res = await getNotifications(10, 2, true)

      expect(res.success).toBe(true)
      expect(res.data).toEqual(apiData)
      // Ensure called with built URL containing params
      expect(mockFetchWithAuth).toHaveBeenCalled()
      const [calledUrl] = mockFetchWithAuth.mock.calls[0]
      expect(calledUrl).toContain('https://api.example.test/notifications')
      expect(calledUrl).toContain('limit=10')
      expect(calledUrl).toContain('page=2')
      expect(calledUrl).toContain('isRead=true')
    })

    it('returns failure when fetchWithAuth fails', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('boom'))
      const res = await getNotifications(0, 1, false)
      expect(res.success).toBe(false)
      expect(res.error).toBe('boom')
    })
  })

  describe('markAsReadNotifications', () => {
    it('PATCHes ids and returns data on success', async () => {
      const apiData = { data: [], limit: 0, page: 1, total: 0 }
      mockFetchWithAuth.mockResolvedValueOnce(successResp(apiData))

      const res = await markAsReadNotifications(['n1', 'n2'])

      expect(res.success).toBe(true)
      expect(res.data).toEqual(apiData)

      expect(mockFetchWithAuth).toHaveBeenCalledWith(
        'https://api.example.test/notifications',
        expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ ids: ['n1', 'n2'] }) })
      )
    })

    it('returns failure when fetchWithAuth fails', async () => {
      mockFetchWithAuth.mockResolvedValueOnce(failResp('nope'))
      const res = await markAsReadNotifications(['n1'])
      expect(res.success).toBe(false)
      expect(res.error).toBe('nope')
    })
  })
})
