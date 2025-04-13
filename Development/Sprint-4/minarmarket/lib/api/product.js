export async function fetchProduct(productId) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/fetch-product-details/${productId}`)
  if (!response.ok) throw new Error('Failed to fetch product')
    const data = await response.json()
    console.log("data.product: ", data.product);
  return data.product
}

export async function uploadToCloudinary(file) {
    console.log(file)

  const formData = new FormData()
  //Read blob data from url
    const blob = await fetch(file.preview).then((r) => r.blob())
  formData.append("file", blob)
  formData.append("upload_preset", "xxy7dsyf")

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dm56xy1oj/image/upload",
    {
      method: "POST",
      body: formData,
    }
  )
  const data = await response.json()
  console.log(data)
  return data.secure_url
}

export async function createProduct(data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/addProductListing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create product')
  return response.json()
}

export async function updateProduct(productId, data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/updateProduct/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update product')
  return response.json()
}

export async function showMyProductListings(userId) { 
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-listings/buyer/my-product-listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: userId }),
  })
  if (!response.ok) throw new Error('Failed to fetch product listings')
  return response.json()
  
}

export async function showMyRequirement(userId)
{
  // console.log(userId)
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyer-requirement`, {

    // body: JSON.stringify({ buyerId: userId }),
    // query: { buyerid: userId },
    headers: { 'buyerId': userId },
  })
  if (!response.ok) throw new Error('Failed to fetch product listings')
  const data = await response.json()
  console.log(data)
  return data
}
export async function createRequirement(data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyer-requirement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create requirement')
  return response.json()
}


export async function updateRequirement(requirementId,userId, data) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/buyer-requirement/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      //const { buyerId, productId, updatedData } = req.body;
      buyerId:userId,
      productId:requirementId,
      updatedData:data
    }),
  })
  if (!response.ok) throw new Error('Failed to update requirement')
  return response.json()
}