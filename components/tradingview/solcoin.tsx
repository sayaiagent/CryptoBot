'use client'

import React, { useEffect, useRef, useState, memo } from 'react'
import axios from 'axios'

export function SolanaCoins() {
  const container = useRef<HTMLDivElement>(null)
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'https://api.geckoterminal.com/api/v2'

  // Fetch data from Gecko Terminal's Solana token analytics
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = 'tokens/info_recently_updated?network=solana'
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
          headers: {
            'accept': 'application/json',
          },
        })
        setTokens(response.data.data)
        setLoading(false)
      } catch (err) {
        setError('Error fetching data')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="container" style={{ padding: '10px 20px', maxWidth: '800px' }}>
      {loading && <p>Loading Solana Tokens...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Solana Tokens</h2>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              padding: '5px 0',
              fontSize: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                borderBottom: '2px solid #ddd',
                fontWeight: 'bold',
                padding: '5px 0',
              }}
            >
              <div style={{ flex: '1', padding: '5px' }}>Token</div>
              <div style={{ flex: '1', padding: '5px' }}>Price</div>
              <div style={{ flex: '1', padding: '5px' }}>Volume</div>
            </div>

            {tokens.slice(0, 10).map((token) => {
              const price = token.attributes.price || 'N/A'
              const volume = token.attributes.volume || 'N/A'
              const contractAddress = token.attributes.address

              return (
                <div
                  key={token.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: '1px solid #ddd',
                    background: '#f9f9f9',
                  }}
                >
                  <div style={{ flex: '1', padding: '5px' }}>{token.attributes.name}</div>
                  <div style={{ flex: '1', padding: '5px' }}>{price}</div>
                  <div style={{ flex: '1', padding: '5px' }}>{volume}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(SolanaCoins)
