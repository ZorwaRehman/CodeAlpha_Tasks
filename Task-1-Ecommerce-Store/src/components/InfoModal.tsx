import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Terminal,
  Server,
  Layers,
  CheckCircle2,
  Code,
  Laptop,
  Globe,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-zinc-950/75 backdrop-blur-sm animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 my-auto flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-800 rounded-xl text-emerald-400 border border-zinc-700">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-base text-white">
                  Developer & Execution Guide
                </h3>
                <p className="text-xs text-zinc-400">
                  Full Stack Architecture & How to Run on Any Machine
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-zinc-700">
            
            {/* Quick Answer: Where to Run */}
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Where can you run this application?</span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                This project is 100% self-contained and runs seamlessly in <strong>any modern web browser</strong> (right here in Google AI Studio) and on <strong>any computer</strong> (Windows, macOS, or Linux) using standard <strong>Node.js (v18+)</strong> and <strong>VS Code</strong> or any code editor of your choice.
              </p>
            </div>

            {/* Architecture Stack */}
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-800" />
                Project Architecture Stack
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-1">Frontend Client</span>
                  <p className="text-zinc-500">React 19, TypeScript, Tailwind CSS, Motion animations, Lucide icons</p>
                </div>
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-1">Backend Server</span>
                  <p className="text-zinc-500">Express.js (Node.js) REST API with authentication and endpoints</p>
                </div>
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200">
                  <span className="font-bold text-zinc-900 block mb-1">Database Storage</span>
                  <p className="text-zinc-500">Persistent disk storage (<code className="font-mono text-[11px] bg-zinc-200 px-1 rounded">data/store.json</code>) with CRUD operations</p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Run Instructions */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-sm text-zinc-900 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-zinc-800" />
                How to Run Locally (VS Code / Terminal)
              </h4>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-3 bg-zinc-900 text-zinc-200 rounded-xl">
                  <span className="text-zinc-500"># 1. Install Node.js dependencies</span>
                  <p className="text-emerald-400 mt-1">npm install</p>
                </div>

                <div className="p-3 bg-zinc-900 text-zinc-200 rounded-xl">
                  <span className="text-zinc-500"># 2. Start the unified Express & Vite development server</span>
                  <p className="text-emerald-400 mt-1">npm run dev</p>
                </div>

                <div className="p-3 bg-zinc-900 text-zinc-200 rounded-xl">
                  <span className="text-zinc-500"># 3. Open in your web browser</span>
                  <p className="text-blue-300 mt-1">http://localhost:3000</p>
                </div>
              </div>
            </div>

            {/* Test Accounts Table */}
            <div>
              <h4 className="font-extrabold text-sm text-zinc-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-800" />
                Pre-Configured Demo Accounts for Testing
              </h4>
              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 text-zinc-700 font-bold border-b border-zinc-200">
                    <tr>
                      <th className="p-2.5">Account Role</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Password</th>
                      <th className="p-2.5">Capabilities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    <tr className="bg-white">
                      <td className="p-2.5 font-bold text-indigo-700">Administrator</td>
                      <td className="p-2.5 font-mono">admin@store.com</td>
                      <td className="p-2.5 font-mono">admin123</td>
                      <td className="p-2.5 text-zinc-600">Admin dashboard, inventory CRUD, fulfill orders</td>
                    </tr>
                    <tr className="bg-zinc-50/50">
                      <td className="p-2.5 font-bold text-zinc-900">Customer</td>
                      <td className="p-2.5 font-mono">alex@example.com</td>
                      <td className="p-2.5 font-mono">password123</td>
                      <td className="p-2.5 text-zinc-600">Place orders, review products, track packages</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs transition-colors"
            >
              Got it, Close Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
