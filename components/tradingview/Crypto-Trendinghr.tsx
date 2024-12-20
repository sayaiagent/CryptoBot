'use client'

import React, { useEffect, useRef, useState, memo } from 'react'
import axios from 'axios'

export function CryptoHrTrending() {
  const container = useRef<HTMLDivElement>(null)
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'https://api.geckoterminal.com/api/v2'

  // Fetch data from the Gecko Terminal API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = 'networks/solana/trending_pools?page=1&duration=24h'
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
          headers: {
            'accept': 'application/json',
          },
        })
        setPools(response.data.data)
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
      {loading && <p>Loading Trending Pools...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Trending Pools</h2>
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
              <div style={{ flex: '1', padding: '5px' }}>Ticker</div>
              <div style={{ flex: '1', padding: '5px' }}>Price</div>
              <div style={{ flex: '1', padding: '5px' }}>Contract Address</div> {/* Display contract address */}
            </div>

            {pools.slice(0, 10).map((pool) => { // Limit to first 10 items
              // Extract relevant fields from pool attributes
              const price = pool.attributes.base_token_price_usd
                ? `$${parseFloat(pool.attributes.base_token_price_usd).toFixed(4)}`
                : pool.attributes.quote_token_price_usd
                ? `$${parseFloat(pool.attributes.quote_token_price_usd).toFixed(4)}`
                : 'N/A'

              // Get the contract address from the pool data
              const contractAddress = pool.attributes.address

              return (
                <div
                  key={pool.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 0',
                    borderBottom: '1px solid #ddd',
                    background: '#f9f9f9',
                  }}
                >
                  <div style={{ flex: '1', padding: '5px' }}>{pool.attributes.name}</div>
                  <div style={{ flex: '1', padding: '5px' }}>{price}</div>
                  <div style={{ flex: '1', padding: '5px' }}>
                    <a
                      href={`https://www.geckoterminal.com/solana/pools/${contractAddress}`} // Link to pump.fun with contract address
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      {contractAddress.slice(0, 8)}...{contractAddress.slice(-4)} {/* Display shortened address */}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(CryptoHrTrending)
