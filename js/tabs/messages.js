/**
 * Messages tab renderer.
 * @module tabs/messages
 */

/**
 * Render the messages tab.
 * @param {number} idx - Item index
 * @param {Object} ctx - Context with pet, client
 * @returns {string} HTML string
 */
export function renderMessagesTab(idx, ctx) {
  if (idx === 0) {
    return `
      <div class="chat-messages">
        <div class="chat-msg">
          <div class="chat-msg-avatar" style="background:#5e6ad2">PC</div>
          <div>
            <div class="chat-msg-bubble">Hi Amy, Milo's annual check-up results are in. Everything looks great \u2014 bloodwork, heart, and joints all normal. He's in excellent shape for his age!</div>
            <div class="chat-msg-time">Yesterday at 2:15 PM</div>
          </div>
        </div>
        <div class="chat-msg outgoing">
          <div class="chat-msg-avatar" style="background:#cf8e3e">AC</div>
          <div>
            <div class="chat-msg-bubble">Thanks for the update! That's such a relief. Should we schedule his next check-up now or wait?</div>
            <div class="chat-msg-time">Today at 9:30 AM</div>
          </div>
        </div>
        <div class="chat-msg">
          <div class="chat-msg-avatar" style="background:#5e6ad2">PC</div>
          <div>
            <div class="chat-msg-bubble">I'd recommend booking his next annual in about 12 months. We can also set up a vaccination reminder for his booster in 6 months. Want me to schedule both?</div>
            <div class="chat-msg-time">Today at 10:05 AM</div>
          </div>
        </div>
        <div class="chat-msg outgoing">
          <div class="chat-msg-avatar" style="background:#cf8e3e">AC</div>
          <div>
            <div class="chat-msg-bubble">Yes please, that would be perfect. Thanks so much!</div>
            <div class="chat-msg-time">Today at 10:12 AM</div>
          </div>
        </div>
      </div>`;
  }

  const clientInitials = ctx.client.split(' ').map(n => n[0]).join('');
  const itemColor = '#cf8e3e';
  const msgs = [
    { sender: ctx.client, initials: clientInitials, color: itemColor, channel: 'SMS', time: 'Today 9:30 AM', text: `Hi, just checking on ${ctx.pet}'s appointment status. Is everything confirmed?` },
    { sender: 'Dr. Sarah Smith', initials: 'SS', color: '#5e6ad2', channel: 'Internal', time: 'Today 9:15 AM', text: `${ctx.pet}'s file has been updated with the latest notes. Please review before the appointment.` },
    { sender: 'System', initials: 'SY', color: '#986ee2', channel: 'Auto', time: 'Yesterday 4:00 PM', text: `Automated reminder sent to ${ctx.client} for upcoming appointment.` },
    { sender: ctx.client, initials: clientInitials, color: itemColor, channel: 'Email', time: 'Mar 12', text: `Thank you for sending the lab results. We'll make sure to follow the recommended diet changes.` },
  ];

  return `
    <div class="tab-section">
      <div class="tab-section-title"><i data-lucide="message-circle"></i> Messages \u2014 ${ctx.pet}</div>
      ${msgs.map(m => `
        <div class="msg-item">
          <div class="msg-avatar" style="background:${m.color}">${m.initials}</div>
          <div class="msg-body">
            <div class="msg-header">
              <span class="msg-sender">${m.sender}</span>
              <span class="msg-channel">${m.channel}</span>
              <span class="msg-time-sm">${m.time}</span>
            </div>
            <div class="msg-text">${m.text}</div>
          </div>
        </div>`).join('')}
    </div>`;
}
