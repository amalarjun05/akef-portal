import React, { useState, useRef } from 'react';
import { 
  Mail, 
  Layout, 
  Image as ImageIcon, 
  Palette, 
  Copy, 
  Check,
  Smartphone,
  Monitor,
  ExternalLink,
  Code
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'welcome',
    name: 'Welcome Series',
    description: 'Clean greeting for new AKEF members.',
    previewColor: '#4F46E5',
    structure: {
      logo: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=100&h=100&fit=crop',
      title: 'Welcome to AKEF Portal!',
      body: 'We are thrilled to have you as part of our community. This portal is your one-stop shop for all AKEF resources, including the Invoice Generator and now our new Email Crafter.',
      buttonText: 'Explore Portal',
      buttonLink: 'https://akef-portal.vercel.app',
      footer: 'AKEF Headquarters • Kerala, India • Unsubscribe',
      accentColor: '#4F46E5',
      backgroundColor: '#F3F4F6'
    }
  },
  {
    id: 'newsletter',
    name: 'Portal Update',
    description: 'Update members on new portal features.',
    previewColor: '#10B981',
    structure: {
      logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop',
      title: 'What\'s New in the Portal',
      body: 'We have just added the Email Template Generator to the AKEF Portal. You can now create professional emails, upload brand assets, and export clean HTML in seconds.',
      buttonText: 'Try It Now',
      buttonLink: '#',
      footer: 'Sent via AKEF Internal Systems',
      accentColor: '#10B981',
      backgroundColor: '#ECFDF5'
    }
  },
  {
    id: 'event',
    name: 'Event Announcement',
    description: 'Bold design for upcoming AKEF events.',
    previewColor: '#F59E0B',
    structure: {
      logo: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=100&h=100&fit=crop',
      title: 'Upcoming AKEF Meetup',
      body: 'Join us for our next community gathering! We will be discussing the future of our digital tools and gathering feedback on the portal performance.',
      buttonText: 'Register Today',
      buttonLink: '#',
      footer: 'Copyright © 2024 AKEF. All rights reserved.',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFBEB'
    }
  }
];

