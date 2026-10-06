import { createClient, type Session } from "@supabase/supabase-js";

export type Role = "user" | "reporter" | "authority" | "admin";
export type CaseStatus =
  | "pending_verification"
  | "verified"
  | "active"
  | "under_investigation"
  | "possible_sighting"
  | "found"
  | "closed"
  | "rejected";
export type SightingStatus =
  | "pending_review"
  | "verified"
  | "rejected"
  | "needs_more_information";
export type WorkspaceMode = "demo" | "cloud";

export interface CaseRecord {
  id: string;
  caseId: string;
  fullName: string;
  age: number;
  dateOfBirth: string | null;
  gender: string;
  photoUrl: string | null;
  height: string | null;
  identifyingMarks: string | null;
  hairDescription: string | null;
  eyeDescription: string | null;
  clothingDescription: string;
  lastSeenDate: string;
  lastSeenTime: string | null;
  lastSeenLocation: string;
  publicArea: string;
  city: string;
  district: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  circumstances: string;
  status: CaseStatus;
  reporterId: string | null;
  verifiedAt: string | null;
  reportedAt: string;
}

export interface CaseInput {
  fullName: string;
  age: number;
  dateOfBirth?: string;
  gender: string;
  photoUrl?: string;
  height?: string;
  identifyingMarks?: string;
  hairDescription?: string;
  eyeDescription?: string;
  clothingDescription: string;
  lastSeenDate: string;
  lastSeenTime?: string;
  lastSeenLocation: string;
  publicArea: string;
  city: string;
  district?: string;
  state: string;
  latitude?: number;
  longitude?: number;
  circumstances: string;
  reporterName: string;
  relationship: string;
  reporterPhone: string;
  reporterEmail: string;
  contactPreference: string;
  additionalNotes?: string;
}

export interface SightingRecord {
  id: string;
  caseId: string;
  caseDisplayId: string;
  personName: string;
  submittedByName: string;
  anonymous: boolean;
  date: string;
  time: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  description: string;
  status: SightingStatus;
  createdAt: string;
}

export interface SightingInput {
  submittedByName: string;
  anonymous: boolean;
  date: string;
  time: string;
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  evidencePath?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactPreference?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: string;
  message: string;
  visibility: "public" | "reporter" | "authority" | "admin";
  authorName: string;
  createdAt: string;
}

export interface AppProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  demo: boolean;
}

export interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface CaseFilters {
  query?: string;
  status?: string;
  gender?: string;
  state?: string;
  city?: string;
  sort?: "newest" | "oldest";
  fromDate?: string;
  toDate?: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "suspended";
  createdAt: string;
}

export interface ReportFlagRecord {
  id: string;
  caseId: string | null;
  reason: string;
  details: string;
  status: string;
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  userName: string;
  createdAt: string;
}

export interface RestrictedCaseDetails {
  reporterName: string;
  relationship: string;
  phone: string;
  email: string;
  contactPreference: string;
  exactLastSeenLocation: string;
  additionalNotes: string;
}

export interface RestrictedSightingDetails {
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactPreference: string | null;
  evidencePath: string | null;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
const DEMO_STORAGE_KEY = "findback-demo-v1";
const MODE_KEY = "findback-workspace-mode";
const PROFILE_KEY = "findback-demo-profile";

const now = new Date();
const date = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
};

