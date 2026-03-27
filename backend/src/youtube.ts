import express from 'express'

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3'

const router = express.Router()

// GET /api/youtube/playlists — fetch user's playlists
router.get('/playlists', async (req, res) => {
  const { accessToken } = req.query
  if (!accessToken) return res.status(400).json({ error: 'accessToken required' })

  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    const url = `${YOUTUBE_API_BASE}/playlists?mine=true&part=snippet,contentDetails&maxResults=50&key=${apiKey}`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const data = await response.json()
    if (!response.ok) return res.status(response.status).json(data)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch playlists' })
  }
})

// GET /api/youtube/tracks — fetch all tracks from a playlist (handles pagination)
router.get('/tracks', async (req, res) => {
  const { playlistId, accessToken } = req.query
  if (!playlistId || !accessToken) return res.status(400).json({ error: 'playlistId and accessToken required' })

  try {
    const apiKey = process.env.YOUTUBE_API_KEY
    let allItems: any[] = []
    let pageToken = ''

    do {
      const tokenParam = pageToken ? `&pageToken=${pageToken}` : ''
      const url = `${YOUTUBE_API_BASE}/playlistItems?playlistId=${playlistId}&part=snippet&maxResults=50&key=${apiKey}${tokenParam}`
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const data = await response.json()
      if (!response.ok) return res.status(response.status).json(data)
      allItems = allItems.concat(data.items || [])
      pageToken = data.nextPageToken || ''
    } while (pageToken)

    res.json({ items: allItems })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tracks' })
  }
})

export default router
