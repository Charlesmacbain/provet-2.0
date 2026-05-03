/* global React */
const { useState, useMemo, useEffect, useRef } = React;

// Mock data — clinic-realistic, calm copy
const ORG = {
  name: "Notting Hill",
  location: "London · UK",
};

const CLINICS = [
  { name: "Bristol Animal Hospital", location: "Bristol · UK" },
  { name: "Wells Equine Practice", location: "Wells · UK" },
  { name: "Bath Veterinary Clinic", location: "Bath · UK" },
  { name: "Edinburgh Vet Group", location: "Edinburgh · UK" },
  { name: "Cardiff Pet Care", location: "Cardiff · UK" },
  { name: "Manchester Animal Centre", location: "Manchester · UK" },
];

const USER = {
  name: "Dr. Sara Lindqvist",
  role: "Veterinarian",
  initials: "SL",
};

const PATIENTS = [
  { id: "PT-204812", name: "Bella Andersen", species: "Canine", breed: "Labrador", sex: "F", neutered: true, age: "6 yr",  weight: "28.4 kg", owner: "Henrik Andersen", lastVisit: "14 Mar 2026", status: "active",   color: "info"      },
  { id: "PT-204813", name: "Milo Olsen",    species: "Feline", breed: "Maine Coon", sex: "M", neutered: true, age: "3 yr", weight: "5.1 kg",  owner: "Astrid Olsen",   lastVisit: "12 Mar 2026", status: "follow",   color: "warning"   },
  { id: "PT-204814", name: "Luna Kowalski", species: "Canine", breed: "Shiba Inu",  sex: "F", neutered: false,age: "2 yr", weight: "9.8 kg",  owner: "Tomasz Kowalski",lastVisit: "28 Feb 2026", status: "overdue",  color: "highlight" },
  { id: "PT-204815", name: "Hiro Tanaka",   species: "Canine", breed: "Akita",      sex: "M", neutered: false,age: "4 yr", weight: "32.0 kg", owner: "Yuki Tanaka",     lastVisit: "10 Mar 2026", status: "active",   color: "success"   },
  { id: "PT-204816", name: "Coco Bernard",  species: "Avian",  breed: "Cockatiel",  sex: "F", neutered: false,age: "5 yr", weight: "0.09 kg", owner: "Marie Bernard",   lastVisit: "08 Mar 2026", status: "active",   color: "info"      },
  { id: "PT-204817", name: "Pixel Schmidt", species: "Feline", breed: "Bengal",     sex: "M", neutered: true, age: "1 yr", weight: "3.4 kg",  owner: "Lukas Schmidt",   lastVisit: "07 Mar 2026", status: "active",   color: "highlight" },
  { id: "PT-204818", name: "Rocco Murphy",  species: "Canine", breed: "Bulldog",    sex: "M", neutered: true, age: "8 yr", weight: "22.7 kg", owner: "Niamh Murphy",    lastVisit: "06 Mar 2026", status: "follow",   color: "warning"   },
  { id: "PT-204819", name: "Pepper Romano", species: "Equine", breed: "Andalusian", sex: "F", neutered: false,age: "11 yr",weight: "498 kg",  owner: "Carla Romano",    lastVisit: "01 Mar 2026", status: "active",   color: "success"   },
];