const demoCases: CaseRecord[] = [
  {
    id: "demo-1", caseId: "FB-2026-00124", fullName: "Aarav Reddy", age: 16,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "5 ft 6 in",
    identifyingMarks: "Small birthmark near left wrist", hairDescription: "Dark, short",
    eyeDescription: "Brown", clothingDescription: "Navy blue school jacket, light trousers",
    lastSeenDate: date(1), lastSeenTime: "16:30", lastSeenLocation: "Near the central bus station",
    publicArea: "Central Kadapa", city: "Kadapa", district: "YSR Kadapa", state: "Andhra Pradesh",
    latitude: 14.47, longitude: 78.82, circumstances: "Last seen leaving a public transit stop. Family has notified local authorities.",
    status: "active", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(1),
  },
  {
    id: "demo-2", caseId: "FB-2026-00123", fullName: "Meera Nair", age: 28,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 3 in",
    identifyingMarks: "None reported", hairDescription: "Dark, shoulder length", eyeDescription: "Brown",
    clothingDescription: "Green kurta and black trousers", lastSeenDate: date(2), lastSeenTime: "19:10",
    lastSeenLocation: "Market road", publicArea: "North Bengaluru", city: "Bengaluru", district: "Bengaluru Urban",
    state: "Karnataka", latitude: 13.04, longitude: 77.59, circumstances: "Last seen near a busy shopping area.",
    status: "under_investigation", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(2),
  },
  {
    id: "demo-3", caseId: "FB-2026-00122", fullName: "Kabir Das", age: 41,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "5 ft 9 in",
    identifyingMarks: "Glasses", hairDescription: "Salt-and-pepper", eyeDescription: "Brown",
    clothingDescription: "Grey collared shirt and dark trousers", lastSeenDate: date(3), lastSeenTime: "08:45",
    lastSeenLocation: "Near the riverside walking path", publicArea: "Alipore, Kolkata", city: "Kolkata",
    district: "Kolkata", state: "West Bengal", latitude: 22.53, longitude: 88.33,
    circumstances: "Did not return from a morning walk. Family has filed a report.",
    status: "possible_sighting", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(3),
  },
  {
    id: "demo-4", caseId: "FB-2026-00121", fullName: "Ishita Rao", age: 19,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 4 in",
    identifyingMarks: "Small silver nose stud", hairDescription: "Dark, tied back", eyeDescription: "Brown",
    clothingDescription: "White top and a denim backpack", lastSeenDate: date(4), lastSeenTime: "14:00",
    lastSeenLocation: "University library entrance", publicArea: "Central Hyderabad", city: "Hyderabad",
    district: "Hyderabad", state: "Telangana", latitude: 17.39, longitude: 78.48,
    circumstances: "Last seen leaving campus. No known medical concerns.",
    status: "verified", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(4),
  },
  {
    id: "demo-5", caseId: "FB-2026-00120", fullName: "Dev Patel", age: 34,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "5 ft 8 in",
    identifyingMarks: "Wears a steel wristwatch", hairDescription: "Dark, wavy", eyeDescription: "Brown",
    clothingDescription: "Blue checked shirt", lastSeenDate: date(5), lastSeenTime: "20:15",
    lastSeenLocation: "Lakefront promenade", publicArea: "Powai, Mumbai", city: "Mumbai",
    district: "Mumbai Suburban", state: "Maharashtra", latitude: 19.12, longitude: 72.91,
    circumstances: "Was expected home after meeting friends nearby.",
    status: "active", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(5),
  },
  {
    id: "demo-6", caseId: "FB-2026-00119", fullName: "Nandini Joseph", age: 67,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 1 in",
    identifyingMarks: "Uses a walking stick", hairDescription: "Grey, short", eyeDescription: "Brown",
    clothingDescription: "Maroon shawl over a cream sari", lastSeenDate: date(6), lastSeenTime: "11:20",
    lastSeenLocation: "Near the community clinic", publicArea: "Fort Kochi, Kochi", city: "Kochi",
    district: "Ernakulam", state: "Kerala", latitude: 9.97, longitude: 76.24,
    circumstances: "May need assistance navigating unfamiliar areas. Family has contacted authorities.",
    status: "under_investigation", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(6),
  },
  {
    id: "demo-7", caseId: "FB-2026-00118", fullName: "Sana Khan", age: 25,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 5 in",
    identifyingMarks: "None reported", hairDescription: "Dark, long", eyeDescription: "Brown",
    clothingDescription: "Blue salwar suit with a light scarf", lastSeenDate: date(7), lastSeenTime: "17:40",
    lastSeenLocation: "Near the public garden gate", publicArea: "North Jaipur", city: "Jaipur",
    district: "Jaipur", state: "Rajasthan", latitude: 26.94, longitude: 75.79,
    circumstances: "Last seen walking toward a nearby transit stop.",
    status: "possible_sighting", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(7),
  },
  {
    id: "demo-8", caseId: "FB-2026-00117", fullName: "Rohan Sen", age: 12,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "4 ft 11 in",
    identifyingMarks: "Red thread bracelet", hairDescription: "Dark, straight", eyeDescription: "Brown",
    clothingDescription: "Yellow T-shirt and charcoal shorts", lastSeenDate: date(8), lastSeenTime: "15:05",
    lastSeenLocation: "Community sports ground", publicArea: "Salt Lake, Kolkata", city: "Kolkata",
    district: "North 24 Parganas", state: "West Bengal", latitude: 22.58, longitude: 88.42,
    circumstances: "Last seen after a neighborhood sports activity.",
    status: "found", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(8),
  },
  {
    id: "demo-9", caseId: "FB-2026-00116", fullName: "Leela Menon", age: 52,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 2 in",
    identifyingMarks: "Round-frame glasses", hairDescription: "Dark with grey streaks", eyeDescription: "Brown",
    clothingDescription: "Light blue sari and brown sandals", lastSeenDate: date(9), lastSeenTime: "09:30",
    lastSeenLocation: "Outside a neighborhood pharmacy", publicArea: "Mylapore, Chennai", city: "Chennai",
    district: "Chennai", state: "Tamil Nadu", latitude: 13.03, longitude: 80.27,
    circumstances: "Did not arrive at an expected appointment.",
    status: "closed", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(9),
  },
  {
    id: "demo-10", caseId: "FB-2026-00115", fullName: "Vikram Gill", age: 30,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "5 ft 10 in",
    identifyingMarks: "Small tattoo on right forearm", hairDescription: "Dark, short", eyeDescription: "Brown",
    clothingDescription: "Black hoodie, olive backpack", lastSeenDate: date(10), lastSeenTime: "21:00",
    lastSeenLocation: "Railway station west entrance", publicArea: "Old Delhi, Delhi", city: "Delhi",
    district: "Central Delhi", state: "Delhi", latitude: 28.65, longitude: 77.22,
    circumstances: "Expected to travel to a nearby city but did not arrive.",
    status: "pending_verification", reporterId: null, verifiedAt: null, reportedAt: date(10),
  },
  {
    id: "demo-11", caseId: "FB-2026-00114", fullName: "Tara Bose", age: 22,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 6 in",
    identifyingMarks: "None reported", hairDescription: "Dark, shoulder length", eyeDescription: "Brown",
    clothingDescription: "Beige jacket and dark jeans", lastSeenDate: date(11), lastSeenTime: "18:15",
    lastSeenLocation: "Near the art district", publicArea: "Indiranagar, Bengaluru", city: "Bengaluru",
    district: "Bengaluru Urban", state: "Karnataka", latitude: 12.98, longitude: 77.64,
    circumstances: "Last seen in a public area after work.",
    status: "active", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(11),
  },
  {
    id: "demo-12", caseId: "FB-2026-00113", fullName: "Aditya Kulkarni", age: 73,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "5 ft 7 in",
    identifyingMarks: "Uses prescription glasses", hairDescription: "Grey, thinning", eyeDescription: "Brown",
    clothingDescription: "White kurta and tan sandals", lastSeenDate: date(12), lastSeenTime: "07:50",
    lastSeenLocation: "Morning market entrance", publicArea: "Shivajinagar, Pune", city: "Pune",
    district: "Pune", state: "Maharashtra", latitude: 18.53, longitude: 73.85,
    circumstances: "May be disoriented and benefit from calm assistance.",
    status: "verified", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(12),
  },
  {
    id: "demo-13", caseId: "FB-2026-00112", fullName: "Farah Ali", age: 38,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 3 in",
    identifyingMarks: "Small scar near chin", hairDescription: "Dark, covered with a scarf", eyeDescription: "Brown",
    clothingDescription: "Lavender kurta with a cream scarf", lastSeenDate: date(13), lastSeenTime: "13:10",
    lastSeenLocation: "Near the city bus depot", publicArea: "Banjara Hills, Hyderabad", city: "Hyderabad",
    district: "Hyderabad", state: "Telangana", latitude: 17.42, longitude: 78.44,
    circumstances: "Last seen near a public transport hub.",
    status: "under_investigation", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(13),
  },
  {
    id: "demo-14", caseId: "FB-2026-00111", fullName: "Manav Shah", age: 15,
    dateOfBirth: null, gender: "Male", photoUrl: null, height: "5 ft 4 in",
    identifyingMarks: "Blue sports bag", hairDescription: "Dark, short", eyeDescription: "Brown",
    clothingDescription: "Red sports jersey and black shorts", lastSeenDate: date(14), lastSeenTime: "17:25",
    lastSeenLocation: "Local sports complex", publicArea: "Satellite, Ahmedabad", city: "Ahmedabad",
    district: "Ahmedabad", state: "Gujarat", latitude: 23.03, longitude: 72.51,
    circumstances: "Did not return after an evening practice.",
    status: "possible_sighting", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(14),
  },
  {
    id: "demo-15", caseId: "FB-2026-00110", fullName: "Ananya Das", age: 47,
    dateOfBirth: null, gender: "Female", photoUrl: null, height: "5 ft 2 in",
    identifyingMarks: "Gold-rimmed glasses", hairDescription: "Dark, tied back", eyeDescription: "Brown",
    clothingDescription: "Rust-colored shawl and dark trousers", lastSeenDate: date(15), lastSeenTime: "10:40",
    lastSeenLocation: "Near the lakeside walking path", publicArea: "Bhopal Lakefront", city: "Bhopal",
    district: "Bhopal", state: "Madhya Pradesh", latitude: 23.25, longitude: 77.40,
    circumstances: "Last seen during a regular morning walk.",
    status: "closed", reporterId: null, verifiedAt: new Date().toISOString(), reportedAt: date(15),
  },
];

