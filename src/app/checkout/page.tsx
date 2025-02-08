"use client"
import React, { useEffect, useState } from 'react'
import { Product } from '../../../types/products'
import { getCartItems } from '../actions/actions'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { form } from 'sanity/structure'
import { FaBeer, FaGreaterThan } from 'react-icons/fa'
import { client } from '@/sanity/lib/client'

const CheckOut = () => {

  const [cartItems, setCartItems] = useState<Product[]>([])
  const [discount, setDiscount] = useState<number>(0)
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email:"",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState ({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    zipCode: false ,
    city: false,
  });

  useEffect(() => {
    setCartItems(getCartItems());
    const appliedDiscount = localStorage.getItem("appliedDiscount");
    if (appliedDiscount) {
        setDiscount(Number(appliedDiscount));
    }
  }, []);

  const subTotal = cartItems.reduce(
    (total, item) => total + item.price * item.stockLevel, 0);
    const total = Math.max(subTotal - discount, 0);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        });
    };

    const validateForm = () => {
        const errors = {
            firstName : !formValues.firstName,
            lastName : !formValues.lastName,
            email: !formValues.email,
            phone: !formValues.phone,
            address: !formValues.address,
            zipCode: !formValues.zipCode,
            city: !formValues.city,
        };
        setFormErrors(errors);
        return Object.values(errors).every((error) => !error);
    }
    const handlePlaceOrder = () => {
        if(validateForm()) {
            localStorage.removeItem("appliedDiscount");
        }
        const orderData = {
            _type: 'order',
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            address: formValues.address,
            city: formValues.city,
            zipCode: formValues.zipCode,
            phone: formValues.phone,
            email: formValues.email,
    
            cartItems: cartItems.map(item => ({
                _type: 'reference',
                _ref: item._id
            })),
            total : subTotal,
            discount: discount,
            orderDate: new Date().toISOString
            
        };
        try{
             client.create(orderData)
            localStorage.removeItem("appliedDiscount")
        } catch (error) {
                console.error("error creating order" , error)
            }
        };

  return (
    <div className='min-h-screen bg-gray-50'>
        <div className='mt-6'>
            <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                <nav className='flex items-center gap-2 py-4'>
                    <Link href="/cart"
                    className='text-[#666666] hover:text-black transition text-sm'>Cart</Link>
                    <FaGreaterThan/>
                    <span>CheckOut</span>
                </nav>
            </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-col-1 lg:grid-col-2 gap-8">
                <div className='bg-white border rounded-lg p-6 space-y-6'>
                    <h2 className='text-lg font-semibold mb-4'> Order Summary</h2>
                    {getCartItems().length > 0 ? (
                        getCartItems().map((item) => (
                            <div key={item._id} className='flex items-center gap-4 py-3 border-b'>
                                <div className='w-16 h-16 rounded overflow-hidden'>
                                    {item.image && (
                                        <Image
                                        src={urlFor(item.image).url()}
                                        alt={item.name}
                                        width={50}
                                        height={50}
                                        className='object-cover w-full h-full'
                                        />
                                    )}
                                </div>
                                <div className='flex-1'>
                                <h3 className='text-sm font-medium'>
                                {item.name}
                                </h3>
                                <p className='text-xs text-gray-500'>Quantity : {item.stockLevel}</p>
                                 </div>
                                <p>${item.price * item.stockLevel}
                                </p>
                                </div>
                            ))
                        ) : (
                            <p className='text-xs font-medium'>No items in cart</p>
                        )}
                        <div className='text-right pt-4'>
                            <p className='text-sm'>
                                SubTotal: <span className='font-medium'>${subTotal}</span>
                            </p>
                            <p className='text-sm'>
                                Discount: <span className='font-medium'>${discount}</span>
                            </p>
                            <p className='text-lg font-semibold'>
                                Total: ${subTotal}
                            </p>
                        </div>
                </div>
                <div className='bg-white border rounded-lg p-6 space-y-6'>
                    <h2>Billing Information</h2>
                    <div>
                        <div>
                            <label htmlFor='firstName'> First Name </label>
                            <input type="text" 
                            id='firstName'
                            placeholder='Enter Your First Name'
                            value={formValues.firstName}
                            onChange={handleInputChange}

                             />
                             {formErrors.firstName && (
                                <p className='text-sm text-red-500'>
                                    First Name is Required
                                </p>
                             )}
                        </div>
                        <div>
                            <label htmlFor='lastName'> Last Name </label>
                            <input type="text" 
                            id='lastName'
                            placeholder='Enter Your Last Name'
                            value={formValues.lastName}
                            onChange={handleInputChange}
                             />
                             {formErrors.lastName && 
                                <p className='text-sm text-red-500'>
                                    Last Name is Required
                                </p>
                             }
                        </div>
                        <div>
                            <label htmlFor='address'>Address </label>
                            <input type="address" 
                            id='address'
                            placeholder='Enter Your Address'
                            value={formValues.address}
                            onChange={handleInputChange}
                             />
                             {formErrors.address && 
                                <p className='text-sm text-red-500'>
                                    Address is Required
                                </p>
                             }
                        </div>
                        <div>
                            <label htmlFor='email'>Email </label>
                            <input type="email" 
                            id='email'
                            placeholder='Enter Your Email'
                            value={formValues.email}
                            onChange={handleInputChange}
                             />
                             {formErrors.email && 
                                <p className='text-sm text-red-500'>
                                    Email is Required
                                </p>
                             }
                        </div>
                        <div>
                            <label htmlFor='phone'>Phone </label>
                            <input type="phone" 
                            id='phone'
                            placeholder='Enter Your Phone'
                            value={formValues.phone}
                            onChange={handleInputChange}
                             />
                             {formErrors.phone && 
                                <p className='text-sm text-red-500'>
                                    Phone is Required
                                </p>
                             }
                        </div>
                        <div>
                            <label htmlFor='zipCode'>Zip Code </label>
                            <input type="zipCode" 
                            id='zipCode'
                            placeholder='Enter Your ZipCode'
                            value={formValues.zipCode}
                            onChange={handleInputChange}
                             />
                             {formErrors.zipCode && 
                                <p className='text-sm text-red-500'>
                                    Zip Code is Required
                                </p>
                             }
                        </div>
                        <div>
                            <label htmlFor='city'>City </label>
                            <input type="city" 
                            id='city'
                            placeholder='Enter Your City'
                            value={formValues.city}
                            onChange={handleInputChange}
                             />
                             {formErrors.city && 
                                <p className='text-sm text-red-500'>City is Required </p>
                             }
                        </div>
                        <button className='w-full h-12 bg-blue-500 hover:bg-blue-700 text-white'
                        onClick={handlePlaceOrder}
                        >
                        Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default CheckOut;