const APPOINTMENTS_TODAY = [
  { time: "08:30", patient: "Bella Andersen",   reason: "Annual wellness exam", vet: "Dr. Lindqvist", status: "checked-in", tone: "success"   },
  { time: "09:00", patient: "Milo Olsen",       reason: "Vaccination — FVRCP",  vet: "Dr. Lindqvist", status: "checked-in", tone: "success"   },
  { time: "09:30", patient: "Hiro Tanaka",      reason: "Lameness follow-up",   vet: "Dr. Patel",     status: "scheduled",  tone: "info"      },
  { time: "10:15", patient: "Pixel Schmidt",    reason: "Spay surgery",         vet: "Dr. Lindqvist", status: "in-surgery", tone: "highlight" },
  { time: "11:00", patient: "Coco Bernard",     reason: "Beak trim",            vet: "Dr. Patel",     status: "scheduled",  tone: "info"      },
  { time: "11:45", patient: "Rocco Murphy",     reason: "Dermatology recheck",  vet: "Dr. Lindqvist", status: "scheduled",  tone: "info"      },
  { time: "13:30", patient: "Pepper Romano",    reason: "Pre-purchase exam",    vet: "Dr. Patel",     status: "scheduled",  tone: "info"      },
  { time: "14:30", patient: "Luna Kowalski",    reason: "Booster — DHPP",       vet: "Dr. Lindqvist", status: "scheduled",  tone: "warning"   },
  { time: "15:30", patient: "Bella Andersen",   reason: "Bloodwork results",    vet: "Dr. Lindqvist", status: "scheduled",  tone: "info"      },
];

const STATS = [
  { label: "Today's appointments", value: "24", delta: "+3", up: true,  sub: "vs last Mon" },
  { label: "Checked-in",           value: "6",  delta: "2 waiting", up: null, sub: "in waiting room" },
  { label: "Outstanding invoices", value: "£4,320", delta: "−12%", up: false, sub: "vs last week" },
  { label: "Avg consult duration", value: "23m", delta: "+1m", up: false, sub: "this week" },
];

const ACTIVITY = [
  { who: "Dr. Patel",     what: "discharged",       target: "Hiro Tanaka",      time: "2 min ago",  icon: "user-checked",       tone: "success" },
  { who: "Reception",     what: "checked in",       target: "Bella Andersen",   time: "12 min ago", icon: "interface-calendar-checked-in", tone: "info" },
  { who: "Lab",           what: "uploaded results for", target: "Milo Olsen",   time: "28 min ago", icon: "medical-flask",      tone: "info" },
  { who: "Dr. Lindqvist", what: "prescribed Apoquel for", target: "Rocco Murphy", time: "41 min ago", icon: "medical-prescription", tone: "highlight" },
  { who: "System",        what: "flagged drug interaction on", target: "Pepper Romano", time: "1 hr ago", icon: "interface-warning", tone: "warning" },
  { who: "Reception",     what: "scheduled follow-up for", target: "Luna Kowalski", time: "2 hr ago", icon: "interface-calendar", tone: "info" },
];

const TASKS = [
  { id: 1, title: "Sign off on Bella Andersen's bloodwork report", meta: "Due today · Lab",    done: false },
  { id: 2, title: "Call Mrs. Olsen — vaccine reminder",            meta: "Today · 14:00",     done: false },
  { id: 3, title: "Refill prescription — Apoquel 16mg × 30",       meta: "Pharmacy",          done: false },
  { id: 4, title: "Review post-op notes — Pixel Schmidt",          meta: "After 11:00",       done: false },
  { id: 5, title: "Update vaccination protocol PDF",               meta: "This week",         done: true  },
];

const INVOICES = [
  { id: "INV-008214", client: "Henrik Andersen",  patient: "Bella Andersen",  amount: 248.00, status: "paid",     date: "14 Mar 2026" },
  { id: "INV-008215", client: "Astrid Olsen",     patient: "Milo Olsen",      amount: 84.50,  status: "paid",     date: "12 Mar 2026" },
  { id: "INV-008216", client: "Tomasz Kowalski",  patient: "Luna Kowalski",   amount: 412.00, status: "overdue",  date: "28 Feb 2026" },
  { id: "INV-008217", client: "Yuki Tanaka",      patient: "Hiro Tanaka",     amount: 156.30, status: "pending",  date: "10 Mar 2026" },
  { id: "INV-008218", client: "Marie Bernard",    patient: "Coco Bernard",    amount: 32.00,  status: "paid",     date: "08 Mar 2026" },
  { id: "INV-008219", client: "Lukas Schmidt",    patient: "Pixel Schmidt",   amount: 968.40, status: "draft",    date: "—" },
  { id: "INV-008220", client: "Niamh Murphy",     patient: "Rocco Murphy",    amount: 178.00, status: "pending",  date: "06 Mar 2026" },
];

