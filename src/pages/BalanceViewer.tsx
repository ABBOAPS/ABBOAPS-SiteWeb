import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { useMemo } from "react";
import {
  Table as TableIcon,
  AreaChart as ChartIcon,
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { SEO } from "../components/SEO";

const csvFiles = import.meta.glob("../content/csv/*.csv", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const COLORS = ["#e65100", "#ff8f00", "#ffb300", "#ffd54f", "#ffe082"];

export function BalanceViewer() {
  const { year: paramYear } = useParams();
  const navigate = useNavigate();

  const allYears = useMemo(() => {
    const years = Object.keys(csvFiles)
      .map((path) => {
        const match = path.match(/bilancio_(\d{4})\.csv/) || path.match(/balance_sheet_(\d{4})\.csv/);
        return match ? match[1] : null;
      })
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a));
    // Unique years
    return Array.from(new Set(years));
  }, []);

  const latestYear = allYears.length > 0 ? allYears[0] : "2026";
  const year = paramYear || latestYear;

  const sheetContent = useMemo(() => {
    const fileKey = Object.keys(csvFiles).find(
      (path) =>
        path.includes(`bilancio_${year}.csv`) ||
        path.includes(`balance_sheet_${year}.csv`),
    );
    return fileKey ? csvFiles[fileKey] : null;
  }, [year]);

  const headerContent = (
    <div className="w-full max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 pb-8 border-b border-[#4a1c0d]/10">
        <div className="flex flex-col">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#4a1c0d]">
            Bilancio Finanziario
          </h1>
          <h2 className="text-3xl text-[#8a3a19] mt-2 font-mono">ANNO {year}</h2>
        </div>

        {allYears.length > 0 && (
          <div className="flex items-center gap-3 clay-card px-4 py-2 hover:-translate-y-1 transition-transform">
            <Calendar className="w-5 h-5 text-[#e65100]" />
            <select
              value={year as string}
              onChange={(e) => navigate(`/archivio/bilanci/${e.target.value}`)}
              className="bg-transparent text-lg border-none text-[#4a1c0d] font-bold outline-none cursor-pointer"
            >
              {allYears.map((y) => (
                <option key={y as string} value={y as string}>
                  Seleziona anno: {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );

  if (!sheetContent) {
    return (
      <div className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 pb-32 flex flex-col items-center text-[#4a1c0d]">
        <SEO title={`Bilancio ${year}`} url={`/bilanci/${year}`} />
        {headerContent}
        <div className="w-full max-w-7xl flex flex-col items-center justify-center py-20 text-center">
          <h3 className="text-2xl font-bold tracking-tighter text-[#8a3a19]">
            Nessun bilancio trovato per l'anno {year}.
          </h3>
          <p className="mt-4 text-[#4a1c0d]/60 font-medium max-w-md">
            Seleziona un anno disponibile dal menu in alto per visualizzare l'archivio dei bilanci di Abbo APS.
          </p>
        </div>
      </div>
    );
  }

  const { data: rows } = Papa.parse<any>(sheetContent, { header: true });

  const validRows = rows.map((r: any) => ({
    Account: r.Account || r.Voce,
    Amount: r.Amount || r.Importo,
    Type: r.Type || r.Tipo,
    MacroCategory: r['Macro Category'] || r['Macro Categoria'] || '',
    Notes: r.Notes || r.Note || ''
  })).filter((r) => r.Account && r.Amount !== undefined && r.Type);

  const incomeRows = validRows.filter(
    (r) =>
      r.Type.toLowerCase() === "income" || r.Type.toLowerCase() === "entrate" || r.Type.toLowerCase() === "entrata",
  );
  const expenseRows = validRows.filter(
    (r) =>
      r.Type.toLowerCase() === "expense" || r.Type.toLowerCase() === "uscite" || r.Type.toLowerCase() === "uscita",
  );

  const totalIncome = incomeRows.reduce(
    (acc, row) => acc + parseFloat(row.Amount || 0),
    0,
  );
  const totalExpense = expenseRows.reduce(
    (acc, row) => acc + parseFloat(row.Amount || 0),
    0,
  );
  const netIncome = totalIncome - totalExpense;

  const expenseData = expenseRows.map((r) => ({
    name: r.Account,
    value: parseFloat(r.Amount || 0),
  }));

    return (
      <div className="relative z-20 w-full min-h-screen pt-40 px-6 md:px-24 pb-32 flex flex-col items-center text-[#4a1c0d]">
        <SEO title={`Bilancio ${year}`} url={`/bilanci/${year}`} />
        {headerContent}
        <div className="w-full max-w-7xl">
          {/* KPI Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="clay-card p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 text-[#e65100]">
                <ArrowUpRight className="w-16 h-16" />
              </div>
              <p className="text-[#4a1c0d]/60 text-sm font-bold uppercase tracking-widest mb-4">
                Entrate Totali
              </p>
              <h3 className="text-5xl font-mono text-[#e65100] tracking-tighter">
                €{totalIncome.toLocaleString()}
              </h3>
            </div>

            <div className="clay-card p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 text-[#e65100]">
                <ArrowDownRight className="w-16 h-16" />
              </div>
              <p className="text-[#4a1c0d]/60 text-sm font-bold uppercase tracking-widest mb-4">
                Uscite Totali
              </p>
              <h3 className="text-5xl font-mono text-[#e65100] tracking-tighter">
                €{totalExpense.toLocaleString()}
              </h3>
            </div>

            <div className="clay-card p-8 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20">
                <Wallet className="w-16 h-16" />
              </div>
              <p className="text-[#4a1c0d]/60 text-sm font-bold uppercase tracking-widest mb-4">
                Utile Netto
              </p>
              <h3 className="text-5xl font-mono font-bold text-[#e65100] tracking-tighter">
                €{netIncome.toLocaleString()}
              </h3>
            </div>
          </div>

          {/* Charts & Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Chart */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <ChartIcon className="w-6 h-6 text-[#4a1c0d]/60" />
                <h3 className="text-2xl font-bold tracking-tight text-[#4a1c0d]">
                  Distribuzione Uscite
                </h3>
              </div>
              <div className="clay-card p-8 h-[400px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {expenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid rgba(230,81,0,0.2)",
                        borderRadius: "12px",
                      }}
                      itemStyle={{ color: "#4a1c0d" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="flex flex-col">
              <div className="flex items-center space-x-3 mb-8">
                <TableIcon className="w-6 h-6 text-[#4a1c0d]/60" />
                <h3 className="text-2xl font-bold tracking-tight text-[#4a1c0d]">
                  Dettaglio Comparativo
                </h3>
              </div>
              <div className="w-full overflow-x-auto clay-card p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#e65100]/10">
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-widest text-[#4a1c0d]/60">
                        Macro Categoria
                      </th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-widest text-[#4a1c0d]/60">
                        Voce
                      </th>
                      <th className="py-4 px-6 font-bold text-xs uppercase tracking-widest text-[#4a1c0d]/60 text-right">
                        Importo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {validRows.map((row: any, i: number) => (
                      <tr
                        key={i}
                        className="border-b border-[#e65100]/5 hover:bg-[#ff8f00]/5 transition-colors"
                      >
                        <td className="py-5 px-6 text-sm text-[#4a1c0d]/70">
                          {row.MacroCategory}
                        </td>
                        <td className="py-5 px-6 text-sm font-medium text-[#4a1c0d]">
                          {row.Account}
                          {row.Notes && <span className="block text-xs font-normal text-[#4a1c0d]/50 mt-1">{row.Notes}</span>}
                        </td>
                        <td className="py-5 px-6 font-mono text-sm font-bold text-[#e65100] text-right whitespace-nowrap">
                          €{parseFloat(row.Amount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
