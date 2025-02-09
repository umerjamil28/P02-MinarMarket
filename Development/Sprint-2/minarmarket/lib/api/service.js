export async function fetchService(serviceId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/fetch-service-details/${serviceId}`)
  if (!response.ok) throw new Error('Failed to fetch service')
  const data = await response.json()
  return data.service
}

export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "xxy7dsyf")

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dm56xy1oj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  )
  const data = await response.json()
  return data.secure_url
}

export async function createService(data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addServiceListing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create service')
  return response.json()
}

export async function updateService(serviceId, data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/updateService/${serviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update service')
  return response.json()
}

export async function showMyServiceListings(userId) {
  console.log(userId)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/service-listings/my-listings?listerId=${userId}`, {
    // method: 'POST',
    // headers: { 'Content-Type': 'application/json' },
    // body: JSON.stringify({ id: userId }),
    // query: { listerId: userId } 
    
  })
  if (!response.ok) throw new Error('Failed to fetch service listings')
  return response.json()
}

export async function createServiceRequirement(data) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyer-service-requirement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to create service requirement')
    return response.json()
}

export async function getMyServiceRequirements(userId) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyer-service-requirement?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to fetch service requirements')
    return response.json()
}