const demoSightings: SightingRecord[] = [
  { id: "s-1", caseId: "demo-1", caseDisplayId: "FB-2026-00124", personName: "Aarav Reddy", submittedByName: "Community member", anonymous: false, date: date(0), time: "09:15", location: "Kadapa central market", latitude: 14.47, longitude: 78.82, description: "A person matching the public description was seen near the market entrance. No contact was made.", status: "pending_review", createdAt: new Date().toISOString() },
  { id: "s-2", caseId: "demo-2", caseDisplayId: "FB-2026-00123", personName: "Meera Nair", submittedByName: "Anonymous", anonymous: true, date: date(1), time: "20:10", location: "North Bengaluru transit area", latitude: 13.04, longitude: 77.59, description: "Possible match seen waiting near a public transport stop.", status: "verified", createdAt: new Date().toISOString() },
  { id: "s-3", caseId: "demo-3", caseDisplayId: "FB-2026-00122", personName: "Kabir Das", submittedByName: "Community member", anonymous: false, date: date(2), time: "08:50", location: "Kolkata riverside path", latitude: 22.53, longitude: 88.33, description: "A person with similar clothing was seen walking east. The observer did not approach.", status: "pending_review", createdAt: new Date().toISOString() },
  { id: "s-4", caseId: "demo-5", caseDisplayId: "FB-2026-00120", personName: "Dev Patel", submittedByName: "Anonymous", anonymous: true, date: date(4), time: "21:20", location: "Powai public promenade", latitude: 19.12, longitude: 72.91, description: "A possible sighting was shared with the review team.", status: "needs_more_information", createdAt: new Date().toISOString() },
  { id: "s-5", caseId: "demo-6", caseDisplayId: "FB-2026-00119", personName: "Nandini Joseph", submittedByName: "Community member", anonymous: false, date: date(5), time: "11:30", location: "Kochi community clinic", latitude: 9.97, longitude: 76.24, description: "A person matching the description was seen near the clinic reception.", status: "verified", createdAt: new Date().toISOString() },
  { id: "s-6", caseId: "demo-7", caseDisplayId: "FB-2026-00118", personName: "Sana Khan", submittedByName: "Anonymous", anonymous: true, date: date(6), time: "18:05", location: "Jaipur north garden", latitude: 26.94, longitude: 75.79, description: "Possible match near a garden gate at the stated time.", status: "pending_review", createdAt: new Date().toISOString() },
  { id: "s-7", caseId: "demo-8", caseDisplayId: "FB-2026-00117", personName: "Rohan Sen", submittedByName: "Community member", anonymous: false, date: date(7), time: "15:30", location: "Salt Lake sports ground", latitude: 22.58, longitude: 88.42, description: "Information was submitted before the case was updated.", status: "verified", createdAt: new Date().toISOString() },
  { id: "s-8", caseId: "demo-11", caseDisplayId: "FB-2026-00114", personName: "Tara Bose", submittedByName: "Anonymous", anonymous: true, date: date(9), time: "18:40", location: "Indiranagar public street", latitude: 12.98, longitude: 77.64, description: "A person matching the clothing description was seen from a distance.", status: "rejected", createdAt: new Date().toISOString() },
  { id: "s-9", caseId: "demo-12", caseDisplayId: "FB-2026-00113", personName: "Aditya Kulkarni", submittedByName: "Community member", anonymous: false, date: date(10), time: "08:10", location: "Pune market area", latitude: 18.53, longitude: 73.85, description: "A possible match was seen near the market. Reviewer requested a time confirmation.", status: "needs_more_information", createdAt: new Date().toISOString() },
  { id: "s-10", caseId: "demo-14", caseDisplayId: "FB-2026-00111", personName: "Manav Shah", submittedByName: "Anonymous", anonymous: true, date: date(12), time: "17:45", location: "Ahmedabad sports complex", latitude: 23.03, longitude: 72.51, description: "A person carrying a similar sports bag was noticed near the entrance.", status: "pending_review", createdAt: new Date().toISOString() },
];

interface DemoDatabase {
  cases: CaseRecord[];
  sightings: SightingRecord[];
  timeline: TimelineEvent[];
  notifications: NotificationRecord[];
  users: AdminUserRecord[];
  flags: ReportFlagRecord[];
  auditLogs: AuditLogRecord[];
  privateCaseDetails: Record<string, RestrictedCaseDetails>;
  privateSightings: Record<string, RestrictedSightingDetails>;
}

const demoUsers: AdminUserRecord[] = [
  { id: "demo-user", name: "Sam Taylor", email: "sam@findback.demo", role: "user", status: "active", createdAt: date(18) },
  { id: "demo-reporter", name: "Maya Patel", email: "maya@findback.demo", role: "reporter", status: "active", createdAt: date(16) },
  { id: "demo-user-2", name: "Alex Kim", email: "alex@findback.demo", role: "user", status: "active", createdAt: date(14) },
  { id: "demo-reporter-2", name: "Noor Desai", email: "noor@findback.demo", role: "reporter", status: "active", createdAt: date(12) },
  { id: "demo-user-3", name: "Lee Morgan", email: "lee@findback.demo", role: "user", status: "active", createdAt: date(10) },
  { id: "demo-authority-1", name: "Jordan Lee", email: "jordan@findback.demo", role: "authority", status: "active", createdAt: date(9) },
  { id: "demo-authority-2", name: "Erin Cole", email: "erin@findback.demo", role: "authority", status: "active", createdAt: date(8) },
  { id: "demo-admin", name: "Casey Morgan", email: "casey@findback.demo", role: "admin", status: "active", createdAt: date(7) },
];

