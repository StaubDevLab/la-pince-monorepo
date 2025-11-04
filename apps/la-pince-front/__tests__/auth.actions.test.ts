import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { forgotPasswordAction, resetPasswordAction } from '@/actions/auth.actions'

describe('auth.actions', () => {
  const OLD_ENV = process.env
  const mockFetch = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    process.env = { ...OLD_ENV, API_URL: 'https://api.example.test' }
    global.fetch = mockFetch
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('forgotPasswordAction', () => {
    it('returns success: true on 2xx', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      const res = await forgotPasswordAction('john@example.com')
      expect(res).toEqual({ success: true })
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.test/auth/forgot-password',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'john@example.com' }),
        })
      )
    })

    it('returns success: false on non-2xx', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      const res = await forgotPasswordAction('john@example.com')
      expect(res).toEqual({
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe',
      })
    })
  })

  describe('resetPasswordAction', () => {
    it('returns success: true on 2xx', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true })
      const res = await resetPasswordAction('NewPassw0rd!', 'token123', 'NewPassw0rd!')
      expect(res).toEqual({ success: true })
      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.test/auth/reset-password',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            newPassword: 'NewPassw0rd!',
            token: 'token123',
            confirmNewPassword: 'NewPassw0rd!',
          }),
        })
      )
    })

    it('returns success: false on non-2xx', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false })
      const res = await resetPasswordAction('x', 'bad', 'x')
      expect(res).toEqual({
        success: false,
        error: 'Erreur lors de la réinitialisation du mot de passe',
      })
    })
  })
})