import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { retrievePaymentIntent } from '@stripe/stripe-react-native';
import { completeOrder } from '../config/services/order';

export default function PaymentScreen({amount, orderId, onError,onSucess }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const fetchPaymentSheetParams = async () => {
    try {
      const response = await axios.post('https://next.infovit.us/create-payment-intent/', {
        amount: parseInt(amount * 100, 10), 
      });

      return {
        paymentIntent: response.data.clientSecret,
      };
    } catch (error) {
     
      console.error('Payment Intent Error:', error);
      return {};
    }
  };

  const initializePaymentSheet = async () => {
    
    const { paymentIntent } = await fetchPaymentSheetParams();

    if (!paymentIntent) return;

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'MyApp',
    });

    if (error) {
      onError?.('Network Error. You may use cash on delivery');
      console.error('Init Error:', error);
    } else {
      setClientSecret(paymentIntent);
    }
  };


  useEffect(() => {
    if (amount && !isNaN(amount)) {
      initializePaymentSheet();
    }
  }, [amount]);
  

  const openPaymentSheet = async () => {
    if (!clientSecret) {
      onError?.('Payment sheet not ready');
      return;
    }

    setLoading(true);
    const { error } = await presentPaymentSheet({ clientSecret });

    if (error) {
      onError?.('Payment Failed', error.message);
      console.error('Payment Error:', error);
    } else {
     
      const { paymentIntent, error: retrieveError } = await retrievePaymentIntent(clientSecret);
  
      if (retrieveError) {
        console.error('Failed to retrieve payment intent:', retrieveError);
        onError?.('Payment succeeded, but failed to retrieve confirmation.');
        setLoading(false);
        return;
      }
  
       
      Alert.alert('Success', 'Your payment is confirmed!');
     onSucess?.(true);
  
      
      if (orderId && paymentIntent?.id) {
        try {
          await completeOrder({
            orderId,
            stripePaymentId: paymentIntent.id,
          });
        } catch (e) {
          console.error('Failed to mark order as complete:', e);
          Alert.alert('Error', 'Payment succeeded but failed to update order.');
        }
      }
    }
  
    setLoading(false);
  };
  



  return (
    <View style={{ padding: 0, width: '100%',marginVertical:4 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Pay with Stripe</Text>

      <TouchableOpacity
        style={{
          backgroundColor: '#635BFF',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 10,
          borderRadius: 2,
          opacity: loading || !clientSecret ? 0.6 : 1,
        }}
        onPress={openPaymentSheet}
        disabled={loading || !clientSecret}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Image
            source={require('../../assets/images/stripe.png')}
            style={{ width: 118, height: 38 }}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}