const VITALS = [
  { label: "Temperature", value: "38.4", unit: "°C",  bar: 65, tone: "" },
  { label: "Heart rate",  value: "94",   unit: "bpm", bar: 50, tone: "" },
  { label: "Resp. rate",  value: "22",   unit: "rpm", bar: 35, tone: "" },
  { label: "Weight",      value: "28.4", unit: "kg",  bar: 75, tone: "" },
];

const ICON = (name) => `assets/icons/${name}.svg`;

// Clients (pet owners) — richer than the patients list, used by the Clients page
const CLIENTS = [
  {
    id: "CL-10248", name: "Amy Collins", initials: "AC", color: "highlight",
    pronouns: "She/Her/Hers",
    email: "amy.collins@hotmail.co.uk", phone: "+44 7700 900142",
    address: "12 Lansdown Crescent, Bath BA1 5EX",
    member: "Member since Jun 2021", balance: 0, unpaid: 0,
    employee: "Thrive Employee", employeeCount: 4,
    coOwners: ["Eric Meller", "Dylan Petersen", "Brandon Petersen"], coOwnersExtra: 6,
    tags: ["VIP", "Email reminders", "Card on file"],
    pets: [
      { id: "PT-204891", name: "Milo",    species: "Canine", breed: "Golden Retriever", age: "5 yr", sex: "M", neutered: true,  weight: "32 lbs", color: "warning",
        crit: true, alerts: ["BLS"], warnings: ["Aggressive", "Allergies", "Wear Gloves", "Diabetic"], warningsExtra: 1,
        groups: ["Suffolk County K9 Unit"], groupsExtra: 1,
        dob: "Oct. 31, 20216", weightShort: "65 lb", color2: "Golden", microchip: "123456789123456",
        callName: "Richards", status: "MN" },
      { id: "PT-204892", name: "Whiskers",species: "Feline", breed: "Domestic SH",      age: "9 yr", sex: "F", neutered: true,  weight: "4.2 kg", color: "info"      },
      { id: "PT-204893", name: "Pip",     species: "Avian",  breed: "Budgerigar",       age: "2 yr", sex: "M", neutered: false, weight: "35 g",   color: "highlight" },
    ],
  },
  { id: "CL-10247", name: "Henrik Andersen",  initials: "HA", color: "info",      email: "henrik@andersen.dk",   phone: "+44 7700 900118", balance: 0,    unpaid: 0,    pets: [{ name: "Bella", species: "Canine" }] },
  { id: "CL-10246", name: "Astrid Olsen",     initials: "AO", color: "warning",   email: "astrid.o@gmail.com",   phone: "+44 7700 900221", balance: 0,    unpaid: 0,    pets: [{ name: "Milo Olsen", species: "Feline" }] },
  { id: "CL-10245", name: "Tomasz Kowalski",  initials: "TK", color: "highlight", email: "tomasz.k@outlook.com", phone: "+44 7700 900334", balance: 412,  unpaid: 1,    pets: [{ name: "Luna", species: "Canine" }] },
  { id: "CL-10244", name: "Yuki Tanaka",      initials: "YT", color: "success",   email: "yuki.tanaka@me.com",   phone: "+44 7700 900401", balance: 0,    unpaid: 0,    pets: [{ name: "Hiro", species: "Canine" }] },
  { id: "CL-10243", name: "Marie Bernard",    initials: "MB", color: "info",      email: "marie@bernard.fr",     phone: "+44 7700 900512", balance: 0,    unpaid: 0,    pets: [{ name: "Coco", species: "Avian" }] },
  { id: "CL-10242", name: "Lukas Schmidt",    initials: "LS", color: "highlight", email: "lukas.s@gmx.de",       phone: "+44 7700 900603", balance: 968, unpaid: 1,    pets: [{ name: "Pixel", species: "Feline" }] },
  { id: "CL-10241", name: "Niamh Murphy",     initials: "NM", color: "warning",   email: "niamh@murphy.ie",      phone: "+44 7700 900714", balance: 0,    unpaid: 0,    pets: [{ name: "Rocco", species: "Canine" }] },
  { id: "CL-10240", name: "Carla Romano",     initials: "CR", color: "success",   email: "carla.romano@libero.it", phone: "+44 7700 900825", balance: 0,  unpaid: 0,    pets: [{ name: "Pepper", species: "Equine" }] },
];

