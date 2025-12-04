// components/SmartQuestionWidget.tsx
// Unified intelligent widget component for interview questions

import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { detectWidgetType, WidgetConfig, WidgetType, getMeasurementGoal } from '../utils/questionWidgetDetector';
import { Star, Check, DollarSign, Clock, TrendingUp, MessageSquare } from 'lucide-react';

interface SmartQuestionWidgetProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

export const SmartQuestionWidget: React.FC<SmartQuestionWidgetProps> = ({
  question,
  value,
  onChange,
  onBlur
}) => {
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  
  useEffect(() => {
    const detected = detectWidgetType(question);
    setConfig(detected);
    console.log(`🎯 [Widget] Detected: ${detected.type} for "${question.text.substring(0, 50)}..."`);
  }, [question]);
  
  if (!config) return null;
  
  // Render the appropriate widget based on detected type
  switch (config.type) {
    case 'scale_1_10':
      return <Scale1to10Widget value={value} onChange={onChange} labels={config.labels} />;
      
    case 'scale_1_5':
      return <Scale1to5Widget value={value} onChange={onChange} labels={config.labels} />;
      
    case 'nps':
      return <NPSWidget value={value} onChange={onChange} labels={config.labels} />;
      
    case 'likert':
      return <LikertWidget value={value} onChange={onChange} options={config.options || []} />;
      
    case 'boolean':
      return <BooleanWidget value={value} onChange={onChange} />;
      
    case 'select':
      return <SelectWidget value={value} onChange={onChange} options={config.options || []} />;
      
    case 'multi_select':
      return <MultiSelectWidget value={value} onChange={onChange} options={config.options || []} />;
      
    case 'currency':
      return <CurrencyWidget value={value} onChange={onChange} presets={config.presets} />;
      
    case 'percentage':
      return <PercentageWidget value={value} onChange={onChange} />;
      
    case 'frequency':
      return <FrequencyWidget value={value} onChange={onChange} options={config.options || []} />;
      
    case 'time_duration':
      return <TimeDurationWidget value={value} onChange={onChange} />;
      
    case 'rating_stars':
      return <StarRatingWidget value={value} onChange={onChange} />;
      
    case 'number':
      return <NumberWidget value={value} onChange={onChange} onBlur={onBlur} />;
      
    case 'boolean_with_options':
      return <BooleanWithOptionsWidget value={value} onChange={onChange} options={config.options || []} />;
      
    case 'text_long':
      return <TextLongWidget value={value} onChange={onChange} onBlur={onBlur} placeholder={config.placeholder} />;
      
    case 'text_short':
    default:
      return <TextShortWidget value={value} onChange={onChange} onBlur={onBlur} placeholder={config.placeholder} />;
  }
};

// ==================== WIDGET COMPONENTS ====================

// Scale 1-10 Widget
const Scale1to10Widget: React.FC<{ value: string; onChange: (v: string) => void; labels?: any }> = ({ value, onChange, labels }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
        <button
          key={val}
          onClick={() => onChange(val.toString())}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl text-lg md:text-xl font-bold transition-all duration-300 flex items-center justify-center border ${
            value === val.toString()
              ? 'bg-neon text-black border-neon scale-110 shadow-[0_0_20px_rgba(58,255,151,0.5)]'
              : val <= 3 ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
              : val <= 6 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
          }`}
        >
          {val}
        </button>
      ))}
    </div>
    {labels && (
      <div className="flex justify-between text-xs text-slate-500 px-2">
        <span>{labels.min}</span>
        {labels.mid && <span>{labels.mid}</span>}
        <span>{labels.max}</span>
      </div>
    )}
  </div>
);

// Scale 1-5 Widget
const Scale1to5Widget: React.FC<{ value: string; onChange: (v: string) => void; labels?: any }> = ({ value, onChange, labels }) => {
  const emojis = ['😞', '🙁', '😐', '🙂', '😍'];
  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-4 mt-6">
        {[1, 2, 3, 4, 5].map((val, idx) => (
          <button
            key={val}
            onClick={() => onChange(val.toString())}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl text-3xl transition-all duration-300 flex flex-col items-center justify-center border gap-1 ${
              value === val.toString()
                ? 'bg-neon text-black border-neon scale-110 shadow-[0_0_25px_rgba(58,255,151,0.5)]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30'
            }`}
          >
            <span>{emojis[idx]}</span>
            <span className={`text-xs font-bold ${value === val.toString() ? 'text-black' : 'text-slate-400'}`}>{val}</span>
          </button>
        ))}
      </div>
      {labels && (
        <div className="flex justify-between text-xs text-slate-500 px-4">
          <span>{labels.min}</span>
          <span>{labels.max}</span>
        </div>
      )}
    </div>
  );
};

