// Script to create a Medusa sales channel
const Medusa = require('@medusajs/medusa-js').default;

const medusa = new Medusa({
  baseUrl: 'http://localhost:9000', // Change if your Medusa server runs elsewhere
  apiKey: 'your-admin-api-key' // Replace with your actual admin API key
});

async function createSalesChannel() {
  try {
    const channel = await medusa.admin.salesChannel.create({
      name: 'Default Storefront',
      description: 'Main sales channel for API key access'
    });
    console.log('Created sales channel:', channel);
  } catch (err) {
    console.error('Error creating sales channel:', err);
  }
}

createSalesChannel();
