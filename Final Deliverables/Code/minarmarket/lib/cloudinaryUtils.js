/**
 * Uploads images to Cloudinary and returns array of uploaded image objects
 * @param {File[] | Object[]} images - Array of image files or image objects
 * @returns {Promise<Array>} - Array of uploaded image objects with name and url
 */
export async function uploadImagesToCloudinary(images) {
  if (!images || images.length === 0) return [];
  
  // Filter out images that are already uploaded (have url property)
  const filesToUpload = images.filter(img => img instanceof File);
  const alreadyUploadedImages = images.filter(img => !(img instanceof File));
  
  const uploadPromises = filesToUpload.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'xxy7dsyf'); // Replace with your Cloudinary upload preset
    console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();
      return {
        name: file.name,
        url: data.secure_url,
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  });

  const uploadedImages = await Promise.all(uploadPromises);
  return [...alreadyUploadedImages, ...uploadedImages];
}