// NPS Widget (0-10 with color gradient)
const NPSWidget: React.FC<{ value: string; onChange: (v: string) => void; labels?: any }> = ({ value, onChange, labels }) => (
  <div className="space-y-4">
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
        <button
          key={val}
          onClick={() => onChange(val.toString())}
          className={`w-11 h-11 md:w-12 md:h-12 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center border ${
            value === val.toString()
              ? 'bg-neon text-black border-neon scale-110 shadow-[0_0_20px_rgba(58,255,151,0.5)]'
              : val <= 6 ? 'bg-red-500/20 text-red-400 border-red-500/40 hover:bg-red-500/30'
              : val <= 8 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 hover:bg-yellow-500/30'
              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          {val}
        </button>
      ))}
    </div>
    <div className="flex justify-between text-xs px-2">
      <span className="text-red-400">Detractores (0-6)</span>
      <span className="text-yellow-400">Pasivos (7-8)</span>
      <span className="text-emerald-400">Promotores (9-10)</span>
    </div>
  </div>
);

// Likert Widget
const LikertWidget: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => (
  <div className="grid grid-cols-1 gap-2 mt-4">
    {options.map((opt, idx) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`p-4 rounded-xl text-left border transition-all flex items-center gap-3 ${
          value === opt
            ? 'bg-neon text-black border-neon font-bold shadow-[0_0_15px_rgba(58,255,151,0.3)]'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
        }`}
      >
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          value === opt ? 'border-black bg-black/20' : 'border-white/30'
        }`}>
          {value === opt && <Check size={14} />}
        </div>
        <span>{opt}</span>
      </button>
    ))}
  </div>
);

// Boolean Widget - Simple clean style
const BooleanWidget: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="flex justify-center gap-6 mt-8">
    {['Sí', 'No'].map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 border ${
          value === opt
            ? 'bg-neon text-black border-neon scale-105 shadow-[0_0_25px_rgba(58,255,151,0.5)]'
            : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// Select Widget (single choice) - No scroll, compact buttons
const SelectWidget: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`p-3 rounded-xl text-left border text-sm transition-all ${
          value === opt
            ? 'bg-neon text-black border-neon font-bold shadow-[0_0_15px_rgba(58,255,151,0.3)]'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// Boolean With Options Widget - For wearable/device type questions
const BooleanWithOptionsWidget: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => {
  const [showOptions, setShowOptions] = React.useState(value !== '' && value !== 'No');
  const [customValue, setCustomValue] = React.useState('');
  
  // Expanded wearable options
  const WEARABLE_OPTIONS = [
    'Apple Watch',
    'Garmin',
    'Fitbit',
    'Whoop',
    'Oura Ring',
    'Samsung Galaxy Watch',
    'Xiaomi Mi Band',
    'Amazfit',
    'Polar',
    'Coros',
  ];
  
  const allOptions = options.length > 2 ? options.filter(o => o !== 'No uso' && o !== 'No uso ninguno') : WEARABLE_OPTIONS;
  
  const handleYes = () => {
    setShowOptions(true);
    // Don't set value yet, wait for option selection
  };
  
  const handleNo = () => {
    setShowOptions(false);
    onChange('No uso ninguno');
  };
  
  const handleOptionSelect = (opt: string) => {
    onChange(opt);
  };
  
  const handleCustom = (text: string) => {
    setCustomValue(text);
    if (text) {
      onChange(`Otro: ${text}`);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Yes/No Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleYes}
          className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 border ${
            showOptions
              ? 'bg-neon text-black border-neon scale-105 shadow-[0_0_20px_rgba(58,255,151,0.5)]'
              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white'
          }`}
        >
          Sí
        </button>
        <button
          onClick={handleNo}
          className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 border ${
            value === 'No uso ninguno'
              ? 'bg-neon text-black border-neon scale-105 shadow-[0_0_20px_rgba(58,255,151,0.5)]'
              : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white'
          }`}
        >
          No
        </button>
      </div>
      
      {/* Options (shown when Yes) */}
      {showOptions && (
        <div className="animate-fade-in-up space-y-3">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider text-center">¿Cuál usas?</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {allOptions.map(opt => (
              <button
                key={opt}
                onClick={() => handleOptionSelect(opt)}
                className={`p-3 rounded-xl text-left border text-sm transition-all ${
                  value === opt
                    ? 'bg-neon text-black border-neon font-bold shadow-[0_0_15px_rgba(58,255,151,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          
          {/* Otro option */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-slate-400 text-sm font-bold">Otro:</span>
            <input
              type="text"
              value={customValue}
              onChange={e => handleCustom(e.target.value)}
              placeholder="Especifica cuál..."
              className={`flex-1 bg-black/30 border rounded-xl p-3 text-white focus:border-neon outline-none text-sm ${
                value.startsWith('Otro:') ? 'border-neon' : 'border-white/10'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Multi-Select Widget
const MultiSelectWidget: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => {
  const selected = value ? value.split(',').map(s => s.trim()) : [];
  
  const toggleOption = (opt: string) => {
    const newSelected = selected.includes(opt)
      ? selected.filter(s => s !== opt)
      : [...selected, opt];
    onChange(newSelected.join(', '));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => toggleOption(opt)}
          className={`p-4 rounded-xl text-left border text-sm transition-all flex items-center gap-3 ${
            selected.includes(opt)
              ? 'bg-neon/20 text-neon border-neon font-bold'
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            selected.includes(opt) ? 'border-neon bg-neon' : 'border-white/30'
          }`}>
            {selected.includes(opt) && <Check size={12} className="text-black" />}
          </div>
          {opt}
        </button>
      ))}
    </div>
  );
};

// Currency Widget
const CurrencyWidget: React.FC<{ value: string; onChange: (v: string) => void; presets?: (string | number)[] }> = ({ value, onChange, presets }) => {
  const defaultPresets = ['$0', '$10', '$25', '$50', '$100', '$200+'];
  const options = presets || defaultPresets;
  
  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-wrap justify-center gap-3">
        {options.map(preset => (
          <button
            key={preset.toString()}
            onClick={() => onChange(preset.toString())}
            className={`px-5 py-3 rounded-xl font-bold transition-all border flex items-center gap-2 ${
              value === preset.toString()
                ? 'bg-neon text-black border-neon shadow-[0_0_15px_rgba(58,255,151,0.4)]'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <DollarSign size={16} />
            {preset}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm">Otro:</span>
        <input
          type="text"
          value={!options.includes(value) ? value : ''}
          onChange={e => onChange(e.target.value)}
          placeholder="$..."
          className="flex-1 bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-neon outline-none"
        />
      </div>
    </div>
  );
};

// Percentage Widget
const PercentageWidget: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const numValue = parseInt(value) || 0;
  
  return (
    <div className="space-y-4 mt-6">
      <div className="relative">
        <input
          type="range"
          min="0"
          max="100"
          value={numValue}
          onChange={e => onChange(e.target.value)}
          className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-5xl font-bold text-neon drop-shadow-[0_0_15px_rgba(58,255,151,0.5)]">{numValue}%</span>
      </div>
    </div>
  );
};

// Frequency Widget
const FrequencyWidget: React.FC<{ value: string; onChange: (v: string) => void; options: string[] }> = ({ value, onChange, options }) => (
  <div className="flex flex-wrap justify-center gap-3 mt-6">
    {options.map(opt => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-4 py-3 rounded-xl font-medium transition-all border text-sm ${
          value === opt
            ? 'bg-neon text-black border-neon shadow-[0_0_15px_rgba(58,255,151,0.4)]'
            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

// Time Duration Widget
const TimeDurationWidget: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => (
  <div className="flex items-center justify-center gap-4 mt-6">
    <Clock className="text-neon" size={24} />
    <input
      type="number"
      min="0"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="0"
      className="w-24 text-center bg-black/30 border border-white/10 rounded-xl p-3 text-2xl font-bold text-white focus:border-neon outline-none"
    />
    <span className="text-slate-400">horas</span>
  </div>
);

// Star Rating Widget
const StarRatingWidget: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const rating = parseInt(value) || 0;
  
  return (
    <div className="flex justify-center gap-3 mt-8">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star.toString())}
          className="transition-all hover:scale-110"
        >
          <Star
            size={48}
            className={star <= rating ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]' : 'text-white/20'}
          />
        </button>
      ))}
    </div>
  );
};

