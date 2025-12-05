import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  CheckSquare, 
  LogOut, 
  Plus, 
  Bell, 
  Search, 
  Menu,
  X,
  ChevronRight,
  Shield,
  MapPin,
  User,
  Send
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_DATA = {
  districts: [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", 
    "Kottayam", "Idukki", "Ernakulam", "Thrissur", "Palakkad", 
    "Malappuram", "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
  ],
  users: [
    { id: 1, name: "Arjun (State)", role: "STATE_ADMIN", district: null, email: "state@akef.in" },
    { id: 2, name: "Rahul (TVM Admin)", role: "DISTRICT_ADMIN", district: "Thiruvananthapuram", email: "tvm@akef.in" },
    { id: 3, name: "Sarah (EKM Admin)", role: "DISTRICT_ADMIN", district: "Ernakulam", email: "ekm@akef.in" },
    { id: 4, name: "Vishnu (TVM Emp)", role: "EMPLOYEE", district: "Thiruvananthapuram", email: "emp1@akef.in" },
  ],
  posts: [
    { id: 1, type: "EVENT", title: "AKEF State Championship 2025", content: "Grand finals will be held in Kochi. All districts please submit team lists.", author: "Arjun (State)", role: "STATE_ADMIN", district: null, date: "2 hrs ago" },
    { id: 2, type: "UPDATE", title: "TVM District Meetup", content: "Monthly meetup at Technopark this Saturday.", author: "Rahul (TVM Admin)", role: "DISTRICT_ADMIN", district: "Thiruvananthapuram", date: "5 hrs ago" },
  ],
  tasks: [
    { id: 101, title: "Update Player Registry", assignedTo: 2, assignedBy: 1, status: "Pending", priority: "High" },
    { id: 102, title: "Venue Booking for Qualifiers", assignedTo: 4, assignedBy: 2, status: "In Progress", priority: "Medium" },
  ],
  chat: [
    { id: 1, user: "Rahul", text: "Has everyone submitted the roster?", district: "Thiruvananthapuram", time: "10:00 AM" },
    { id: 2, user: "Vishnu", text: "Uploading it now, sir.", district: "Thiruvananthapuram", time: "10:05 AM" },
  ]
};

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
  <div className={`bg-gray-800 border border-gray-700 rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = "default" }) => {
  const styles = {
    default: "bg-gray-700 text-gray-300",
    success: "bg-green-900/50 text-green-400 border border-green-700",
    warning: "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
    danger: "bg-red-900/50 text-red-400 border border-red-700",
    brand: "bg-green-600 text-black font-bold",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[type] || styles.default}`}>
      {children}
    </span>
  );
};

// --- MAIN APP ---

export default function AKEFPortal() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data State
  const [posts, setPosts] = useState(MOCK_DATA.posts);
  const [tasks, setTasks] = useState(MOCK_DATA.tasks);
  const [messages, setMessages] = useState(MOCK_DATA.chat);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveTab("feed");
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const addTask = (task) => {
    setTasks([task, ...tasks]);
  };

  const sendMessage = (text) => {
    const newMsg = {
      id: Date.now(),
      user: currentUser.name.split(" ")[0],
      text,
      district: currentUser.district,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

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
              <span className="text-xl font-bold tracking-tighter">AKEF<span className="text-green-500">PORTAL</span></span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <NavButton active={activeTab === "feed"} onClick={() => setActiveTab("feed")} icon={<Bell size={18} />}>Feed</NavButton>
              <NavButton active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={18} />}>Tasks</NavButton>
              <NavButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")} icon={<MessageSquare size={18} />}>District Chat</NavButton>
              {currentUser.role === "STATE_ADMIN" && (
                <NavButton active={activeTab === "admin"} onClick={() => setActiveTab("admin")} icon={<Users size={18} />}>Admin</NavButton>
              )}
              <div className="h-6 w-px bg-gray-700 mx-2"></div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full border border-gray-700">
                <div className="w-6 h-6 rounded-full bg-green-900/50 flex items-center justify-center text-green-400 text-xs font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="text-sm font-medium hidden lg:block">{currentUser.name}</span>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-red-900/20 text-gray-400 hover:text-red-400 rounded-full transition-colors">
                <LogOut size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-400">
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700 px-2 pt-2 pb-3 space-y-1">
             <MobileNavButton active={activeTab === "feed"} onClick={() => setActiveTab("feed")} icon={<Bell size={18} />}>Feed</MobileNavButton>
             <MobileNavButton active={activeTab === "tasks"} onClick={() => setActiveTab("tasks")} icon={<CheckSquare size={18} />}>Tasks</MobileNavButton>
             <MobileNavButton active={activeTab === "chat"} onClick={() => setActiveTab("chat")} icon={<MessageSquare size={18} />}>Chat</MobileNavButton>
             {currentUser.role === "STATE_ADMIN" && (
                <MobileNavButton active={activeTab === "admin"} onClick={() => setActiveTab("admin")} icon={<Users size={18} />}>Admin</MobileNavButton>
              )}
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-gray-700 rounded-md">
               <LogOut size={18} /> Logout
             </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "feed" && <FeedView user={currentUser} posts={posts} setPosts={setPosts} />}
        {activeTab === "tasks" && <TaskView user={currentUser} tasks={tasks} onAddTask={addTask} />}
        {activeTab === "chat" && <ChatView user={currentUser} messages={messages} onSendMessage={sendMessage} />}
        {activeTab === "admin" && currentUser.role === "STATE_ADMIN" && <AdminView />}
      </main>
    </div>
  );
}

