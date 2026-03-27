import { describe, it, expect, vi, beforeEach } from 'vitest'
import { youtubeProvider } from '../youtube'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

beforeEach(() => {
  mockFetch.mockReset()
})

describe('youtubeProvider', () => {
  it('has name "YouTube"', () => {
    expect(youtubeProvider.name).toBe('YouTube')
  })

  describe('getPlaylists', () => {
    it('calls correct URL and maps response to Playlist[]', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{
            id: 'PL123',
            snippet: {
              title: 'My Playlist',
              thumbnails: { default: { url: 'http://img.jpg' } },
            },
            contentDetails: { itemCount: 5 },
          }],
        }),
      })

      const playlists = await youtubeProvider.getPlaylists('tok123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/youtube/playlists?accessToken=tok123')
      )
      expect(playlists).toEqual([{
        id: 'PL123',
        title: 'My Playlist',
        thumbnail: 'http://img.jpg',
        trackCount: 5,
      }])
    })

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 401 })

      await expect(youtubeProvider.getPlaylists('bad'))
        .rejects.toThrow('Failed to fetch playlists: 401')
    })
  })

  describe('getTracks', () => {
    it('calls correct URL and maps response to Track[]', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{
            snippet: {
              title: 'Song Name',
              videoOwnerChannelTitle: 'Artist',
              resourceId: { videoId: 'abc123' },
              thumbnails: { default: { url: 'http://thumb.jpg' } },
            },
          }],
        }),
      })

      const tracks = await youtubeProvider.getTracks('PL123', 'tok123')

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/youtube/tracks?playlistId=PL123&accessToken=tok123')
      )
      expect(tracks).toEqual([{
        id: 'abc123',
        title: 'Song Name',
        artist: 'Artist',
        thumbnail: 'http://thumb.jpg',
        url: 'https://music.youtube.com/watch?v=abc123',
        playlistName: '',
      }])
    })

    it('throws on non-ok response', async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 })

      await expect(youtubeProvider.getTracks('PL123', 'bad'))
        .rejects.toThrow('Failed to fetch tracks: 500')
    })
  })
})