// Recent visits / chart events for Amy Collins → Milo
const CLIENT_TIMELINE = [
  { date: "14 Mar 2026", time: "09:14", title: "Annual wellness exam",  vet: "Dr. Lindqvist", note: "Healthy. Weight up 0.4 kg. Continue current diet. Recommend dental in Q3.", tone: "success",   icon: "medical-stethoscope" },
  { date: "02 Feb 2026", time: "11:30", title: "Booster — DHPP",        vet: "Dr. Patel",     note: "DHPP administered. No reaction observed during 15-min hold.", tone: "info",       icon: "medical-vaccine-syringe" },
  { date: "11 Dec 2025", time: "10:05", title: "Blood panel — CBC, Chem-17", vet: "Dr. Lindqvist", note: "All values within reference. ALT slightly elevated — recheck in 6 mo.", tone: "warning",   icon: "medical-flask" },
  { date: "19 Sep 2025", time: "15:40", title: "Skin irritation — left flank", vet: "Dr. Lindqvist", note: "Atopic dermatitis suspected. Started Apoquel 16 mg. Re-eval in 14d.", tone: "danger",   icon: "medical-bandage" },
  { date: "08 Aug 2025", time: "08:50", title: "Post-dental recheck",   vet: "Dr. Patel",     note: "Healing well. Resume normal kibble. No further intervention needed.",     tone: "success",   icon: "medical-tooth" },
  { date: "12 Jul 2025", time: "13:20", title: "Dental cleaning + scale", vet: "Dr. Lindqvist", note: "Mild tartar grade 2. Cleaned under GA. Recovery uneventful.", tone: "highlight", icon: "medical-tooth" },
];

