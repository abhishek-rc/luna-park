"use client";
import React, { useState } from "react";

interface PaymentFormProps {
  paymentData: any;
  onSubmit: (formData: any) => void;
  onBack: () => void;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  postCode: string;
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  country: string;
  subscribeToEmails: boolean;
  agreeToTerms: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ paymentData, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    postCode: "",
    cardNumber: "",
    expirationDate: "",
    securityCode: "",
    country: "India",
    subscribeToEmails: false,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpirationDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + ' / ' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.postCode) {
      newErrors.postCode = "Post code is required";
    }

    if (!formData.cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = "Card number is invalid";
    }

    if (!formData.expirationDate) {
      newErrors.expirationDate = "Expiration date is required";
    } else if (formData.expirationDate.length < 7) {
      newErrors.expirationDate = "Expiration date is invalid";
    }

    if (!formData.securityCode) {
      newErrors.securityCode = "Security code is required";
    } else if (formData.securityCode.length < 3) {
      newErrors.securityCode = "Security code is invalid";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Payment submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Email Address */}
      <div>
        <h2 className="text-xl font-bold text-[#0E5A6A] mb-4">
          {paymentData?.email_address_heading || "EMAIL ADDRESS"}
        </h2>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={paymentData?.email_placeholder || "Enter your email address*"}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Billing Details */}
      <div>
        <h2 className="text-xl font-bold text-[#0E5A6A] mb-4">
          {paymentData?.billing_details_heading || "BILLING DETAILS"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder={paymentData?.first_name_placeholder || "First Name*"}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder={paymentData?.last_name_placeholder || "Last Name*"}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <input
            type="text"
            name="postCode"
            value={formData.postCode}
            onChange={handleInputChange}
            placeholder={paymentData?.post_code_placeholder || "Post Code*"}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
              errors.postCode ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.postCode && (
            <p className="text-red-500 text-sm mt-1">{errors.postCode}</p>
          )}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <h2 className="text-xl font-bold text-[#0E5A6A] mb-4">
          {paymentData?.payment_method_heading || "SELECT PAYMENT METHOD:"}
        </h2>
        
        {/* Pay by Card Option */}
        <div className="mb-6">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              defaultChecked
              className="w-5 h-5 text-[#aa3030] focus:ring-[#aa3030]"
            />
            <span className="text-lg font-semibold text-[#0E5A6A]">
              {paymentData?.pay_by_card_text || "PAY BY CARD"}
            </span>
          </label>
        </div>

        {/* Card Details */}
        <div className="space-y-4">
          {/* Card Number */}
          <div>
            <div className="relative">
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setFormData(prev => ({ ...prev, cardNumber: formatted }));
                }}
                placeholder={paymentData?.card_number_placeholder || "1234 1234 1234 1234"}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
                  errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={19}
              />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiration Date and Security Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={(e) => {
                  const formatted = formatExpirationDate(e.target.value);
                  setFormData(prev => ({ ...prev, expirationDate: formatted }));
                }}
                placeholder={paymentData?.expiration_placeholder || "MM / YY"}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
                  errors.expirationDate ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={7}
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expirationDate}</p>
              )}
            </div>
            <div>
              <input
                type="password"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleInputChange}
                placeholder={paymentData?.security_code_placeholder || "CVV"}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent ${
                  errors.securityCode ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={4}
                autoComplete="off"
              />
              {errors.securityCode && (
                <p className="text-red-500 text-sm mt-1">{errors.securityCode}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#aa3030] focus:border-transparent"
            >
              <option value="India">India</option>
              <option value="Australia">Australia</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-4">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="subscribeToEmails"
            checked={formData.subscribeToEmails}
            onChange={handleInputChange}
            className="w-5 h-5 text-[#aa3030] focus:ring-[#aa3030] mt-0.5"
          />
          <span className="text-sm text-gray-700">
            {paymentData?.subscribe_checkbox_text || "Subscribe to Luna Park emails for the latest news, events and offers"}
          </span>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className={`w-5 h-5 text-[#aa3030] focus:ring-[#aa3030] mt-0.5 ${
              errors.agreeToTerms ? 'border-red-500' : ''
            }`}
          />
          <span className="text-sm text-gray-700">
            {paymentData?.terms_checkbox_text || "I have read and agree to the "}
            <a href={paymentData?.terms_conditions_link || "#"} className="text-[#aa3030] underline hover:no-underline">
              Terms and Conditions
            </a>
            {paymentData?.terms_checkbox_text_continued || ", including the "}
            <a href={paymentData?.fair_trading_link || "#"} className="text-[#aa3030] underline hover:no-underline">
              Fair Trading Disclosures
            </a>
            {", "}
            <a href={paymentData?.privacy_policy_link || "#"} className="text-[#aa3030] underline hover:no-underline">
              Privacy Policy
            </a>
            {" and "}
            <a href={paymentData?.risk_warning_link || "#"} className="text-[#aa3030] underline hover:no-underline">
              Risk Warning Waiver
            </a>
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-sm">You must agree to the terms and conditions</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="text-[#aa3030] font-semibold hover:underline flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{paymentData?.back_button_text || "← BACK"}</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#aa3030] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#8a2525] transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>{isSubmitting ? "Processing..." : (paymentData?.pay_securely_button_text || "PAY SECURELY NOW")}</span>
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
