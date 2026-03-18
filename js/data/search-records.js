// Search records for clients and patients used in the global search overlay
export const SEARCH_RECORDS = [
  { type: 'client', name: 'Amy Collins', initials: 'AC', color: '#cf8e3e', email: 'amy.collins@email.com', phone: '+1 (555) 012-3456', pets: ['Milo'], since: 'Jan 2024', address: '45 Maple Ave, Toronto' },
  { type: 'client', name: 'David Turner', initials: 'DT', color: '#5e6ad2', email: 'david.turner@email.com', phone: '+1 (555) 234-5678', pets: ['Archie'], since: 'Mar 2024', address: '12 Oak St, Toronto' },
  { type: 'client', name: 'Emma Patel', initials: 'EP', color: '#cf8e3e', email: 'emma.patel@email.com', phone: '+1 (555) 345-6789', pets: ['Nala', 'Daisy'], since: 'Jun 2023', address: '88 Birch Rd, Toronto' },
  { type: 'client', name: 'Daniel Reyes', initials: 'DR', color: '#539bf5', email: 'daniel.reyes@email.com', phone: '+1 (555) 456-7890', pets: ['Luna'], since: 'Sep 2023', address: '201 Pine Cres, Toronto' },
  { type: 'client', name: 'Olivia Zhang', initials: 'OZ', color: '#4dab9a', email: 'olivia.zhang@email.com', phone: '+1 (555) 567-8901', pets: ['Rex'], since: 'Nov 2023', address: '77 Cedar Ln, Toronto' },
  { type: 'client', name: 'Hannah Wells', initials: 'HW', color: '#e5534b', email: 'hannah.wells@email.com', phone: '+1 (555) 678-9012', pets: ['Pepper'], since: 'Feb 2024', address: '33 Elm Way, Toronto' },
  { type: 'client', name: 'Rebecca Young', initials: 'RY', color: '#986ee2', email: 'rebecca.young@email.com', phone: '+1 (555) 789-0123', pets: ['Nala'], since: 'May 2024', address: '15 Spruce Dr, Toronto' },
  { type: 'client', name: 'Sarah Smith', initials: 'SS', color: '#986ee2', email: 'sarah.smith@email.com', phone: '+1 (555) 890-1234', pets: ['Buddy'], since: 'Apr 2023', address: '62 Willow Ct, Toronto' },
  { type: 'patient', name: 'Milo', initials: 'MI', color: '#cf8e3e', species: 'Canine', breed: 'Labrador Retriever', age: '7 years', weight: '32 kg', sex: 'Male (Neutered)', owner: 'Amy Collins', id: '30041' },
  { type: 'patient', name: 'Archie', initials: 'AR', color: '#5e6ad2', species: 'Canine', breed: 'Mixed Breed', age: '8 months', weight: '6 kg', sex: 'Male', owner: 'David Turner', id: '30062' },
  { type: 'patient', name: 'Nala', initials: 'NA', color: '#c96198', species: 'Canine', breed: 'Mixed Breed', age: '2 years', weight: '14 kg', sex: 'Female', owner: 'Emma Patel', id: '30079' },
  { type: 'patient', name: 'Luna', initials: 'LU', color: '#539bf5', species: 'Feline', breed: 'Siamese', age: '4 years', weight: '4.2 kg', sex: 'Female (Spayed)', owner: 'Daniel Reyes', id: '30034' },
  { type: 'patient', name: 'Rex', initials: 'RE', color: '#4dab9a', species: 'Canine', breed: 'German Shepherd', age: '6 years', weight: '38 kg', sex: 'Male', owner: 'Olivia Zhang', id: '30027' },
  { type: 'patient', name: 'Pepper', initials: 'PE', color: '#e5534b', species: 'Feline', breed: 'Domestic Shorthair', age: '9 years', weight: '4.8 kg', sex: 'Female', owner: 'Hannah Wells', id: '30071' },
  { type: 'patient', name: 'Daisy', initials: 'DA', color: '#57ab5a', species: 'Canine', breed: 'Beagle', age: '3 years', weight: '11 kg', sex: 'Female', owner: 'Emma Patel', id: '30055' },
  { type: 'patient', name: 'Buddy', initials: 'BU', color: '#986ee2', species: 'Canine', breed: 'Golden Retriever', age: '5 years', weight: '29 kg', sex: 'Male (Neutered)', owner: 'Sarah Smith', id: '30018' },
];
