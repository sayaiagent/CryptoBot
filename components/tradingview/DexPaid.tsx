'use client'

import React, { useEffect, useRef, useState, memo } from 'react'
import axios from 'axios'

export function Dexpaid() {
  const container = useRef<HTMLDivElement>(null)
  const [pools, setPools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'https://api.geckoterminal.com/api/v2'

  // Fetch data from the Gecko Terminal API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = 'networks/solana/trending_pools?page=1&duration=1h'
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
          headers: {
            'accept': 'application/json',
          },
        })
        // Filter pools with a token_info gt_score > 50
        const filteredPools = response.data.data.filter((pool: { token_info: { attributes: { gt_score: number } } }) => pool?.token_info?.attributes?.gt_score > 50)
        setPools(filteredPools)
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
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr', // 4 columns: Ticker, Price, Change%, Buy%
              gap: '0px', // No gap between columns for tight display
              padding: '5px 0',
              fontSize: '14px', // Smaller font size
              borderBottom: '2px solid #ddd',
            }}
          >
            <div style={{ fontWeight: 'bold', padding: '5px', borderRight: '1px solid #ddd' }}>Ticker</div>
            <div style={{ fontWeight: 'bold', padding: '5px', borderRight: '1px solid #ddd' }}>Price</div>
            <div style={{ fontWeight: 'bold', padding: '5px', borderRight: '1px solid #ddd' }}>Change (1h)</div>
            <div style={{ fontWeight: 'bold', padding: '5px' }}>Buy%</div>

            {pools.slice(0, 10).map((pool) => { // Limit to first 10 items
              const transactions = pool?.transactions || {}
              const buyPercentage = transactions.m5
                ? ((transactions.m5.buys / (transactions.m5.buys + transactions.m5.sells)) * 100).toFixed(2)
                : 'N/A'

              return (
                <>
                  <div
                    style={{
                      padding: '5px',
                      background: '#f9f9f9',
                      borderRight: '1px solid #ddd', // Separator for Ticker
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {pool.attributes.name}
                  </div>
                  <div
                    style={{
                      padding: '5px',
                      background: '#f9f9f9',
                      borderRight: '1px solid #ddd', // Separator for Price
                    }}
                  >
                    ${pool.attributes.base_token_price_usd}
                  </div>
                  <div
                    style={{
                      padding: '5px',
                      background: '#f9f9f9',
                      borderRight: '1px solid #ddd', // Separator for Change%
                    }}
                  >
                    {pool.price_change_percentage?.h1 || 'N/A'}%
                  </div>
                  <div
                    style={{
                      padding: '5px',
                      background: '#f9f9f9',
                    }}
                  >
                    {buyPercentage}%
                  </div>
                </>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(Dexpaid)
