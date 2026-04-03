import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function CustomDropdown({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option...', 
  className = '',
  searchable = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine if options are grouped or flat
  const isGrouped = options.length > 0 && 'category' in options[0];

  // Helper to compare values safely (including arrays like in AgendaCreationModal)
  const isSelected = (optValue) => {
    if (Array.isArray(value) && Array.isArray(optValue)) {
      return value.length === optValue.length && value.every((v, i) => v === optValue[i]);
    }
    return value === optValue;
  };

  // Get selected label
  const getSelectedLabel = () => {
    if (value === undefined || value === null || value === '') return placeholder;
    
    if (isGrouped) {
      for (const group of options) {
        const found = group.options.find(opt => isSelected(opt.value));
        if (found) return found.label;
      }
    } else {
      const found = options.find(opt => isSelected(opt.value));
      if (found) return found.label;
    }
    return placeholder;
  };

  // Filter options based on search query
  const getFilteredOptions = () => {
    if (!searchQuery) return options;
    const lowerQuery = searchQuery.toLowerCase();

    if (isGrouped) {
      return options.map(group => ({
        ...group,
        options: group.options.filter(opt => opt.label.toLowerCase().includes(lowerQuery))
      })).filter(group => group.options.length > 0);
    } else {
      return options.filter(opt => opt.label.toLowerCase().includes(lowerQuery));
    }
  };

  const filteredOptions = getFilteredOptions();

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchQuery('');
        }}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#FFD700]/50 focus:ring-1 focus:ring-[#FFD700]/30 transition-all shadow-sm hover:border-white/20"
      >
        <span className={`truncate ${!value || value === '' ? 'text-slate-400' : 'text-white font-medium'}`}>
          {getSelectedLabel()}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 top-full left-0 mt-2 w-full min-w-[200px] bg-[#11151F]/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-72"
          >
            {searchable && (
              <div className="p-2 border-b border-white/5 shrink-0 bg-black/20">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FFD700]/50"
                  />
                </div>
              </div>
            )}
            
            <div className="overflow-y-auto custom-scrollbar p-1 flex-1">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500 italic">No options found</div>
              ) : isGrouped ? (
                filteredOptions.map((group, gIdx) => (
                  <div key={gIdx} className="mb-1 last:mb-0">
                    {group.category && (
                      <div className="px-3 py-1.5 text-[10px] uppercase font-black tracking-widest text-slate-500 bg-white/5 sticky top-0 z-10 backdrop-blur-md">
                        {group.category}
                      </div>
                    )}
                    <div className="p-1">
                      {group.options.map((opt, oIdx) => {
                        const selected = isSelected(opt.value);
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              onChange(opt.value);
                              setIsOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left ${
                              selected 
                              ? 'bg-[#FFD700]/10 text-[#FFD700] font-bold shadow-[0_0_10px_rgba(255,215,0,0.1)]' 
                              : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                            }`}
                          >
                            <span className="truncate flex items-center gap-2">
                              {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                              {opt.render ? opt.render : opt.label}
                            </span>
                            {selected && <Check className="w-4 h-4 ml-2 shrink-0 text-[#FFD700]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                filteredOptions.map((opt, idx) => {
                  const selected = isSelected(opt.value);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all text-left ${
                        selected 
                        ? 'bg-[#FFD700]/10 text-[#FFD700] font-bold shadow-[0_0_10px_rgba(255,215,0,0.1)]' 
                        : 'text-slate-300 hover:bg-white/10 hover:text-white font-medium'
                      }`}
                    >
                      <span className="truncate flex items-center gap-2 w-full">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        {opt.render ? opt.render : opt.label}
                      </span>
                      {selected && <Check className="w-4 h-4 ml-2 shrink-0 text-[#FFD700]" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
