"use client";
import { useState, useEffect, Suspense } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getContentByType } from "../../../helper";
import CheckoutFooter from "../component/footer";

interface SuccessPageData {
  page_title?: string;
  success_heading?: string;
  success_message?: string;
  order_details_heading?: string;
  next_steps_heading?: string;
  next_steps?: string[];
  contact_info?: {
    heading?: string;
    phone?: string;
    email?: string;
    hours?: string;
  };
  cta_buttons?: {
    return_home?: {
      text?: string;
      url?: string;
    };
    view_orders?: {
      text?: string;
      url?: string;
    };
  };
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successData, setSuccessData] = useState<SuccessPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get order data from URL params
  const selectedDate = searchParams.get('date');
  const totalTickets = searchParams.get('tickets');
  const yellowPass = searchParams.get('yellowPass');
  const redGreenPass = searchParams.get('redGreenPass');
  const totalPrice = searchParams.get('totalPrice');
  const orderId = searchParams.get('orderId') || `LPS-${Date.now()}`;
  const orderNumber = searchParams.get('orderNumber');
  const selectedVariantsParam = searchParams.get('selectedVariants');

  // Parse selected variants with error handling
  let selectedVariants = {};
  try {
    if (selectedVariantsParam) {
      selectedVariants = JSON.parse(selectedVariantsParam);
    }
  } catch (error) {
    console.error('Error parsing selectedVariants:', error);
    selectedVariants = {};
  }

  useEffect(() => {
    const fetchSuccessData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContentByType('success_page');
        if (response && response.length > 0) {
          const contentstackData = response[0];
          // Handle both direct fields and JSON field structure
          if (contentstackData.success_content) {
            // If data is in JSON field, parse it
            try {
              const parsedData = typeof contentstackData.success_content === 'string'
                ? JSON.parse(contentstackData.success_content)
                : contentstackData.success_content;
              setSuccessData(parsedData);
            } catch (e) {
              console.error('Error parsing success_content JSON:', e);
              setSuccessData(contentstackData);
            }
          } else {
            // If data is in direct fields
            setSuccessData(contentstackData);
          }
        } else {
          // Fallback data if no Contentstack data
          setSuccessData({
            page_title: "Payment Successful",
            success_heading: "Payment Successful!",
            success_message: "Thank you for your purchase. Your tickets have been confirmed and will be sent to your email shortly.",
            order_details_heading: "Order Details",
            next_steps_heading: "What's Next?",
            next_steps: [
              "You will receive a confirmation email with your tickets",
              "Please arrive 15 minutes before your scheduled time",
              "Bring a valid ID for verification",
              "Your tickets are valid for the selected date only"
            ],
            contact_info: {
              heading: "Need Help?",
              phone: "+61 2 9922 6644",
              email: "grelations@lunaparksydney.com",
              hours: "10:00 AM - 8:00 PM"
            },
            cta_buttons: {
              return_home: {
                text: "Return to Home",
                url: "/"
              },
              view_orders: {
                text: "View My Orders",
                url: "/orders"
              }
            }
          });
        }
      } catch (err) {
        console.error('Error fetching success data:', err);
        setError('Failed to load success page data');
      } finally {
        setLoading(false);
      }
    };

    fetchSuccessData();
  }, []);

  const handleReturnHome = () => {
    router.push(successData?.cta_buttons?.return_home?.url || '/');
  };

  const handleViewOrders = () => {
    router.push(successData?.cta_buttons?.view_orders?.url || '/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#aa3030]"></div>
      </div>
    );
  }

  if (error || !successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-bold">Error loading success page</p>
          <p>{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#0E5A6A]">Payment Confirmation</h1>
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-green-600 font-medium">Payment Successful</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#0E5A6A] mb-4">
              {successData.success_heading || "Payment Successful!"}
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              {successData.success_message || "Thank you for your purchase. Your tickets have been confirmed and will be sent to your email shortly."}
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold">
                {orderNumber ? `Order #${orderNumber}` : `Order ID: ${orderId}`}
              </p>
              {orderNumber && (
                <p className="text-green-700 text-sm mt-1">
                  This order has been created in Shopify and will appear in your admin dashboard.
                </p>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#0E5A6A] mb-4">
              {successData.order_details_heading || "Order Details"}
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              {/* Order Items */}
              {selectedVariants && Object.keys(selectedVariants).length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[#0E5A6A] mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {Object.values(selectedVariants)
                      .filter((item: any) => item && item.variant && item.quantity > 0)
                      .map((item: any, index: number) => {
                        const { variant, quantity } = item;
                        return (
                          <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">{variant?.title || 'Unknown Item'}</p>
                              <p className="text-sm text-gray-600">Quantity: {quantity || 0}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#0E5A6A]">
                                ${((parseFloat(variant?.price || '0') * (quantity || 0)).toFixed(2))}
                              </p>
                              <p className="text-sm text-gray-600">${parseFloat(variant?.price || '0').toFixed(2)} each</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Fallback Order Items from URL params */}
              {(!selectedVariants || Object.keys(selectedVariants).length === 0) && (yellowPass || redGreenPass) && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-[#0E5A6A] mb-3">Items Ordered</h4>
                  <div className="space-y-3">
                    {yellowPass && parseInt(yellowPass) > 0 && (
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">UNLIMITED RIDES PASS YELLOW</p>
                          <p className="text-sm text-gray-600">Quantity: {yellowPass}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#0E5A6A]">
                            ${(55 * parseInt(yellowPass)).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">$55.00 each</p>
                        </div>
                      </div>
                    )}
                    {redGreenPass && parseInt(redGreenPass) > 0 && (
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">UNLIMITED RIDES PASS RED/GREEN</p>
                          <p className="text-sm text-gray-600">Quantity: {redGreenPass}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[#0E5A6A]">
                            ${(45 * parseInt(redGreenPass)).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">$45.00 each</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Visit Date</p>
                  <p className="text-lg font-semibold text-[#0E5A6A]">
                    {selectedDate || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                  <p className="text-lg font-semibold text-[#0E5A6A]">
                    {totalTickets || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Yellow Pass</p>
                  <p className="text-lg font-semibold text-[#0E5A6A]">
                    {yellowPass || '0'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Red/Green Pass</p>
                  <p className="text-lg font-semibold text-[#0E5A6A]">
                    {redGreenPass || '0'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-[#aa3030]">
                    {totalPrice || '$0.00'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-[#0E5A6A] mb-4">
              {successData.next_steps_heading || "What's Next?"}
            </h3>
            <div className="space-y-3">
              {(successData.next_steps || []).map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#aa3030] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          {successData.contact_info && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-[#0E5A6A] mb-4">
                {successData.contact_info.heading || "Need Help?"}
              </h3>
              <div className="bg-[#0E5A6A] text-white rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-300">Phone</p>
                    <p className="text-lg font-semibold">
                      {successData.contact_info.phone || "+61 2 9922 6644"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Email</p>
                    <p className="text-lg font-semibold">
                      {successData.contact_info.email || "grelations@lunaparksydney.com"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Hours</p>
                    <p className="text-lg font-semibold">
                      {successData.contact_info.hours || "10:00 AM - 8:00 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleReturnHome}
              className="bg-[#aa3030] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#8a2525] transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{successData.cta_buttons?.return_home?.text || "Return to Home"}</span>
            </button>

            <button
              onClick={handleViewOrders}
              className="bg-white border-2 border-[#aa3030] text-[#aa3030] px-8 py-3 rounded-full font-semibold hover:bg-[#aa3030] hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{successData.cta_buttons?.view_orders?.text || "View My Orders"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <CheckoutFooter />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#aa3030]"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
