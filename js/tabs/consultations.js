/**
 * Consultations tab renderer — active SOAP note with AI scribe and orders.
 * @module tabs/consultations
 */

/**
 * Render the consultations tab.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet, species, weight
 * @returns {string} HTML string
 */
export function renderConsultationsTab(idx, ctx) {
  return `
    <div class="consultation-active">
      <div class="consultation-header">
        <div class="consultation-header-left">
          <span class="status-pill active dot">In Progress</span>
          <span class="consultation-date">Mar 18, 2026</span>
          <span class="consultation-vet"><i data-lucide="user"></i> Dr. Sarah Smith</span>
        </div>
        <div class="consultation-header-right">
          <button class="consultation-action-btn" title="AI Scribe"><i data-lucide="mic"></i> AI Scribe</button>
          <button class="consultation-action-btn consultation-action-primary" title="Finalize"><i data-lucide="check"></i> Finalize</button>
        </div>
      </div>

      <div class="consultation-reason">
        <div class="consultation-label">Reason for Visit</div>
        <div class="consultation-reason-text">Annual wellness exam \u2014 ${ctx.pet}</div>
      </div>

      <div class="soap-grid">
        <div class="soap-section">
          <div class="soap-label"><span class="soap-letter">S</span> Subjective</div>
          <textarea class="soap-textarea" placeholder="Owner's observations, history, complaints...">${ctx.pet === '\u2014' ? '' : 'Owner reports ' + ctx.pet + ' is eating and drinking normally. No vomiting, diarrhea, or coughing. Activity level unchanged. Owner notes occasional scratching at left ear for the past week.'}</textarea>
        </div>
        <div class="soap-section">
          <div class="soap-label"><span class="soap-letter">O</span> Objective</div>
          <textarea class="soap-textarea" placeholder="Physical exam findings, vitals, test results...">${ctx.pet === '\u2014' ? '' : 'Weight: ' + ctx.weight + '. Temp: 38.5\u00B0C. HR: 90 bpm. RR: 18/min. BCS: 5/9. Mucous membranes pink and moist. CRT < 2s. Heart and lungs auscultate normally. Abdomen soft, non-painful. Mild ceruminous debris in left ear canal, no erythema. Dental grade 1 \u2014 mild tartar on upper premolars.'}</textarea>
        </div>
        <div class="soap-section">
          <div class="soap-label"><span class="soap-letter">A</span> Assessment</div>
          <textarea class="soap-textarea" placeholder="Diagnosis, differential diagnoses...">${ctx.pet === '\u2014' ? '' : 'Healthy ' + ctx.species.toLowerCase() + ' presenting for annual wellness exam. Mild ceruminous otitis \u2014 left ear. Mild dental tartar (grade 1). No other abnormalities detected.'}</textarea>
        </div>
        <div class="soap-section">
          <div class="soap-label"><span class="soap-letter">P</span> Plan</div>
          <textarea class="soap-textarea" placeholder="Treatment plan, follow-up, client instructions...">${ctx.pet === '\u2014' ? '' : '1. Ear cleaning \u2014 flush left ear with Epi-Otic, dispense for home use BID x 7 days.\n2. Recommend dental cleaning within 6 months.\n3. Annual vaccinations administered (see Immunizations).\n4. Recheck ear in 2 weeks if not improved.\n5. Continue current diet and exercise regimen.'}</textarea>
        </div>
      </div>

      <div class="consultation-ai-scribe">
        <div class="consultation-label"><i data-lucide="sparkles"></i> AI Scribe</div>
        <div class="ai-scribe-status">
          <span class="ai-scribe-indicator"></span>
          <span>Listening... recording consultation notes</span>
        </div>
        <div class="ai-scribe-transcript">
          <div class="ai-scribe-line"><span class="ai-scribe-speaker">Dr. Smith:</span> Let\u2019s start with the exam. ${ctx.pet} looks good today, weight is stable...</div>
          <div class="ai-scribe-line"><span class="ai-scribe-speaker">Dr. Smith:</span> Heart and lungs sound clear. I\u2019m noticing some debris in the left ear...</div>
          <div class="ai-scribe-line"><span class="ai-scribe-speaker">Owner:</span> Yes, ${ctx.pet === '\u2014' ? 'the pet' : ctx.pet} has been scratching at that ear for about a week now.</div>
          <div class="ai-scribe-line"><span class="ai-scribe-speaker">Dr. Smith:</span> I\u2019ll flush it and send you home with ear cleaner. Teeth look okay but we should plan a dental cleaning...</div>
        </div>
        <div class="ai-scribe-actions">
          <button class="ai-scribe-btn"><i data-lucide="wand-2"></i> Auto-fill SOAP from transcript</button>
          <button class="ai-scribe-btn"><i data-lucide="file-text"></i> Generate summary for client</button>
        </div>
      </div>

      <div class="consultation-orders">
        <div class="consultation-label"><i data-lucide="clipboard-list"></i> Orders</div>
        <div class="orders-list">
          <div class="order-item">
            <div class="order-icon"><i data-lucide="syringe"></i></div>
            <div class="order-body">
              <div class="order-name">DA2PP Vaccination</div>
              <div class="order-detail">Administered \u2014 right shoulder, SC</div>
            </div>
            <span class="status-pill completed">Done</span>
          </div>
          <div class="order-item">
            <div class="order-icon"><i data-lucide="syringe"></i></div>
            <div class="order-body">
              <div class="order-name">Rabies Vaccination</div>
              <div class="order-detail">Administered \u2014 right rear leg, SC</div>
            </div>
            <span class="status-pill completed">Done</span>
          </div>
          <div class="order-item">
            <div class="order-icon"><i data-lucide="droplets"></i></div>
            <div class="order-body">
              <div class="order-name">Ear flush \u2014 Epi-Otic (left ear)</div>
              <div class="order-detail">In-clinic treatment + dispense for home BID x 7 days</div>
            </div>
            <span class="status-pill active dot">Pending</span>
          </div>
          <div class="order-item">
            <div class="order-icon"><i data-lucide="flask-conical"></i></div>
            <div class="order-body">
              <div class="order-name">Fecal exam \u2014 routine</div>
              <div class="order-detail">Send to lab, results expected in 24-48h</div>
            </div>
            <span class="status-pill active dot">Pending</span>
          </div>
          <div class="order-item">
            <div class="order-icon"><i data-lucide="calendar"></i></div>
            <div class="order-body">
              <div class="order-name">Dental cleaning</div>
              <div class="order-detail">Schedule within 6 months \u2014 grade 1 tartar</div>
            </div>
            <span class="status-pill scheduled">Scheduled</span>
          </div>
        </div>
        <button class="add-order-btn"><i data-lucide="plus"></i> Add Order</button>
      </div>
    </div>`;
}
