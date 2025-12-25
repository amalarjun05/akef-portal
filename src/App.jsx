import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, Calendar, MessageSquare, CheckSquare, LogOut, Plus, Bell, 
  Menu, X, Shield, MapPin, User, Send, BookOpen, Video, Clock, FileText,
  AlertCircle, CheckCircle, MessageCircle, Phone, Mail, Lock, Camera, 
  UploadCloud, Trash2, FileSpreadsheet, ArrowLeft, Download, Printer, ExternalLink,
  Receipt, DollarSign, XCircle, Vote, BarChart, Image as ImageIcon, Briefcase
} from 'lucide-react';

// --- MOCK DATA & LOCAL STORAGE HELPERS ---
const loadFromStorage = (key, defaultData) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultData;
};

const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const DEFAULT_POSTS = [
  { id: 1, author: "State Secretary", role: "ADMIN", content: "⚠️ Urgent: All District Associations must submit their qualified player lists for the State Championship by this Friday, 5 PM.", date: "2 hrs ago", type: "URGENT" },
  { id: 2, author: "Event Coordinator", role: "MEMBER", content: "The venue for the Grand Finals has been confirmed: Rajiv Gandhi Indoor Stadium, Kochi. Floor plan attached in Library.", date: "5 hrs ago", type: "UPDATE" }
];

const DEFAULT_EVENTS = [
  { id: 1, title: "State Committee Meeting", date: "2025-12-15", time: "10:00 AM", location: "Kochi HQ" },
  { id: 2, title: "District Qualifiers (Online)", date: "2025-12-20", time: "09:00 AM", location: "Discord" },
  { id: 3, title: "Annual General Body", date: "2026-01-05", time: "11:00 AM", location: "Trivandrum" },
];

const DEFAULT_TASKS = [
  { id: 1, title: "Finalize venue for Kochi qualifiers", status: "pending" },
  { id: 2, title: "Send invites to district heads", status: "completed" },
];

const DEFAULT_MEETINGS = [
  { id: 1, title: "Core Team Sync", date: "2025-12-12", time: "10:00", type: "Online" },
];

const DEFAULT_CLAIMS = [
  { id: 1, claimant: "Rahul (TVM)", desc: "Venue Advance - District Qualifiers", amount: 15000, date: "2025-12-01", status: "Pending", proof: "receipt_001.jpg" },
  { id: 2, claimant: "Vishnu (Tech)", desc: "Server Hosting (AWS) - Dec 2025", amount: 4500, date: "2025-12-05", status: "Approved", proof: "aws_inv.pdf" },
  { id: 3, claimant: "Sarah (EKM)", desc: "Refreshments for Committee Meet", amount: 1200, date: "2025-11-28", status: "Rejected", proof: "food_bill.jpg" },
];

const DEFAULT_POLLS = [
  { 
    id: 1, 
    question: "Select Venue for State Grand Finals 2025", 
    status: "Active", 
    totalVotes: 12,
    options: [
      { id: 'a', text: "Rajiv Gandhi Stadium, Kochi", votes: 8 },
      { id: 'b', text: "Jimmy George Stadium, TVM", votes: 4 }
    ],
    userVoted: null 
  },
  { 
    id: 2, 
    question: "Should we include 'Valorant' in the official roster?", 
    status: "Closed", 
    totalVotes: 25,
    options: [
      { id: 'a', text: "Yes", votes: 20 },
      { id: 'b', text: "No", votes: 5 }
    ],
    userVoted: 'a'
  }
];

const COLLEAGUES = [
  { uid: 2, name: "Rahul (TVM Sec)", status: "online", role: "District Admin" },
  { uid: 3, name: "Sarah (EKM Pres)", status: "busy", role: "District Admin" },
  { uid: 4, name: "Vishnu (Tech Lead)", status: "offline", role: "Employee" },
  { uid: 5, name: "Anjali (HR)", status: "online", role: "HR Manager" },
];

// --- MAIN APP COMPONENT ---

