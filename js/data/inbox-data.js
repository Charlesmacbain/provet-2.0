// Category definitions for inbox filtering
export const INBOX_CATEGORIES = [
  { id: 'all', label: 'All', icon: 'inbox' },
  { id: 'notification', label: 'Notifications', icon: 'bell' },
  { id: 'task', label: 'Tasks', icon: 'clipboard-check' },
  { id: 'chat', label: 'Chat', icon: 'message-circle' },
  { id: 'conversation', label: 'Conversations', icon: 'messages-square' },
  { id: 'consultation', label: 'Consultations', icon: 'stethoscope' },
];

// Inbox notification items displayed in the inbox list
export const INBOX_ITEMS = [
  { initials: 'AC', color: '#cf8e3e', title: 'Milo — Annual check-up results', subtitle: 'Amy Collins replied: Thanks for the update...', time: '1h', unread: true, badge: 'close', badgeColor: '#e5534b', category: 'conversation' },
  { initials: 'MJ', color: '#57ab5a', title: 'Surgery complete — Daisy', subtitle: 'New patient update by mike.johnson', time: '2h', unread: true, badge: 'project', badgeColor: '#5e6ad2', category: 'notification' },
  { initials: 'DT', color: '#5e6ad2', title: 'Reschedule Archie appointment', subtitle: 'david.turner mentioned you: Can we move...', time: '3h', unread: true, badge: 'mention', badgeColor: '#cf8e3e', category: 'chat' },
  { initials: 'SS', color: '#986ee2', title: 'Lab results — Collins patient', subtitle: 'sarah.smith commented: Results are back...', time: '4h', unread: true, badge: 'comment', badgeColor: '#986ee2', category: 'notification' },
  { initials: 'OZ', color: '#4dab9a', title: 'Rex follow-up confirmed', subtitle: 'olivia.zhang replied: We\'ll bring him in Friday', time: '5h', unread: false, badge: 'project', badgeColor: '#57ab5a', category: 'conversation' },
  { initials: 'KB', color: '#c96198', title: 'Vaccination reminder — Luna', subtitle: 'Reminder sent to Daniel Reyes for tomorrow', time: '6h', unread: true, badge: 'bell', badgeColor: '#539bf5', category: 'notification' },
  { initials: 'DR', color: '#539bf5', title: 'Luna medication update', subtitle: 'daniel.reyes replied: She\'s doing much better...', time: '7h', unread: true, badge: 'comment', badgeColor: '#986ee2', category: 'chat' },
  { initials: 'HW', color: '#e5534b', title: 'Prescription refill — Pepper', subtitle: 'hannah.wells requested: Is there a refill available?', time: '8h', unread: true, badge: 'pill', badgeColor: '#e5534b', category: 'conversation' },
  { initials: 'EM', color: '#cf8e3e', title: 'Post-op recovery — Nala Day 3', subtitle: 'Follow-up task assigned to you', time: '9h', unread: false, badge: 'task', badgeColor: '#cf8e3e', category: 'task' },
  { initials: 'MG', color: '#57ab5a', title: 'Low stock alert: Metacam', subtitle: 'Stock level: 3 units remaining', time: '10h', unread: false, badge: 'alert', badgeColor: '#e5534b', category: 'notification' },
  { initials: 'RY', color: '#986ee2', title: 'Spay procedure — Nala complete', subtitle: 'rebecca.young notified about discharge', time: '10h', unread: false, badge: 'check', badgeColor: '#57ab5a', category: 'notification' },
  { initials: 'SS', color: '#986ee2', title: 'Update patient records — Buddy', subtitle: 'Assigned to you by sarah.smith', time: '11h', unread: false, badge: 'task', badgeColor: '#cf8e3e', category: 'task' },
  { initials: 'MJ', color: '#57ab5a', title: 'Review Daisy\'s post-op notes', subtitle: 'Task due today — mark as complete', time: '12h', unread: true, badge: 'task', badgeColor: '#e5534b', category: 'task' },
  { initials: 'KB', color: '#c96198', title: 'Katie Brown', subtitle: 'Can you check the schedule for Thursday?', time: '2h', unread: true, badge: 'chat', badgeColor: '#539bf5', category: 'chat' },
  { initials: 'DT', color: '#5e6ad2', title: 'David Turner', subtitle: 'Thanks, I\'ll let the owner know.', time: '4h', unread: false, badge: 'chat', badgeColor: '#5e6ad2', category: 'chat' },
];

