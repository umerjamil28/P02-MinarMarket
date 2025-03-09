import { getUserDetails } from "@/lib/SessionManager"

export async function submitProposal(data) {
  console.log('API call data:', data)
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/proposals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      buyerId: data.buyerId,
      sellerId: data.sellerId,
      requirementId: data.requirementId,
      price: parseFloat(data.price),
      description: data.description,
      status: 'pending'
    })
  })

  const result = await response.json()
  if (!response.ok) {
    console.error('API Error:', result)
    throw new Error(result.message || 'Failed to submit proposal')
  }

  return result
}