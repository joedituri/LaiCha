const API_URL = 'http://localhost:5000';
// const API_URL = import.meta.env.VITE_API_URL 

class APIService {
  async getMenu() {
    try {
      const response = await fetch(`${API_URL}/api/menu`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching menu:', error);
      throw error;
    }
  }

  async createOrder(orderData) {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrder(orderId) {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch order');
      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }
}

export default new APIService();
