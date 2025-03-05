
/**
 * Coinchange Earn Widget
 * Embed script for non-technical users to add the Earn widget to their websites
 * 
 * Usage:
 * <script src="https://your-domain.com/widget.js" data-partner-id="partner-123"></script>
 */
(function() {
  // Get configuration from script tag
  const currentScript = document.currentScript;
  const partnerId = currentScript.getAttribute('data-partner-id') || 'default';
  const theme = currentScript.getAttribute('data-theme') || 'light';
  const containerId = currentScript.getAttribute('data-container-id') || null;
  
  // Configuration
  const API_BASE_URL = currentScript.getAttribute('data-api-url') || 'https://api-sandbox.coinchange.io';
  
  // Widget styles
  const styles = `
    .cc-earn-widget {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 500px;
      margin: 0 auto;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      background-color: #ffffff;
      color: #0f172a;
    }
    .cc-earn-widget-header {
      font-weight: 700;
      font-size: 1.25rem;
      margin-bottom: 16px;
    }
    .cc-earn-product {
      padding: 16px;
      margin-bottom: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background-color: #f8fafc;
    }
    .cc-earn-product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .cc-earn-product-name {
      font-weight: 600;
      font-size: 1.125rem;
    }
    .cc-earn-product-apy {
      font-weight: 700;
      font-size: 1.25rem;
      color: #059669;
    }
    .cc-earn-product-button {
      background-color: #1e3a8a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-weight: 500;
      cursor: pointer;
      width: 100%;
    }
    .cc-earn-product-button:hover {
      background-color: #1e40af;
    }
    .cc-earn-loading {
      text-align: center;
      padding: 24px;
    }
    .cc-earn-error {
      text-align: center;
      padding: 24px;
      color: #dc2626;
    }
  `;
  
  // Add styles to document
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
  
  // Create widget container
  let container;
  if (containerId) {
    container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found`);
      return;
    }
  } else {
    container = document.createElement('div');
    container.className = 'cc-earn-widget-container';
    
    // Insert the widget where the script tag was placed
    currentScript.parentNode.insertBefore(container, currentScript);
  }
  
  // Show loading state
  container.innerHTML = `
    <div class="cc-earn-widget">
      <div class="cc-earn-loading">Loading Earn products...</div>
    </div>
  `;
  
  // Fetch partner configuration 
  fetch(`${API_BASE_URL}/partner-config/${partnerId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch partner configuration');
      }
      return response.json();
    })
    .then(partnerConfig => {
      // Fetch products
      return fetch(`${partnerConfig.baseUrl || API_BASE_URL}/api/yaas/v1/products/`, {
        headers: {
          'Authorization': `Bearer ${partnerConfig.apiKey || ''}`,
          'X-Partner-ID': partnerId
        }
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    })
    .then(products => {
      // Render products
      renderProducts(container, products);
    })
    .catch(error => {
      console.error('Earn Widget Error:', error);
      
      // Show error state
      container.innerHTML = `
        <div class="cc-earn-widget">
          <div class="cc-earn-error">
            Failed to load Earn products. Please try again later.
          </div>
        </div>
      `;
    });
  
  // Render products in the container
  function renderProducts(container, products) {
    if (!products || products.length === 0) {
      container.innerHTML = `
        <div class="cc-earn-widget">
          <div class="cc-earn-header">Earn Products</div>
          <div class="cc-earn-loading">No products available</div>
        </div>
      `;
      return;
    }
    
    const productHtml = products.map(product => `
      <div class="cc-earn-product">
        <div class="cc-earn-product-header">
          <div>
            <div class="cc-earn-product-name">${product.currency}</div>
            <div class="cc-earn-product-description">${product.description}</div>
          </div>
          <div class="cc-earn-product-apy">${product.apy}% APY</div>
        </div>
        <button class="cc-earn-product-button" data-product-id="${product.id}">
          Earn Now
        </button>
      </div>
    `).join('');
    
    container.innerHTML = `
      <div class="cc-earn-widget">
        <div class="cc-earn-header">Earn Products</div>
        ${productHtml}
      </div>
    `;
    
    // Add click handlers
    container.querySelectorAll('.cc-earn-product-button').forEach(button => {
      button.addEventListener('click', () => {
        const productId = button.getAttribute('data-product-id');
        const product = products.find(p => p.id === productId);
        
        // Dispatch custom event that partners can listen for
        const event = new CustomEvent('earnProductSelected', { 
          detail: { product, partnerId } 
        });
        document.dispatchEvent(event);
        
        // Redirect to partner dashboard if data-redirect is set
        const redirectUrl = currentScript.getAttribute('data-redirect');
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }
      });
    });
  }
})();
