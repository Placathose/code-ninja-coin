// Cloudinary upload utility
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'reward_items') // You'll need to create this preset in Cloudinary
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload image')
  }
}

// Image validation utility
export const validateImage = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 20 * 1024 * 1024 // 20MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image size must be less than 20MB' }
  }

  return { valid: true }
}
