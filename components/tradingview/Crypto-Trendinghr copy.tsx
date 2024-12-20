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
        const endpoint = 'networks/solana/trending_pools?page=1&duration=1h'
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

  // Initialize TradingView widget on the container
  useEffect(() => {
    if (!container.current) return

    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      colorTheme: 'light',
      dateRange: '1D',
      defaultcolum: 'overview',
      defaultScreen: '',
      exchange: 'US',
      showChart: true,
      locale: 'en',
      largeChartUrl: '',
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      width: '100%',
      height: '100%',
      plotLineColorGrowing: 'rgb(0, 62, 197)',
      plotLineColorFalling: 'rgba(255, 0, 0, 1)',
      gridLineColor: 'rgba(0, 0, 0, 0)',
      scaleFontColor: 'rgba(19, 23, 34, 1)',
      belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
      belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
      belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
      symbolActiveColor: 'rgba(60, 120, 216, 0.12)',
    })

    container.current.appendChild(script)

    return () => {
      if (container.current) {
        container.current.removeChild(script)
      }
    }
  }, [])

  return (
    <div style={{ height: '500px', padding: '20px', backgroundColor: '#f7f7f7', borderRadius: '8px' }}>
      {loading && <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading Trending Pools...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red', fontSize: '18px' }}>{error}</p>}
      {!loading && !error && (
        <div
          className="tradingview-widget-container"
          ref={container}
          style={{ height: '100%', width: '100%' }}
        >
          <div
            className="tradingview-widget-container__widget"
            style={{ height: 'calc(100% - 32px)', width: '100%' }}
          >
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Trending Pools</h2>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {pools.map((pool) => (
                  <li
                    key={pool.id}
                    style={{
                      backgroundColor: '#fff',
                      padding: '15px',
                      margin: '10px 0',
                      borderRadius: '6px',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                      fontSize: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <strong style={{ color: '#2e4c8f' }}>{pool.attributes.name}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#888', fontSize: '14px' }}>{pool.attributes.volume} TVL</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tradingview-widget-copyright">
            <a
              href="https://www.tradingview.com/"
              rel="noopener nofollow"
              target="_blank"
            >
              <span>Track all markets on TradingView</span>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(CryptoHrTrending)