// Per-inbox-item patient/client context for detail views
export const INBOX_CONTEXT = [
  { client: 'Amy Collins', pet: 'Milo', species: 'Canine', breed: 'Labrador Retriever', sex: 'Male (Neutered)', age: '7 years', weight: '32 kg', dob: 'Mar 15, 2019', id: '30041', activeTab: 'Messages' },
  { client: 'Mike Johnson', pet: 'Daisy', species: 'Canine', breed: 'Beagle', sex: 'Female', age: '3 years', weight: '11 kg', dob: 'Jun 2, 2023', id: '30055', activeTab: 'Chart' },
  { client: 'David Turner', pet: 'Archie', species: 'Canine', breed: 'Mixed Breed', sex: 'Male', age: '8 months', weight: '6 kg', dob: 'Jul 20, 2025', id: '30062', activeTab: 'Chart' },
  { client: 'Sarah Smith', pet: 'Buddy', species: 'Canine', breed: 'Golden Retriever', sex: 'Male (Neutered)', age: '5 years', weight: '29 kg', dob: 'Jan 8, 2021', id: '30018', activeTab: 'Labs' },
  { client: 'Olivia Zhang', pet: 'Rex', species: 'Canine', breed: 'German Shepherd', sex: 'Male', age: '6 years', weight: '38 kg', dob: 'Sep 14, 2020', id: '30027', activeTab: 'Chart' },
  { client: 'Daniel Reyes', pet: 'Luna', species: 'Feline', breed: 'Siamese', sex: 'Female (Spayed)', age: '4 years', weight: '4.2 kg', dob: 'Nov 3, 2022', id: '30034', activeTab: 'Immunizations' },
  { client: 'Daniel Reyes', pet: 'Luna', species: 'Feline', breed: 'Siamese', sex: 'Female (Spayed)', age: '4 years', weight: '4.2 kg', dob: 'Nov 3, 2022', id: '30034', activeTab: 'Medications' },
  { client: 'Hannah Wells', pet: 'Pepper', species: 'Feline', breed: 'Domestic Shorthair', sex: 'Female', age: '9 years', weight: '4.8 kg', dob: 'Apr 11, 2017', id: '30071', activeTab: 'Medications' },
  { client: 'Emma Patel', pet: 'Nala', species: 'Canine', breed: 'Mixed Breed', sex: 'Female', age: '2 years', weight: '14 kg', dob: 'Dec 28, 2023', id: '30079', activeTab: 'Chart' },
  { client: '\u2014', pet: '\u2014', species: '\u2014', breed: '\u2014', sex: '\u2014', age: '\u2014', weight: '\u2014', dob: '\u2014', id: '\u2014', activeTab: 'Info' },
  { client: 'Rebecca Young', pet: 'Nala', species: 'Canine', breed: 'Mixed Breed', sex: 'Female', age: '2 years', weight: '14 kg', dob: 'Dec 28, 2023', id: '30079', activeTab: 'Chart' },
  { client: 'Sarah Smith', pet: 'Buddy', species: 'Canine', breed: 'Golden Retriever', sex: 'Male (Neutered)', age: '5 years', weight: '29 kg', dob: 'Jan 8, 2021', id: '30018', activeTab: 'Chart' },
  { client: 'Mike Johnson', pet: 'Daisy', species: 'Canine', breed: 'Beagle', sex: 'Female', age: '3 years', weight: '11 kg', dob: 'Jun 2, 2023', id: '30055', activeTab: 'Chart' },
  { client: '\u2014', pet: '\u2014', species: '\u2014', breed: '\u2014', sex: '\u2014', age: '\u2014', weight: '\u2014', dob: '\u2014', id: '\u2014', activeTab: 'Messages' },
  { client: '\u2014', pet: '\u2014', species: '\u2014', breed: '\u2014', sex: '\u2014', age: '\u2014', weight: '\u2014', dob: '\u2014', id: '\u2014', activeTab: 'Messages' },
];

