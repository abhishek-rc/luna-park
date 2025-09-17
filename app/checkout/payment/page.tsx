"use client";
import { useState, useEffect, Suspense } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PaymentForm from "./component/PaymentForm";
import OrderSummary from "./component/OrderSummary";
import CheckoutFooter from "../component/footer";
import { getContentByType } from "../../../helper";
import { OrderService, OrderData } from "../../../services/OrderService";

interface PaymentPageData {
  email_address_heading: string;
  email_placeholder: string;
  billing_details_heading: string;
  first_name_placeholder: string;
  last_name_placeholder: string;
  post_code_placeholder: string;
  payment_method_heading: string;
  pay_by_card_text: string;
  card_number_placeholder: string;
  expiration_placeholder: string;
  security_code_placeholder: string;
  country_placeholder: string;
  subscribe_checkbox_text: string;
  terms_checkbox_text: string;
  terms_conditions_link: string;
  privacy_policy_link: string;
  risk_warning_link: string;
  fair_trading_link: string;
  back_button_text: string;
  pay_securely_button_text: string;
  order_summary_heading: string;
  items_in_cart_text: string;
  apply_promotion_text: string;
  apply_gift_card_text: string;
  cart_subtotal_text: string;
  order_total_text: string;
  payment_methods: Array<{
    method_name: string;
    method_logo: {
      url: string;
      title: string;
    };
  }>;
  faq_section: {
    heading: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  support_section: {
    heading: string;
    contact_text: string;
    phone_number: string;
    email: string;
    faq_text: string;
  };
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get order data from URL params or context
  const selectedDate = searchParams.get('date');
  const totalTickets = searchParams.get('tickets');
  const yellowPass = searchParams.get('yellowPass');
  const redGreenPass = searchParams.get('redGreenPass');
  const totalPrice = searchParams.get('totalPrice');
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
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getContentByType('payment_page');
        if (response && response.length > 0) {
          setPaymentData(response[0]);
        } else {
          // Set fallback data if no Contentstack data
          setPaymentData({
            email_address_heading: "EMAIL ADDRESS",
            email_placeholder: "Enter your email address*",
            billing_details_heading: "BILLING DETAILS",
            first_name_placeholder: "First Name*",
            last_name_placeholder: "Last Name*",
            post_code_placeholder: "Post Code*",
            payment_method_heading: "SELECT PAYMENT METHOD:",
            pay_by_card_text: "PAY BY CARD",
            card_number_placeholder: "1234 1234 1234 1234",
            expiration_placeholder: "MM / YY",
            security_code_placeholder: "CVC",
            country_placeholder: "Country",
            subscribe_checkbox_text: "Subscribe to Luna Park emails for the latest news, events and offers",
            terms_checkbox_text: "I have read and agree to the Terms and Conditions, including the Fair Trading Disclosures, Privacy Policy and Risk Warning Waiver",
            terms_conditions_link: "#",
            privacy_policy_link: "#",
            risk_warning_link: "#",
            fair_trading_link: "#",
            back_button_text: "← BACK",
            pay_securely_button_text: "PAY SECURELY NOW",
            order_summary_heading: "ORDER SUMMARY",
            items_in_cart_text: "ITEMS IN CART",
            apply_promotion_text: "Apply Promotion Code",
            apply_gift_card_text: "Apply Gift Card",
            cart_subtotal_text: "CART SUBTOTAL:",
            order_total_text: "ORDER TOTAL:",
            payment_methods: [],
            faq_section: {
              heading: "Frequently Asked Questions",
              questions: []
            },
            support_section: {
              heading: "Need Assistance?",
              contact_text: "We are here to assist with any enquiries. Please get in touch with our team via email",
              phone_number: "+61 2 9922 6644",
              email: "grelations@lunaparksydney.com",
              faq_text: "Talk to our experts on live chat"
            }
          });
        }
      } catch (err) {
        console.error('Error fetching payment data:', err);
        // Set fallback data even on error
        setPaymentData({
          email_address_heading: "EMAIL ADDRESS",
          email_placeholder: "Enter your email address*",
          billing_details_heading: "BILLING DETAILS",
          first_name_placeholder: "First Name*",
          last_name_placeholder: "Last Name*",
          post_code_placeholder: "Post Code*",
          payment_method_heading: "SELECT PAYMENT METHOD:",
          pay_by_card_text: "PAY BY CARD",
          card_number_placeholder: "1234 1234 1234 1234",
          expiration_placeholder: "MM / YY",
          security_code_placeholder: "CVC",
          country_placeholder: "Country",
          subscribe_checkbox_text: "Subscribe to Luna Park emails for the latest news, events and offers",
          terms_checkbox_text: "I have read and agree to the Terms and Conditions, including the Fair Trading Disclosures, Privacy Policy and Risk Warning Waiver",
          terms_conditions_link: "#",
          privacy_policy_link: "#",
          risk_warning_link: "#",
          fair_trading_link: "#",
          back_button_text: "← BACK",
          pay_securely_button_text: "PAY SECURELY NOW",
          order_summary_heading: "ORDER SUMMARY",
          items_in_cart_text: "ITEMS IN CART",
          apply_promotion_text: "Apply Promotion Code",
          apply_gift_card_text: "Apply Gift Card",
          cart_subtotal_text: "CART SUBTOTAL:",
          order_total_text: "ORDER TOTAL:",
          payment_methods: [],
          faq_section: {
            heading: "Frequently Asked Questions",
            questions: []
          },
          support_section: {
            heading: "Need Assistance?",
            contact_text: "We are here to assist with any enquiries. Please get in touch with our team via email",
            phone_number: "+61 2 9922 6644",
            email: "grelations@lunaparksydney.com",
            faq_text: "Talk to our experts on live chat"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const handlePaymentSubmit = async (formData: any) => {
    try {

      // Prepare order items from selectedVariants
      const orderItems: Array<{
        variantId: string;
        quantity: number;
        price: number;
        title: string;
      }> = [];
      if (selectedVariants && typeof selectedVariants === 'object') {
        Object.values(selectedVariants).forEach((item: any) => {
          if (item && item.variant && item.quantity > 0) {
            const { variant, quantity } = item;
            orderItems.push({
              variantId: variant.id,
              quantity: quantity,
              price: parseFloat(variant.price),
              title: variant.title
            });
          }
        });
      }

      // Create order data
      const orderData: OrderData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        postCode: formData.postCode,
        selectedDate: selectedDate || '',
        items: orderItems,
        totalPrice: parseFloat(totalPrice?.replace('$', '') || '0')
      };

      // Validate order data
      const validation = OrderService.validateOrderData(orderData);
      if (!validation.isValid) {
        alert('Please check your order details: ' + validation.errors.join(', '));
        return;
      }

      // Create order in Shopify
      const orderResult = await OrderService.createOrder(orderData);

      if (orderResult.success) {
        // Prepare success page URL with order data
        const successParams = new URLSearchParams({
          orderId: orderResult.orderId || `LPS-${Date.now()}`,
          date: selectedDate || '',
          tickets: totalTickets || '',
          yellowPass: yellowPass || '',
          redGreenPass: redGreenPass || '',
          totalPrice: totalPrice || '',
          selectedVariants: JSON.stringify(selectedVariants)
        });

        // Redirect to success page with order data
        router.push(`/checkout/success?${successParams.toString()}`);
      } else {
        alert('Failed to create order: ' + orderResult.error);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred while processing your payment. Please try again.');
    }
  };

  const handleBackToCheckout = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#aa3030]"></div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-bold">Error loading payment page</p>
          <p>{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-[#0E5A6A]">REVIEW & PAYMENT</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Secure Checkout</span>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-green-600 font-medium">SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <PaymentForm
              paymentData={paymentData}
              onSubmit={handlePaymentSubmit}
              onBack={handleBackToCheckout}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              paymentData={paymentData}
              selectedDate={selectedDate}
              totalTickets={totalTickets}
              yellowPass={yellowPass}
              redGreenPass={redGreenPass}
              totalPrice={totalPrice}
              selectedVariants={selectedVariants}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <CheckoutFooter />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#aa3030]"></div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
