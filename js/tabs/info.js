/**
 * Info tab renderer — patient details, medical summary, and owner information.
 * @module tabs/info
 */

/**
 * Render the info tab.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet, client, species, breed, etc.
 * @returns {string} HTML string
 */
export function renderInfoTab(idx, ctx) {
  if (ctx.pet === '\u2014') {
    return `
      <div class="tab-section">
        <div class="tab-section-title"><i data-lucide="package"></i> Product Information</div>
        <div class="info-grid">
          <div><div class="info-label">Product</div><div class="info-value">Metacam (Meloxicam)</div></div>
          <div><div class="info-label">Form</div><div class="info-value">1.5mg/mL oral suspension</div></div>
          <div><div class="info-label">Supplier</div><div class="info-value">Boehringer Ingelheim</div></div>
          <div><div class="info-label">SKU</div><div class="info-value">MET-15-100</div></div>
          <div><div class="info-label">Category</div><div class="info-value">NSAID \u2014 Anti-inflammatory</div></div>
          <div><div class="info-label">Controlled</div><div class="info-value">No</div></div>
          <div><div class="info-label">Current Stock</div><div class="info-value" style="color:#e5534b;font-weight:600">3 units</div></div>
          <div><div class="info-label">Reorder Level</div><div class="info-value">5 units</div></div>
          <div><div class="info-label">Unit Cost</div><div class="info-value">$28.50</div></div>
          <div><div class="info-label">Retail Price</div><div class="info-value">$45.00</div></div>
        </div>
      </div>`;
  }

  const email = ctx.client.toLowerCase().replace(' ', '.') + '@email.com';

  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="paw-print"></i> Patient Details</div>
      <div class="info-grid">
        <div><div class="info-label">Name</div><div class="info-value">${ctx.pet}</div></div>
        <div><div class="info-label">Patient ID</div><div class="info-value">${ctx.id}</div></div>
        <div><div class="info-label">Species</div><div class="info-value">${ctx.species}</div></div>
        <div><div class="info-label">Breed</div><div class="info-value">${ctx.breed}</div></div>
        <div><div class="info-label">Sex</div><div class="info-value">${ctx.sex}</div></div>
        <div><div class="info-label">Age</div><div class="info-value">${ctx.age}</div></div>
        <div><div class="info-label">Weight</div><div class="info-value">${ctx.weight}</div></div>
        <div><div class="info-label">Date of Birth</div><div class="info-value">${ctx.dob}</div></div>
        <div><div class="info-label">Microchip</div><div class="info-value">985112003456789</div></div>
        <div><div class="info-label">Colour</div><div class="info-value">${ctx.species === 'Feline' ? 'Seal point' : 'Golden'}</div></div>
      </div>
    </div>
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="heart-pulse"></i> Medical Summary</div>
      <div class="info-grid">
        <div><div class="info-label">Allergies</div><div class="info-value">None known</div></div>
        <div><div class="info-label">Chronic Conditions</div><div class="info-value">None</div></div>
        <div><div class="info-label">Last Vaccination</div><div class="info-value">Feb 28, 2026</div></div>
        <div><div class="info-label">Last Visit</div><div class="info-value">Mar 14, 2026</div></div>
        <div><div class="info-label">Primary Vet</div><div class="info-value">Dr. Sarah Smith</div></div>
        <div><div class="info-label">Insurance</div><div class="info-value">PetSecure \u2014 Policy #PS-449821</div></div>
      </div>
    </div>
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="user"></i> Owner Information</div>
      <div class="info-grid">
        <div><div class="info-label">Name</div><div class="info-value">${ctx.client}</div></div>
        <div><div class="info-label">Email</div><div class="info-value">${email}</div></div>
        <div><div class="info-label">Phone</div><div class="info-value">+1 (555) 012-3456</div></div>
        <div><div class="info-label">Address</div><div class="info-value">123 Main St, Toronto, ON</div></div>
        <div><div class="info-label">Client Since</div><div class="info-value">Jan 2024</div></div>
        <div><div class="info-label">Preferred Contact</div><div class="info-value">Email</div></div>
      </div>
    </div>`;
}
