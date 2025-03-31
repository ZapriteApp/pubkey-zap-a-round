import { NextResponse } from 'next/server'

const getZapriteApiUrl = () => {
  const apiUrl = process.env.ZAPRITE_API_URL
  if (!apiUrl) {
    throw new Error('ZAPRITE_API_URL environment variable is not set')
  }
  return apiUrl
}

type Params = Promise<{ id: string }>

export async function GET(request: Request, context: { params: Params }) {
  try {
    const { id } = await context.params
    const zapriteApiUrl = getZapriteApiUrl()

    const response = await fetch(`${zapriteApiUrl}/v1/order/${id}`, {
      headers: {
        Authorization: `Bearer ${process.env.ZAPRITE_API_KEY}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch order from Zaprite')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 },
    )
  }
}
