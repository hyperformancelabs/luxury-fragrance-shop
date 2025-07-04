import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
  ScatterChart, Scatter,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import { Loader2, Send, Copy, Trash2, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'react-toastify';
import { PageHeader } from '../Components/common';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

/* Supported chart colors */
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'
];

const chartOptions = [
  { value: 'auto', label: 'Hệ thống tự chọn' },
  { value: 'bar', label: 'Biểu đồ cột' },
  { value: 'line', label: 'Biểu đồ đường' },
  { value: 'pie', label: 'Biểu đồ tròn' },
  { value: 'area', label: 'Biểu đồ vùng' },
  { value: 'scatter', label: 'Biểu đồ phân tán' },
  { value: 'table', label: 'Bảng dữ liệu' }
];

// Helper to generate unique id
const generateId = () => Date.now().toString();

const presetSuggestions = [
  'Tổng doanh thu theo tháng năm hiện tại',
  'Top 5 sản phẩm bán chạy nhất trong quý này',
  'Số đơn hàng theo trạng thái trong 30 ngày qua',
  'Tăng trưởng khách hàng mới theo tháng',
  'Tổng chi phí marketing theo kênh trong năm nay'
];

// Confirm Dialog component (reuse style used in other pages)
const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = "Xác nhận", confirmButtonClass = "bg-red-600 hover:bg-red-700" }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-medium mb-4">{title || "Xác nhận"}</h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Hủy</button>
        <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-md ${confirmButtonClass}`}>{confirmText}</button>
      </div>
    </div>
  </div>
);

const AiStatistics = () => {
  const [question, setQuestion] = useState('');
  const [preferredChart, setPreferredChart] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [chartResponse, setChartResponse] = useState(null);
  const [savedCharts, setSavedCharts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [chartToDelete, setChartToDelete] = useState(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Load saved charts from localStorage and refresh data
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('ai_saved_charts') || '[]');
    if (stored && Array.isArray(stored)) {
      setSavedCharts(stored);
      // Refresh each chart's data
      stored.forEach(async (c) => {
        try {
          const res = await axios.post('http://localhost:8080/api/v1/emp/llm/generate', { question: buildPromptForChart(c) });
          if (res.data?.code === 200 && res.data?.data) {
            setSavedCharts(prev => prev.map(item => item.id === c.id ? { ...item, chartResponse: res.data.data } : item));
          }
        } catch (_) {}
      });
    }
  }, []);

  // Persist to localStorage whenever savedCharts changes
  useEffect(() => {
    localStorage.setItem('ai_saved_charts', JSON.stringify(savedCharts));
  }, [savedCharts]);

  // Load history
  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('ai_query_history') || '[]');
    setQueryHistory(h);
  }, []);

  // Persist history
  useEffect(() => {
    localStorage.setItem('ai_query_history', JSON.stringify(queryHistory));
  }, [queryHistory]);

  // Build prompt for a saved chart (respect preferred chart if user specified)
  const buildPromptForChart = (chart) => {
    if (!chart?.question) return '';
    let prompt = chart.question;
    if (chart.preferredChart && chart.preferredChart !== 'auto') {
      const viMap = { bar: 'cột', line: 'đường', pie: 'tròn', area: 'khu vực', scatter: 'phân tán', table: 'bảng' };
      prompt += `. Bạn hãy ưu tiên sử dụng biểu đồ ${viMap[chart.preferredChart] || chart.preferredChart}.`;
    }
    if (chart.fromDate || chart.toDate) {
      const fVi = chart.fromDate ? new Date(chart.fromDate).toLocaleDateString('vi-VN') : '';
      const tVi = chart.toDate ? new Date(chart.toDate).toLocaleDateString('vi-VN') : '';
      if (chart.fromDate && chart.toDate) prompt += ` Dữ liệu giới hạn trong khoảng thời gian từ ngày ${fVi} đến ngày ${tVi}.`;
      else if (chart.fromDate) prompt += ` Dữ liệu kể từ ngày ${fVi}.`;
      else if (chart.toDate) prompt += ` Dữ liệu đến ngày ${tVi}.`;
    }
    return prompt;
  };

  /* Build prompt with user preference */
  const buildPrompt = () => {
    if (!question.trim()) return '';
    if (preferredChart !== 'auto') {
      // Provide Vietnamese mapping for chart type
      const viMap = {
        bar: 'cột',
        line: 'đường',
        pie: 'tròn',
        area: 'khu vực',
        scatter: 'phân tán',
        table: 'bảng'
      };
      let base = `${question}. Bạn hãy ưu tiên sử dụng biểu đồ ${viMap[preferredChart] || preferredChart}.`;
      if (fromDate || toDate) {
        const fVi = fromDate ? new Date(fromDate).toLocaleDateString('vi-VN') : '';
        const tVi = toDate ? new Date(toDate).toLocaleDateString('vi-VN') : '';
        if (fromDate && toDate) base += ` Dữ liệu giới hạn trong khoảng thời gian từ ngày ${fVi} đến ngày ${tVi}.`;
        else if (fromDate) base += ` Dữ liệu kể từ ngày ${fVi}.`;
        else if (toDate) base += ` Dữ liệu đến ngày ${tVi}.`;
      }
      return base;
    }
    let base = question;
    if (fromDate || toDate) {
      const fVi = fromDate ? new Date(fromDate).toLocaleDateString('vi-VN') : '';
      const tVi = toDate ? new Date(toDate).toLocaleDateString('vi-VN') : '';
      if (fromDate && toDate) base += `. Dữ liệu giới hạn trong khoảng thời gian từ ngày ${fVi} đến ngày ${tVi}.`;
      else if (fromDate) base += `. Dữ liệu kể từ ngày ${fVi}.`;
      else if (toDate) base += `. Dữ liệu đến ngày ${tVi}.`;
    }
    return base;
  };

  const handleGenerate = async () => {
    const prompt = buildPrompt();
    if (!prompt) {
      toast.warning('Vui lòng nhập câu hỏi');
      return;
    }
    try {
      setLoading(true);
      setChartResponse(null);
      const res = await axios.post('http://localhost:8080/api/v1/emp/llm/generate', { question: prompt });
      if (res.data?.code !== 200) {
        toast.error(res.data?.message || 'Có lỗi xảy ra');
        return;
      }
      if (!res.data?.data) {
        toast.error('LLM không trả về dữ liệu hợp lệ');
        return;
      }
      setChartResponse(res.data.data);
      // Save to history if new
      setQueryHistory(prev => {
        if (prompt && !prev.includes(prompt)) {
          return [prompt, ...prev].slice(0, 20); // limit 20 entries
        }
        return prev;
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChart = () => {
    if (!chartResponse) return;
    const id = generateId();
    const newChart = {
      id,
      question,
      preferredChart,
      chartResponse,
      title: chartResponse.description || question || 'Biểu đồ',
      fromDate,
      toDate,
      // default layout occupies 4x4 grid cells
      w: 4,
      h: 4,
      x: 0,
      y: Infinity
    };
    setSavedCharts(prev => [...prev, newChart]);
    toast.success('Đã lưu biểu đồ');
  };

  const handleRemoveChart = (id) => {
    setSavedCharts(prev => prev.filter(c => c.id !== id));
  };

  const confirmRemoveChart = (id) => {
    setChartToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleLayoutChange = (layout) => {
    setSavedCharts(prev => prev.map(item => {
      const lItem = layout.find(l => l.i === item.id);
      return lItem ? { ...item, ...lItem } : item;
    }));
  };

  const renderChartGeneric = (response, pref) => {
    // clone of renderChart but parameterized
    const chartTypeRaw = (response.chartType || pref || '').toLowerCase();
    let chartType = chartTypeRaw === 'column' ? 'bar' : chartTypeRaw;
    const data = response.data || [];
    const xKey = response.xaxis || response.xAxis || response.x_axis || 'x';
    const yKeys = response.yaxis || response.yAxis || response.y_axis || [];
    if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-center text-gray-500">Không có dữ liệu</div>;
    }
    const inferredY = Array.isArray(yKeys) && yKeys.length > 0 ? yKeys : Object.keys(data[0]).filter(k => typeof data[0][k] === 'number');
    const chartMargin = { top: 20, right: 30, left: 60, bottom: 5 };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={chartMargin}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey={xKey} /> <YAxis tickMargin={8}/> <Tooltip /> <Legend /> {inferredY.map((key, idx) => (<Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} name={key}/>))}</BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={chartMargin}> <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey={xKey} /> <YAxis tickMargin={8}/> <Tooltip /> <Legend /> {inferredY.map((key, idx) => (<Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} name={key}/>))}</LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        const pieVal = inferredY[0];
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart><Tooltip/><Legend/><Pie data={data} dataKey={pieVal} nameKey={xKey} cx="50%" cy="50%" outerRadius={80} label>{data.map((_,idx)=>(<Cell key={idx} fill={COLORS[idx%COLORS.length]}/>))}</Pie></PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={chartMargin}><defs>{inferredY.map((key, idx)=>(<linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS[idx%COLORS.length]} stopOpacity={0.8}/><stop offset="95%" stopColor={COLORS[idx%COLORS.length]} stopOpacity={0}/></linearGradient>))}</defs><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={xKey}/><YAxis tickMargin={8}/><Tooltip/><Legend/>{inferredY.map((key,idx)=>(<Area key={key} type="monotone" dataKey={key} stroke={COLORS[idx%COLORS.length]} fillOpacity={0.3} fill={`url(#color-${key})`} name={key}/>))}</AreaChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        if (inferredY.length<1) return <div>Không đủ dữ liệu</div>;
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={chartMargin}><CartesianGrid/><XAxis dataKey={xKey} name={xKey}/><YAxis dataKey={inferredY[0]} name={inferredY[0]}/><Tooltip cursor={{strokeDasharray:'3 3'}}/><Scatter name="Data" data={data} fill={COLORS[0]}/></ScatterChart>
          </ResponsiveContainer>
        );
      default:
        const cols = Object.keys(data[0]);
        return (
          <div className="overflow-x-auto text-sm h-full">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>{cols.map(c=>(<th key={c} className="px-4 py-2 text-left">{c}</th>))}</tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">{data.map((row,idx)=>(<tr key={idx}>{cols.map(c=>(<td key={c} className="px-4 py-2 whitespace-nowrap">{row[c]}</td>))}</tr>))}</tbody>
            </table>
          </div>
        );
    }
  };

  /* Render dynamic chart */
  const renderChart = () => {
    if (!chartResponse) return null;

    let chartType = (chartResponse.chartType || preferredChart || '').toLowerCase();
    if (chartType === 'column') chartType = 'bar';
    const data = chartResponse.data || [];
    // Normalize keys
    const xKey = chartResponse.xaxis || chartResponse.xAxis || chartResponse.x_axis || 'x';
    const yKeys = chartResponse.yaxis || chartResponse.yAxis || chartResponse.y_axis || [];

    if (!Array.isArray(data) || data.length === 0) {
      return <div className="text-center text-gray-500">Không có dữ liệu để hiển thị</div>;
    }

    // Fallback if yKeys empty => infer numeric fields
    const inferredY = Array.isArray(yKeys) && yKeys.length > 0
      ? yKeys
      : Object.keys(data[0] || {}).filter(k => typeof data[0][k] === 'number');

    const chartMargin = { top: 20, right: 30, left: 60, bottom: 5 };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis tickMargin={8} />
              <Tooltip />
              <Legend />
              {inferredY.map((key, idx) => (
                <Bar key={key} dataKey={key} fill={COLORS[idx % COLORS.length]} name={key} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis tickMargin={8} />
              <Tooltip />
              <Legend />
              {inferredY.map((key, idx) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} name={key} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        // For pie, use first yKey (value) and xKey as name
        const pieValueKey = inferredY[0];
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie
                data={data}
                dataKey={pieValueKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {data.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data} margin={chartMargin}>
              <defs>
                {inferredY.map((key, idx) => (
                  <linearGradient key={key} id={`color-${key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis tickMargin={8} />
              <Tooltip />
              <Legend />
              {inferredY.map((key, idx) => (
                <Area key={key} type="monotone" dataKey={key} stroke={COLORS[idx % COLORS.length]} fillOpacity={0.3} fill={`url(#color-${key})`} name={key} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        if (inferredY.length < 1) {
          return <div className="text-center text-gray-500">Không đủ dữ liệu để vẽ Scatter</div>;
        }
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={chartMargin}>
              <CartesianGrid />
              <XAxis dataKey={xKey} name={xKey}/>
              <YAxis dataKey={inferredY[0]} name={inferredY[0]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Data" data={data} fill={COLORS[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'table':
      default:
        const columns = Object.keys(data[0] || {});
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(col => (
                    <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm">
                {data.map((row, idx) => (
                  <tr key={idx}>
                    {columns.map(col => (
                      <td key={col} className="px-6 py-4 whitespace-nowrap">{row[col]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  const copyToInput = (text) => {
    setQuestion(text);
    setShowSuggestions(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard?.writeText(text);
    toast.success('Đã sao chép');
  };

  const deleteHistory = (text) => {
    setQueryHistory(prev => prev.filter(q => q !== text));
  };

  // Click outside handler to close suggestion box
  const textareaRef = React.useRef(null);
  const suggestionBoxRef = React.useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (!suggestionBoxRef.current || !showSuggestions) return;
      if (!suggestionBoxRef.current.contains(e.target) && !textareaRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSuggestions]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <PageHeader title="Phân tích dữ liệu" />

      {/* Input section */}
      <div className="bg-white rounded-lg shadow mb-6 mt-6">
        <div className="p-6">
          {/* Main Input Area */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Câu hỏi phân tích
            </label>
            
            {/* Input and Button Row */}
            <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
              <div className="relative flex-1 min-w-0">
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Bạn muốn xem dữ liệu gì?"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-colors h-[70px]"
                />
                {showSuggestions && (
                  <div ref={suggestionBoxRef} className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto text-sm">
                    <div className="px-3 py-2 font-medium text-gray-600 border-b bg-gray-50">Gợi ý</div>
                    {presetSuggestions.map((s, idx) => (
                      <div key={`sug-${idx}`} onClick={()=>copyToInput(s)} className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors">{s}</div>
                    ))}
                    {queryHistory.length > 0 && (
                      <>
                        <div className="px-3 py-2 font-medium text-gray-600 border-b bg-gray-50">Lịch sử</div>
                        {queryHistory.map((h, idx) => (
                          <div key={`hist-${idx}`} className="flex items-center px-3 py-2 hover:bg-blue-50 group transition-colors">
                            <span className="flex-1 truncate cursor-pointer" onClick={()=>copyToInput(h)}>{h}</span>
                            <Copy size={14} className="mr-2 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" onClick={()=>copyToClipboard(h)} />
                            <Trash2 size={14} className="text-gray-400 hover:text-red-600 cursor-pointer transition-colors" onClick={()=>deleteHistory(h)} />
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Generate Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className={`w-full sm:w-auto px-8 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] h-[70px] ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      <span>Đang tạo...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Tạo biểu đồ</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <div className="pt-2">
              <button
                onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Settings size={16} />
                Cài đặt thêm
                {showAdvancedSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>

            {/* Advanced Settings Panel */}
            {showAdvancedSettings && (
              <div className="border-t pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Chart Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Loại biểu đồ
                    </label>
                    <select
                      value={preferredChart}
                      onChange={e => setPreferredChart(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {chartOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Từ ngày
                    </label>
                    <input
                      type="date"
                      value={fromDate}
                      max={toDate || undefined}
                      onChange={e=>setFromDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Đến ngày
                    </label>
                    <input
                      type="date"
                      value={toDate}
                      min={fromDate || undefined}
                      max={new Date().toISOString().split('T')[0]}
                      onChange={e=>setToDate(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart render section */}
      {chartResponse && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          {chartResponse.description && (
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{chartResponse.description}</h3>
              <button onClick={handleSaveChart} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">Lưu biểu đồ</button>
            </div>
          )}
          {renderChart()}
          {chartResponse.sql && (
            <details className="mt-4 select-text text-xs text-gray-500 whitespace-pre-wrap">
              <summary className="cursor-pointer text-blue-600">Xem Truy vấn SQL</summary>
              {chartResponse.sql}
            </details>
          )}
        </div>
      )}

      {/* Saved Charts Section */}
      {savedCharts.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Biểu đồ đã lưu</h3>
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: savedCharts.map(c => ({ i: c.id, x: c.x, y: c.y, w: c.w, h: c.h })) }}
            breakpoints={{ lg: 1024, md: 768, sm: 480, xs: 0 }}
            cols={{ lg: 12, md: 8, sm: 4, xs: 2 }}
            rowHeight={80}
            onLayoutChange={handleLayoutChange}
            draggableHandle=".drag-handle"
          >
            {savedCharts.map(c => (
              <div key={c.id} className="border rounded-lg shadow-sm overflow-hidden bg-gray-50 flex flex-col">
                <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 text-sm font-medium cursor-move drag-handle">
                  <span className="truncate" title={c.question}>{c.title || 'Biểu đồ'}</span>
                  <button onMouseDown={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation(); confirmRemoveChart(c.id);}} className="text-red-600">✕</button>
                </div>
                <div className="flex-1 p-2 min-h-[200px]">
                  {c.chartResponse ? renderChartGeneric(c.chartResponse, c.preferredChart) : <div className="text-center text-gray-400">Đang tải...</div>}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Xác nhận xoá biểu đồ"
          message="Bạn có chắc chắn muốn xoá biểu đồ này? Hành động này không thể hoàn tác."
          confirmText="Xoá"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          onConfirm={() => { handleRemoveChart(chartToDelete); setShowDeleteConfirm(false); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default AiStatistics; 