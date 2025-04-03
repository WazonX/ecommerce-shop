"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../Common/Auth/AuthContext";
import { useRouter } from "next/navigation";

export default function AddressSetup() {
  const [formData, setFormData] = useState({
    country: "",
    city: "",
    zipCode: "",
    street: "",
    cardNumber: "",
    expDate: "",
    cvc: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (!userInfo?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/user/address?userId=${userInfo.id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch address");
        }

        const data = await res.json();
        if (data.address) {
          // Format the zipCode with hyphen
          const formattedZipCode = data.address.zipCode.replace(/(\d{2})(\d{3})/, '$1-$2');
          
          setFormData(prev => ({
            ...prev,
            country: data.address.country || "",
            city: data.address.city || "",
            zipCode: formattedZipCode || "",
            street: data.address.street || ""
          }));
        }
      } catch (error) {
        console.error('Error fetching address:', error);
        setError("Failed to load address information");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAddress();
  }, [userInfo?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'zipCode') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as XX-XXX
      let formattedValue = digits;
      if (digits.length >= 2) {
        formattedValue = digits.slice(0, 2) + '-' + digits.slice(2, 5);
      }
      
      // Limit to 5 digits (plus hyphen)
      formattedValue = formattedValue.slice(0, 6);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'cardNumber') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as XXXX XXXX XXXX XXXX
      let formattedValue = digits.replace(/(\d{4})/g, '$1 ').trim();
      
      // Limit to 16 digits (plus spaces)
      formattedValue = formattedValue.slice(0, 19);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'expDate') {
      // Remove any non-digit characters
      const digits = value.replace(/\D/g, '');
      
      // Format as MM/YY
      let formattedValue = digits;
      if (digits.length >= 2) {
        formattedValue = digits.slice(0, 2) + '/' + digits.slice(2, 4);
      }
      
      // Limit to 5 characters (MM/YY)
      formattedValue = formattedValue.slice(0, 5);
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else if (name === 'cvc') {
      // Only allow digits and limit to 3 characters
      const digits = value.replace(/\D/g, '').slice(0, 3);
      
      setFormData(prev => ({
        ...prev,
        [name]: digits
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateZipCode = (zipCode: string) => {
    // Check if it matches the format XX-XXX
    return /^\d{2}-\d{3}$/.test(zipCode);
  };

  const validateCardNumber = (cardNumber: string) => {
    // Remove spaces and check if it's 16 digits
    return /^\d{16}$/.test(cardNumber.replace(/\s/g, ''));
  };

  const validateExpDate = (expDate: string) => {
    // Check if it matches the format MM/YY
    if (!/^\d{2}\/\d{2}$/.test(expDate)) return false;
    
    const [month, year] = expDate.split('/');
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    const expMonth = parseInt(month);
    const expYear = parseInt(year);
    
    // Check if month is valid (1-12)
    if (expMonth < 1 || expMonth > 12) return false;
    
    // Check if date is in the future
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) return false;
    
    return true;
  };

  const validateCVC = (cvc: string) => {
    return /^\d{3}$/.test(cvc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInfo?.id) {
      router.push('/Login');
      return;
    }

    // Validate all fields
    if (!validateZipCode(formData.zipCode) || 
        !validateCardNumber(formData.cardNumber) || 
        !validateExpDate(formData.expDate) || 
        !validateCVC(formData.cvc)) {
      setError('Please fill in all fields correctly');
      return;
    }

    try {
      const res = await fetch("/api/user/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo.id,
          ...formData
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save address");
      }

      // Clear the cart
      const clearCartRes = await fetch("/api/cart/clear", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userInfo.id
        }),
      });

      if (!clearCartRes.ok) {
        const errorData = await clearCartRes.json();
        throw new Error(errorData.error || "Failed to clear cart");
      }

      // Show success message
      setIsSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to save address");
    }
  };

  const handleBackToCart = () => {
    router.push('/Cart');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white p-8">
        <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-lg shadow-lg text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-zinc-300 mb-8">Your order has been processed successfully.</p>
          <button
            onClick={handleBackToCart}
            className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition-colors"
          >
            Back to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Delivery Address & Payment Setup</h1>
        
        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="country" className="block mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="city" className="block mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block mb-1">ZIP Code (XX-XXX)</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                maxLength={6}
                pattern="\d{2}-\d{3}"
                placeholder="XX-XXX"
                required
                className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.zipCode && !validateZipCode(formData.zipCode) && (
                <p className="text-red-500 text-sm mt-1">Please enter a valid ZIP code (XX-XXX)</p>
              )}
            </div>

            <div>
              <label htmlFor="street" className="block mb-1">Street Address</label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
                className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 border-t border-zinc-700">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block mb-1">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    maxLength={19}
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                    className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.cardNumber && !validateCardNumber(formData.cardNumber) && (
                    <p className="text-red-500 text-sm mt-1">Please enter a valid 16-digit card number</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expDate" className="block mb-1">Expiration Date</label>
                    <input
                      type="text"
                      id="expDate"
                      name="expDate"
                      value={formData.expDate}
                      onChange={handleChange}
                      maxLength={5}
                      placeholder="MM/YY"
                      required
                      className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.expDate && !validateExpDate(formData.expDate) && (
                      <p className="text-red-500 text-sm mt-1">Please enter a valid expiration date</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="cvc" className="block mb-1">CVC</label>
                    <input
                      type="text"
                      id="cvc"
                      name="cvc"
                      value={formData.cvc}
                      onChange={handleChange}
                      maxLength={3}
                      placeholder="123"
                      required
                      className="w-full bg-zinc-800 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.cvc && !validateCVC(formData.cvc) && (
                      <p className="text-red-500 text-sm mt-1">Please enter a valid 3-digit CVC</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition-colors"
            >
              Proceed to Checkout
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
