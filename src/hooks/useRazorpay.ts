import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface PaymentOptions {
  amount: number;
  name: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess?: (response: RazorpayResponse) => void;
  onError?: (error: Error) => void;
  onDismiss?: () => void;
}

export const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if script is already loaded
    if (window.Razorpay) {
      setIsScriptLoaded(true);
      return;
    }

    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway',
        variant: 'destructive',
      });
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const initiatePayment = useCallback(async (options: PaymentOptions) => {
    if (!isScriptLoaded) {
      toast({
        title: 'Please wait',
        description: 'Payment gateway is loading...',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order via edge function
      const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: {
          amount: options.amount,
          notes: options.notes,
        },
      });

      if (error || !data) {
        throw new Error(error?.message || 'Failed to create order');
      }

      const { orderId, amount, currency, keyId } = data;

      // Open Razorpay checkout
      const razorpayOptions: RazorpayOptions = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: options.name,
        description: options.description,
        order_id: orderId,
        handler: (response) => {
          setIsLoading(false);
          toast({
            title: 'Payment Successful!',
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          options.onSuccess?.(response);
        },
        prefill: options.prefill,
        theme: {
          color: '#10b981', // Primary green color
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            options.onDismiss?.();
          },
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error) {
      setIsLoading(false);
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
      options.onError?.(error instanceof Error ? error : new Error('Payment failed'));
    }
  }, [isScriptLoaded]);

  return {
    initiatePayment,
    isLoading,
    isScriptLoaded,
  };
};
