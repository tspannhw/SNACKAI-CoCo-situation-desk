import { describe, it, expect } from 'vitest'
import { cn, formatCurrency, formatNumber, timeAgo } from '../lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('handles conditional classes', () => {
      const condition = false
      expect(cn('foo', condition && 'bar', 'baz')).toBe('foo baz')
    })

    it('handles undefined values', () => {
      expect(cn('foo', undefined, 'bar')).toBe('foo bar')
    })
  })

  describe('formatCurrency', () => {
    it('formats numbers as USD currency', () => {
      expect(formatCurrency(1500)).toBe('$1,500.00')
    })

    it('formats small numbers', () => {
      expect(formatCurrency(50)).toBe('$50.00')
    })

    it('formats large numbers', () => {
      expect(formatCurrency(1500000)).toBe('$1,500,000.00')
    })
  })

  describe('formatNumber', () => {
    it('formats large numbers with K suffix', () => {
      expect(formatNumber(1500)).toBe('1.5K')
    })

    it('formats millions with M suffix', () => {
      expect(formatNumber(1500000)).toBe('1.5M')
    })

    it('formats small numbers without suffix', () => {
      expect(formatNumber(50)).toBe('50')
    })
  })

  describe('timeAgo', () => {
    it('formats seconds ago', () => {
      const date = new Date(Date.now() - 30 * 1000)
      expect(timeAgo(date)).toBe('30s ago')
    })

    it('formats minutes ago', () => {
      const date = new Date(Date.now() - 5 * 60 * 1000)
      expect(timeAgo(date)).toBe('5m ago')
    })

    it('formats hours ago', () => {
      const date = new Date(Date.now() - 2 * 60 * 60 * 1000)
      expect(timeAgo(date)).toBe('2h ago')
    })

    it('formats days ago', () => {
      const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      expect(timeAgo(date)).toBe('3d ago')
    })
  })
})