// Number Widget
const NumberWidget: React.FC<{ value: string; onChange: (v: string) => void; onBlur?: () => void }> = ({ value, onChange, onBlur }) => (
  <div className="flex justify-center mt-6">
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder="0"
      className="w-40 text-center bg-black/30 border border-white/10 rounded-xl p-4 text-3xl font-bold text-white focus:border-neon outline-none"
    />
  </div>
);

// Text Short Widget - Taller with 3 visible rows
const TextShortWidget: React.FC<{ value: string; onChange: (v: string) => void; onBlur?: () => void; placeholder?: string }> = ({ value, onChange, onBlur, placeholder }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    onBlur={onBlur}
    rows={3}
    placeholder={placeholder || 'Escribe tu respuesta...'}
    className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-lg text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none resize-none transition-all"
  />
);

// Text Long Widget - Taller with 5 visible rows
const TextLongWidget: React.FC<{ value: string; onChange: (v: string) => void; onBlur?: () => void; placeholder?: string }> = ({ value, onChange, onBlur, placeholder }) => (
  <div className="relative">
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      onBlur={onBlur}
      rows={5}
      placeholder={placeholder || 'Escribe tu respuesta detallada aquí...'}
      className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-lg text-white focus:border-neon focus:ring-1 focus:ring-neon outline-none resize-none transition-all"
    />
    <div className="absolute bottom-3 right-3 text-xs text-slate-500">
      {value.length} caracteres
    </div>
  </div>
);

export default SmartQuestionWidget;
