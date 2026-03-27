import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import request from 'supertest'
import app from '../index.js'

beforeEach(() => {
  vi.stubEnv('YOUTUBE_API_KEY', 'test-api-key')
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('GET /api/youtube/playlists', () => {
  it('returns 400 if no accessToken', async () => {
    const res = await request(app).get('/api/youtube/playlists')
    expect(res.status).toBe(400)
    expect(res.body.error).toBe('accessToken required')
  })

  it('fetches single page of playlists', async () => {
    const mockData = { items: [{ id: 'pl1', snippet: { title: 'My Playlist' } }] }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    })
    vi.stubGlobal('fetch', mockFetch)

    const res = await request(app).get('/api/youtube/playlists?accessToken=my-token')

    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(mockFetch).toHaveBeenCalledOnce()

    const [url, options] = mockFetch.mock.calls[0]
    expect(url).toContain('playlists?mine=true&part=snippet,contentDetails&maxResults=50&key=test-api-key')
    expect(options.headers.Authorization).toBe('Bearer my-token')
  })

  it('handles pagination across multiple pages', async () => {
    const page1 = { items: [{ id: 'pl1', snippet: { title: 'Playlist 1' } }], nextPageToken: 'page2token' }
    const page2 = { items: [{ id: 'pl2', snippet: { title: 'Playlist 2' } }] }

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(page1) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(page2) })
    vi.stubGlobal('fetch', mockFetch)

    const res = await request(app).get('/api/youtube/playlists?accessToken=my-token')
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(2)
    expect(mockFetch).toHaveBeenCalledTimes(2)

    const secondCallUrl = mockFetch.mock.calls[1][0]
    expect(secondCallUrl).toContain('pageToken=page2token')
  })

  it('forwards YouTube error status on API failure', async () => {
    const errorData = { error: { message: 'Forbidden' } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: () => Promise.resolve(errorData),
    }))

    const res = await request(app).get('/api/youtube/playlists?accessToken=my-token')
    expect(res.status).toBe(403)
    expect(res.body).toEqual(errorData)
  })
})

describe('GET /api/youtube/tracks', () => {
  it('returns 400 if missing params', async () => {
    const res1 = await request(app).get('/api/youtube/tracks')
    expect(res1.status).toBe(400)
    expect(res1.body.error).toBe('playlistId and accessToken required')

    const res2 = await request(app).get('/api/youtube/tracks?playlistId=pl1')
    expect(res2.status).toBe(400)

    const res3 = await request(app).get('/api/youtube/tracks?accessToken=tok')
    expect(res3.status).toBe(400)
  })

  it('fetches single page of tracks', async () => {
    const mockData = { items: [{ snippet: { title: 'Track 1' } }] }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockData),
    }))

    const res = await request(app).get('/api/youtube/tracks?playlistId=pl1&accessToken=tok')
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(1)
    expect(res.body.items[0].snippet.title).toBe('Track 1')
  })

  it('handles pagination across multiple pages', async () => {
    const page1 = { items: [{ snippet: { title: 'Track 1' } }], nextPageToken: 'page2token' }
    const page2 = { items: [{ snippet: { title: 'Track 2' } }] }

    const mockFetch = vi.fn()
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(page1) })
      .mockResolvedValueOnce({ ok: true, status: 200, json: () => Promise.resolve(page2) })
    vi.stubGlobal('fetch', mockFetch)

    const res = await request(app).get('/api/youtube/tracks?playlistId=pl1&accessToken=tok')
    expect(res.status).toBe(200)
    expect(res.body.items).toHaveLength(2)
    expect(res.body.items[0].snippet.title).toBe('Track 1')
    expect(res.body.items[1].snippet.title).toBe('Track 2')
    expect(mockFetch).toHaveBeenCalledTimes(2)

    const secondCallUrl = mockFetch.mock.calls[1][0]
    expect(secondCallUrl).toContain('pageToken=page2token')
  })

  it('returns YouTube error status on API failure', async () => {
    const errorData = { error: { message: 'Not Found' } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve(errorData),
    }))

    const res = await request(app).get('/api/youtube/tracks?playlistId=pl1&accessToken=tok')
    expect(res.status).toBe(404)
    expect(res.body).toEqual(errorData)
  })
})