export default function AKEFWorkspace() {
  const [user] = useState({
    uid: "test-admin-01",
    displayName: "State Administrator",
    email: "admin@akef.in",
    photoURL: null
  });
  
  const [userData] = useState({
    name: "Arjun (State)",
    role: "STATE_ADMIN",
    district: "State Office",
    designation: "General Secretary",
    isOnline: true
  });

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-green-500 selection:text-black">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter">AKEF<span className="text-green-500">WORKSPACE</span></span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              <NavButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<Bell size={18} />}>Dashboard</NavButton>
              <NavButton active={activeTab === "finance"} onClick={() => setActiveTab("finance")} icon={<Receipt size={18} />}>Finance</NavButton>
              <NavButton active={activeTab === "governance"} onClick={() => setActiveTab("governance")} icon={<Vote size={18} />}>Governance</NavButton>
              <NavButton active={activeTab === "library"} onClick={() => setActiveTab("library")} icon={<BookOpen size={18} />}>Library</NavButton>
              <NavButton active={activeTab === "todos"} onClick={() => setActiveTab("todos")} icon={<CheckSquare size={18} />}>Tasks</NavButton>
              <NavButton active={activeTab === "meetings"} onClick={() => setActiveTab("meetings")} icon={<Video size={18} />}>Meetings</NavButton>
              
              <div className="h-6 w-px bg-gray-700 mx-2"></div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
                <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 text-xs font-bold border border-green-500/30">
                  {userData.name?.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none text-white">{userData.name}</span>
                  <span className="text-[10px] text-green-400 leading-none">{userData.designation}</span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-gray-400">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-gray-800 border-b border-gray-700 px-2 pt-2 pb-3 space-y-1">
             <MobileNavButton active={activeTab === "dashboard"} onClick={() => {setActiveTab("dashboard"); setIsMobileMenuOpen(false)}} icon={<Bell size={18} />}>Dashboard</MobileNavButton>
             <MobileNavButton active={activeTab === "finance"} onClick={() => {setActiveTab("finance"); setIsMobileMenuOpen(false)}} icon={<Receipt size={18} />}>Finance & Claims</MobileNavButton>
             <MobileNavButton active={activeTab === "governance"} onClick={() => {setActiveTab("governance"); setIsMobileMenuOpen(false)}} icon={<Vote size={18} />}>Governance</MobileNavButton>
             <MobileNavButton active={activeTab === "library"} onClick={() => {setActiveTab("library"); setIsMobileMenuOpen(false)}} icon={<BookOpen size={18} />}>Library</MobileNavButton>
             <MobileNavButton active={activeTab === "todos"} onClick={() => {setActiveTab("todos"); setIsMobileMenuOpen(false)}} icon={<CheckSquare size={18} />}>Tasks</MobileNavButton>
             <MobileNavButton active={activeTab === "meetings"} onClick={() => {setActiveTab("meetings"); setIsMobileMenuOpen(false)}} icon={<Video size={18} />}>Meetings</MobileNavButton>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {activeTab === "dashboard" && <FeedView user={user} userData={userData} />}
        {activeTab === "finance" && <FinanceView userData={userData} />}
        {activeTab === "governance" && <GovernanceView userData={userData} />}
        {activeTab === "library" && <LibraryView />}
        {activeTab === "todos" && <TodoView />}
        {activeTab === "meetings" && <MeetingView userData={userData} />}
      </main>

      {/* Floating Chat Widget */}
      <ChatWidget currentUser={{...userData, uid: user.uid}} />
    </div>
  );
}

// --- NEW FEATURES: FINANCE & GOVERNANCE ---