function initialDemoDb(): DemoDatabase {
  return {
    cases: demoCases,
    sightings: demoSightings,
    timeline: demoCases.flatMap((item) => [
      { id: `${item.id}-submitted`, caseId: item.id, type: "report_submitted", message: "Report submitted for review", visibility: "public" as const, authorName: "FindBack", createdAt: `${item.reportedAt}T09:00:00.000Z` },
      ...(item.verifiedAt ? [{ id: `${item.id}-verified`, caseId: item.id, type: "verification", message: "Case reviewed by an authorized reviewer", visibility: "public" as const, authorName: "Authorized reviewer", createdAt: item.verifiedAt }] : []),
      ...(item.status === "found" || item.status === "closed" ? [{ id: `${item.id}-resolved`, caseId: item.id, type: item.status, message: "Case status updated after human review", visibility: "public" as const, authorName: "Authorized reviewer", createdAt: new Date().toISOString() }] : []),
    ]),
    notifications: [
      { id: "n-1", title: "A sighting needs review", message: "A new community sighting was submitted for a public case.", type: "new_sighting", read: false, createdAt: new Date().toISOString() },
      { id: "n-2", title: "Demo workspace ready", message: "All records are fictional and saved in this browser only.", type: "authority_update", read: false, createdAt: new Date().toISOString() },
    ],
    users: demoUsers,
    flags: [],
    auditLogs: [
      { id: "audit-demo-1", action: "demo_workspace_opened", entityType: "workspace", entityId: null, userName: "FindBack demo", createdAt: new Date().toISOString() },
    ],
    privateCaseDetails: {},
    privateSightings: {},
  };
}

function readDemoDb(): DemoDatabase {
  try {
    const saved = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!saved) return initialDemoDb();
    return { ...initialDemoDb(), ...JSON.parse(saved) as Partial<DemoDatabase> };
  } catch {
    return initialDemoDb();
  }
}

function addDemoAudit(action: string, entityType: string, entityId: string | null) {
  const db = readDemoDb();
  db.auditLogs.unshift({
    id: crypto.randomUUID(),
    action,
    entityType,
    entityId,
    userName: getDemoProfile().name,
    createdAt: new Date().toISOString(),
  });
  writeDemoDb(db);
}

function writeDemoDb(db: DemoDatabase) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(db));
}

export function currentMode(): WorkspaceMode {
  return (localStorage.getItem(MODE_KEY) as WorkspaceMode | null) ?? "demo";
}

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

export function getSupabaseClient() {
  return supabase;
}

export function switchMode(mode: WorkspaceMode) {
  if (mode === "cloud" && !supabase) {
    throw new Error("Supabase is not configured for this app.");
  }
  localStorage.setItem(MODE_KEY, mode);
  if (mode === "demo") localStorage.removeItem(PROFILE_KEY);
}

export function getDemoProfile(): AppProfile {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) return JSON.parse(saved) as AppProfile;
  } catch {
    // Recreate the safe default demo identity.
  }
  const profile: AppProfile = {
    id: "demo-user",
    name: "Sam Taylor",
    email: "sam@findback.demo",
    role: "user",
    demo: true,
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

export function setDemoRole(role: Role): AppProfile {
  if (currentMode() !== "demo") {
    throw new Error("Role switching is only available in the local demo workspace.");
  }
  const names: Record<Role, string> = {
    user: "Sam Taylor",
    reporter: "Maya Patel",
    authority: "Jordan Lee",
    admin: "Casey Morgan",
  };
  const profile: AppProfile = {
    id: `demo-${role}`,
    name: names[role],
    email: `${role}@findback.demo`,
    role,
    demo: true,
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}

async function requireSupabase() {
  if (!supabase) throw new Error("Supabase connection settings are missing.");
  return supabase;
}

async function getSupabaseProfile(session: Session | null): Promise<AppProfile | null> {
  if (!session || !supabase) return null;
  const { data, error } = await supabase.from("profiles").select("id,name,email,phone,role").eq("id", session.user.id).single();
  if (error) throw error;
  return { id: data.id, name: data.name ?? "FindBack member", email: data.email ?? session.user.email ?? "", phone: data.phone ?? undefined, role: data.role as Role, demo: false };
}

export async function signIn(email: string, password: string): Promise<AppProfile> {
  const client = await requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const profile = await getSupabaseProfile(data.session);
  if (!profile) throw new Error("Your account profile is not available.");
  localStorage.setItem(MODE_KEY, "cloud");
  localStorage.removeItem(PROFILE_KEY);
  return profile;
}

export async function signUp(input: { name: string; email: string; phone: string; password: string }) {
  const client = await requireSupabase();
  const { data, error } = await client.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { name: input.name, phone: input.phone } },
  });
  if (error) throw error;
  return data;
}

export async function requestPasswordReset(email: string) {
  const client = await requireSupabase();
  const redirectTo = `${window.location.origin}${import.meta.env.BASE_URL}reset-password`;
  const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const client = await requireSupabase();
  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
  switchMode("demo");
}

export async function getCurrentProfile(): Promise<AppProfile | null> {
  if (currentMode() === "demo") return getDemoProfile();
  const client = await requireSupabase();
  const { data } = await client.auth.getSession();
  if (!data.session) return null;
  return getSupabaseProfile(data.session);
}

function mapCase(row: Record<string, unknown>): CaseRecord {
  return {
    id: String(row.id),
    caseId: String(row.case_id),
    fullName: String(row.full_name),
    age: Number(row.age),
    dateOfBirth: row.date_of_birth ? String(row.date_of_birth) : null,
    gender: String(row.gender ?? "Not specified"),
    photoUrl: row.photo_url ? String(row.photo_url) : null,
    height: row.height ? String(row.height) : null,
    identifyingMarks: row.identifying_marks ? String(row.identifying_marks) : null,
    hairDescription: row.hair_description ? String(row.hair_description) : null,
    eyeDescription: row.eye_description ? String(row.eye_description) : null,
    clothingDescription: String(row.clothing_description ?? ""),
    lastSeenDate: String(row.last_seen_date),
    lastSeenTime: row.last_seen_time ? String(row.last_seen_time) : null,
    lastSeenLocation: String(row.public_location ?? row.last_seen_location ?? ""),
    publicArea: String(row.public_area ?? row.last_seen_location ?? ""),
    city: String(row.city ?? ""),
    district: String(row.district ?? ""),
    state: String(row.state ?? ""),
    latitude: row.public_latitude == null ? null : Number(row.public_latitude),
    longitude: row.public_longitude == null ? null : Number(row.public_longitude),
    circumstances: String(row.public_circumstances ?? row.circumstances ?? ""),
    status: row.status as CaseStatus,
    reporterId: row.reporter_id ? String(row.reporter_id) : null,
    verifiedAt: row.verified_at ? String(row.verified_at) : null,
    reportedAt: String(row.created_at),
  };
}

async function hydratePhotos(records: CaseRecord[]): Promise<CaseRecord[]> {
  if (!supabase || currentMode() !== "cloud") return records;
  return Promise.all(records.map(async (record) => {
    if (!record.photoUrl || record.photoUrl.startsWith("data:") || record.photoUrl.startsWith("http")) return record;
    const { data } = await supabase.storage.from("case-photos").createSignedUrl(record.photoUrl, 60 * 60);
    return { ...record, photoUrl: data?.signedUrl ?? null };
  }));
}

