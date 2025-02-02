export async function getAllProductListings() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-product-listings`);
    if (!response.ok) {
        throw new Error('Failed to fetch product listings');
    }
    return response.json();
}

export async function updateProductListingsStatus(itemIds, newStatus) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin-product-listings/update-listings-status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemIds, newStatus }),
    });
    if (!response.ok) {
        throw new Error('Failed to update product listings');
    }
    return response.json();
}
