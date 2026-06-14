"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { mockDatabaseSchema, Table, Column, Relationship } from "@/lib/dbSchema";
import SupabaseBanner from "@/components/SupabaseBanner";
import BottomNav from "@/components/BottomNav";
import { 
  ChevronLeft, 
  ChevronRight,
  Database, 
  Layers, 
  GitCommit, 
  Code, 
  TableProperties, 
  KeyRound, 
  Fingerprint, 
  Info,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function TableDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tableName = params.tableName as string;

  // Tabs: 'columns' | 'relations' | 'preview'
  const [activeTab, setActiveTab] = useState<'columns' | 'relations' | 'preview'>('columns');

  // Find table definition index based on URL parameter
  const [currentTableIndex, setCurrentTableIndex] = useState<number>(() => {
    const idx = mockDatabaseSchema.tables.findIndex(
      (t) => t.name.toLowerCase() === tableName.toLowerCase()
    );
    return idx !== -1 ? idx : 0;
  });

  // Sync state with URL change (e.g. back/forward navigation)
  useEffect(() => {
    const idx = mockDatabaseSchema.tables.findIndex(
      (t) => t.name.toLowerCase() === tableName.toLowerCase()
    );
    if (idx !== -1) {
      setCurrentTableIndex(idx);
    }
  }, [tableName]);

  // Sync URL with state change silently (updating browser address bar)
  useEffect(() => {
    const currentTable = mockDatabaseSchema.tables[currentTableIndex];
    if (currentTable && currentTable.name.toLowerCase() !== tableName.toLowerCase()) {
      window.history.pushState(null, "", `/table/${currentTable.name}`);
    }
  }, [currentTableIndex, tableName]);

  const table = mockDatabaseSchema.tables[currentTableIndex];

  if (!table) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden pb-24 text-white">
        <SupabaseBanner />
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <Info className="w-12 h-12 text-slate-500" />
          <p className="text-slate-400 font-semibold">Table not found</p>
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-violet-600 rounded-xl text-xs font-semibold hover:bg-violet-500 transition-colors"
          >
            Go Back Home
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Find relationships involving this table
  const outgoingRelations = mockDatabaseSchema.relationships.filter(
    (rel) => rel.sourceTable.toLowerCase() === table.name.toLowerCase()
  );
  
  const incomingRelations = mockDatabaseSchema.relationships.filter(
    (rel) => rel.targetTable.toLowerCase() === table.name.toLowerCase()
  );

  const handlePrevPage = () => {
    setCurrentTableIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentTableIndex((prev) => Math.min(mockDatabaseSchema.tables.length - 1, prev + 1));
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-36 text-slate-200">
      <SupabaseBanner />

      {/* Outer wrapper keyed by index to restart the fade-in animation */}
      <div key={currentTableIndex} className="flex-1 flex flex-col overflow-hidden animate-fade-in">
        {/* Top Header Navigation */}
        <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/20 border-b border-slate-800/50">
          <button 
            onClick={() => router.back()}
            className="p-1.5 hover:bg-slate-800/80 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-violet-500/10 text-violet-400 border border-violet-500/20">
                {table.schema}
              </span>
              <h1 className="text-base font-bold text-white tracking-wide">
                {table.name}
              </h1>
            </div>
            <span className="text-[10px] text-slate-500">
              {table.rowCount.toLocaleString()} estimated records
            </span>
          </div>
        </div>

        {/* Main Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 space-y-4 no-scrollbar">
          {/* Table Description Card */}
          <div className="bg-slate-900/30 border border-slate-800/40 rounded-2xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-violet-400" />
              <span>Description</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {table.description}
            </p>
          </div>

          {/* Tab Selection Row */}
          <div className="flex bg-slate-900/60 p-1 rounded-xl border border-slate-800/50">
            <button
              onClick={() => setActiveTab('columns')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'columns'
                  ? "bg-violet-600/25 border border-violet-500/25 text-violet-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>
            <button
              onClick={() => setActiveTab('relations')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'relations'
                  ? "bg-violet-600/25 border border-violet-500/25 text-violet-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Relations</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'preview'
                  ? "bg-violet-600/25 border border-violet-500/25 text-violet-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>SQL / Data</span>
            </button>
          </div>

          {/* Tab Panels */}
          <div className="space-y-4">
            {/* COLUMNS TAB */}
            {activeTab === 'columns' && (
              <div className="space-y-3">
                {table.columns.map((col, idx) => (
                  <div 
                    key={col.name}
                    className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 space-y-3"
                    style={{
                      animation: 'slideUp 0.3s ease-out forwards',
                      animationDelay: `${idx * 0.04}s`,
                      opacity: 0
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-white font-mono">
                            {col.name}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {col.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          {col.isNullable ? (
                            <span className="text-slate-500">NULLABLE</span>
                          ) : (
                            <span className="text-red-400 font-medium">NOT NULL</span>
                          )}
                          {col.defaultValue && (
                            <span className="font-mono text-violet-400/80">
                              · DEFAULT: {col.defaultValue}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Key Badges */}
                      <div className="flex gap-1.5">
                        {col.isPrimaryKey && (
                          <div className="flex items-center gap-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            <KeyRound className="w-2.5 h-2.5" />
                            <span>PK</span>
                          </div>
                        )}
                        {col.isForeignKey && (
                          <div className="flex items-center gap-0.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                            <Fingerprint className="w-2.5 h-2.5" />
                            <span>FK</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {col.description}
                    </p>

                    {col.isForeignKey && col.foreignKeyTarget && (
                      <div className="mt-2 bg-sky-500/5 border border-sky-500/10 rounded-xl p-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-sky-400 font-semibold uppercase">
                          <GitCommit className="w-3.5 h-3.5" />
                          <span>References</span>
                        </div>
                        <Link 
                          href={`/table/${col.foreignKeyTarget.split('.')[0]}`}
                          className="text-xs text-sky-300 font-mono hover:underline"
                        >
                          {col.foreignKeyTarget}
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* RELATIONS TAB */}
            {activeTab === 'relations' && (
              <div className="space-y-4">
                {/* Outgoing relationships (Referencing other tables) */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
                    References (Outgoing - {outgoingRelations.length})
                  </h3>
                  {outgoingRelations.length > 0 ? (
                    <div className="space-y-2">
                      {outgoingRelations.map((rel, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-900/30 border border-slate-800/40 rounded-2xl p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Column</p>
                            <p className="text-sm font-semibold text-white font-mono">{rel.sourceColumn}</p>
                          </div>
                          <div className="flex flex-col items-center px-4">
                            <span className="text-[10px] text-slate-600 font-mono tracking-tighter">
                              {rel.type}
                            </span>
                            <div className="w-8 h-px bg-slate-800 relative my-1">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium">Targets Table</p>
                            <Link 
                              href={`/table/${rel.targetTable}`}
                              className="text-sm font-semibold text-violet-400 font-mono hover:underline"
                            >
                              {rel.targetTable}({rel.targetColumn})
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 px-1">This table has no outgoing references.</p>
                  )}
                </div>

                {/* Incoming relationships (Referenced by other tables) */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
                    Referenced By (Incoming - {incomingRelations.length})
                  </h3>
                  {incomingRelations.length > 0 ? (
                    <div className="space-y-2">
                      {incomingRelations.map((rel, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-900/30 border border-slate-800/40 rounded-2xl p-4 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Source Table</p>
                            <Link 
                              href={`/table/${rel.sourceTable}`}
                              className="text-sm font-semibold text-violet-400 font-mono hover:underline"
                            >
                              {rel.sourceTable}({rel.sourceColumn})
                            </Link>
                          </div>
                          <div className="flex flex-col items-center px-4">
                            <span className="text-[10px] text-slate-600 font-mono tracking-tighter">
                              {rel.type}
                            </span>
                            <div className="w-8 h-px bg-slate-800 relative my-1">
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-violet-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-medium">Column</p>
                            <p className="text-sm font-semibold text-white font-mono">{rel.targetColumn}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 px-1">No other tables reference this table.</p>
                  )}
                </div>
              </div>
            )}

            {/* SQL / DATA PREVIEW TAB */}
            {activeTab === 'preview' && (
              <div className="space-y-4">
                {/* SQL Schema Definition */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
                    <Code className="w-3.5 h-3.5 text-violet-400" />
                    <span>SQL Create Statement</span>
                  </div>
                  <div className="relative">
                    <pre className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-[10px] font-mono text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
                      {table.sqlDefinition}
                    </pre>
                  </div>
                </div>

                {/* Sample Data Records */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 px-1 uppercase tracking-wider">
                    <TableProperties className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Sample Data Records</span>
                  </div>
                  <div className="space-y-2.5">
                    {table.sampleData.map((row, idx) => (
                      <div 
                        key={idx} 
                        className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 text-[11px] font-mono space-y-1.5 shadow-sm"
                      >
                        <div className="flex justify-between border-b border-slate-800/60 pb-1.5 text-[10px] text-slate-500">
                          <span>Record #{idx + 1}</span>
                        </div>
                        <div className="space-y-1 pt-1">
                          {Object.entries(row).map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span className="text-slate-400 font-semibold">{k}:</span>
                              <span className="text-white text-right break-all">
                                {typeof v === 'object' && v !== null 
                                  ? JSON.stringify(v) 
                                  : typeof v === 'boolean'
                                  ? (v ? 'true' : 'false')
                                  : String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Table Pagination Navigation Bar */}
      <div className="absolute bottom-22 left-4 right-4 h-12 glassmorphism rounded-xl flex items-center justify-between px-4 z-35 shadow-lg">
        <button 
          onClick={handlePrevPage}
          disabled={currentTableIndex === 0}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>
        <span className="text-xs text-slate-500 font-bold tracking-wider">
          {currentTableIndex + 1} / {mockDatabaseSchema.tables.length}
        </span>
        <button 
          onClick={handleNextPage}
          disabled={currentTableIndex === mockDatabaseSchema.tables.length - 1}
          className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-40 disabled:hover:text-slate-400 transition-colors"
        >
          <span>Next Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Floating navigation */}
      <BottomNav />
    </div>
  );
}
