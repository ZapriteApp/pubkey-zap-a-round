import { NextResponse } from 'next/server'

const getZapriteApiUrl = () => {
  const apiUrl = process.env.ZAPRITE_API_URL
  if (!apiUrl) {
    throw new Error('ZAPRITE_API_URL environment variable is not set')
  }
  return apiUrl
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, name, note, externalUniqId } = body

    const zapriteApiUrl = getZapriteApiUrl()

    const orderData = {
      amount: amount * 100, // Convert to cents
      currency: 'USD',
      customCheckoutId: process.env.ZAPRITE_CHECKOUT_ID,
      externalUniqId,
      label: 'PubKey Zap-A-Round Donation',
      metadata: {
        name,
        note,
      },
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment?cart_id=${externalUniqId}`,
      sendReceiptToCustomer: false,
    }

    const response = await fetch(`${zapriteApiUrl}/v1/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ZAPRITE_API_KEY}`,
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      throw new Error('Error connecting to Checkout.')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order.' },
      { status: 500 },
    )
  }
}
