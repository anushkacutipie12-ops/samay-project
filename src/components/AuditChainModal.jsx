import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, CheckCircle2, AlertOctagon, Link2 } from 'lucide-react';

export default function AuditChainModal({ auditChain, onClose }) {
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);

    const result = await auditChain.verifyChain();
    setTimeout(() => {
      setVerifying(false);
      setVerifyResult(result);
    }, 400);
  };

  const blocks = auditChain.chain;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">
                Cryptographic Hash-Chained Audit Log
              </h3>
              <p className="text-[11px] text-slate-300">
                Immutable, tamper-proof record of every RTS clock event & appeal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Verification Strip */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-slate-700">Total Blocks in Chain: </span>
            <span className="font-mono font-bold text-blue-700">{blocks.length} Blocks</span>
          </div>

          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs"
          >
            {verifying ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Verify Chain Integrity</span>
          </button>
        </div>

        {/* Verification Result Banner */}
        {verifyResult && (
          <div className={`p-3 text-xs flex items-center space-x-2 ${
            verifyResult.valid
              ? 'bg-emerald-50 text-emerald-900 border-b border-emerald-200'
              : 'bg-rose-50 text-rose-900 border-b border-rose-200'
          }`}>
            {verifyResult.valid ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">
                  Chain Verified! All {verifyResult.blockCount} blocks strictly validate with SHA-256 hash-chaining. Zero tampering detected.
                </span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                <span className="font-bold">
                  Chain Broken at Block #{verifyResult.brokenIndex}: {verifyResult.reason}
                </span>
              </>
            )}
          </div>
        )}

        {/* Block List */}
        <div className="overflow-y-auto p-4 space-y-3 flex-1 text-xs font-mono bg-slate-900 text-slate-200">
          {blocks.map((block) => (
            <div
              key={block.index}
              className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 space-y-1 text-[11px]"
            >
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Link2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>BLOCK #{block.index} • [{block.eventType}]</span>
                </span>
                <span className="text-slate-400 text-[10px]">{block.timestamp}</span>
              </div>

              <div className="text-slate-300">
                <span className="text-slate-500">App ID: </span>
                <span className="text-blue-300">{block.applicationId}</span>
              </div>

              <div className="text-slate-400 text-[10px] truncate">
                <span className="text-slate-500">Prev Hash: </span>
                {block.previousHash}
              </div>

              <div className="text-emerald-400 text-[10px] truncate font-bold">
                <span className="text-slate-500">Block Hash: </span>
                {block.hash}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
