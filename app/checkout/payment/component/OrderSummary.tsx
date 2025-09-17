"use client";
import React, { useState } from "react";

interface OrderSummaryProps {
  paymentData: any;
  selectedDate: string | null;
  totalTickets: string | null;
  yellowPass: string | null;
  redGreenPass: string | null;
  totalPrice: string | null;
  selectedVariants?: { [key: string]: { variant: any; quantity: number } };
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  paymentData,
  selectedDate,
  totalTickets,
  yellowPass,
  redGreenPass,
  totalPrice,
  selectedVariants = {},
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Create cart items from the selectedVariants data
  const cartItems = [];
  
  if (selectedVariants && typeof selectedVariants === 'object') {
    Object.values(selectedVariants).forEach((item: any, index: number) => {
      if (item && item.variant && item.quantity > 0) {
        const { variant, quantity } = item;
        cartItems.push({
          id: variant.id || index,
          name: variant.title || "UNLIMITED RIDES PASS",
          price: parseFloat(variant.price) || 0,
          quantity: quantity,
          image: "/ticket-pass-h.svg"
        });
      }
    });
  }

  // Fallback to URL params if no variants data
  if (cartItems.length === 0) {
    if (yellowPass && parseInt(yellowPass) > 0) {
      cartItems.push({
        id: 1,
        name: "UNLIMITED RIDES PASS YELLOW",
        price: 55.00,
        quantity: parseInt(yellowPass),
        image: "/ticket-pass-h.svg"
      });
    }
    
    if (redGreenPass && parseInt(redGreenPass) > 0) {
      cartItems.push({
        id: 2,
        name: "UNLIMITED RIDES PASS RED/GREEN",
        price: 45.00,
        quantity: parseInt(redGreenPass),
        image: "/ticket-pass-h.svg"
      });
    }
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#0E5A6A]">
          {paymentData?.order_summary_heading || "ORDER SUMMARY"}
        </h3>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-[#0E5A6A] hover:text-[#aa3030] transition-colors"
        >
          <svg
            className={`w-5 h-5 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Items Count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          {totalItems} {paymentData?.items_in_cart_text || "ITEMS IN CART"}
        </span>
      </div>

      {!isCollapsed && (
        <>
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#0E5A6A]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-semibold text-[#0E5A6A]">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          {/* Promotions and Gift Cards */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-[#aa3030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {paymentData?.apply_promotion_text || "Apply Promotion Code"}
                </span>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-[#aa3030]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  {paymentData?.apply_gift_card_text || "Apply Gift Card"}
                </span>
              </div>
            </button>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                {paymentData?.cart_subtotal_text || "CART SUBTOTAL:"}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-[#0E5A6A]">
                {paymentData?.order_total_text || "ORDER TOTAL:"}
              </span>
              <span className="text-lg font-bold text-[#0E5A6A]">
                {totalPrice || `$${subtotal.toFixed(2)}`}
              </span>
            </div>
          </div>
        </>
      )}

      {/* Payment Methods */}
      {paymentData?.payment_methods && paymentData.payment_methods.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            {paymentData.payment_methods.map((method: any, index: number) => (
              <div key={index} className="flex items-center">
                {method.method_logo && method.method_logo.url ? (
                  <img
                    src={method.method_logo.url}
                    alt={method.method_name || 'Payment Method'}
                    className="h-6 w-auto"
                  />
                ) : (
                  <span className="text-xs font-semibold text-gray-600 px-2 py-1 bg-gray-100 rounded">
                    {method.method_name || 'Payment'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Default Payment Methods if none from Contentstack */}
      {(!paymentData?.payment_methods || paymentData.payment_methods.length === 0) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
            <div className="w-12 h-8 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
            <div className="w-12 h-8 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">AE</div>
            <div className="w-12 h-8 bg-orange-600 rounded text-white text-xs flex items-center justify-center font-bold">AP</div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      {paymentData?.faq_section && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-lg font-semibold text-[#0E5A6A] mb-4">
            {paymentData.faq_section.heading || "Frequently Asked Questions"}
          </h4>
          <div className="space-y-4">
            {paymentData.faq_section.questions?.slice(0, 4).map((faq: any, index: number) => (
              <div key={index}>
                <h5 className="text-sm font-semibold text-gray-900 mb-1">
                  {faq.question}
                </h5>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support Section */}
      {paymentData?.support_section && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-[#0E5A6A] mb-2">
              {paymentData.support_section.heading || "Need Assistance?"}
            </h4>
            <p className="text-xs text-gray-600 mb-3">
              {paymentData.support_section.contact_text || "We are here to assist with any enquiries. Please get in touch with our team via email"}
            </p>
            <div className="space-y-1">
              <p className="text-xs text-[#0E5A6A] font-medium">
                {paymentData.support_section.phone_number || "+61 2 9922 6644"}
              </p>
              <p className="text-xs text-[#0E5A6A] font-medium">
                {paymentData.support_section.email || "grelations@lunaparksydney.com"}
              </p>
              <p className="text-xs text-[#0E5A6A] font-medium">
                {paymentData.support_section.faq_text || "Talk to our experts on live chat"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
