import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import { 
  Building2, 
  MapPin, 
  User, 
  Cpu, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  ShieldAlert, 
  Info,
  X 
} from 'lucide-react';

const SiteManagement = () => {
  const { user, sites, addSite, updateSite, deleteSite, meters } = useIoT();

  // Dialog / Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [activeSite, setActiveSite] = useState(null);

  // Form States
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [status, setStatus] = useState('Active');
  
  // Permission helper: Operator & Viewer are read-only
  const isReadOnly = user?.role === 'Operator' || user?.role === 'Viewer' || user?.role === 'Viewer / Client';

  const getSiteMeters = (siteId) => {
    return meters.filter(m => m.siteId === siteId);
  };

  const handleOpenAdd = () => {
    if (isReadOnly) return;
    setModalMode('add');
    setName('');
    setLocation('');
    setContactPerson('');
    setStatus('Active');
    setActiveSite(null);
    setShowModal(true);
  };

  const handleOpenEdit = (site) => {
    if (isReadOnly) return;
    setModalMode('edit');
    setActiveSite(site);
    setName(site.name);
    setLocation(site.location);
    setContactPerson(site.contactPerson);
    setStatus(site.status);
    setShowModal(true);
  };

  const handleOpenView = (site) => {
    setModalMode('view');
    setActiveSite(site);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (isReadOnly) return;
    if (window.confirm('Are you sure you want to delete this industrial site? All associated energy meters will be set to Offline.')) {
      deleteSite(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) return;

    const payload = { name, location, contactPerson, status };

    if (modalMode === 'add') {
      addSite(payload);
    } else if (modalMode === 'edit' && activeSite) {
      updateSite(activeSite.id, payload);
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main font-serif">
            Industrial Sites Inventory
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Configure regional plants, manufacturing zones, and assigned managers.
          </p>
        </div>
        
        {!isReadOnly && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-stitch shadow hover:bg-primary/95 transition-all"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Add Industrial Site
          </button>
        )}
      </div>

      {/* Warning for Operator/Viewer Roles */}
      {isReadOnly && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-stitch text-[11px] sm:text-xs text-yellow-800 font-semibold shadow-sm">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>You are logged in as an <strong>{user?.role}</strong> (Read-Only). Adding, editing, or deleting sites is locked to administrative roles.</span>
        </div>
      )}

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map((site) => {
          const siteMeters = getSiteMeters(site.id);
          return (
            <div 
              key={site.id}
              className="bg-background-lowest border border-outline/10 p-6 rounded-stitch shadow-stitch flex flex-col justify-between hover:border-primary/20 transition-all duration-200"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-stitch bg-primary/10 text-primary">
                      <Building2 className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-text-main leading-tight">{site.name}</h3>
                      <span className="text-[10px] text-text-muted font-bold font-sans">ID: {site.id}</span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    site.status === 'Active' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {site.status}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs font-semibold text-text-muted">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary/70 shrink-0" />
                    <span>{site.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-secondary/70 shrink-0" />
                    <span>Contact: {site.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-secondary/70 shrink-0" />
                    <span className="text-text-main font-bold">{siteMeters.length} Energy Meters Assigned</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-outline/10 flex justify-between items-center">
                <span className="text-[10px] text-text-muted font-medium">
                  Last Updated: {new Date(site.lastUpdated).toLocaleTimeString()}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenView(site)}
                    className="p-2 bg-background-container text-text-muted rounded-lg hover:bg-background-high hover:text-text-main transition-colors border border-outline/5"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  {!isReadOnly && (
                    <>
                      <button
                        onClick={() => handleOpenEdit(site)}
                        className="p-2 bg-background-container text-primary rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-outline/5"
                        title="Edit Site"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(site.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100"
                        title="Delete Site"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals Form (Add / Edit / View Details) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-main/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-background-lowest rounded-2xl shadow-stitch border border-outline/10 p-6 relative animate-fade-in">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text-main p-1.5 rounded-full hover:bg-background-high transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {modalMode === 'view' ? (
              // SITE VIEW SCREEN
              <div>
                <h3 className="font-serif text-xl font-bold text-text-main mb-2">Industrial Plant Profile</h3>
                <p className="text-xs text-text-muted mb-6">Detailed parameters and connected sensory network.</p>

                {activeSite && (
                  <div className="space-y-4 text-sm font-semibold">
                    <div className="bg-background-container p-4 rounded-stitch border border-outline/15 space-y-2">
                      <p className="text-xs text-primary font-bold">PLANT PROPERTIES</p>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-text-muted">Site Name:</span>
                        <span className="col-span-2 text-text-main">{activeSite.name}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-text-muted">Location:</span>
                        <span className="col-span-2 text-text-main">{activeSite.location}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-text-muted">Site Manager:</span>
                        <span className="col-span-2 text-text-main">{activeSite.contactPerson}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <span className="text-text-muted">Status:</span>
                        <span className="col-span-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            activeSite.status === 'Active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {activeSite.status}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-primary font-bold">CONNECTED METERS telemetry</p>
                      {getSiteMeters(activeSite.id).length === 0 ? (
                        <p className="text-xs text-text-muted italic bg-background-high/30 p-4 rounded-stitch border border-dashed border-outline/10">
                          No smart energy meters assigned to this site yet.
                        </p>
                      ) : (
                        <div className="max-h-40 overflow-y-auto divide-y divide-outline/10 border border-outline/10 rounded-stitch bg-background-container/10">
                          {getSiteMeters(activeSite.id).map(m => (
                            <div key={m.id} className="p-2.5 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-text-main block">{m.name}</span>
                                <span className="text-[10px] text-text-muted block">{m.id} • {m.location}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                m.status === 'Online' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                              }`}>{m.status}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-stitch hover:bg-primary/95 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              // SITE ADD / EDIT SCREEN
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-text-main mb-2">
                  {modalMode === 'add' ? 'Add Industrial Plant' : 'Modify Plant Configuration'}
                </h3>
                <p className="text-xs text-text-muted mb-4">
                  Define spatial metadata and operational states for the industrial energy grid.
                </p>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                    Site / Plant Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Madurai Plant Yard C"
                    className="w-full px-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                    Physical Address / Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Guindy Industrial Estate, Chennai"
                    className="w-full px-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                    Site Superintendent / Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Vignesh Ramaswamy"
                    className="w-full px-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1">
                    Plant Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background-container border border-outline/10 rounded-stitch text-sm text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="Active">Active / Connected</option>
                    <option value="Inactive">Inactive / Suspended</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-outline/10">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-bold text-text-muted bg-background-container border border-outline/10 rounded-stitch hover:bg-background-high transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-primary rounded-stitch shadow hover:bg-primary/95 transition-colors"
                  >
                    {modalMode === 'add' ? 'Register Plant' : 'Update Configuration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteManagement;
