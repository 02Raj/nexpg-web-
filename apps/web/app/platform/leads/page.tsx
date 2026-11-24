'use client';

import {
  fetchGrowthLeads,
  addGrowthLead,
  updateGrowthLead,
  regenerateLeadPitch,
  scrapeHubLeads,
  type GrowthLead,
} from '@/api/leads';
import { PageSkeleton } from '@/components/Loading';
import { toast } from '@/lib/toast';
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  MessageCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Users,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import styles from '../platform.module.css';

const LOCAL_STORAGE_KEY = 'runmypg_growth_leads_cache_v1';

export default function PlatformLeadsPage() {
  const [leads, setLeads] = useState<GrowthLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scraping, setScraping] = useState(false);
  const [selectedHub, setSelectedHub] = useState('kota');
  const [isCustomCity, setIsCustomCity] = useState(false);
  const [customCityInput, setCustomCityInput] = useState('');
  const [generatingPitchId, setGeneratingPitchId] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Add lead modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingLead, setAddingLead] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    owner_name: '',
    phone: '',
    city: 'Kota',
    area: '',
  });

  // Load from local storage cache initially
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as GrowthLead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads(parsed);
          setLoading(false);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage whenever leads change
  const saveLeadsState = (updatedList: GrowthLead[]) => {
    setLeads(updatedList);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // ignore
    }
  };

  const loadLeads = async () => {
    try {
      const data = await fetchGrowthLeads({
        city: cityFilter,
        status: statusFilter,
      });
      if (data.length > 0) {
        saveLeadsState(data);
      }
    } catch {
      // Keep cached leads if network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [cityFilter, statusFilter]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [cityFilter, statusFilter, pageSize]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchCity =
        cityFilter === 'all' || l.city.toLowerCase().includes(cityFilter.toLowerCase());
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      return matchCity && matchStatus;
    });
  }, [leads, cityFilter, statusFilter]);

  // Paginated Leads
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  // Metrics
  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      contacted: leads.filter((l) => l.status === 'contacted').length,
      interested: leads.filter((l) => l.status === 'interested').length,
      converted: leads.filter((l) => l.status === 'converted').length,
    };
  }, [leads]);

  // 1-Click WhatsApp Action (Psychological short pitch)
  const onWhatsAppClick = async (lead: GrowthLead) => {
    const cleanDigits = lead.phone.replace(/\D/g, '').slice(-10);
    if (!cleanDigits || cleanDigits.length !== 10) {
      toast.error('Invalid 10-digit phone number');
      return;
    }

    const cleanOwner = (lead.owner_name || '')
      .replace(/\s*(ji|garu|kaka|bhaiya|bhai|mr\.?|shri)\s*$/i, '')
      .replace(/^\s*(mr\.?|shri)\s*/i, '')
      .trim();
    const salutation = cleanOwner ? `Mr. ${cleanOwner}` : 'Sir';
    const fallbackPitch = `Hello ${salutation},\n\nHope you're well! Reaching out regarding ${lead.name} in ${lead.city}.\n\nQuick question: are you still calculating electricity sub-meters and rent manually in diaries? We built a free 1-click management tool at runmypg.in to send automated WhatsApp slips. Mind if I share a 1-min demo?`;
    
    const message = (lead.ai_pitch?.trim() || fallbackPitch);
    const waUrl = `https://wa.me/91${cleanDigits}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');

    // Automatically mark as contacted & persist
    if (lead.status === 'new') {
      try {
        const updated = await updateGrowthLead(lead.id, {
          status: 'contacted',
          last_contacted_at: new Date().toISOString(),
        });
        saveLeadsState(leads.map((l) => (l.id === lead.id ? updated : l)));
        toast.success(`Marked ${lead.name} as Contacted!`);
      } catch {
        // Fallback local update
        saveLeadsState(
          leads.map((l) =>
            l.id === lead.id ? { ...l, status: 'contacted', last_contacted_at: new Date().toISOString() } : l
          )
        );
      }
    }
  };

  // Copy Pitch to Clipboard
  const onCopyPitch = (pitch: string | null, name: string) => {
    if (!pitch) return toast.error('No pitch available to copy');
    void navigator.clipboard.writeText(pitch);
    toast.success(`Copied message for ${name}!`);
  };

  // Direct In-Place Edit Pitch & Auto-Save
  const onPitchChange = (leadId: string, newPitch: string) => {
    saveLeadsState(leads.map((l) => (l.id === leadId ? { ...l, ai_pitch: newPitch } : l)));
  };

  const onPitchBlur = async (leadId: string, finalPitch: string) => {
    try {
      await updateGrowthLead(leadId, { ai_pitch: finalPitch });
    } catch {
      // non-blocking
    }
  };

  // Regenerate pitch with RapidRouter
  const onRegeneratePitch = async (lead: GrowthLead) => {
    setGeneratingPitchId(lead.id);
    try {
      const newPitch = await regenerateLeadPitch(lead.id);
      saveLeadsState(
        leads.map((l) => (l.id === lead.id ? { ...l, ai_pitch: newPitch } : l))
      );
      toast.success('Generated fresh psychological pitch with RapidRouter!');
    } catch {
      toast.error('Could not generate pitch with RapidRouter');
    } finally {
      setGeneratingPitchId(null);
    }
  };

  // Status Change
  const onStatusChange = async (leadId: string, newStatus: GrowthLead['status']) => {
    try {
      const updated = await updateGrowthLead(leadId, { status: newStatus });
      saveLeadsState(leads.map((l) => (l.id === leadId ? updated : l)));
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch {
      saveLeadsState(leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)));
    }
  };

  // Dynamic list of unique cities currently present
  const availableCities = useMemo(() => {
    const list = Array.from(new Set(leads.map((l) => l.city.trim()))).filter(Boolean);
    return list.sort();
  }, [leads]);

  // Scrape PG Hub
  const onScrapeHub = async () => {
    const targetCity = isCustomCity ? customCityInput.trim() : selectedHub;
    if (!targetCity) {
      toast.error('Please enter a city name');
      return;
    }

    setScraping(true);
    try {
      const res = await scrapeHubLeads(targetCity, true);
      toast.success(res.message);
      if (res.leads && res.leads.length > 0) {
        saveLeadsState([...res.leads, ...leads]);
      } else {
        await loadLeads();
      }
      if (isCustomCity) {
        setCustomCityInput('');
      }
    } catch {
      toast.error('Scraping hub leads failed');
    } finally {
      setScraping(false);
    }
  };

  // Add Single Lead
  const onSubmitNewLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      toast.error('PG name and phone number required');
      return;
    }
    setAddingLead(true);
    try {
      const lead = await addGrowthLead(newLead, true);
      saveLeadsState([lead, ...leads]);
      setShowAddModal(false);
      setNewLead({ name: '', owner_name: '', phone: '', city: 'Kota', area: '' });
      toast.success('Lead added & AI pitch generated!');
    } catch {
      // Fallback local lead
      const localLead: GrowthLead = {
        id: `local_${Date.now()}`,
        name: newLead.name.trim(),
        owner_name: newLead.owner_name?.trim() || null,
        phone: newLead.phone.replace(/\D/g, '').slice(-10),
        city: newLead.city.trim(),
        area: newLead.area?.trim() || null,
        source: 'manual',
        status: 'new',
        ai_pitch: `Namaste ${newLead.owner_name || 'Bhaiya'} 🙏 Aapka ${newLead.name} (${newLead.city}) hai na?\n\nKamre ke bijli meter aur rent hisab diary mein karte hain ya WhatsApp slip pe? Humne PG owners ke liye free 1-click tool banaya hai runmypg.in pe. Demo bhejoon?`,
        notes: null,
        last_contacted_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      saveLeadsState([localLead, ...leads]);
      setShowAddModal(false);
      setNewLead({ name: '', owner_name: '', phone: '', city: 'Kota', area: '' });
      toast.success('Lead added locally & ready to message!');
    } finally {
      setAddingLead(false);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* ── Top Header & Stats ── */}
      <div>
        <h2 className={styles.section}>Growth & Outreach Engine</h2>
        <p className={styles.lead}>
          High-conversion PG owner outreach. Short psychological curiosity hooks powered by{' '}
          <strong>RapidRouter AI (Gemma-4)</strong>. 1-Click WhatsApp with zero ban risk.
        </p>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Total Leads</p>
          <p className={styles.statValue}>{stats.total}</p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>New (Uncontacted)</p>
          <p className={styles.statValue} style={{ color: '#2563eb' }}>
            {stats.new}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Contacted</p>
          <p className={styles.statValue} style={{ color: '#d97706' }}>
            {stats.contacted}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Interested / Hot</p>
          <p className={styles.statValue} style={{ color: '#16a34a' }}>
            {stats.interested}
          </p>
        </div>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Converted (Customers)</p>
          <p className={styles.statValue} style={{ color: '#059669' }}>
            {stats.converted}
          </p>
        </div>
      </div>

      {/* ── Controls & Actions Bar ── */}
      <div className={styles.leadControls}>
        <div className={styles.filterGroup}>
          <Filter size={15} style={{ color: 'var(--ink-muted)' }} />
          <select
            className={styles.filterSelect}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="all">All Cities</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="converted">Converted</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            className={styles.filterSelect}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            title="Rows per page"
          >
            <option value="6">6 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>

        <div className={styles.actionBtnGroup}>
          {/* Quick Hub Scraper with Custom City Option */}
          <select
            className={styles.filterSelect}
            value={isCustomCity ? 'custom' : selectedHub}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomCity(true);
              } else {
                setIsCustomCity(false);
                setSelectedHub(e.target.value);
              }
            }}
            disabled={scraping}
          >
            <option value="kota">Kota Hub</option>
            <option value="bangalore">Bangalore IT Hub</option>
            <option value="delhi">Delhi Student Hub</option>
            <option value="pune">Pune Hub</option>
            <option value="noida">Noida Hub</option>
            <option value="hyderabad">Hyderabad Hub</option>
            <option value="indore">Indore Hub</option>
            <option value="jaipur">Jaipur Hub</option>
            <option value="patna">Patna Hub</option>
            <option value="custom">✏️ Type Any City...</option>
          </select>

          {isCustomCity ? (
            <input
              type="text"
              className={styles.filterSelect}
              style={{ minWidth: 150 }}
              placeholder="e.g. Indore, Dehradun..."
              value={customCityInput}
              onChange={(e) => setCustomCityInput(e.target.value)}
              disabled={scraping}
              autoFocus
            />
          ) : null}

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onScrapeHub}
            disabled={scraping || (isCustomCity && !customCityInput.trim())}
          >
            <Sparkles size={14} />
            {scraping
              ? 'Scraping Leads…'
              : `Scrape ${isCustomCity ? (customCityInput.trim() || 'Custom') : selectedHub.toUpperCase()} Leads`}
          </button>

          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} /> Add Lead
          </button>
        </div>
      </div>

      {/* ── Leads Table ── */}
      {loading && leads.length === 0 ? (
        <PageSkeleton variant="default" />
      ) : filteredLeads.length === 0 ? (
        <div className={styles.empty}>
          <Users size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ margin: '0 0 12px', fontWeight: 600 }}>No leads found in this filter.</p>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--ink-muted)' }}>
            Click <strong>&quot;Scrape Hub Leads&quot;</strong> above to instantly populate real PG
            listings with AI-crafted outreach pitches.
          </p>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onScrapeHub}
            disabled={scraping}
          >
            <Sparkles size={14} />
            {scraping ? 'Scraping…' : `Scrape ${selectedHub.toUpperCase()} Leads Now`}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 220 }}>PG & Location</th>
                  <th style={{ width: 180 }}>Owner / Phone</th>
                  <th>Short Psychology Pitch (Click to Edit)</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ textAlign: 'right', width: 140 }}>1-Click Send</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLeads.map((lead) => {
                  const isGenerating = generatingPitchId === lead.id;
                  const cleanOwner = (lead.owner_name || '')
                    .replace(/\s*(ji|garu|kaka|bhaiya|bhai|mr\.?|shri)\s*$/i, '')
                    .replace(/^\s*(mr\.?|shri)\s*/i, '')
                    .trim();
                  const salutation = cleanOwner ? `Mr. ${cleanOwner}` : 'Property Owner';

                  return (
                    <tr key={lead.id}>
                      <td>
                        <strong style={{ fontSize: 14, display: 'block', color: 'var(--ink)' }}>
                          {lead.name}
                        </strong>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-muted)' }}>
                          {lead.area ? `${lead.area}, ` : ''}
                          <strong>{lead.city}</strong>
                        </p>
                      </td>

                      <td>
                        <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 13 }}>
                          {salutation}
                        </p>
                        <a
                          href={`tel:${lead.phone}`}
                          style={{
                            fontSize: 12,
                            color: 'var(--brand)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            textDecoration: 'none',
                          }}
                        >
                          <Phone size={11} /> +91 {lead.phone.slice(-10)}
                        </a>
                      </td>

                      <td>
                        <div className={styles.pitchPreview}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: 4,
                            }}
                          >
                            <span className={styles.aiBadge}>
                              <Bot size={11} /> Gemma-4 AI Hook
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <button
                                type="button"
                                className={styles.btnMiniIcon}
                                title="Copy message"
                                onClick={() => onCopyPitch(lead.ai_pitch, lead.name)}
                              >
                                <Copy size={12} />
                              </button>
                              <button
                                type="button"
                                className={styles.btnMiniIcon}
                                title="Regenerate pitch with RapidRouter AI"
                                onClick={() => onRegeneratePitch(lead)}
                                disabled={isGenerating}
                              >
                                <RefreshCw
                                  size={12}
                                  className={isGenerating ? styles.spin : undefined}
                                />
                              </button>
                            </div>
                          </div>

                          {isGenerating ? (
                            <p style={{ margin: '6px 0', fontStyle: 'italic', fontSize: 11, color: '#6366f1' }}>
                              Crafting high-converting hook with RapidRouter…
                            </p>
                          ) : (
                            <textarea
                              className={styles.editablePitch}
                              value={lead.ai_pitch || ''}
                              onChange={(e) => onPitchChange(lead.id, e.target.value)}
                              onBlur={(e) => onPitchBlur(lead.id, e.target.value)}
                              placeholder="Write or edit WhatsApp message..."
                              title="Click to edit before sending"
                            />
                          )}
                        </div>
                      </td>

                      <td>
                        <select
                          className={styles.statusSelect}
                          data-status={lead.status}
                          value={lead.status}
                          onChange={(e) =>
                            onStatusChange(lead.id, e.target.value as GrowthLead['status'])
                          }
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="interested">Interested</option>
                          <option value="converted">Converted 🎉</option>
                          <option value="rejected">Rejected</option>
                        </select>
                        {lead.status === 'converted' ? (
                          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#059669', fontWeight: 600 }}>
                            ✅ Signed Up!
                          </p>
                        ) : null}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            justifyContent: 'flex-end',
                          }}
                        >
                          <button
                            type="button"
                            className={styles.whatsappBtn}
                            onClick={() => onWhatsAppClick(lead)}
                            title="Open WhatsApp chat with pre-written message"
                          >
                            <MessageCircle size={14} fill="#fff" /> WhatsApp
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Pagination Bar ── */}
          <div className={styles.paginationBar}>
            <div>
              Showing{' '}
              <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
              <strong>{Math.min(currentPage * pageSize, filteredLeads.length)}</strong> of{' '}
              <strong>{filteredLeads.length}</strong> leads
            </div>

            <div className={styles.paginationControls}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  type="button"
                  className={[
                    styles.pageBtn,
                    currentPage === num ? styles.pageBtnActive : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}

              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Add Lead Modal ── */}
      {showAddModal ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              maxWidth: 440,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px', fontSize: 18 }}>Add PG Lead</h3>
            <form onSubmit={onSubmitNewLead}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    PG / Hostel Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shree Balaji Residency"
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--line)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Owner Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Ji"
                    value={newLead.owner_name}
                    onChange={(e) => setNewLead({ ...newLead, owner_name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--line)',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Mobile Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9829012345"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid var(--line)',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kota"
                      value={newLead.city}
                      onChange={(e) => setNewLead({ ...newLead, city: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--line)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Landmark City"
                      value={newLead.area}
                      onChange={(e) => setNewLead({ ...newLead, area: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid var(--line)',
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  marginTop: 20,
                }}
              >
                <button
                  type="button"
                  className={styles.btnSecondary}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.btnPrimary} disabled={addingLead}>
                  {addingLead ? 'Saving & Generating AI Pitch…' : 'Save & Generate Pitch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
