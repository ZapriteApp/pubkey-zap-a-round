'use client'
import { Button } from '@/components/ui/button'
import { FileDown, Zap, ZapOff, SquareArrowOutUpRight } from 'lucide-react'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { Card } from '@/components/ui/card'

type ZapriteOrder = {
  id: string
  status:
    | 'PENDING'
    | 'PROCESSING'
    | 'PAID'
    | 'OVERPAID'
    | 'UNDERPAID'
    | 'COMPLETE'
  amount: number
  currency: string
  createdAt: string
  externalUniqId: string
  updatedAt: string
  receiptPdfUrl?: string
  transactions: Array<{
    amount: number
    amountInOrderCurrency: number
    orderCurrency: string
  }>
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'success' | 'error' | 'loading'>(
    'loading',
  )
  const [order, setOrder] = useState<ZapriteOrder | null>(null)

  useEffect(() => {
    const fetchOrderStatus = async () => {
      try {
        // Get cart_id from URL params or localStorage
        const cartId =
          searchParams.get('cart_id') || localStorage.getItem('cart_id')

        if (!cartId) {
          toast.error('No payment found.')
          setStatus('error')
          return
        }

        // Make API call to Zaprite
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/get-order/${cartId}`,
        )

        if (!response.ok) {
          throw new Error('Failed to fetch order status.')
        }

        const data: ZapriteOrder = await response.json()
        setOrder(data)

        // Determine status based on order state
        if (data.status === 'COMPLETE' || data.status === 'PAID') {
          setStatus('success')
        } else if (data.status === 'UNDERPAID') {
          setStatus('error')
        } else {
          setStatus('loading')
        }
      } catch (error) {
        console.error('Error fetching order status:', error)
        setStatus('error')
        toast.error('Failed to fetch payment status')
      }
    }

    fetchOrderStatus()
  }, [searchParams])

  const handleShare = () => {
    if (!order?.transactions?.[0]) return

    const amount = order.transactions[0].amount.toLocaleString()
    const usdAmount = (
      order.transactions[0].amountInOrderCurrency / 100
    ).toLocaleString('en-US', { minimumFractionDigits: 2 })
    const text = `Just dropped ${amount} sats ($${usdAmount} USD) behind the bar at @PubKey\n\nGo grab a beer on me! 🍻\n\nJoin the round at pubkey.zaprite.dev`

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Card className="flex flex-col w-full max-w-lg p-6 gap-2">
        <div className="text-center">
          <h3 className="font-jersey-25 uppercase text-3xl font-menium mb-4 sm:text-4xl">
            {status === 'success'
              ? 'Thank You!'
              : status === 'error'
                ? 'Ah, shoot!'
                : 'Processing payment ...'}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center">
          {status === 'success' ? (
            <>
              <Zap className="mx-auto h-12 w-12 text-green-500" />
              <p>Your donation has been received.</p>
            </>
          ) : status === 'error' ? (
            <>
              <ZapOff className="mx-auto h-12 w-12 text-red-500" />
              <p>There was an error with your donation.</p>
            </>
          ) : null}
        </div>
        {order && order.transactions?.[0] && (
          <div className="w-full text-center">
            <div className="felx flex-col items-center my-4 rounded-lg bg-gray-50 p-4 text-sm">
              <div className="flex flex-row mx-auto text-4xl justify-center items-baseline">
                <div className="flex flex-row font-bold text-4xl">
                  {order.transactions[0].amount.toLocaleString()}
                </div>
                <div className="text-lg ml-1">sats</div>
              </div>
              <div className="text-lg text-gray-400">
                {order.transactions[0].orderCurrency} $
                {(
                  order.transactions[0].amountInOrderCurrency / 100
                ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Reference ID: {order.externalUniqId}
            </p>
          </div>
        )}
        <div className="flex flex-row mt-4 gap-4">
          {order?.receiptPdfUrl && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(order.receiptPdfUrl, '_blank')}
              className="flex grow mr-auto"
            >
              Download Receipt
              <FileDown className="ml-1" />
            </Button>
          )}
          <Button size="lg" onClick={handleShare} className="flex grow ml-auto">
            Share on 𝕏
            <SquareArrowOutUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </Card>
      <Toaster />
    </div>
  )
}
