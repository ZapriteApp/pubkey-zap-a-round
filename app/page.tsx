'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const [customAmount, setCustomAmount] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    amount: '0',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleDonateClick = (amount?: number) => {
    setCustomAmount(amount || null)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Generate externalUniqId
      const timestamp = Date.now()
      const externalUniqId = `pkzar_${timestamp}`

      // Store in localStorage
      localStorage.setItem('cart_id', externalUniqId)

      // Prepare order data
      const amount = customAmount || parseFloat(formData.amount)

      // Create order using our API route
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/create-order`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            name: formData.name,
            note: formData.note,
            externalUniqId,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const data = await response.json()

      // Redirect to the payment URL
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Error creating order:', error)
      // TODO: Show error message to user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="items-center justify-items-center p-8 gap-16 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <div className="flex gap-4 items-center text-center flex-col">
          <h1 className="text-6xl uppercase text-white font-[family-name:var(--font-jersey-25)] sm:text-7xl md:text-8xl">
            Zap-A-Round
          </h1>
          <h3 className="text-3xl uppercase font-jersey-25 sm:text-4xl md:text-5xl">
            Drop some sats behind the bar at PubKey.
          </h3>
          <p className="text-xl font-medium">
            All donations will be added to an open tab for anyone currently at
            the bar.
          </p>
        </div>
        <div className="flex gap-4 items-center flex-col w-full sm:flex-row">
          <div className="grid grid-cols-2 mx-auto sm:grid-cols-3 gap-4 w-full max-w-[24rem]">
            {[5, 25, 50, 100, 250, 500].map((amount) => (
              <Button
                size="lg"
                key={amount}
                onClick={() => handleDonateClick(amount)}
                className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all"
              >
                ${amount.toLocaleString()}
              </Button>
            ))}
            <Button
              size="lg"
              onClick={() => handleDonateClick()}
              className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all col-span-2 sm:col-span-3"
            >
              Custom Amount
            </Button>
          </div>
        </div>
      </main>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-12 sm:max-w-[480px] border-0 bg-white">
          <DialogHeader>
            <DialogTitle>Make a Donation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {customAmount === null ? (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  step="1.00"
                  required
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="Enter an amount ..."
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="text-2xl font-medium">
                  ${customAmount.toLocaleString()}
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (Optional)</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                placeholder="Add a note to your donation"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading
                ? 'Processing...'
                : `Donate $${customAmount || formData.amount} Now`}
              <ArrowRight className="ml-1" />
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