export default function EmailGenerator() {
  const [activeTemplateId, setActiveTemplateId] = useState(TEMPLATES[0].id);
  const [data, setData] = useState(TEMPLATES[0].structure);
  const [viewMode, setViewMode] = useState('desktop');
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleTemplateChange = (template) => {
    setActiveTemplateId(template.id);
    setData(template.structure);
  };

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateData('logo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateHTML = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <style>
    body { font-family: sans-serif; background-color: ${data.backgroundColor}; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; }
    .header { padding: 40px; text-align: center; }
    .logo { max-width: 80px; border-radius: 12px; }
    .content { padding: 0 40px 40px; text-align: left; color: #374151; }
    h1 { color: #111827; font-size: 24px; margin-top: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: ${data.accentColor}; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .footer { padding: 24px; background: #F9FAFB; text-align: center; font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="${data.logo}" alt="Logo" class="logo">
      <h1>${data.title}</h1>
    </div>
    <div class="content">
      <p style="line-height: 1.6;">${data.body}</p>
      <div style="text-align: center; margin-top: 30px;">
        <a href="${data.buttonLink}" class="button">${data.buttonText}</a>
      </div>
    </div>
    <div class="footer">${data.footer}</div>
  </div>
</body>
</html>`;
  };

  const copyToClipboard = () => {
    const html = generateHTML();
    const textArea = document.createElement("textarea");
    textArea.value = html;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar: Presets */}
      <aside className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-sm">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-bold text-lg">AKEF Email</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Portal Tool v1.0</p>
        </div>
        
        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateChange(t)}
                className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                  activeTemplateId === t.id 
                    ? 'border-indigo-600 bg-indigo-50/50' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{t.name}</span>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.previewColor }} />
                </div>
                <p className="text-xs text-slate-500 leading-tight">{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t border-slate-100">
           <button 
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm"
          >
            {copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Code className="w-4 h-4" />}
            {copySuccess ? 'HTML Copied' : 'Copy HTML Code'}
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-100/30">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex bg-slate-100 p-1 rounded-lg scale-90 origin-left">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`px-3 py-1 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`px-3 py-1 rounded flex items-center gap-2 text-xs font-bold transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[10px] font-bold uppercase">Auto-Preview Active</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-12 flex justify-center">
          <div 
            className={`transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden h-fit ${
              viewMode === 'mobile' ? 'w-[375px]' : 'w-full max-w-[600px]'
            }`}
            style={{ backgroundColor: data.backgroundColor }}
          >
            <div className="bg-white min-h-[400px]">
              <div className="p-12 flex flex-col items-center">
                <img src={data.logo} alt="Logo" className="w-16 h-16 object-cover rounded-xl mb-6 border border-slate-100 shadow-sm" />
                <h1 className="text-2xl font-black text-slate-900 text-center mb-4 leading-tight tracking-tight">
                  {data.title}
                </h1>
                <div className="w-8 h-1 rounded-full mb-8 opacity-50" style={{ backgroundColor: data.accentColor }} />
                <p className="text-slate-600 leading-relaxed text-center mb-10 text-sm">
                  {data.body}
                </p>
                <a 
                  href={data.buttonLink}
                  className="px-8 py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                  style={{ backgroundColor: data.accentColor, boxShadow: `0 10px 15px -3px ${data.accentColor}44` }}
                >
                  {data.buttonText}
                </a>
              </div>
              <div className="p-8 bg-slate-50/50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                  {data.footer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Controls */}
      <aside className="w-full lg:w-80 bg-white border-l border-slate-200 overflow-y-auto shrink-0">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400">
            <Layout className="w-4 h-4" />
            Designer
          </h2>
        </div>

        <div className="p-6 space-y-8">
          {/* Logo */}
          <section>
            <label className="text-[10px] font-bold text-slate-400 uppercase mb-3 block">Logo Asset</label>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all shrink-0"
              >
                <ImageIcon className="w-5 h-5 text-slate-300" />
              </button>
              <input 
                type="text"
                placeholder="https://image-url..."
                className="flex-1 text-xs p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white outline-none"
                value={data.logo}
                onChange={(e) => updateData('logo', e.target.value)}
              />
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </section>

          {/* Text Content */}
          <section className="space-y-4">
             <label className="text-[10px] font-bold text-slate-400 uppercase block">Message Content</label>
            <input 
              type="text"
              placeholder="Headline"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm font-bold"
              value={data.title}
              onChange={(e) => updateData('title', e.target.value)}
            />
            <textarea 
              rows={4}
              placeholder="Main Message Body"
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-xs leading-relaxed"
              value={data.body}
              onChange={(e) => updateData('body', e.target.value)}
            />
          </section>

          {/* Button */}
          <section className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase block">Call to Action</label>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Button Label"
                className="w-1/2 p-3 border border-slate-200 rounded-xl text-xs font-bold"
                value={data.buttonText}
                onChange={(e) => updateData('buttonText', e.target.value)}
              />
              <input 
                type="text"
                placeholder="URL"
                className="w-1/2 p-3 border border-slate-200 rounded-xl text-xs"
                value={data.buttonLink}
                onChange={(e) => updateData('buttonLink', e.target.value)}
              />
            </div>
          </section>

          {/* Theme */}
          <section className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Accent Color</span>
              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.accentColor}</span>
                <input 
                  type="color"
                  className="w-5 h-5 rounded cursor-pointer border-none p-0 bg-transparent"
                  value={data.accentColor}
                  onChange={(e) => updateData('accentColor', e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Backdrop</span>
              <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{data.backgroundColor}</span>
                <input 
                  type="color"
                  className="w-5 h-5 rounded cursor-pointer border-none p-0 bg-transparent"
                  value={data.backgroundColor}
                  onChange={(e) => updateData('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Footer Text */}
          <section>
            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-2">Legal Footer</label>
            <input 
              type="text"
              className="w-full p-3 border border-slate-200 rounded-xl text-[10px] text-slate-500 italic"
              value={data.footer}
              onChange={(e) => updateData('footer', e.target.value)}
            />
          </section>
        </div>
      </aside>
    </div>
  );
}