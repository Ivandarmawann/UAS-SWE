import { ApiResponse } from "@shared/schema";

const API_URL = 'https://script.google.com/macros/s/AKfycbwSxdhUGzge3dXCwtM0rFAt0kHw5NsiXUZ8tNE0hfRgCif4kgeKP5b_zgTG3lsxTJ7TPA/exec';

export async function makeAPICall<T = any>(
  data: any,
  endpoint?: string
): Promise<ApiResponse<T>> {
  try {
    let payload: any = {};
    
    if (endpoint === 'products') {
      payload = {
        sheet: 'Products',
        action: data.action,
        email: data.email,
        data: data.data
      };
      
      if (data.product_id) {
        payload.product_id = data.product_id;
      }
    } else if (endpoint === 'orders') {
      payload = {
        sheet: 'Orders',
        action: data.action,
        email: data.email
      };
      
      if (data.order_id) {
        payload.order_id = data.order_id;
      }
      
      if (data.data) {
        payload.data = data.data;
      }
      
      // For update operations, include order_status directly in payload
      if (data.action === 'update') {
        if (data.order_status) {
          payload.order_status = data.order_status;
        }
        if (data.data && data.data.order_status) {
          payload.order_status = data.data.order_status;
        }
      }
    } else {
      // For auth operations
      payload = {
        sheet: 'Users',
        action: data.action,
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        nomorHp: data.nomorHp,
        jurusan: data.jurusan,
        role: data.role
      };
    }
    
    console.log('Making API call with payload:', payload);
    
    // Send data directly as JSON string in the body (what Google Apps Script expects)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload)
    });
    
    console.log('API response received:', response.status, response.statusText);
    
    const responseText = await response.text();
    console.log('API response text:', responseText);
    
    // Check if response is HTML redirect
    if (responseText.includes('<HTML>') || responseText.includes('<html>')) {
      const redirectMatch = responseText.match(/HREF="([^"]+)"/);
      if (redirectMatch && redirectMatch[1]) {
        const redirectUrl = redirectMatch[1].replace(/&amp;/g, '&');
        console.log('Following redirect URL:', redirectUrl);
        
        const redirectResponse = await fetch(redirectUrl, {
          method: 'GET',
        });
        
        const redirectText = await redirectResponse.text();
        console.log('Redirect response:', redirectText);
        
        const result = JSON.parse(redirectText);
        return result;
      }
    }
    
    // Direct JSON response
    const result = JSON.parse(responseText);
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    
    // Return a more user-friendly error response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghubungi server'
    };
  }
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}
