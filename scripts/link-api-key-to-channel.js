// Script to link a publishable API key to a Medusa sales channel
const Medusa = require('@medusajs/medusa-js').default;

const medusa = new Medusa({
  baseUrl: 'http://localhost:9000', // Change if your Medusa server runs elsewhere
  apiKey: 'your-admin-api-key' // Replace with your actual admin API key
});

async function linkKey() {
  try {
    const keyId = 'pk_7733e352d0f19809a78038c1f0ce5c31bf9a3c5dd90da3bb63f0e46242635e82'; // Your publishable key
    const channelId = 'your-sales-channel-id'; // Replace with the ID from the previous script
    await medusa.admin.publishableApiKey.update(keyId, {
      sales_channel_ids: [channelId]
    });
    console.log('Linked publishable key to sales channel');
  } catch (err) {
    console.error('Error linking key:', err);
  }
}

linkKey();