const PUBLIC_CASE_COLUMNS = "id,case_id,full_name,age,gender,photo_url,height,identifying_marks,hair_description,eye_description,clothing_description,last_seen_date,last_seen_time,public_area,city,district,state,public_latitude,public_longitude,public_circumstances,status,verified_at,created_at,updated_at";

async function validateImage(file: File) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error("Choose a JPG, PNG, or WEBP image.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Images must be smaller than 5 MB.");
  const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This image could not be opened."));
    };
    image.src = url;
  });
  if (dimensions.width < 128 || dimensions.height < 128 || dimensions.width > 8000 || dimensions.height > 8000) {
    throw new Error("Images must be between 128 and 8,000 pixels in each dimension.");
  }
}

async function compressedDemoImage(file: File): Promise<string> {
  const source = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("This image could not be opened."));
      element.src = source;
    });
    const scale = Math.min(1, 1000 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("This image could not be prepared.");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.76);
  } finally {
    URL.revokeObjectURL(source);
  }
}

export async function uploadCasePhoto(file: File): Promise<{ path: string; previewUrl: string }> {
  await validateImage(file);
  if (currentMode() === "demo") {
    const image = await compressedDemoImage(file);
    return { path: image, previewUrl: image };
  }
  const client = await requireSupabase();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) throw new Error("Sign in before uploading a case photo.");
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${auth.user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from("case-photos").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data, error: signError } = await client.storage.from("case-photos").createSignedUrl(path, 60 * 60);
  if (signError) throw signError;
  return { path, previewUrl: data.signedUrl };
}

export async function uploadSightingEvidence(file: File): Promise<{ path: string; previewUrl: string }> {
  await validateImage(file);
  if (currentMode() === "demo") {
    const image = await compressedDemoImage(file);
    return { path: image, previewUrl: image };
  }
  const client = await requireSupabase();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) throw new Error("Sign in before uploading private sighting evidence. You can still submit an anonymous text observation.");
  const path = `${auth.user.id}/${crypto.randomUUID()}.${file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg"}`;
  const { error } = await client.storage.from("sighting-evidence").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data, error: signError } = await client.storage.from("sighting-evidence").createSignedUrl(path, 60 * 60);
  if (signError) throw signError;
  return { path, previewUrl: data.signedUrl };
}

export async function getSightingEvidenceUrl(path: string): Promise<string> {
  if (currentMode() === "demo") return path;
  const client = await requireSupabase();
  const { data, error } = await client.storage.from("sighting-evidence").createSignedUrl(path, 60 * 60);
  if (error) throw error;
  return data.signedUrl;
}

