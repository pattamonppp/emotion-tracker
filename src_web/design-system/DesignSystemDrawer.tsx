import React, { useState } from 'react';
import { X, Check, Copy, Sparkles, Sliders, Info, Heart, Layers } from 'lucide-react';
import { Button, ButtonVariant, ButtonColorTheme, ButtonRadius } from './Button';
import { DESIGN_TOKENS } from './tokens';

interface DesignSystemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const DesignSystemDrawer: React.FC<DesignSystemDrawerProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ButtonVariant>('primary');
  const [selectedTheme, setSelectedTheme] = useState<ButtonColorTheme>('turquoise');
  const [selectedRadius, setSelectedRadius] = useState<ButtonRadius>('24px');
  const [selectedSize, setSelectedSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenName);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md transition-opacity">
      <div 
        className="w-full sm:max-w-xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-in fade-in slide-in-from-bottom duration-200"
      >
        {/* Header (0px sharp containers per design tokens) */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[12px] bg-[#00C4B3]/20 border border-[#00C4B3]/40 flex items-center justify-center text-[#00C4B3]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                mindfull / Ooca Design System
              </h2>
              <p className="text-xs text-slate-400">Tokens, Elevation & Button Component Library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
          
          {/* Section 1: Color Tokens */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#00C4B3]">
                1. Brand & Semantic Color Tokens
              </h3>
              <span className="text-[11px] text-slate-500">Tap to copy hex</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Turquoise Primary */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.brand.turquoise.primary, 'primary')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#00C4B3] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#00C4B3] shadow-sm" />
                  <div>
                    <div className="font-semibold text-white">Primary Turquoise</div>
                    <div className="text-[11px] font-mono text-slate-400">#00C4B3</div>
                  </div>
                </div>
                {copiedToken === 'primary' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Turquoise-2 Light */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.brand.turquoise.light, 'turquoise-2')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#33D0C2] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#33D0C2] shadow-sm" />
                  <div>
                    <div className="font-semibold text-white">Turquoise-2 (Light)</div>
                    <div className="text-[11px] font-mono text-slate-400">#33D0C2</div>
                  </div>
                </div>
                {copiedToken === 'turquoise-2' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Turquoise-3 Pale */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.brand.turquoise.pale, 'turquoise-3')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#E6F9F7] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#E6F9F7] border border-slate-400 shadow-sm" />
                  <div>
                    <div className="font-semibold text-white">Turquoise-3 (Pale)</div>
                    <div className="text-[11px] font-mono text-slate-400">#E6F9F7</div>
                  </div>
                </div>
                {copiedToken === 'turquoise-3' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Turquoise Contrast Text */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.brand.turquoise.text, 'text-teal')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#004D40] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#004D40] border border-teal-800 shadow-sm" />
                  <div>
                    <div className="font-semibold text-white">Contrast Text</div>
                    <div className="text-[11px] font-mono text-slate-400">#004D40</div>
                  </div>
                </div>
                {copiedToken === 'text-teal' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Feedback Flamingo (Error) */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.feedback.error, 'flamingo')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#F26E6E] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#F26E6E]" />
                  <div>
                    <div className="font-semibold text-white">Error (Flamingo)</div>
                    <div className="text-[11px] font-mono text-slate-400">#F26E6E</div>
                  </div>
                </div>
                {copiedToken === 'flamingo' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Feedback Sunshade (Warning) */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.feedback.warning, 'sunshade')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#FA8C3D] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#FA8C3D]" />
                  <div>
                    <div className="font-semibold text-white">Warning (Sunshade)</div>
                    <div className="text-[11px] font-mono text-slate-400">#FA8C3D</div>
                  </div>
                </div>
                {copiedToken === 'sunshade' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Feedback Guava (Success) */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.feedback.success, 'guava')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#7CC954] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#7CC954]" />
                  <div>
                    <div className="font-semibold text-white">Success (Guava)</div>
                    <div className="text-[11px] font-mono text-slate-400">#7CC954</div>
                  </div>
                </div>
                {copiedToken === 'guava' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>

              {/* Accent Blue 500 */}
              <div 
                onClick={() => copyToClipboard(DESIGN_TOKENS.color.accent.blue[500], 'blue-500')}
                className="p-3 rounded-[8px] bg-slate-800/80 border border-slate-700 hover:border-[#3B82F6] cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#3B82F6]" />
                  <div>
                    <div className="font-semibold text-white">Accent Blue 500</div>
                    <div className="text-[11px] font-mono text-slate-400">#3B82F6</div>
                  </div>
                </div>
                {copiedToken === 'blue-500' ? <Check className="w-4 h-4 text-[#00C4B3]" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </div>
            </div>
          </div>

          {/* Section 2: Geometry Rules */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#00C4B3] mb-2.5">
              2. Geometry & Border Radius Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-[8px] border border-slate-700/60">
                <span className="font-semibold text-white">Controls & Toggles</span>
                <p className="text-[11px] text-slate-400 mt-0.5">50% border-radius (Circle)</p>
                <div className="mt-2 w-8 h-8 rounded-full bg-[#00C4B3]/30 border border-[#00C4B3] flex items-center justify-center text-xs font-bold text-[#00C4B3]">
                  50%
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-[8px] border border-slate-700/60">
                <span className="font-semibold text-white">Avatars</span>
                <p className="text-[11px] text-slate-400 mt-0.5">12px rounded square</p>
                <div className="mt-2 w-8 h-8 rounded-[12px] bg-blue-500/30 border border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400">
                  12px
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-[8px] border border-slate-700/60">
                <span className="font-semibold text-white">Actionables (Buttons, Cards)</span>
                <p className="text-[11px] text-slate-400 mt-0.5">8px or 24px rounded rectangle</p>
                <div className="mt-2 flex gap-2">
                  <div className="h-8 px-2 rounded-[8px] bg-slate-700 border border-slate-600 flex items-center text-[10px] text-slate-300">
                    8px
                  </div>
                  <div className="h-8 px-2 rounded-[24px] bg-[#00C4B3]/20 border border-[#00C4B3] flex items-center text-[10px] text-[#00C4B3]">
                    24px
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-[8px] border border-slate-700/60">
                <span className="font-semibold text-white">Layout Containers</span>
                <p className="text-[11px] text-slate-400 mt-0.5">0px sharp edges (Headers, Footers)</p>
                <div className="mt-2 h-8 rounded-none bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] text-slate-300">
                  0px Sharp
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 8 Elevation Levels */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#00C4B3] mb-2.5">
              3. Tinted Box Shadow Elevation (8 Levels)
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => (
                <div
                  key={lvl}
                  className={`p-3 rounded-[8px] bg-slate-800/90 border border-[#00C4B3]/20 elevation-${lvl} transition-transform hover:-translate-y-0.5`}
                >
                  <div className="font-bold text-[#00C4B3]">Level {lvl}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lvl <= 3 ? '8-12%' : lvl <= 5 ? '12%' : '16%'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Interactive Button Playground */}
          <div className="p-4 rounded-[12px] bg-slate-950 border border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#00C4B3] mb-3 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              4. Button Component Architecture Playground
            </h3>

            {/* Controls */}
            <div className="space-y-3 mb-4 text-xs">
              {/* Variant */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Variant:</span>
                <div className="flex gap-1">
                  {(['primary', 'secondary', 'text', 'icon-only'] as ButtonVariant[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-2 py-1 rounded-[8px] text-[11px] font-medium transition-colors ${
                        selectedVariant === v ? 'bg-[#00C4B3] text-[#004D40]' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Theme */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Color Theme:</span>
                <div className="flex gap-1">
                  {(['turquoise', 'blue', 'red'] as ButtonColorTheme[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedTheme(c)}
                      className={`px-2 py-1 rounded-[8px] text-[11px] font-medium transition-colors ${
                        selectedTheme === c ? 'bg-white text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius & Size */}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Radius & Size:</span>
                <div className="flex gap-2">
                  <select
                    value={selectedRadius}
                    onChange={(e) => setSelectedRadius(e.target.value as ButtonRadius)}
                    className="bg-slate-800 text-slate-200 text-[11px] rounded-[8px] px-2 py-1 border border-slate-700"
                  >
                    <option value="24px">24px Rectangle</option>
                    <option value="8px">8px Rectangle</option>
                    <option value="circle">Circle (50%)</option>
                  </select>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value as 'sm' | 'md' | 'lg')}
                    className="bg-slate-800 text-slate-200 text-[11px] rounded-[8px] px-2 py-1 border border-slate-700"
                  >
                    <option value="sm">Small</option>
                    <option value="md">Medium</option>
                    <option value="lg">Large</option>
                  </select>
                </div>
              </div>

              {/* States Toggles */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">States:</span>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={isLoading}
                      onChange={(e) => setIsLoading(e.target.checked)}
                      className="rounded accent-[#00C4B3]"
                    />
                    Loading
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                    <input
                      type="checkbox"
                      checked={isDisabled}
                      onChange={(e) => setIsDisabled(e.target.checked)}
                      className="rounded accent-[#00C4B3]"
                    />
                    Disabled
                  </label>
                </div>
              </div>
            </div>

            {/* Live Rendered Button Preview */}
            <div className="p-6 bg-slate-900/90 rounded-[12px] border border-slate-800 flex flex-col items-center justify-center gap-3">
              <Button
                variant={selectedVariant}
                colorTheme={selectedTheme}
                radius={selectedRadius}
                size={selectedSize}
                isLoading={isLoading}
                isDisabled={isDisabled}
                lang={lang}
                leadingIcon={<Sparkles className="w-4 h-4" />}
                trailingIcon={<Heart className="w-4 h-4" />}
                label={lang === 'th' ? 'ทดสอบปุ่ม mindfull' : 'Test mindfull Button'}
              />

              <div className="text-[11px] text-slate-400 font-mono">
                &lt;Button variant="{selectedVariant}" colorTheme="{selectedTheme}" radius="{selectedRadius}" /&gt;
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <Button
            variant="primary"
            colorTheme="turquoise"
            size="sm"
            onClick={onClose}
            label={lang === 'th' ? 'ปิดหน้าระบบ' : 'Close Inspector'}
          />
        </div>
      </div>
    </div>
  );
};
