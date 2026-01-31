import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, ArrowLeft, Camera, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock state for fields that might not be in user object yet
  const [formData, setFormData] = useState({
    firstname: user?.fullname?.firstname || "",
    lastname: user?.fullname?.lastname || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate developer and AI enthusiast. Love building sleek UIs and exploring new technologies.",
    occupation: "Software Engineer"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Here you would typically determine the API call to update the user
    // For now, we'll just toggle edit mode
    setIsEditing(false);
    // You might also want to update localStorage if you were actually changing data

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all shadow-sm"
          >
            <Edit2 size={16} />
            Edit Profile
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-[#6c5dd3] text-white rounded-xl text-sm font-medium hover:bg-[#5b4eb8] transition-all shadow-lg shadow-[#6c5dd3]/20"
          >
            <Save size={16} />
            Save Changes
          </button>
        )}
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 space-y-8">
        {/* Profile Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#6c5dd3] to-[#a5a6f6] opacity-10"></div>
          
          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-end pt-12">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=3387&auto=format&fit=crop" 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-gray-900 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="flex-1 space-y-2 mb-2">
              <h2 className="text-3xl font-bold text-gray-900">
                {formData.firstname} {formData.lastname}
              </h2>
              <p className="text-gray-500 font-medium">{formData.occupation}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} />
                  {formData.location}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Joined January 2026
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-8"
          >
            {/* Bio Section */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About Me</h3>
              {isEditing ? (
                 <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full min-h-[120px] p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6c5dd3] focus:ring-4 focus:ring-[#6c5dd3]/10 transition-all outline-none resize-none text-gray-600 leading-relaxed"
                 />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {formData.bio}
                </p>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">First Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6c5dd3] focus:ring-4 focus:ring-[#6c5dd3]/10 transition-all outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-xl text-gray-700 font-medium">
                      {formData.firstname}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Last Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full p-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6c5dd3] focus:ring-4 focus:ring-[#6c5dd3]/10 transition-all outline-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50/50 rounded-xl text-gray-700 font-medium">
                      {formData.lastname}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <div className="w-full p-3 pl-10 bg-gray-50/50 rounded-xl text-gray-700 font-medium overflow-hidden text-ellipsis">
                      {formData.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 pl-10 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#6c5dd3] focus:ring-4 focus:ring-[#6c5dd3]/10 transition-all outline-none"
                      />
                    ) : (
                      <div className="w-full p-3 pl-10 bg-gray-50/50 rounded-xl text-gray-700 font-medium">
                        {formData.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar Stats/Extra */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-[#6c5dd3] rounded-3xl p-8 text-white shadow-lg shadow-[#6c5dd3]/30 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10"></div>
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full blur-xl -ml-10 -mb-10"></div>
               
               <h3 className="text-lg font-bold mb-1 relative z-10">Pro Plan</h3>
               <p className="text-indigo-100 text-sm mb-6 relative z-10">Your subscription renews on Feb 1, 2026</p>
               
               <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 relative z-10">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-xs font-medium text-indigo-100">Usage</span>
                   <span className="text-xs font-bold">78%</span>
                 </div>
                 <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                   <div className="h-full bg-white rounded-full" style={{ width: '78%' }}></div>
                 </div>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Account Settings</h3>
              <div className="space-y-2">
                 <button className="w-full text-left p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#6c5dd3] transition-all flex items-center justify-between group">
                   Change Password
                   <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
                 <button className="w-full text-left p-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#6c5dd3] transition-all flex items-center justify-between group">
                   Privacy Settings
                   <ArrowLeft size={16} className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </button>
                 <button className="w-full text-left p-3 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-between group">
                   Delete Account
                 </button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