// Inventory — items / consumables / pharmaceuticals with stock & price for the search modal
const INVENTORY = [
  { id: "SKU-1042", name: "Apoquel 16 mg",            sku: "1042", category: "Pharmacy",     unit: "tablet",     stock: 248,  reorder: 60,  price: 2.85,  loc: "Pharmacy A · 2",   supplier: "Zoetis",       expires: "Aug 2027" },
  { id: "SKU-1078", name: "Apoquel 5.4 mg",           sku: "1078", category: "Pharmacy",     unit: "tablet",     stock: 96,   reorder: 40,  price: 1.40,  loc: "Pharmacy A · 2",   supplier: "Zoetis",       expires: "May 2027" },
  { id: "SKU-2210", name: "Cerenia 16 mg",            sku: "2210", category: "Pharmacy",     unit: "tablet",     stock: 14,   reorder: 30,  price: 3.10,  loc: "Pharmacy A · 4",   supplier: "Zoetis",       expires: "Mar 2027" },
  { id: "SKU-2415", name: "Metacam 1.5 mg/ml oral",   sku: "2415", category: "Pharmacy",     unit: "10 ml vial", stock: 36,   reorder: 12,  price: 18.40, loc: "Pharmacy A · 5",   supplier: "Boehringer",   expires: "Jan 2028" },
  { id: "SKU-2502", name: "Amoxicillin 250 mg",       sku: "2502", category: "Pharmacy",     unit: "tablet",     stock: 320,  reorder: 80,  price: 0.42,  loc: "Pharmacy A · 1",   supplier: "Bimeda",       expires: "Nov 2026" },
  { id: "SKU-3010", name: "Frontline Plus — Dog 20-40 kg", sku: "3010", category: "Parasiticide", unit: "pipette",   stock: 64,   reorder: 24,  price: 12.50, loc: "Retail · 3",      supplier: "Boehringer",   expires: "Apr 2028" },
  { id: "SKU-3022", name: "Bravecto Chew — Cat 6.25-12.5 kg", sku: "3022", category: "Parasiticide", unit: "chew",  stock: 42,   reorder: 20,  price: 38.90, loc: "Retail · 3",      supplier: "MSD",          expires: "Sep 2027" },
  { id: "SKU-4015", name: "Vetrap bandage 5 cm",      sku: "4015", category: "Consumables",  unit: "roll",       stock: 88,   reorder: 30,  price: 4.20,  loc: "Treatment · A",    supplier: "3M",           expires: "—" },
  { id: "SKU-4112", name: "Surgical gloves L (pair)", sku: "4112", category: "Consumables",  unit: "pair",       stock: 412,  reorder: 100, price: 0.65,  loc: "Surgery · cab 2",  supplier: "Cardinal",     expires: "—" },
  { id: "SKU-4480", name: "Suture — Vicryl 3-0",      sku: "4480", category: "Surgical",     unit: "pack",       stock: 28,   reorder: 12,  price: 6.80,  loc: "Surgery · cab 1",  supplier: "Ethicon",      expires: "Dec 2028" },
  { id: "SKU-5021", name: "Hill's z/d Canine 3 kg",   sku: "5021", category: "Diet",         unit: "bag",        stock: 11,   reorder: 6,   price: 32.50, loc: "Retail · 1",      supplier: "Hill's",       expires: "Feb 2027" },
  { id: "SKU-5044", name: "Royal Canin Renal Cat 2 kg", sku: "5044", category: "Diet",       unit: "bag",        stock: 0,    reorder: 8,   price: 28.40, loc: "Retail · 1",      supplier: "Royal Canin",  expires: "Apr 2027" },
  { id: "SKU-6101", name: "DHPP vaccine — Nobivac",   sku: "6101", category: "Vaccine",      unit: "dose",       stock: 56,   reorder: 24,  price: 14.20, loc: "Fridge · 1",      supplier: "MSD",          expires: "Jul 2026" },
  { id: "SKU-6118", name: "FVRCP vaccine — Purevax",  sku: "6118", category: "Vaccine",      unit: "dose",       stock: 38,   reorder: 20,  price: 13.80, loc: "Fridge · 1",      supplier: "Boehringer",   expires: "Jun 2026" },
  { id: "SKU-7002", name: "IV catheter 22G",          sku: "7002", category: "Consumables",  unit: "ea",         stock: 140,  reorder: 60,  price: 1.10,  loc: "Treatment · B",    supplier: "BD",           expires: "—" },
  { id: "SKU-7044", name: "Lactated Ringer's 1 L",    sku: "7044", category: "Fluids",       unit: "bag",        stock: 22,   reorder: 12,  price: 4.90,  loc: "Treatment · B",    supplier: "Hartmann",     expires: "Oct 2027" },
  { id: "SKU-9801", name: "Microchip + registration", sku: "9801", category: "Service",      unit: "ea",         stock: 60,   reorder: 20,  price: 22.00, loc: "Reception",       supplier: "PetTrac",      expires: "—" },
];

window.PROVET_DATA = {
  ORG, USER, CLINICS, PATIENTS, APPOINTMENTS_TODAY, STATS, ACTIVITY, TASKS, INVOICES, VITALS, CLIENTS, CLIENT_TIMELINE, ICON, INVENTORY,
};
