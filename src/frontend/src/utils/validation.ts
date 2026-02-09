export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateMobile(mobile: string): string | null {
  if (!mobile || mobile.trim() === '') {
    return 'Mobile number is required';
  }
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length !== 10) {
    return 'Mobile number must be 10 digits';
  }
  return null;
}

export function validatePincode(pincode: string): string | null {
  if (!pincode || pincode.trim() === '') {
    return 'Pincode is required';
  }
  const cleaned = pincode.replace(/\D/g, '');
  if (cleaned.length !== 6) {
    return 'Pincode must be 6 digits';
  }
  return null;
}

export function validateQuantity(quantity: number, minQuantity: number): string | null {
  if (quantity < minQuantity) {
    return `Minimum order quantity is ${minQuantity}`;
  }
  return null;
}

export function validatePrice(price: string): string | null {
  const num = parseFloat(price);
  if (isNaN(num) || num <= 0) {
    return 'Price must be a positive number';
  }
  return null;
}

export function validateStock(stock: string): string | null {
  const num = parseInt(stock, 10);
  if (isNaN(num) || num < 0) {
    return 'Stock must be a non-negative number';
  }
  return null;
}
