'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

async function uploadToCloudinary(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !preset) {
    throw new Error('Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', preset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Image upload failed.');
  }

  const json = await response.json();
  return json.secure_url;
}

export function ProductForm({ mode, productId, defaultValues }) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(defaultValues?.images ?? []);
  const [notification, setNotification] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: defaultValues?.title ?? '',
      description: defaultValues?.description ?? '',
      category: defaultValues?.category ?? '',
      price: defaultValues?.price ?? 0,
      featuresInput: defaultValues?.features.join(', ') ?? '',
      stackInput: defaultValues?.technologyStack.join(', ') ?? '',
      freelancerAvailable: defaultValues?.freelancerAvailable ?? false,
    },
  });

  const submitLabel = useMemo(() => (mode === 'create' ? 'Create product' : 'Update product'), [mode]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    setNotification(null);

    try {
      const uploadedUrls = await Promise.all(selectedFiles.map((file) => uploadToCloudinary(file)));
      const images = [...existingImages, ...uploadedUrls];

      const payload = {
        title: values.title,
        description: values.description,
        category: values.category,
        price: Number(values.price),
        features: values.featuresInput.split(',').map((item) => item.trim()).filter(Boolean),
        technologyStack: values.stackInput.split(',').map((item) => item.trim()).filter(Boolean),
        freelancerAvailable: values.freelancerAvailable,
        images,
      };

      const url = mode === 'create' ? '/api/seller/products' : `/api/seller/products/${productId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Request failed');
      }

      setNotification({ type: 'success', message: mode === 'create' ? 'Product created successfully.' : 'Product updated successfully.' });
      router.push('/seller/products');
      router.refresh();
    } catch (error) {
      setNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Something went wrong while saving the product.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: 12 }}>
      {notification ? (
        <p style={{ color: notification.type === 'error' ? '#b91c1c' : '#15803d' }}>{notification.message}</p>
      ) : null}
      <label>Title<input {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Minimum 3 characters' } })} /></label>
      {errors.title ? <p style={{ color: '#b91c1c' }}>{errors.title.message}</p> : null}
      <label>Description<textarea {...register('description', { required: 'Description is required', minLength: { value: 20, message: 'Minimum 20 characters' } })} /></label>
      {errors.description ? <p style={{ color: '#b91c1c' }}>{errors.description.message}</p> : null}
      <label>Category<input {...register('category', { required: 'Category is required' })} /></label>
      {errors.category ? <p style={{ color: '#b91c1c' }}>{errors.category.message}</p> : null}
      <label>Price (USD)<input type="number" step="0.01" {...register('price', { required: true, min: { value: 1, message: 'Price must be greater than 0' } })} /></label>
      {errors.price ? <p style={{ color: '#b91c1c' }}>{errors.price.message}</p> : null}
      <label>Features (comma separated)<input {...register('featuresInput')} /></label>
      <label>Technology stack (comma separated)<input {...register('stackInput')} /></label>
      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}><input type="checkbox" {...register('freelancerAvailable')} />Freelancer available for service delivery</label>
      {existingImages.length ? <div><p>Existing images:</p><ul>{existingImages.map((image) => <li key={image}><a href={image} target="_blank" rel="noreferrer">{image}</a> <button type="button" onClick={() => setExistingImages((current) => current.filter((entry) => entry !== image))}>Remove</button></li>)}</ul></div> : null}
      <label>Upload images<input type="file" accept="image/*" multiple onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))} /></label>
      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : submitLabel}</button>
    </form>
  );
}
