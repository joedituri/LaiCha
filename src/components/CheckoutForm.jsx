import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

function CheckoutForm({ amount, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('http://localhost:5000/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      setError('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
      <div style={{ 
        padding: '15px', 
        border: '1px solid #ddd', 
        borderRadius: '8px',
        marginBottom: '15px'
      }}>
        <CardElement />
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="place-order-btn"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
}

export default CheckoutForm;