// --- SUB-VIEWS ---

function FeedView({ user, posts, setPosts }) {
  const [newPost, setNewPost] = useState("");
  const [postScope, setPostScope] = useState("GLOBAL");

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const post = {
      id: Date.now(),
      type: "UPDATE",
      title: "New Update",
      content: newPost,
      author: user.name,
      role: user.role,
      district: user.role === "STATE_ADMIN" && postScope === "GLOBAL" ? null : user.district,
      date: "Just now"
    };
    setPosts([post, ...posts]);
    setNewPost("");
  };

  const visiblePosts = posts.filter(post => {
    if (user.role === "STATE_ADMIN") return true;
    if (!post.district) return true;
    return post.district === user.district;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {(user.role === "STATE_ADMIN" || user.role === "DISTRICT_ADMIN") && (
          <Card className="bg-gradient-to-r from-gray-800 to-gray-800/50 border-green-900/30">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
              <Plus size={16} /> Post an Update
            </h3>
            <form onSubmit={handlePost}>
              <textarea 
                className="w-full bg-gray-900/50 border border-gray-700 rounded-md p-3 text-sm focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all placeholder-gray-600 text-white"
                placeholder={`What's happening in ${user.role === "STATE_ADMIN" ? "Kerala" : user.district}?`}
                rows="3"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex justify-between items-center mt-3">
                {user.role === "STATE_ADMIN" && (
                  <select 
                    value={postScope}
                    onChange={(e) => setPostScope(e.target.value)}
                    className="bg-gray-900 text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none"
                  >
                    <option value="GLOBAL">Global (All Districts)</option>
                    <option value="DISTRICT">My District Only</option>
                  </select>
                )}
                <div className="flex-1"></div>
                <button type="submit" className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-1.5 rounded text-sm transition-colors">
                  Post Update
                </button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Latest Updates <span className="text-xs font-normal text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">{visiblePosts.length}</span>
          </h2>
          {visiblePosts.map((post) => (
            <Card key={post.id} className="hover:border-gray-600 transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${post.role === 'STATE_ADMIN' ? 'bg-green-900 text-green-400' : 'bg-blue-900 text-blue-400'}`}>
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-gray-200">{post.author}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                       <span>{post.role.replace('_', ' ')}</span>
                       <span>•</span>
                       <span>{post.date}</span>
                    </div>
                  </div>
                </div>
                {!post.district ? (
                  <Badge type="brand">GLOBAL</Badge>
                ) : (
                  <Badge>{post.district}</Badge>
                )}
              </div>
              <h3 className="text-lg font-medium text-white mb-1 group-hover:text-green-400 transition-colors">{post.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{post.content}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-green-900/10 border-green-900/50">
          <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
             <Calendar size={18} /> Upcoming Events
          </h3>
          <div className="space-y-3">
             <div className="flex gap-3 items-center p-2 bg-gray-800/50 rounded hover:bg-gray-800 cursor-pointer">
                <div className="bg-gray-700 text-gray-300 rounded px-2 py-1 text-center min-w-[3.5rem]">
                   <div className="text-xs">DEC</div>
                   <div className="font-bold text-lg">15</div>
                </div>
                <div>
                   <div className="text-sm font-medium text-gray-200">State Semi-Finals</div>
                   <div className="text-xs text-gray-500">Kochi Arena</div>
                </div>
             </div>
             <div className="flex gap-3 items-center p-2 bg-gray-800/50 rounded hover:bg-gray-800 cursor-pointer">
                <div className="bg-gray-700 text-gray-300 rounded px-2 py-1 text-center min-w-[3.5rem]">
                   <div className="text-xs">DEC</div>
                   <div className="font-bold text-lg">22</div>
                </div>
                <div>
                   <div className="text-sm font-medium text-gray-200">Annual GBM</div>
                   <div className="text-xs text-gray-500">Online Zoom</div>
                </div>
             </div>
          </div>
        </Card>

        <Card>
           <h3 className="font-bold text-gray-300 mb-3">My District</h3>
           <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <MapPin size={16} />
              {user.district || "Kerala State Office"}
           </div>
           <div className="w-full h-24 bg-gray-700/30 rounded-md flex items-center justify-center text-xs text-gray-500">
              Map Placeholder
           </div>
        </Card>
      </div>
    </div>
  );
}

function TaskView({ user, tasks, onAddTask }) {
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");

  const myTasks = tasks.filter(t => t.assignedTo === user.id);
  const assignedByMe = tasks.filter(t => t.assignedBy === user.id);
  const canAssignTask = user.role !== "EMPLOYEE";
  
  const potentialAssignees = MOCK_DATA.users.filter(u => {
    if (u.id === user.id) return false;
    if (user.role === "STATE_ADMIN") return true;
    if (user.role === "DISTRICT_ADMIN") return u.district === user.district;
    return false;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const task = {
      id: Date.now(),
      title: newTaskTitle,
      assignedTo: parseInt(assigneeId),
      assignedBy: user.id,
      status: "Pending",
      priority: "Medium"
    };
    onAddTask(task);
    setShowModal(false);
    setNewTaskTitle("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Tasks</h2>
        {canAssignTask && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-600 hover:bg-green-500 text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Assign New Task
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <User size={14} /> Assigned to Me
          </h3>
          {myTasks.length === 0 && <p className="text-gray-600 italic text-sm">No tasks assigned to you.</p>}
          {myTasks.map(task => (
             <TaskCard key={task.id} task={task} isOwner={true} />
          ))}
        </div>

        {canAssignTask && (
          <div className="space-y-3">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
              <Send size={14} /> Assigned by Me
            </h3>
            {assignedByMe.length === 0 && <p className="text-gray-600 italic text-sm">You haven't assigned any tasks.</p>}
            {assignedByMe.map(task => (
               <TaskCard key={task.id} task={task} isOwner={false} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className="bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-700">
              <h3 className="text-lg font-bold mb-4">Assign New Task</h3>
              <form onSubmit={handleCreate} className="space-y-4">
                 <div>
                    <label className="block text-xs text-gray-400 mb-1">Task Title</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                    />
                 </div>
                 <div>
                    <label className="block text-xs text-gray-400 mb-1">Assign To</label>
                    <select 
                      required
                      className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white"
                      value={assigneeId}
                      onChange={e => setAssigneeId(e.target.value)}
                    >
                      <option value="">Select Member...</option>
                      {potentialAssignees.map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                      ))}
                    </select>
                 </div>
                 <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded text-sm text-gray-200">Cancel</button>
                    <button type="submit" className="flex-1 bg-green-600 hover:bg-green-500 text-black font-bold py-2 rounded text-sm">Assign</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, isOwner }) {
  const getAssigneeName = (id) => MOCK_DATA.users.find(u => u.id === id)?.name || "Unknown";

  return (
    <Card className="flex items-center justify-between p-3">
       <div>
          <h4 className="font-medium text-gray-200">{task.title}</h4>
          <p className="text-xs text-gray-500 mt-1">
             {isOwner ? `From: ${getAssigneeName(task.assignedBy)}` : `To: ${getAssigneeName(task.assignedTo)}`}
          </p>
       </div>
       <Badge type={task.status === "Pending" ? "warning" : "success"}>{task.status}</Badge>
    </Card>
  );
}

function ChatView({ user, messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const chatEndRef = React.useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  const districtMessages = messages.filter(m => m.district === user.district);

  if (!user.district && user.role === "STATE_ADMIN") {
     return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
           <MessageSquare size={48} className="text-gray-600 mb-4" />
           <h3 className="text-xl font-bold text-gray-300">Select a District Channel</h3>
           <p className="text-gray-500 max-w-md mt-2">As a State Admin, you would typically select a specific district from a list to view their internal communications.</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[600px] bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-900/50 p-4 border-b border-gray-700 flex justify-between items-center">
         <h3 className="font-bold flex items-center gap-2 text-white">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {user.district} District Chat
         </h3>
         <span className="text-xs text-gray-500">{districtMessages.length} messages</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {districtMessages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.user === user.name.split(" ")[0] ? "items-end" : "items-start"}`}>
               <div className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                 msg.user === user.name.split(" ")[0] 
                   ? "bg-green-600 text-black font-medium rounded-tr-none" 
                   : "bg-gray-700 text-gray-200 rounded-tl-none"
               }`}>
                  {msg.text}
               </div>
               <span className="text-[10px] text-gray-500 mt-1 px-1">
                  {msg.user} • {msg.time}
               </span>
            </div>
         ))}
         <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-900 border-t border-gray-700 flex gap-2">
         <input 
           className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-green-500 text-white"
           placeholder="Type a message..."
           value={input}
           onChange={e => setInput(e.target.value)}
         />
         <button type="submit" className="bg-green-600 hover:bg-green-500 text-black p-2 rounded-md transition-colors">
            <Send size={18} />
         </button>
      </form>
    </div>
  );
}

function AdminView() {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white">Administration</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="flex flex-col items-center justify-center p-8 border-dashed border-2 border-gray-700 bg-transparent hover:border-green-500 cursor-pointer transition-colors group">
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-900/30">
                <Users className="text-gray-400 group-hover:text-green-400" />
             </div>
             <span className="font-semibold text-gray-300 group-hover:text-green-400">Manage Users</span>
          </Card>
          <Card className="flex flex-col items-center justify-center p-8 border-dashed border-2 border-gray-700 bg-transparent hover:border-green-500 cursor-pointer transition-colors group">
             <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-900/30">
                <MapPin className="text-gray-400 group-hover:text-green-400" />
             </div>
             <span className="font-semibold text-gray-300 group-hover:text-green-400">District Settings</span>
          </Card>
       </div>
       
       <div className="mt-8">
          <h3 className="text-lg font-bold mb-4 text-white">All Users Directory</h3>
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                   <tr>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">District</th>
                      <th className="px-6 py-3">Email</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                   {MOCK_DATA.users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-700/50">
                         <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                         <td className="px-6 py-4"><Badge>{u.role}</Badge></td>
                         <td className="px-6 py-4 text-gray-400">{u.district || "-"}</td>
                         <td className="px-6 py-4 text-gray-400">{u.email}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-600/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Shield className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AKEF <span className="text-green-500">INTERNAL</span></h1>
          <p className="text-gray-500 mt-2">Select a role to access the portal</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => onLogin(MOCK_DATA.users[0])}
            className="w-full group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-green-500/50 p-4 rounded-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center text-green-500">
                  <Shield size={20} />
               </div>
               <div className="text-left">
                  <div className="font-bold text-gray-200 group-hover:text-white">State Committee</div>
                  <div className="text-xs text-gray-500">Full Access • Global Feed</div>
               </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-green-500" size={20} />
          </button>

          <button 
            onClick={() => onLogin(MOCK_DATA.users[1])}
            className="w-full group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-blue-500/50 p-4 rounded-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-500">
                  <MapPin size={20} />
               </div>
               <div className="text-left">
                  <div className="font-bold text-gray-200 group-hover:text-white">District Committee</div>
                  <div className="text-xs text-gray-500">Thiruvananthapuram • District Admin</div>
               </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-blue-500" size={20} />
          </button>

          <button 
            onClick={() => onLogin(MOCK_DATA.users[3])}
            className="w-full group bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 p-4 rounded-xl transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center text-purple-500">
                  <User size={20} />
               </div>
               <div className="text-left">
                  <div className="font-bold text-gray-200 group-hover:text-white">Employee / Member</div>
                  <div className="text-xs text-gray-500">Restricted Access • Task View</div>
               </div>
            </div>
            <ChevronRight className="text-gray-600 group-hover:text-purple-500" size={20} />
          </button>
        </div>

        <div className="mt-8 text-center">
           <p className="text-xs text-gray-600">All Kerala Esports Federation © 2025</p>
        </div>
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, children }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active ? "bg-green-600 text-black" : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {icon}
    {children}
  </button>
);

const MobileNavButton = ({ active, onClick, icon, children }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
      active ? "bg-green-600 text-black" : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {icon}
    {children}
  </button>
);