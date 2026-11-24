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

export default function PlatformLeadsPage() {
  const [leads, setLeads] = useState<GrowthLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scraping, setScraping] = useState(false);
  const [selectedCity, setSelectedCity] = useState('kota');
  const [generatingPitchId, setGeneratingPitchId] = useState<string | null>(null);

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

  const loadLeads = async () => {
    try {
      const data = await fetchGrowthLeads({
        city: cityFilter,
        status: statusFilter,
      });
      setLeads(data);
    } catch {
      toast.error('Failed to load outreach leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadLeads();
  }, [cityFilter, statusFilter]);

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

  // 1-Click WhatsApp Action
  const onWhatsAppClick = async (lead: GrowthLead) => {
    const cleanDigits = lead.phone.replace(/\D/g, '').slice(-10);
    if (!cleanDigits || cleanDigits.length !== 10) {
      toast.error('Invalid 10-digit phone number');
      return;
    }

    const fallbackPitch = `Namaste! Maine aapka ${lead.name} (${lead.area ? `${lead.area}, ` : ''}${lead.city}) dekha. Kya PG ka rent hisab, tenant slips aur bijli sub-meter calculation automate karna chahte hain? RunMyPG app se ye 1-click mein ho jata hai. Free trial: https://www.runmypg.in`;
    const message = lead.ai_pitch?.trim() || fallbackPitch;
    const waUrl = `https://wa.me/91${cleanDigits}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank');

    // Automatically mark as contacted if it was new
    if (lead.status === 'new') {
      try {
        const updated = await updateGrowthLead(lead.id, {
          status: 'contacted',
          last_contacted_at: new Date().toISOString(),
        });
        setLeads((prev) => prev.map((l) => (l.id === lead.id ? updated : l)));
        toast.success(`Marked ${lead.name} as Contacted!`);
      } catch {
        // non-blocking
      }
    }
  };

  // Regenerate pitch with RapidRouter
  const onRegeneratePitch = async (lead: GrowthLead) => {
    setGeneratingPitchId(lead.id);
    try {
      const newPitch = await regenerateLeadPitch(lead.id);
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, ai_pitch: newPitch } : l))
      );
      toast.success('Generated fresh AI pitch with RapidRouter!');
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
      setLeads((prev) => prev.map((l) => (l.id === leadId ? updated : l)));
      toast.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch {
      toast.error('Could not update status');
    }
  };

  // Scrape PG Hub
  const onScrapeHub = async () => {
    setScraping(true);
    try {
      const res = await scrapeHubLeads(selectedCity, true);
      toast.success(res.message);
      await loadLeads();
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
      setLeads((prev) => [lead, ...prev]);
      setShowAddModal(false);
      setNewLead({ name: '', owner_name: '', phone: '', city: 'Kota', area: '' });
      toast.success('Lead added & AI pitch generated!');
    } catch {
      toast.error('Failed to add lead');
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
          Automate PG owner acquisition. AI-tailored WhatsApp pitches powered by{' '}
          <strong>RapidRouter AI (google/gemma-4-31b-it)</strong>. Click to chat with zero ban risk.
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
            <option value="Kota">Kota</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Delhi">Delhi</option>
            <option value="Pune">Pune</option>
            <option value="Noida">Noida</option>
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
        </div>

        <div className={styles.actionBtnGroup}>
          {/* Quick Hub Scraper */}
          <select
            className={styles.filterSelect}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            disabled={scraping}
          >
            <option value="kota">Kota Hub</option>
            <option value="bangalore">Bangalore IT Hub</option>
            <option value="delhi">Delhi Student Hub</option>
            <option value="pune">Pune Hub</option>
            <option value="noida">Noida Hub</option>
          </select>

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={onScrapeHub}
            disabled={scraping}
          >
            <Sparkles size={14} />
            {scraping ? 'Scraping Hub…' : 'Scrape Hub Leads'}
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
      {loading ? (
        <PageSkeleton variant="default" />
      ) : leads.length === 0 ? (
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
            {scraping ? 'Scraping…' : `Scrape ${selectedCity.toUpperCase()} Leads Now`}
          </button>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>PG & Location</th>
                <th>Owner / Phone</th>
                <th style={{ width: 380 }}>AI WhatsApp Pitch (RapidRouter)</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const isGenerating = generatingPitchId === lead.id;
                return (
                  <tr key={lead.id}>
                    <td>
                      <strong style={{ fontSize: 14 }}>{lead.name}</strong>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--ink-muted)' }}>
                        {lead.area ? `${lead.area}, ` : ''}
                        <strong>{lead.city}</strong>
                      </p>
                    </td>

                    <td>
                      <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: 13 }}>
                        {lead.owner_name || 'Owner / Manager'}
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
                          }}
                        >
                          <span className={styles.aiBadge}>
                            <Bot size={11} /> Gemma-4 AI
                          </span>
                          <button
                            type="button"
                            title="Regenerate pitch with RapidRouter AI"
                            onClick={() => onRegeneratePitch(lead)}
                            disabled={isGenerating}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              cursor: 'pointer',
                              color: 'var(--ink-muted)',
                              padding: 2,
                            }}
                          >
                            <RefreshCw
                              size={12}
                              className={isGenerating ? styles.spin : undefined}
                            />
                          </button>
                        </div>
                        {isGenerating ? (
                          <p style={{ margin: '4px 0 0', fontStyle: 'italic', fontSize: 11 }}>
                            Generating pitch with RapidRouter…
                          </p>
                        ) : (
                          <p style={{ margin: '4px 0 0' }}>{lead.ai_pitch || 'No pitch generated.'}</p>
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
                        <option value="converted">Converted</option>
                        <option value="rejected">Rejected</option>
                      </select>
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
