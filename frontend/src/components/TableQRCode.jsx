import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

const TableQRCode = ({ table }) => {
  const [showQR, setShowQR] = useState(false)
  const url = `${window.location.origin}/table/${table.table_number}`

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${table.table_number}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 40px; }
            h2 { color: #f97316; font-size: 24px; margin-bottom: 8px; }
            p { color: #666; font-size: 14px; margin-bottom: 20px; }
            svg { width: 200px; height: 200px; }
          </style>
        </head>
        <body>
          <h2>🍽️ SmartResto</h2>
          <p>Table ${table.table_number} — ${table.location} — ${table.capacity} seats</p>
          <div id="qr"></div>
          <p style="margin-top:16px; font-size:12px; color:#999;">Scan to order</p>
        </body>
      </html>
    `)
    printWindow.document.close()

    // Draw QR in new window
    const svg = document.getElementById(`qr-${table.id}`)?.outerHTML
    printWindow.document.getElementById('qr').innerHTML = svg
    printWindow.print()
  }

  return (
    <div>
      <button
        onClick={() => setShowQR(!showQR)}
        className="text-xs bg-purple-50 text-purple-500 px-3 py-1 rounded-lg hover:bg-purple-100 transition"
      >
        {showQR ? 'Hide QR' : 'Show QR'}
      </button>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center max-w-xs w-full mx-4">
            <h3 className="font-bold text-gray-800 mb-1">Table {table.table_number}</h3>
            <p className="text-gray-400 text-xs mb-4">
              📍 {table.location} · 👥 {table.capacity} seats
            </p>

            <div className="flex justify-center mb-4">
              <QRCodeSVG
                id={`qr-${table.id}`}
                value={`${window.location.origin}/table/${table.table_number}`}
                size={180}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-xs text-gray-400 mb-6 break-all">{url}</p>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-2 rounded-xl transition"
              >
                🖨️ Print
              </button>
              <button
                onClick={() => setShowQR(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold py-2 rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TableQRCode