function FinanceView({ userData }) {
  const [claims, setClaims] = useState(() => loadFromStorage('akef_claims', DEFAULT_CLAIMS));
  const [showModal, setShowModal] = useState(false);
  const [newClaim, setNewClaim] = useState({ desc: "", amount: "", proof: "" });

  const isAdmin = userData.role === "STATE_ADMIN";

  const handleSubmit = (e) => {
    e.preventDefault();
    const claim = {
      id: Date.now(),
      claimant: userData.name,
      desc: newClaim.desc,
      amount: parseFloat(newClaim.amount),
      date: new Date().toISOString().split('T')[0],
      status: "Pending",
      proof: "uploaded_file.jpg"
    };
    const updated = [claim, ...claims];
    setClaims(updated);
    saveToStorage('akef_claims', updated);
    setShowModal(false);
    setNewClaim({ desc: "", amount: "", proof: "" });
  };

  const updateStatus = (id, newStatus) => {
    const updated = claims.map(c => c.id === id ? { ...c, status: newStatus } : c);
    setClaims(updated);
    saveToStorage('akef_claims', updated);
  };

  const getStatusBadge = (status) => {
    const colors = {
      Pending: "bg-yellow-900/50 text-yellow-400 border-yellow-700",
      Approved: "bg-green-900/50 text-green-400 border-green-700",
      Rejected: "bg-red-900/50 text-red-400 border-red-700"
    };
    return `px-2 py-1 rounded text-xs border ${colors[status]}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Receipt className="text-green-500" /> Expense Tracking
        </h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded-md flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> New Claim
        </button>
      </div>

      <div className="grid gap-4">
        {claims.map(claim => (
          <Card key={claim.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4">
            <div className="flex-1">
              <div className="flex justify-between md:justify-start items-center gap-4 mb-1">
                <span className="font-bold text-white text-lg">₹{claim.amount.toLocaleString()}</span>
                <span className={getStatusBadge(claim.status)}>{claim.status}</span>
              </div>
              <h4 className="text-gray-300 font-medium">{claim.desc}</h4>
              <p className="text-xs text-gray-500 mt-1">Submitted by {claim.claimant} on {claim.date}</p>
            </div>
            
            {isAdmin && claim.status === "Pending" && (
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => updateStatus(claim.id, "Approved")}
                  className="flex-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 border border-green-800 px-3 py-2 rounded text-xs flex items-center justify-center gap-1"
                >
                  <CheckCircle size={14} /> Approve
                </button>
                <button 
                  onClick={() => updateStatus(claim.id, "Rejected")}
                  className="flex-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800 px-3 py-2 rounded text-xs flex items-center justify-center gap-1"
                >
                  <XCircle size={14} /> Reject
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-white">Submit Expense Claim</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Description</label>
                <input required className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white focus:border-green-500 outline-none" value={newClaim.desc} onChange={e => setNewClaim({...newClaim, desc: e.target.value})} placeholder="e.g., Venue Advance" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Amount (₹)</label>
                <input required type="number" className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white focus:border-green-500 outline-none" value={newClaim.amount} onChange={e => setNewClaim({...newClaim, amount: e.target.value})} placeholder="0.00" />
              </div>
              <div className="p-4 border-2 border-dashed border-gray-700 rounded-lg text-center text-gray-500 text-sm cursor-pointer hover:border-gray-500">
                <UploadCloud className="mx-auto mb-2" />
                Upload Bill / Receipt
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded text-sm">Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GovernanceView({ userData }) {
  const [polls, setPolls] = useState(() => loadFromStorage('akef_polls', DEFAULT_POLLS));

  const handleVote = (pollId, optionId) => {
    const updated = polls.map(poll => {
      if (poll.id === pollId) {
        if (poll.userVoted) return poll; // Already voted
        return {
          ...poll,
          totalVotes: poll.totalVotes + 1,
          userVoted: optionId,
          options: poll.options.map(opt => 
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          )
        };
      }
      return poll;
    });
    setPolls(updated);
    saveToStorage('akef_polls', updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Vote className="text-blue-500" /> Governance & Polling
        </h2>
        {userData.role === "STATE_ADMIN" && (
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded border border-blue-700 flex items-center gap-2">
            <Plus size={16} /> Create Poll
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {polls.map(poll => (
          <Card key={poll.id} className="p-5 border-t-4 border-t-blue-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-white">{poll.question}</h3>
              <span className={`text-[10px] px-2 py-1 rounded border ${poll.status === 'Active' ? 'bg-green-900/30 text-green-400 border-green-800' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                {poll.status}
              </span>
            </div>

            <div className="space-y-3">
              {poll.options.map(option => {
                const percentage = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
                const isSelected = poll.userVoted === option.id;
                
                return (
                  <div 
                    key={option.id} 
                    onClick={() => poll.status === 'Active' && !poll.userVoted && handleVote(poll.id, option.id)}
                    className={`relative p-3 rounded-md border transition-all ${
                      poll.userVoted 
                        ? 'border-gray-700 bg-gray-800 cursor-default' 
                        : 'border-gray-600 bg-gray-800/50 hover:border-blue-500 cursor-pointer'
                    }`}
                  >
                    {/* Progress Bar Background */}
                    {(poll.userVoted || poll.status === 'Closed') && (
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-md opacity-20 ${isSelected ? 'bg-green-500' : 'bg-blue-500'}`} 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    )}
                    
                    <div className="relative flex justify-between items-center z-10">
                      <span className={`text-sm ${isSelected ? 'text-green-400 font-bold' : 'text-gray-300'}`}>
                        {option.text} {isSelected && "(You)"}
                      </span>
                      {(poll.userVoted || poll.status === 'Closed') && (
                        <span className="text-xs font-bold text-white">{percentage}%</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
              <span>Total Votes: {poll.totalVotes}</span>
              {!poll.userVoted && poll.status === 'Active' && <span className="text-blue-400">Tap an option to vote</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// --- VIEW COMPONENTS (Existing) ---

function FeedView({ user, userData }) {
  const [posts, setPosts] = useState(() => loadFromStorage('akef_posts', DEFAULT_POSTS));
  const [events] = useState(() => loadFromStorage('akef_events', DEFAULT_EVENTS));
  const [newPost, setNewPost] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const post = {
      id: Date.now(),
      content: newPost,
      author: userData.name,
      role: userData.role,
      date: "Just now",
      type: "UPDATE"
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    saveToStorage('akef_posts', updatedPosts);
    setNewPost("");
  };

  const deletePost = (id) => {
    const updated = posts.filter(p => p.id !== id);
    setPosts(updated);
    saveToStorage('akef_posts', updated);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Feed */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-gradient-to-r from-gray-800 to-gray-800/50 border-green-900/30">
          <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
            <Plus size={16} /> Post Announcement
          </h3>
          <textarea 
            className="w-full bg-gray-900/50 border border-gray-700 rounded-md p-3 text-sm text-white focus:border-green-500 outline-none placeholder-gray-500"
            placeholder="Share an update with the State & District committees..."
            rows="2"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={handlePost} 
              className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-1.5 rounded text-sm transition-colors"
            >
              Post Update
            </button>
          </div>
        </Card>

        <h2 className="text-lg font-bold text-white flex items-center gap-2">Official Updates</h2>
        <div className="space-y-4">
          {posts.length === 0 && <div className="text-gray-500 text-sm text-center py-10 bg-gray-800/50 rounded-lg">No updates yet.</div>}
          {posts.map((post) => (
            <Card key={post.id} className="hover:border-gray-600 transition-colors group relative">
              <button onClick={() => deletePost(post.id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={16} />
              </button>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-sm text-green-400 border border-gray-600">
                    {post.author?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">{post.author}</h4>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">{post.role} • {post.date}</span>
                  </div>
                </div>
                {post.type === "URGENT" && <span className="text-[10px] bg-red-900/30 text-red-400 px-2 py-1 rounded border border-red-900/50 animate-pulse">URGENT</span>}
              </div>
              <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed ml-13 pl-13">{post.content}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Column: Reminders, Events & Quick Links */}
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-green-400 flex items-center gap-2">
               <Calendar size={18} /> Upcoming Events
            </h3>
          </div>
          <div className="space-y-3">
             {events.map(event => (
               <div key={event.id} className="flex gap-3 items-center p-2 rounded hover:bg-gray-700/50 cursor-pointer border-l-2 border-transparent hover:border-green-500 transition-all">
                  <div className="bg-gray-700 text-gray-300 rounded px-2 py-1 text-center min-w-[3.5rem]">
                     <div className="text-[10px] uppercase font-bold text-green-500">{new Date(event.date).getDate()}</div>
                     <div className="font-bold text-xs leading-none">{new Date(event.date).toLocaleString('default', { month: 'short' })}</div>
                  </div>
                  <div>
                     <div className="text-sm font-medium text-gray-200">{event.title}</div>
                     <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Clock size={12} /> {event.time} <span className="mx-1">•</span> <MapPin size={12} /> {event.location}
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </Card>

        <Card className="bg-yellow-900/10 border-yellow-900/30">
          <h3 className="font-bold text-yellow-500 mb-4 flex items-center gap-2 text-sm">
             <AlertCircle size={16} /> Action Required
          </h3>
          <div className="space-y-3">
             <div className="flex gap-3 items-start p-2 rounded hover:bg-gray-800/50 cursor-pointer">
                <div className="mt-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                   <div className="text-sm font-medium text-gray-200">Approve District Budgets</div>
                   <div className="text-xs text-gray-500">Deadline: Today, 5:00 PM</div>
                </div>
             </div>
          </div>
        </Card>

        <Card>
           <h3 className="font-bold text-gray-300 mb-3 text-sm">Employee Quick Links</h3>
           <div className="grid grid-cols-2 gap-2">
              <button className="p-3 bg-gray-900 rounded border border-gray-700 hover:border-green-500 text-xs text-gray-400 hover:text-white transition-colors text-center">
                 HR Portal
              </button>
              <button className="p-3 bg-gray-900 rounded border border-gray-700 hover:border-green-500 text-xs text-gray-400 hover:text-white transition-colors text-center">
                 Apply Leave
              </button>
           </div>
        </Card>
      </div>
    </div>
  );
}

function LibraryView() {
  const tools = [
    { 
      id: 'invoice', 
      name: "AKEF Invoice Maker", 
      desc: "Open external invoicing tool", 
      icon: FileSpreadsheet, 
      color: "text-blue-400",
      link: "https://akef-invoice.vercel.app" 
    },
    { 
      id: 'email_craft', 
      name: "Email Craft", 
      desc: "Professional email generator", 
      icon: Mail, 
      color: "text-purple-400",
      link: "https://email-craft-bice.vercel.app/" 
    }
  ];

  const assets = [
    { id: 1, name: "AKEF Logo Pack", type: "ZIP", desc: "Official Logos (PNG, SVG, AI)" },
    { id: 2, name: "Letterhead Template", type: "DOCX", desc: "For official district correspondence" },
    { id: 3, name: "Sponsorship Deck 2025", type: "PPTX", desc: "Standard pitch for sponsors" },
    { id: 4, name: "ID Card Template", type: "PSD", desc: "Photoshop file for member IDs" },
  ];

  const documents = [
    { id: 1, name: "AKEF Constitution 2025.pdf", category: "Legal", size: "2.4 MB" },
    { id: 2, name: "Esports Event Guidelines v3.docx", category: "Operations", size: "1.1 MB" },
    { id: 3, name: "Brand Assets & Logos.zip", category: "Marketing", size: "15 MB" },
    { id: 4, name: "District Committee Structure.pdf", category: "HR", size: "500 KB" },
  ];

  return (
    <div className="space-y-8">
      {/* TOOLS SECTION */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Official Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map(tool => (
            <Card 
              key={tool.id} 
              className="hover:border-blue-500 cursor-pointer group" 
              onClick={() => window.open(tool.link, '_blank')}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 group-hover:border-blue-500 transition-colors">
                  <tool.icon size={24} className={tool.color} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-200 group-hover:text-blue-400 flex items-center gap-2">
                    {tool.name} <ExternalLink size={12} className="opacity-50" />
                  </h3>
                  <p className="text-xs text-gray-500">{tool.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* BRAND ASSETS SECTION */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Brand Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {assets.map(asset => (
            <Card key={asset.id} className="hover:border-purple-500 group cursor-pointer">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-900/30 rounded flex items-center justify-center text-purple-400">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-200 group-hover:text-purple-400">{asset.name}</h3>
                  <p className="text-[10px] text-gray-500">{asset.desc}</p>
                  <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400 mt-2 inline-block">{asset.type}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* DOCUMENTS SECTION */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Document Library</h2>
          <button className="bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded border border-gray-600 flex items-center gap-2 cursor-pointer transition-colors">
            <UploadCloud size={16} /> Upload New
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map(doc => (
            <Card key={doc.id} className="hover:border-green-500 group cursor-pointer transition-all">
              <div className="flex flex-col h-full justify-between">
                <div className="mb-4">
                  <FileText size={32} className="text-gray-500 group-hover:text-green-500 mb-3 transition-colors" />
                  <h4 className="text-sm font-medium text-gray-200 line-clamp-2" title={doc.name}>{doc.name}</h4>
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-3">
                  <span className="bg-gray-800 px-2 py-1 rounded">{doc.category}</span>
                  <span>{doc.size}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function TodoView() {
  const [tasks, setTasks] = useState(() => loadFromStorage('akef_tasks', DEFAULT_TASKS));
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    const task = { id: Date.now(), title: newTask, status: "pending" };
    const updated = [task, ...tasks];
    setTasks(updated);
    saveToStorage('akef_tasks', updated);
    setNewTask("");
  };

  const toggleTask = (id) => {
    const updated = tasks.map(t => t.id === id ? { ...t, status: t.status === "completed" ? "pending" : "completed" } : t);
    setTasks(updated);
    saveToStorage('akef_tasks', updated);
  };

  const deleteTask = (e, id) => {
    e.stopPropagation();
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveToStorage('akef_tasks', updated);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <h2 className="text-2xl font-bold text-white">My To-Do List</h2>
        <span className="text-sm text-gray-500">{tasks.filter(t => t.status === 'pending').length} remaining</span>
      </div>

      <Card className="p-0 overflow-hidden">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            onClick={() => toggleTask(task.id)}
            className={`p-4 border-b border-gray-700 flex items-center gap-4 cursor-pointer hover:bg-gray-800 transition-colors group ${task.status === 'completed' ? 'bg-gray-800/30' : ''}`}
          >
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.status === 'completed' ? 'bg-green-600 border-green-600' : 'border-gray-500 group-hover:border-green-500'}`}>
              {task.status === 'completed' && <CheckSquare size={14} className="text-black" />}
            </div>
            <span className={`flex-1 text-sm ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
              {task.title}
            </span>
            <button onClick={(e) => deleteTask(e, task.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              <X size={18} />
            </button>
          </div>
        ))}
        <div className="p-3 bg-gray-900/50 flex items-center gap-3 border-t border-gray-700">
          <Plus size={18} className="text-green-500" />
          <input 
            className="bg-transparent border-none outline-none text-sm text-white flex-1 placeholder-gray-600"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <button onClick={addTask} className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 px-3 py-1 rounded">Add</button>
        </div>
      </Card>
    </div>
  );
}

function MeetingView({ userData }) {
  const [meetings, setMeetings] = useState(() => loadFromStorage('akef_meetings', DEFAULT_MEETINGS));
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", type: "Online" });

  const scheduleMeeting = (e) => {
    e.preventDefault();
    const meeting = { id: Date.now(), ...form, createdBy: userData.name };
    const updated = [...meetings, meeting].sort((a, b) => new Date(a.date) - new Date(b.date));
    setMeetings(updated);
    saveToStorage('akef_meetings', updated);
    setShowModal(false);
    setForm({ title: "", date: "", time: "", type: "Online" });
  };

  const deleteMeeting = (id) => {
    const updated = meetings.filter(m => m.id !== id);
    setMeetings(updated);
    saveToStorage('akef_meetings', updated);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Scheduled Meetings</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
        >
          <Plus size={16} /> Schedule
        </button>
      </div>

      <div className="space-y-4">
        {meetings.length === 0 && <div className="text-gray-500 text-center py-10">No scheduled meetings.</div>}
        {meetings.map(meeting => (
          <Card key={meeting.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 hover:border-gray-500 transition-colors group relative">
            <button onClick={() => deleteMeeting(meeting.id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100">
              <X size={16} />
            </button>
            <div className="flex gap-4">
              <div className="bg-gray-700 rounded-lg p-3 text-center min-w-[4rem] border border-gray-600">
                <div className="text-xs text-gray-400 uppercase">{meeting.date ? new Date(meeting.date).toLocaleString('default', {weekday: 'short'}) : ''}</div>
                <div className="font-bold text-white text-xl">{meeting.date ? new Date(meeting.date).getDate() : ''}</div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{meeting.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded border border-gray-700"><Video size={10} /> {meeting.type}</span>
                  <span className="flex items-center gap-1 bg-gray-900 px-2 py-1 rounded border border-gray-700"><Clock size={10} /> {meeting.time}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-white">New Meeting</h3>
            <form onSubmit={scheduleMeeting} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Title</label>
                <input required className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white focus:border-green-500 outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Date</label>
                  <input required type="date" className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white focus:border-green-500 outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Time</label>
                  <input required type="time" className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white focus:border-green-500 outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Type</label>
                <select className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white focus:border-green-500 outline-none" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option>Online (Zoom/Meet)</option>
                  <option>In-Person (HQ)</option>
                  <option>Hybrid</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-400 hover:text-white text-sm">Cancel</button>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 rounded text-sm transition-colors">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatWidget({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState("general"); 
  const [messages, setMessages] = useState({
    general: [
      { id: 1, sender: "Rahul (TVM)", text: "Has the schedule for the qualifier been released?", time: "10:30 AM" },
      { id: 2, sender: "Sarah (EKM)", text: "Yes, check the Library. I uploaded it an hour ago.", time: "10:32 AM" },
    ]
  });
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  // Load chat from storage on init
  useEffect(() => {
    const savedChat = localStorage.getItem('akef_chat');
    if (savedChat) setMessages(JSON.parse(savedChat));
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeChat]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: "You",
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = {
      ...messages,
      [activeChat]: [...(messages[activeChat] || []), msg]
    };

    setMessages(updatedMessages);
    saveToStorage('akef_chat', updatedMessages);
    setNewMessage("");
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-500 text-black rounded-full shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center transition-transform hover:scale-105 z-50"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-gray-900">3</span>}
      </button>

      <div className={`fixed bottom-24 right-6 w-96 h-[600px] max-h-[70vh] bg-gray-800 border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-40 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none translate-y-10'}`}>
        
        <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              {activeChat === 'general' ? '# General Public' : COLLEAGUES.find(c => c.uid === activeChat)?.name}
            </h3>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              {activeChat === 'general' ? 'All Federation Members' : 'Direct Message'}
            </span>
          </div>
          {activeChat !== 'general' && (
            <button onClick={() => setActiveChat('general')} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-white">
              Back
            </button>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`absolute inset-0 bg-gray-800 transition-transform duration-300 flex flex-col ${activeChat !== 'general' ? '-translate-x-full' : 'translate-x-0'}`}>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
                <div className="text-center py-4">
                   <p className="text-xs text-gray-500 mb-2">Welcome to the General Channel</p>
                   <div className="flex justify-center -space-x-2">
                      {COLLEAGUES.map(c => (
                        <div key={c.uid} onClick={() => setActiveChat(c.uid)} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-[10px] cursor-pointer hover:z-10 hover:border-green-500 transition-colors" title={c.name}>
                          {c.name.charAt(0)}
                        </div>
                      ))}
                   </div>
                </div>

                {(messages['general'] || []).map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === 'You' 
                        ? 'bg-green-600 text-black rounded-tr-none font-medium' 
                        : 'bg-gray-700 text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.sender === 'You' ? '' : msg.sender + ' • '}{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2 shrink-0">
               <input 
                 className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 text-white placeholder-gray-500"
                 placeholder="Message #general..."
                 value={newMessage}
                 onChange={e => setNewMessage(e.target.value)}
               />
               <button type="submit" className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-full transition-colors">
                 <Send size={18} />
               </button>
             </form>
          </div>

          <div className={`absolute inset-0 bg-gray-800 transition-transform duration-300 flex flex-col ${activeChat === 'general' ? 'translate-x-full' : 'translate-x-0'}`}>
             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/50">
               {(messages[activeChat] || []).map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.sender === 'You' 
                        ? 'bg-green-600 text-black rounded-tr-none font-medium' 
                        : 'bg-gray-700 text-gray-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
             </div>
             <form onSubmit={handleSend} className="p-3 bg-gray-900 border-t border-gray-700 flex gap-2 shrink-0">
               <input 
                 className="flex-1 bg-gray-800 border border-gray-600 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-green-500 text-white placeholder-gray-500"
                 placeholder={`Message ${COLLEAGUES.find(c => c.uid === activeChat)?.name.split(' ')[0]}...`}
                 value={newMessage}
                 onChange={e => setNewMessage(e.target.value)}
               />
               <button type="submit" className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-full transition-colors">
                 <Send size={18} />
               </button>
             </form>
          </div>

        </div>
      </div>
    </>
  );
}

// Utility
const Card = ({ children, className = "", ...props }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`} {...props}>
    {children}
  </div>
);

const NavButton = ({ active, onClick, icon, children }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${active ? "bg-green-600 text-black shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
  >
    {icon}
    {children}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, children }) => (
  <button 
    onClick={onClick} 
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${active ? "bg-green-600 text-black" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}
  >
    {icon}
    {children}
  </button>
);