// AI drawer task context and suggested actions per inbox item
export const DRAWER_CONTEXT_MAP = [
  { task: 'Review annual check-up results for Milo and share findings with client.',
    actions: [
      ['file-text', 'Summarize Milo\u2019s check-up results'],
      ['send', 'Draft message to Amy with findings'],
      ['alert-triangle', 'Flag any out-of-range values'],
      ['calendar', 'Schedule Milo\u2019s next annual visit'],
    ]},
  { task: 'Confirm post-surgery recovery plan for Daisy and schedule follow-up.',
    actions: [
      ['clipboard-list', 'Generate post-op care instructions'],
      ['send', 'Send recovery plan to Mike Johnson'],
      ['calendar', 'Book 2-week follow-up appointment'],
      ['pill', 'Review Daisy\u2019s pain medication plan'],
    ]},
  { task: 'Reschedule Archie\u2019s appointment and notify the client.',
    actions: [
      ['calendar', 'Find next available appointment slot'],
      ['send', 'Notify David Turner of the new time'],
      ['clock', 'Check Archie\u2019s vaccination schedule'],
      ['file-text', 'Pull up Archie\u2019s last visit notes'],
    ]},
  { task: 'Review lab results for Buddy and flag any abnormal values.',
    actions: [
      ['search', 'Analyze Buddy\u2019s lab panel results'],
      ['alert-triangle', 'Highlight abnormal values with context'],
      ['send', 'Draft lab summary for Sarah Smith'],
      ['git-compare', 'Compare with Buddy\u2019s previous labs'],
    ]},
  { task: 'Confirm Rex\u2019s follow-up appointment details with client.',
    actions: [
      ['send', 'Send appointment confirmation to Olivia'],
      ['file-text', 'Summarize Rex\u2019s treatment history'],
      ['clipboard-list', 'Prepare pre-visit checklist'],
      ['calendar', 'Reschedule if client needs a new time'],
    ]},
  { task: 'Send vaccination reminder to Daniel Reyes for Luna.',
    actions: [
      ['send', 'Draft vaccination reminder for Daniel'],
      ['syringe', 'Check Luna\u2019s immunization history'],
      ['calendar', 'Book Luna\u2019s vaccination appointment'],
      ['file-text', 'List overdue vaccinations for Luna'],
    ]},
  { task: 'Review and update Luna\u2019s medication dosage.',
    actions: [
      ['pill', 'Review current medications and dosages'],
      ['alert-triangle', 'Check for drug interactions'],
      ['calculator', 'Calculate weight-based dosage for Luna'],
      ['send', 'Notify Daniel Reyes of dosage change'],
    ]},
  { task: 'Process prescription refill request for Pepper.',
    actions: [
      ['pill', 'Review Pepper\u2019s prescription history'],
      ['check-circle', 'Approve and process the refill'],
      ['send', 'Confirm refill with Hannah Wells'],
      ['alert-triangle', 'Check for refill frequency concerns'],
    ]},
  { task: 'Check Nala\u2019s post-op recovery progress and update chart.',
    actions: [
      ['activity', 'Summarize Nala\u2019s recovery milestones'],
      ['file-text', 'Update Nala\u2019s chart with latest status'],
      ['send', 'Send progress update to Emma Patel'],
      ['calendar', 'Schedule suture removal appointment'],
    ]},
  { task: 'Reorder Metacam \u2014 stock level critical.',
    actions: [
      ['package', 'Generate purchase order for Metacam'],
      ['bar-chart-3', 'Review Metacam usage trends'],
      ['alert-triangle', 'Check for alternative NSAIDs in stock'],
      ['clipboard-list', 'Audit other low-stock medications'],
    ]},
  { task: 'Prepare for Nala\u2019s spay procedure and confirm pre-op checklist.',
    actions: [
      ['clipboard-list', 'Generate pre-op checklist for spay'],
      ['send', 'Send pre-op instructions to Rebecca Young'],
      ['file-text', 'Review Nala\u2019s anesthesia risk profile'],
      ['calendar', 'Confirm surgery time and room booking'],
    ]},
  { task: 'Update Buddy\u2019s patient records with latest visit notes.',
    actions: [
      ['file-text', 'Summarize Buddy\u2019s recent visits'],
      ['check-circle', 'Mark record update as complete'],
      ['send', 'Notify Sarah Smith of updates'],
    ]},
  { task: 'Review and approve Daisy\u2019s post-op notes.',
    actions: [
      ['file-text', 'Review post-op documentation'],
      ['check-circle', 'Approve and close task'],
      ['send', 'Send notes to Mike Johnson'],
    ]},
  { task: 'Reply to Katie Brown about Thursday\u2019s schedule.',
    actions: [
      ['calendar', 'Check Thursday schedule'],
      ['send', 'Draft reply to Katie'],
    ]},
  { task: 'Follow up with David Turner.',
    actions: [
      ['send', 'Send follow-up message'],
      ['file-text', 'Review conversation history'],
    ]},
];