export async function listCases(filters: CaseFilters = {}): Promise<CaseRecord[]> {
  if (currentMode() === "demo") {
    let items = [...readDemoDb().cases];
    const query = filters.query?.trim().toLowerCase();
    if (query) items = items.filter((item) => [item.fullName, item.caseId, item.publicArea, item.city, item.district, item.state].join(" ").toLowerCase().includes(query));
    if (filters.status) items = items.filter((item) => item.status === filters.status);
    if (filters.gender) items = items.filter((item) => item.gender === filters.gender);
    if (filters.state) items = items.filter((item) => item.state.toLowerCase() === filters.state?.toLowerCase());
    if (filters.city) items = items.filter((item) => item.city.toLowerCase() === filters.city?.toLowerCase());
    if (filters.fromDate) items = items.filter((item) => item.lastSeenDate >= filters.fromDate!);
    if (filters.toDate) items = items.filter((item) => item.lastSeenDate <= filters.toDate!);
    items.sort((a, b) => filters.sort === "oldest" ? a.reportedAt.localeCompare(b.reportedAt) : b.reportedAt.localeCompare(a.reportedAt));
    return items;
  }
  const client = await requireSupabase();
  let query = client.from("missing_persons").select(PUBLIC_CASE_COLUMNS).order("created_at", { ascending: filters.sort === "oldest" }).range(0, 49);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.gender) query = query.eq("gender", filters.gender);
  if (filters.state) query = query.ilike("state", filters.state);
  if (filters.city) query = query.ilike("city", filters.city);
  if (filters.fromDate) query = query.gte("last_seen_date", filters.fromDate);
  if (filters.toDate) query = query.lte("last_seen_date", filters.toDate);
  const search = filters.query?.trim().replace(/[,%()*.\\]/g, " ");
  if (search) query = query.or(`full_name.ilike.%${search}%,case_id.ilike.%${search}%,public_area.ilike.%${search}%,city.ilike.%${search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return hydratePhotos((data ?? []).map((row: unknown) => mapCase(row as Record<string, unknown>)));
}

export async function listMyCases(): Promise<CaseRecord[]> {
  if (currentMode() === "demo") {
    const id = getDemoProfile().id;
    return readDemoDb().cases.filter((item) => item.reporterId === id);
  }
  const client = await requireSupabase();
  const { data, error } = await client.rpc("get_my_cases");
  if (error) throw error;
  return hydratePhotos((data ?? []).map((row) => mapCase(row as Record<string, unknown>)));
}

export async function searchCases(filters: CaseFilters = {}, page = 1, pageSize = 9) {
  if (currentMode() === "demo") {
    const items = (await listCases(filters)).filter((record) => !["pending_verification", "rejected"].includes(record.status));
    const start = Math.max(0, page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total: items.length };
  }
  const client = await requireSupabase();
  const start = Math.max(0, page - 1) * pageSize;
  let query = client.from("missing_persons").select(PUBLIC_CASE_COLUMNS, { count: "exact" }).order("created_at", { ascending: filters.sort === "oldest" }).range(start, start + pageSize - 1);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.gender) query = query.eq("gender", filters.gender);
  if (filters.state) query = query.ilike("state", filters.state);
  if (filters.city) query = query.ilike("city", filters.city);
  if (filters.fromDate) query = query.gte("last_seen_date", filters.fromDate);
  if (filters.toDate) query = query.lte("last_seen_date", filters.toDate);
  const search = filters.query?.trim().replace(/[,%()*.\\]/g, " ");
  if (search) query = query.or(`full_name.ilike.%${search}%,case_id.ilike.%${search}%,public_area.ilike.%${search}%,city.ilike.%${search}%`);
  const { data, error, count } = await query;
  if (error) throw error;
  return { items: await hydratePhotos((data ?? []).map((row) => mapCase(row as Record<string, unknown>))), total: count ?? 0 };
}

export async function getCase(id: string): Promise<CaseRecord | null> {
  if (currentMode() === "demo") {
    return readDemoDb().cases.find((item) => item.id === id || item.caseId === id) ?? null;
  }
  const client = await requireSupabase();
  const { data, error } = await client.from("missing_persons").select(PUBLIC_CASE_COLUMNS).or(`id.eq.${id},case_id.eq.${id}`).maybeSingle();
  if (error) throw error;
  return data ? (await hydratePhotos([mapCase(data as Record<string, unknown>)]))[0] : null;
}

export async function createCase(input: CaseInput): Promise<CaseRecord> {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    const n = 125 + db.cases.length - demoCases.length;
    const created: CaseRecord = {
      id: `demo-${crypto.randomUUID()}`,
      caseId: `FB-${new Date().getFullYear()}-${String(n).padStart(5, "0")}`,
      fullName: input.fullName,
      age: input.age,
      dateOfBirth: input.dateOfBirth || null,
      gender: input.gender,
      photoUrl: input.photoUrl || null,
      height: input.height || null,
      identifyingMarks: input.identifyingMarks || null,
      hairDescription: input.hairDescription || null,
      eyeDescription: input.eyeDescription || null,
      clothingDescription: input.clothingDescription,
      lastSeenDate: input.lastSeenDate,
      lastSeenTime: input.lastSeenTime || null,
      lastSeenLocation: input.lastSeenLocation,
      publicArea: input.publicArea,
      city: input.city,
      district: input.district ?? "",
      state: input.state,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      circumstances: input.circumstances,
      status: "pending_verification",
      reporterId: getDemoProfile().id,
      verifiedAt: null,
      reportedAt: new Date().toISOString(),
    };
    db.cases.unshift(created);
    db.privateCaseDetails[created.id] = {
      reporterName: input.reporterName,
      relationship: input.relationship,
      phone: input.reporterPhone,
      email: input.reporterEmail,
      contactPreference: input.contactPreference,
      exactLastSeenLocation: input.lastSeenLocation,
      additionalNotes: input.additionalNotes ?? "",
    };
    db.timeline.unshift({ id: crypto.randomUUID(), caseId: created.id, type: "report_submitted", message: "Report submitted and is awaiting an authorized human review.", visibility: "reporter", authorName: input.reporterName, createdAt: created.reportedAt });
    db.notifications.unshift({ id: crypto.randomUUID(), title: "Report received", message: `${created.caseId} is pending verification.`, type: "report_submitted", read: false, createdAt: created.reportedAt });
    writeDemoDb(db);
    addDemoAudit("case_creation", "missing_person", created.id);
    return created;
  }
  const client = await requireSupabase();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) throw new Error("Sign in before submitting a report.");
  const publicCoords = input.latitude && input.longitude ? { lat: Math.round(input.latitude * 100) / 100, lng: Math.round(input.longitude * 100) / 100 } : { lat: null, lng: null };
  const { data, error } = await client.rpc("submit_missing_person", {
    p_public: {
      full_name: input.fullName,
      age: input.age,
      date_of_birth: input.dateOfBirth || null,
      gender: input.gender,
      photo_url: input.photoUrl || null,
      height: input.height || null,
      identifying_marks: input.identifyingMarks || null,
      hair_description: input.hairDescription || null,
      eye_description: input.eyeDescription || null,
      clothing_description: input.clothingDescription,
      last_seen_date: input.lastSeenDate,
      last_seen_time: input.lastSeenTime || null,
      public_area: input.publicArea,
      city: input.city,
      district: input.district || null,
      state: input.state,
      public_latitude: publicCoords.lat,
      public_longitude: publicCoords.lng,
      public_circumstances: input.circumstances,
    },
    p_private: {
      reporter_name: input.reporterName,
      relationship: input.relationship,
      phone: input.reporterPhone,
      email: input.reporterEmail,
      contact_preference: input.contactPreference,
      exact_last_seen_location: input.lastSeenLocation,
      exact_latitude: input.latitude ?? null,
      exact_longitude: input.longitude ?? null,
      circumstances: input.circumstances,
      additional_notes: input.additionalNotes ?? "",
    },
  });
  if (error) throw error;
  const caseRecord = mapCase(data as Record<string, unknown>);
  return caseRecord;
}

export async function listSightings(caseId?: string): Promise<SightingRecord[]> {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    return db.sightings.filter((item) => !caseId || item.caseId === caseId || item.caseDisplayId === caseId);
  }
  const client = await requireSupabase();
  let query = client.from("sightings").select("id,case_id,anonymous,sighting_date,sighting_time,public_location,public_latitude,public_longitude,description,status,created_at,missing_persons(case_id,full_name)").order("created_at", { ascending: false }).limit(100);
  if (caseId) query = query.eq("case_id", caseId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((row) => {
    const person = row.missing_persons as { case_id?: string; full_name?: string } | null;
    return {
      id: String(row.id), caseId: String(row.case_id), caseDisplayId: person?.case_id ?? "Case",
      personName: person?.full_name ?? "Person", submittedByName: row.anonymous ? "Anonymous" : "Identified observer",
      anonymous: Boolean(row.anonymous), date: String(row.sighting_date), time: String(row.sighting_time),
      location: String(row.public_location ?? ""), latitude: row.public_latitude == null ? null : Number(row.public_latitude),
      longitude: row.public_longitude == null ? null : Number(row.public_longitude), description: String(row.description),
      status: row.status as SightingStatus, createdAt: String(row.created_at),
    };
  });
}

export async function createSighting(caseRecord: CaseRecord, input: SightingInput): Promise<SightingRecord> {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    const created: SightingRecord = {
      id: crypto.randomUUID(), caseId: caseRecord.id, caseDisplayId: caseRecord.caseId, personName: caseRecord.fullName,
      submittedByName: input.anonymous ? "Anonymous" : input.submittedByName, anonymous: input.anonymous,
      date: input.date, time: input.time, location: input.location, latitude: input.latitude ?? null,
      longitude: input.longitude ?? null, description: input.description, status: "pending_review", createdAt: new Date().toISOString(),
    };
    db.sightings.unshift(created);
    if (input.evidencePath || input.contactPhone || input.contactEmail) {
      db.privateSightings[created.id] = {
        contactName: input.anonymous ? null : input.submittedByName || null,
        contactPhone: input.contactPhone || null,
        contactEmail: input.contactEmail || null,
        contactPreference: input.contactPreference || null,
        evidencePath: input.evidencePath || null,
      };
    }
    db.timeline.unshift({ id: crypto.randomUUID(), caseId: caseRecord.id, type: "sighting", message: "A new sighting was submitted and is awaiting human review.", visibility: "authority", authorName: "Community member", createdAt: created.createdAt });
    db.notifications.unshift({ id: crypto.randomUUID(), title: "New sighting submitted", message: `A sighting for ${caseRecord.caseId} is pending review.`, type: "new_sighting", read: false, createdAt: created.createdAt });
    writeDemoDb(db);
    addDemoAudit("sighting_submission", "sighting", created.id);
    return created;
  }
  const client = await requireSupabase();
  const { data, error } = await client.rpc("submit_sighting", {
    p_case_id: caseRecord.id,
    p_sighting: {
      anonymous: input.anonymous,
      sighting_date: input.date,
      sighting_time: input.time,
      public_location: input.location,
      public_latitude: input.latitude == null ? null : Math.round(input.latitude * 100) / 100,
      public_longitude: input.longitude == null ? null : Math.round(input.longitude * 100) / 100,
      description: input.description,
    },
    p_private: {
      contact_name: input.anonymous ? null : input.submittedByName,
      contact_phone: input.contactPhone || null,
      contact_email: input.contactEmail || null,
      contact_preference: input.contactPreference || null,
      evidence_path: input.evidencePath || null,
    },
  });
  if (error) throw error;
  return {
    id: String(data.id), caseId: String(data.case_id), caseDisplayId: caseRecord.caseId, personName: caseRecord.fullName,
    submittedByName: input.anonymous ? "Anonymous" : input.submittedByName, anonymous: input.anonymous,
    date: String(data.sighting_date), time: String(data.sighting_time), location: String(data.public_location),
    latitude: data.public_latitude == null ? null : Number(data.public_latitude), longitude: data.public_longitude == null ? null : Number(data.public_longitude),
    description: String(data.description), status: data.status as SightingStatus, createdAt: String(data.created_at),
  };
}

export async function getRestrictedCaseDetails(caseId: string): Promise<RestrictedCaseDetails | null> {
  if (currentMode() === "demo") {
    const profile = getDemoProfile();
    if (profile.role !== "authority" && profile.role !== "admin" && profile.role !== "reporter") {
      throw new Error("Restricted case details are only available in a reviewer or reporter demo role.");
    }
    return readDemoDb().privateCaseDetails[caseId] ?? null;
  }
  const client = await requireSupabase();
  const { data, error } = await client.from("case_private_details").select("*").eq("case_id", caseId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    reporterName: String(data.reporter_name),
    relationship: String(data.relationship ?? ""),
    phone: String(data.phone),
    email: String(data.email),
    contactPreference: String(data.contact_preference),
    exactLastSeenLocation: String(data.exact_last_seen_location),
    additionalNotes: String(data.additional_notes ?? ""),
  };
}

export async function getRestrictedSightingDetails(sightingId: string): Promise<RestrictedSightingDetails | null> {
  if (currentMode() === "demo") {
    const profile = getDemoProfile();
    if (profile.role !== "authority" && profile.role !== "admin") {
      throw new Error("Evidence is only available to an authorized reviewer.");
    }
    return readDemoDb().privateSightings[sightingId] ?? null;
  }
  const client = await requireSupabase();
  const { data, error } = await client.from("sighting_private_details").select("*").eq("sighting_id", sightingId).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    contactName: data.contact_name ? String(data.contact_name) : null,
    contactPhone: data.contact_phone ? String(data.contact_phone) : null,
    contactEmail: data.contact_email ? String(data.contact_email) : null,
    contactPreference: data.contact_preference ? String(data.contact_preference) : null,
    evidencePath: data.evidence_path ? String(data.evidence_path) : null,
  };
}

export async function getTimeline(caseId: string): Promise<TimelineEvent[]> {
  if (currentMode() === "demo") {
    return readDemoDb().timeline.filter((item) => item.caseId === caseId || item.caseId === readDemoDb().cases.find((record) => record.caseId === caseId)?.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  const client = await requireSupabase();
  const { data, error } = await client.from("case_updates").select("id,case_id,author_name,type,message,visibility,created_at").eq("case_id", caseId).order("created_at");
  if (error) throw error;
  return (data ?? []).map((row) => ({ id: String(row.id), caseId: String(row.case_id), type: String(row.type), message: String(row.message), visibility: row.visibility as TimelineEvent["visibility"], authorName: row.author_name ?? "FindBack reviewer", createdAt: String(row.created_at) }));
}

export async function reviewCase(caseId: string, decision: "verified" | "rejected" | "more_information_required", notes: string) {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    const index = db.cases.findIndex((item) => item.id === caseId || item.caseId === caseId);
    if (index < 0) throw new Error("Case not found.");
    const record = db.cases[index];
    const newStatus: CaseStatus = decision === "verified" ? "active" : decision === "rejected" ? "rejected" : "pending_verification";
    db.cases[index] = { ...record, status: newStatus, verifiedAt: decision === "verified" ? new Date().toISOString() : record.verifiedAt };
    const stamp = new Date().toISOString();
    db.timeline.push({ id: crypto.randomUUID(), caseId: record.id, type: "verification", message: notes || (decision === "verified" ? "Case verified by an authorized demo reviewer." : decision === "rejected" ? "Case rejected after review." : "More information requested from the reporter."), visibility: "public", authorName: "Authorized demo reviewer", createdAt: stamp });
    db.notifications.unshift({ id: crypto.randomUUID(), title: decision === "verified" ? "Case verified" : decision === "rejected" ? "Case review complete" : "More information requested", message: `${record.caseId} was updated by a human reviewer.`, type: decision === "verified" ? "report_verified" : "status_changed", read: false, createdAt: stamp });
    writeDemoDb(db);
    addDemoAudit("case_verification", "missing_person", record.id);
    return db.cases[index];
  }
  const client = await requireSupabase();
  const { data, error } = await client.rpc("review_missing_person", { p_case_id: caseId, p_decision: decision, p_notes: notes });
  if (error) throw error;
  return data;
}

export async function reviewSighting(id: string, decision: SightingStatus, notes = "") {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    const index = db.sightings.findIndex((item) => item.id === id);
    if (index < 0) throw new Error("Sighting not found.");
    const sighting = db.sightings[index];
    db.sightings[index] = { ...sighting, status: decision };
    db.timeline.push({ id: crypto.randomUUID(), caseId: sighting.caseId, type: "sighting", message: notes || `Sighting review updated: ${decision.replaceAll("_", " ")}.`, visibility: "authority", authorName: "Authorized demo reviewer", createdAt: new Date().toISOString() });
    writeDemoDb(db);
    addDemoAudit("sighting_review", "sighting", sighting.id);
    return db.sightings[index];
  }
  const client = await requireSupabase();
  const { data, error } = await client.rpc("review_sighting", { p_sighting_id: id, p_decision: decision, p_notes: notes });
  if (error) throw error;
  return data;
}

export async function updateCaseStatus(id: string, status: CaseStatus, message: string) {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    const index = db.cases.findIndex((item) => item.id === id || item.caseId === id);
    if (index < 0) throw new Error("Case not found.");
    db.cases[index] = { ...db.cases[index], status };
    db.timeline.push({ id: crypto.randomUUID(), caseId: db.cases[index].id, type: status === "found" ? "found" : "status_change", message: message || `Case status updated to ${status.replaceAll("_", " ")}.`, visibility: "public", authorName: "Authorized demo reviewer", createdAt: new Date().toISOString() });
    writeDemoDb(db);
    addDemoAudit("case_status_change", "missing_person", db.cases[index].id);
    return db.cases[index];
  }
  const client = await requireSupabase();
  const { data, error } = await client.rpc("change_case_status", { p_case_id: id, p_status: status, p_message: message });
  if (error) throw error;
  return data;
}

export async function getNotifications(): Promise<NotificationRecord[]> {
  if (currentMode() === "demo") return readDemoDb().notifications;
  const client = await requireSupabase();
  const { data, error } = await client.from("notifications").select("*").order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? []).map((item) => ({ id: String(item.id), title: String(item.title), message: String(item.message), type: String(item.type), read: Boolean(item.read), createdAt: String(item.created_at) }));
}

export async function markNotificationRead(id: string, read = true) {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    db.notifications = db.notifications.map((item) => item.id === id ? { ...item, read } : item);
    writeDemoDb(db);
    return;
  }
  const client = await requireSupabase();
  const { error } = await client.from("notifications").update({ read }).eq("id", id);
  if (error) throw error;
}

export async function markAllNotificationsRead() {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    db.notifications = db.notifications.map((item) => ({ ...item, read: true }));
    writeDemoDb(db);
    return;
  }
  const client = await requireSupabase();
  const { error } = await client.from("notifications").update({ read: true }).eq("read", false);
  if (error) throw error;
}

export async function createReportFlag(caseId: string, reason: string, details: string) {
  if (currentMode() === "demo") {
    const db = readDemoDb();
    db.flags.unshift({ id: crypto.randomUUID(), caseId, reason, details, status: "open", createdAt: new Date().toISOString() });
    db.notifications.unshift({ id: crypto.randomUUID(), title: "Report received", message: "Your safety report was recorded in this browser demo.", type: "authority_update", read: false, createdAt: new Date().toISOString() });
    writeDemoDb(db);
    addDemoAudit("case_flagged", "report_flag", caseId);
    return;
  }
  const client = await requireSupabase();
  const { data: auth } = await client.auth.getUser();
  const { error } = await client.from("report_flags").insert({ case_id: caseId, reporter_id: auth.user?.id ?? null, reason, details, status: "open" });
  if (error) throw error;
}

export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  if (currentMode() === "demo") return readDemoDb().users;
  const client = await requireSupabase();
  const { data, error } = await client.from("profiles").select("id,name,email,role,status,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: String(item.id), name: String(item.name ?? "FindBack member"), email: String(item.email),
    role: item.role as Role, status: item.status as AdminUserRecord["status"], createdAt: String(item.created_at),
  }));
}

export async function setUserRole(userId: string, role: Exclude<Role, "admin">) {
  if (currentMode() === "demo") {
    if (getDemoProfile().role !== "admin") throw new Error("Switch to the admin demo role to manage users.");
    const db = readDemoDb();
    db.users = db.users.map((user) => user.id === userId ? { ...user, role } : user);
    writeDemoDb(db);
    addDemoAudit("user_role_change", "profile", userId);
    return;
  }
  const client = await requireSupabase();
  const { error } = await client.rpc("admin_set_profile_role", { p_user_id: userId, p_role: role });
  if (error) throw error;
}

export async function setUserStatus(userId: string, status: AdminUserRecord["status"]) {
  if (currentMode() === "demo") {
    if (getDemoProfile().role !== "admin") throw new Error("Switch to the admin demo role to manage users.");
    const db = readDemoDb();
    db.users = db.users.map((user) => user.id === userId ? { ...user, status } : user);
    writeDemoDb(db);
    addDemoAudit("user_status_change", "profile", userId);
    return;
  }
  const client = await requireSupabase();
  const { error } = await client.rpc("admin_set_profile_status", { p_user_id: userId, p_status: status });
  if (error) throw error;
}

export async function getReportFlags(): Promise<ReportFlagRecord[]> {
  if (currentMode() === "demo") return readDemoDb().flags;
  const client = await requireSupabase();
  const { data, error } = await client.from("report_flags").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: String(item.id), caseId: item.case_id ? String(item.case_id) : null,
    reason: String(item.reason), details: String(item.details ?? ""), status: String(item.status),
    createdAt: String(item.created_at),
  }));
}

export async function reviewReportFlag(id: string, status: string) {
  if (currentMode() === "demo") {
    if (getDemoProfile().role !== "admin") throw new Error("Switch to the admin demo role to review reports.");
    const db = readDemoDb();
    db.flags = db.flags.map((flag) => flag.id === id ? { ...flag, status } : flag);
    writeDemoDb(db);
    addDemoAudit("flag_review", "report_flag", id);
    return;
  }
  const client = await requireSupabase();
  const { error } = await client.rpc("admin_review_report_flag", { p_flag_id: id, p_status: status });
  if (error) throw error;
}

export async function getAuditLogs(): Promise<AuditLogRecord[]> {
  if (currentMode() === "demo") return readDemoDb().auditLogs;
  const client = await requireSupabase();
  const { data, error } = await client.from("audit_logs").select("id,action,entity_type,entity_id,user_id,created_at").order("created_at", { ascending: false }).limit(100);
  if (error) throw error;
  return (data ?? []).map((item) => ({
    id: String(item.id), action: String(item.action), entityType: String(item.entity_type),
    entityId: item.entity_id ? String(item.entity_id) : null, userName: "Authorized account",
    createdAt: String(item.created_at),
  }));
}

export async function getReviewerStats() {
  const cases = await listCases();
  const sightings = await listSightings();
  return {
    active: cases.filter((item) => ["active", "verified", "under_investigation", "possible_sighting"].includes(item.status)).length,
    pendingCases: cases.filter((item) => item.status === "pending_verification").length,
    found: cases.filter((item) => item.status === "found").length,
    verified: cases.filter((item) => ["verified", "active", "under_investigation", "possible_sighting"].includes(item.status)).length,
    pendingSightings: sightings.filter((item) => item.status === "pending_review").length,
    totalSightings: sightings.length,
    totalCases: cases.length,
    resolved: cases.filter((item) => ["found", "closed"].includes(item.status)).length,
    cases,
    sightings,
  };
}

export function onAuthStateChange(callback: (profile: AppProfile | null) => void) {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    void getSupabaseProfile(session).then(callback).catch(() => callback(null));
  });
  return () => data.subscription.unsubscribe();
}

