// src/pages/Settings.jsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import {
  FaUser, FaLock, FaBell, FaGlobe, FaShieldAlt,
  FaKey, FaSave, FaEye, FaEyeSlash,
  FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt,
  FaCamera, FaCog, FaSignOutAlt, FaHistory,
  FaUserShield, FaSitemap, FaCode, FaInfoCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

// ─── Reusable Components ──────────────────────────────────────────────────────
const inputCls = 'w-full px-4 py-2.5 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all text-sm';

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

const SettingRow = ({ icon, iconBg, label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-pink-50 last:border-0 gap-4 flex-wrap">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>}
      </div>
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Toggle = ({ enabled, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    aria-label={label}
    className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${
      enabled ? 'bg-pink-500' : 'bg-gray-300'
    }`}
  >
    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
      enabled ? 'left-6' : 'left-0.5'
    }`} />
  </button>
);

const SectionCard = ({ title, subtitle, icon, children }) => (
  <div className="bg-white border-2 border-pink-100 rounded-2xl overflow-hidden">
    <div className="px-6 py-4 border-b-2 border-pink-50 bg-gradient-to-r from-pink-50 to-white flex items-center gap-3">
      <div className="w-9 h-9 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="font-bold text-gray-800 text-base">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'profile',       label: 'Profile',       icon: <FaUser />  },
  { id: 'security',      label: 'Security',      icon: <FaLock />  },
  { id: 'notifications', label: 'Notifications', icon: <FaBell />  },
  { id: 'platform',      label: 'Platform',      icon: <FaGlobe /> },
];

// ═══════════════════════════════════════════════════════════════════════════════
const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  // ── Profile ───────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    firstName: 'Arun',
    lastName:  'Kumar',
    email:     'arun@nexotechnologies.in',
    phone:     '+91 98400 12345',
    company:   'Nexo Technologies & Services',
    role:      'Super Admin',
    location:  'Chennai, Tamil Nadu',
    bio:       'Super Admin managing all site operations, products, and user access.',
  });

  // ── Security ──────────────────────────────────────────────────────────────
  const [passwords, setPasswords]           = useState({ current: '', newPass: '', confirm: '' });
  const [showPwd,   setShowPwd]             = useState({ current: false, newPass: false, confirm: false });
  const [twoFA,          setTwoFA]          = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [loginAlerts,    setLoginAlerts]    = useState(true);

  const SESSIONS = [
    { device: 'Chrome — Windows 11',  location: 'Chennai, IN', time: 'Now (Current)', current: true  },
    { device: 'Safari — iPhone 15',   location: 'Chennai, IN', time: '2 hours ago',   current: false },
    { device: 'Chrome — MacBook Pro', location: 'Mumbai, IN',  time: '1 day ago',     current: false },
  ];

  // ── Notifications ─────────────────────────────────────────────────────────
  const [notifs, setNotifs] = useState({
    emailNewOrder: true,  emailLowStock: true,  emailNewUser: false, emailWeeklyReport: true,
    pushNewOrder:  true,  pushLowStock:  true,  pushSystemAlerts: true, pushNewSite: false,
    smsOrderUpdates: false, smsCriticalAlerts: true,
  });

  // ── Platform ──────────────────────────────────────────────────────────────
  const [platform, setPlatform] = useState({
    siteName:     'IniServe Admin',
    siteUrl:      'https://inibuy.iniserve.com',
    supportEmail: 'support@iniserve.com',
    timezone:     'Asia/Kolkata',
    currency:     'INR',
    language:     'en',
    maintenanceMode:     false,
    autoApproveProducts: false,
    autoApproveSites:    false,
    maxProductsPerSite:  '500',
    lowStockThreshold:   '10',
  });

  // ── Password Handler ──────────────────────────────────────────────────────
  const handleChangePassword = () => {
    if (!passwords.current)                       return toast.error('Enter current password');
    if (passwords.newPass.length < 8)             return toast.error('Password must be at least 8 characters');
    if (passwords.newPass !== passwords.confirm)  return toast.error('Passwords do not match');
    toast.success('Password changed successfully!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };

  // ── Render Tab Content ────────────────────────────────────────────────────
  const renderContent = () => {
    switch (activeTab) {

      // ══════════════════════════════════════════
      // PROFILE
      // ══════════════════════════════════════════
      case 'profile':
        return (
          <div className="space-y-6">
            <SectionCard title="Profile Photo" icon={<FaCamera />}>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl font-bold">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </span>
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors shadow-md">
                    <FaCamera className="text-xs" />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{profile.role}</p>
                  <p className="text-xs text-gray-400 mt-1">{profile.email}</p>
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1.5 text-xs font-semibold bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                      Upload Photo
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Personal Information" subtitle="Update your name, contact, and bio" icon={<FaUser />}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="First Name">
                    <input type="text" value={profile.firstName}
                      onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                      className={inputCls} />
                  </Field>
                  <Field label="Last Name">
                    <input type="text" value={profile.lastName}
                      onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                      className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Email Address" hint="Used for login and notifications">
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="email" value={profile.email}
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Phone Number">
                    <div className="relative">
                      <FaPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="tel" value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Company">
                    <div className="relative">
                      <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="text" value={profile.company}
                        onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Location">
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="text" value={profile.location}
                        onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                </div>
                <Field label="Role">
                  <input type="text" value={profile.role} disabled
                    className={`${inputCls} bg-gray-50 text-gray-400 cursor-not-allowed`} />
                </Field>
                <Field label="Bio">
                  <textarea value={profile.bio} rows="3"
                    onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                    className={`${inputCls} resize-none`} />
                </Field>
                <div className="flex justify-end">
                  <button onClick={() => toast.success('Profile updated!')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md text-sm">
                    <FaSave /> Save Profile
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        );

      // ══════════════════════════════════════════
      // SECURITY
      // ══════════════════════════════════════════
      case 'security':
        return (
          <div className="space-y-6">
            <SectionCard title="Change Password" subtitle="Use a strong password with 8+ characters" icon={<FaLock />}>
              <div className="space-y-4">
                {[
                  { key: 'current', label: 'Current Password'     },
                  { key: 'newPass', label: 'New Password'         },
                  { key: 'confirm', label: 'Confirm New Password' },
                ].map(({ key, label }) => (
                  <Field key={key} label={label}>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input
                        type={showPwd[key] ? 'text' : 'password'}
                        value={passwords[key]}
                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        placeholder="••••••••••"
                        className={`${inputCls} pl-10 pr-11`}
                      />
                      <button type="button"
                        onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors">
                        {showPwd[key] ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </Field>
                ))}
                {passwords.newPass.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-gray-600">Password Strength</p>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[8, 12, 16, 20].map((len, i) => (
                        <div key={i} className={`h-1.5 rounded-full transition-all ${
                          passwords.newPass.length >= len
                            ? ['bg-red-400','bg-yellow-400','bg-blue-400','bg-green-500'][i]
                            : 'bg-gray-200'
                        }`} />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {passwords.newPass.length < 8 ? 'Too short' : passwords.newPass.length < 12 ? 'Weak' : passwords.newPass.length < 16 ? 'Medium' : 'Strong'}
                    </p>
                  </div>
                )}
                <div className="flex justify-end pt-1">
                  <button onClick={handleChangePassword}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md text-sm">
                    <FaKey /> Update Password
                  </button>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Security Settings" subtitle="Control access and authentication" icon={<FaShieldAlt />}>
              <div className="divide-y divide-pink-50">
                <SettingRow icon={<FaShieldAlt className="text-green-600 text-sm" />} iconBg="bg-green-100"
                  label="Two-Factor Authentication" description="Require a code on every login">
                  <Toggle enabled={twoFA} onChange={setTwoFA} label="2FA" />
                </SettingRow>
                <SettingRow icon={<FaBell className="text-blue-600 text-sm" />} iconBg="bg-blue-100"
                  label="Login Alerts" description="Email me when a new device logs in">
                  <Toggle enabled={loginAlerts} onChange={setLoginAlerts} label="Login Alerts" />
                </SettingRow>
                <SettingRow icon={<FaHistory className="text-purple-600 text-sm" />} iconBg="bg-purple-100"
                  label="Session Timeout" description="Auto-logout after inactivity">
                  <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                    className="px-3 py-2 border-2 border-pink-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 bg-white">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="480">8 hours</option>
                    <option value="0">Never</option>
                  </select>
                </SettingRow>
              </div>
            </SectionCard>

            <SectionCard title="Active Sessions" subtitle="Devices currently logged in" icon={<FaHistory />}>
              <div className="space-y-3">
                {SESSIONS.map((s, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-2 flex-wrap gap-3 ${
                    s.current ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${s.current ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {s.device}
                          {s.current && (
                            <span className="ml-2 text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full font-bold">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.location} · {s.time}</p>
                      </div>
                    </div>
                    {!s.current && (
                      <button onClick={() => toast.success('Session revoked!')}
                        className="px-3 py-1.5 text-xs font-semibold text-red-500 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={() => toast.success('All other sessions revoked!')}
                  className="w-full py-2.5 border-2 border-red-200 text-red-500 font-semibold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 mt-1">
                  <FaSignOutAlt /> Revoke All Other Sessions
                </button>
              </div>
            </SectionCard>
          </div>
        );

      // ══════════════════════════════════════════
      // NOTIFICATIONS
      // ══════════════════════════════════════════
      case 'notifications':
        return (
          <div className="space-y-6">
            {[
              {
                title: 'Email Notifications', subtitle: 'Receive alerts via email', icon: <FaEnvelope />,
                items: [
                  { key: 'emailNewOrder',     label: 'New Order Placed',      desc: 'Alert when a customer places an order'       },
                  { key: 'emailLowStock',     label: 'Low Stock Warning',     desc: 'When product quantity drops below threshold' },
                  { key: 'emailNewUser',      label: 'New User Registration', desc: 'When a new user registers on any site'       },
                  { key: 'emailWeeklyReport', label: 'Weekly Report',         desc: 'Summary of orders, revenue, and activity'    },
                ],
              },
              {
                title: 'Push Notifications', subtitle: 'In-app and browser alerts', icon: <FaBell />,
                items: [
                  { key: 'pushNewOrder',     label: 'New Order',        desc: 'Real-time alert for each new order'      },
                  { key: 'pushLowStock',     label: 'Low Stock Alert',  desc: 'Immediate push for critically low stock' },
                  { key: 'pushSystemAlerts', label: 'System Alerts',    desc: 'Maintenance, errors, and system events'  },
                  { key: 'pushNewSite',      label: 'New Site Created', desc: 'When a new admin creates a site'         },
                ],
              },
              {
                title: 'SMS Notifications', subtitle: 'Text alerts to your phone', icon: <FaPhone />,
                items: [
                  { key: 'smsOrderUpdates',   label: 'Order Updates',          desc: 'SMS for critical order status changes' },
                  { key: 'smsCriticalAlerts', label: 'Critical System Alerts', desc: 'Only for downtime or security issues'  },
                ],
              },
            ].map(section => (
              <SectionCard key={section.title} title={section.title} subtitle={section.subtitle} icon={section.icon}>
                <div className="divide-y divide-pink-50">
                  {section.items.map(item => (
                    <SettingRow key={item.key}
                      icon={<FaBell className="text-pink-500 text-sm" />} iconBg="bg-pink-100"
                      label={item.label} description={item.desc}>
                      <Toggle
                        enabled={notifs[item.key]}
                        onChange={() => setNotifs(p => ({ ...p, [item.key]: !p[item.key] }))}
                        label={item.label}
                      />
                    </SettingRow>
                  ))}
                </div>
              </SectionCard>
            ))}
          </div>
        );

      // ══════════════════════════════════════════
      // PLATFORM
      // ══════════════════════════════════════════
      case 'platform':
        return (
          <div className="space-y-6">
            <SectionCard title="General Configuration" subtitle="Core platform settings" icon={<FaGlobe />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Platform Name">
                    <div className="relative">
                      <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="text" value={platform.siteName}
                        onChange={e => setPlatform(p => ({ ...p, siteName: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Platform URL">
                    <div className="relative">
                      <FaGlobe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="url" value={platform.siteUrl}
                        onChange={e => setPlatform(p => ({ ...p, siteUrl: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Support Email">
                    <div className="relative">
                      <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pink-400 pointer-events-none" />
                      <input type="email" value={platform.supportEmail}
                        onChange={e => setPlatform(p => ({ ...p, supportEmail: e.target.value }))}
                        className={`${inputCls} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Timezone">
                    <select value={platform.timezone}
                      onChange={e => setPlatform(p => ({ ...p, timezone: e.target.value }))}
                      className={inputCls}>
                      <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Currency">
                    <select value={platform.currency}
                      onChange={e => setPlatform(p => ({ ...p, currency: e.target.value }))}
                      className={inputCls}>
                      <option value="INR">₹ INR — Indian Rupee</option>
                      <option value="USD">$ USD — US Dollar</option>
                      <option value="EUR">€ EUR — Euro</option>
                      <option value="GBP">£ GBP — British Pound</option>
                    </select>
                  </Field>
                  <Field label="Language">
                    <select value={platform.language}
                      onChange={e => setPlatform(p => ({ ...p, language: e.target.value }))}
                      className={inputCls}>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </Field>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Product & Site Rules" subtitle="Control how products and sites behave" icon={<FaSitemap />}>
              <div className="space-y-4">
                <div className="divide-y divide-pink-50">
                  {[
                    { key: 'autoApproveProducts', label: 'Auto-Approve Products', desc: 'New products go live without review', iconCls: 'text-green-600',  bg: 'bg-green-100'  },
                    { key: 'autoApproveSites',    label: 'Auto-Approve Sites',    desc: 'New sites approved automatically',   iconCls: 'text-blue-600',   bg: 'bg-blue-100'   },
                    { key: 'maintenanceMode',     label: 'Maintenance Mode',      desc: 'Platform goes into read-only mode',  iconCls: 'text-orange-600', bg: 'bg-orange-100' },
                  ].map(item => (
                    <SettingRow key={item.key}
                      icon={<FaCog className={`${item.iconCls} text-sm`} />} iconBg={item.bg}
                      label={item.label} description={item.desc}>
                      <Toggle
                        enabled={platform[item.key]}
                        onChange={v => setPlatform(p => ({ ...p, [item.key]: v }))}
                        label={item.label}
                      />
                    </SettingRow>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <Field label="Max Products per Site" hint="0 = unlimited">
                    <input type="number" min="0" value={platform.maxProductsPerSite}
                      onChange={e => setPlatform(p => ({ ...p, maxProductsPerSite: e.target.value }))}
                      className={inputCls} />
                  </Field>
                  <Field label="Low Stock Threshold" hint="Alert when qty falls below this">
                    <input type="number" min="1" value={platform.lowStockThreshold}
                      onChange={e => setPlatform(p => ({ ...p, lowStockThreshold: e.target.value }))}
                      className={inputCls} />
                  </Field>
                </div>
              </div>
            </SectionCard>

            <div className="flex justify-end">
              <button onClick={() => toast.success('Platform settings saved!')}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-md text-sm">
                <FaSave /> Save Platform Settings
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Layout>
      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your account, platform, and preferences</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-pink-50 border-2 border-pink-200 rounded-xl">
            <FaUserShield className="text-pink-500" />
            <span className="text-sm font-bold text-pink-700">Super Admin</span>
            <span className="w-2 h-2 bg-green-400 rounded-full" />
          </div>
        </div>

        {/* Layout */}
        <div className="flex gap-6 flex-col lg:flex-row">

          {/* Sidebar Tabs */}
          <div className="lg:w-56 flex-shrink-0">
            <nav className="bg-white border-2 border-pink-100 rounded-2xl overflow-hidden">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all text-left border-b border-pink-50 last:border-0 ${
                    activeTab === tab.id
                      ? 'bg-pink-50 text-pink-700 border-r-4 border-r-pink-500'
                      : 'text-gray-600 hover:bg-pink-50/50 hover:text-pink-600'
                  }`}
                >
                  <span className={`text-base ${activeTab === tab.id ? 'text-pink-500' : 'text-gray-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Settings;
