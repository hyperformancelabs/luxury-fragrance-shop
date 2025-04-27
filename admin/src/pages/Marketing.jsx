import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, TrendingUp, Calendar, Users, ShoppingBag, 
  BarChart2, PieChart, Target, ArrowUpRight, ArrowUp, ArrowDown, Clock, 
  Globe, Share2, Instagram, Facebook, Twitter, ExternalLink, MessageCircle,
  Edit, Trash2, Download, Upload, FilePlus, Coffee } from 'lucide-react';

const Marketing = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('thisMonth');
  const [sortField, setSortField] = useState('performance');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample marketing campaigns data
  const campaigns = [
    {
      id: 1,
      name: 'Khuyến mãi mùa hè',
      product: 'Nước hoa Body Essentials',
      status: 'active',
      startDate: '01/04/2025',
      endDate: '30/06/2025',
      budget: '45,000,000',
      spent: '12,350,000',
      reach: 78500,
      impressions: 256700,
      clicks: 12850,
      conversions: 745,
      roi: 2.8,
      performance: 'high'
    },
    {
      id: 2,
      name: 'Giảm giá cuối tuần',
      product: 'Bộ sản phẩm chăm sóc da',
      status: 'active',
      startDate: '10/04/2025',
      endDate: '12/05/2025',
      budget: '15,000,000',
      spent: '7,820,000',
      reach: 45300,
      impressions: 127600,
      clicks: 8430,
      conversions: 412,
      roi: 2.1,
      performance: 'medium'
    },
    {
      id: 3,
      name: 'Ra mắt sản phẩm mới',
      product: 'Serum dưỡng tóc Silk Therapy',
      status: 'planned',
      startDate: '01/05/2025',
      endDate: '31/05/2025',
      budget: '85,000,000',
      spent: '0',
      reach: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      roi: 0,
      performance: 'pending'
    },
    {
      id: 4,
      name: 'Ngày lễ quốc tế phụ nữ',
      product: 'Bộ quà tặng cao cấp',
      status: 'completed',
      startDate: '01/03/2025',
      endDate: '08/03/2025',
      budget: '35,000,000',
      spent: '34,950,000',
      reach: 92400,
      impressions: 287500,
      clicks: 15720,
      conversions: 1230,
      roi: 3.5,
      performance: 'high'
    },
    {
      id: 5,
      name: 'Khuyến mãi tháng 4',
      product: 'Bộ sưu tập mùa xuân',
      status: 'active',
      startDate: '01/04/2025',
      endDate: '30/04/2025',
      budget: '25,000,000',
      spent: '12,500,000',
      reach: 35600,
      impressions: 98700,
      clicks: 5430,
      conversions: 276,
      roi: 1.6,
      performance: 'low'
    },
    {
      id: 6,
      name: 'Khuyến mãi sinh viên',
      product: 'Dòng sản phẩm cơ bản',
      status: 'paused',
      startDate: '15/03/2025',
      endDate: '15/05/2025',
      budget: '18,000,000',
      spent: '9,200,000',
      reach: 42300,
      impressions: 118500,
      clicks: 5870,
      conversions: 320,
      roi: 1.8,
      performance: 'medium'
    }
  ];
  
  // Sample products data with marketing performance
  const products = [
    {
      id: 1,
      name: 'Nước hoa Body Essentials',
      category: 'Nước hoa',
      launchDate: '10/01/2025',
      sales: 3850,
      revenue: '962,500,000',
      marketingSpend: '145,000,000',
      socialMentions: 4270,
      rating: 4.7,
      trend: 'up'
    },
    {
      id: 2,
      name: 'Bộ sản phẩm chăm sóc da',
      category: 'Chăm sóc da',
      launchDate: '05/02/2025',
      sales: 2750,
      revenue: '687,500,000',
      marketingSpend: '112,000,000',
      socialMentions: 3150,
      rating: 4.5,
      trend: 'up'
    },
    {
      id: 3,
      name: 'Serum dưỡng tóc Silk Therapy',
      category: 'Chăm sóc tóc',
      launchDate: '20/04/2025',
      sales: 0,
      revenue: '0',
      marketingSpend: '85,000,000',
      socialMentions: 1850,
      rating: 0,
      trend: 'neutral'
    },
    {
      id: 4,
      name: 'Bộ quà tặng cao cấp',
      category: 'Quà tặng',
      launchDate: '15/02/2025',
      sales: 1920,
      revenue: '768,000,000',
      marketingSpend: '95,000,000',
      socialMentions: 2870,
      rating: 4.8,
      trend: 'up'
    },
    {
      id: 5,
      name: 'Bộ sưu tập mùa xuân',
      category: 'Bộ sưu tập',
      launchDate: '01/03/2025',
      sales: 1320,
      revenue: '396,000,000',
      marketingSpend: '78,000,000',
      socialMentions: 1950,
      rating: 4.2,
      trend: 'down'
    },
    {
      id: 6,
      name: 'Dòng sản phẩm cơ bản',
      category: 'Chăm sóc da',
      launchDate: '10/12/2024',
      sales: 4350,
      revenue: '652,500,000',
      marketingSpend: '98,000,000',
      socialMentions: 2150,
      rating: 4.3,
      trend: 'neutral'
    }
  ];
  
  // Sample social media metrics
  const socialMetrics = {
    facebook: {
      followers: 38500,
      engagement: 5.2,
      growth: 3.8,
      posts: 24,
      shares: 3750,
      clicks: 15200
    },
    instagram: {
      followers: 52700,
      engagement: 7.5,
      growth: 5.2,
      posts: 32,
      likes: 48200,
      comments: 7850
    },
    twitter: {
      followers: 12300,
      engagement: 2.8,
      growth: 1.5,
      tweets: 45,
      retweets: 1280,
      mentions: 950
    }
  };
  
  // Sample content calendar events
  const contentCalendar = [
    {
      id: 1,
      title: 'Bài đăng về sản phẩm mới',
      platform: 'instagram',
      date: '13/04/2025',
      status: 'scheduled',
      assignee: 'Nguyễn Thị Hương'
    },
    {
      id: 2,
      title: 'Video hướng dẫn sử dụng serum',
      platform: 'facebook',
      date: '15/04/2025',
      status: 'draft',
      assignee: 'Trần Văn Minh'
    },
    {
      id: 3,
      title: 'Bài viết blog về thành phần',
      platform: 'website',
      date: '18/04/2025',
      status: 'scheduled',
      assignee: 'Phạm Thu Hà'
    },
    {
      id: 4,
      title: 'Phỏng vấn chuyên gia',
      platform: 'youtube',
      date: '20/04/2025',
      status: 'planned',
      assignee: 'Lê Quang Đạt'
    },
    {
      id: 5,
      title: 'Cuộc thi hashtag trên Twitter',
      platform: 'twitter',
      date: '23/04/2025',
      status: 'planned',
      assignee: 'Nguyễn Thị Hương'
    }
  ];
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp size={16} className="ml-1" /> : 
      <ChevronDown size={16} className="ml-1" />;
  };
  
  // Function to get campaign status badge
  const getCampaignStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Đang chạy</span>;
      case 'planned':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Lên kế hoạch</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Hoàn thành</span>;
      case 'paused':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Tạm dừng</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };
  
  // Function to get performance badge
  const getPerformanceBadge = (performance) => {
    switch (performance) {
      case 'high':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span className="text-green-700">Hiệu quả cao</span>
          </div>
        );
      case 'medium':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-blue-700">Khá tốt</span>
          </div>
        );
      case 'low':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-yellow-700">Cần cải thiện</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
            <span className="text-gray-500">Chưa bắt đầu</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-gray-400 mr-1"></div>
            <span className="text-gray-500">{performance}</span>
          </div>
        );
    }
  };
  
  // Function to get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <ArrowUp size={16} className="text-green-600" />;
      case 'down':
        return <ArrowDown size={16} className="text-red-600" />;
      default:
        return <div className="w-4 h-1 bg-gray-400 mx-auto rounded"></div>;
    }
  };
  
  // Function to get platform icon
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook':
        return <Facebook size={16} className="text-blue-600" />;
      case 'instagram':
        return <Instagram size={16} className="text-purple-600" />;
      case 'twitter':
        return <Twitter size={16} className="text-blue-400" />;
      case 'youtube':
        return (
          <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'website':
        return <Globe size={16} className="text-gray-700" />;
      default:
        return <ExternalLink size={16} className="text-gray-600" />;
    }
  };
  
  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'text-green-600';
      case 'draft':
        return 'text-yellow-600';
      case 'planned':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };
  
  const filteredCampaigns = campaigns.filter(campaign => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        campaign.name.toLowerCase().includes(query) ||
        campaign.product.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-6 py-3">
          <h1 className="text-xl font-bold text-gray-800">Quản lý Marketing</h1>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow mb-6 overflow-x-auto">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'overview' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Tổng quan
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'campaigns' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('campaigns')}
          >
            Chiến dịch
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'products' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('products')}
          >
            Sản phẩm
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'social' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('social')}
          >
            Mạng xã hội
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'content' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('content')}
          >
            Lịch nội dung
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              activeTab === 'reports' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            Báo cáo
          </button>
        </div>
        
        {/* Filter & Actions */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <select 
                className="bg-gray-100 text-gray-800 text-sm rounded-lg px-3 py-2 border-0 focus:ring-2 focus:ring-blue-500"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="last7days">7 ngày qua</option>
                <option value="thisMonth">Tháng này</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="custom">Tùy chỉnh...</option>
              </select>
              
              <div className="relative w-full sm:w-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="bg-gray-100 text-gray-800 text-sm rounded-lg pl-10 pr-4 py-2 w-full sm:w-auto min-w-[250px] border-0 focus:ring-2 focus:ring-blue-500"
                  placeholder="Tìm chiến dịch, sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg flex items-center">
                <FilePlus size={16} className="mr-2" />
                Tạo mới
              </button>
              
              <button className="text-gray-700 border border-gray-300 text-sm px-4 py-2 rounded-lg flex items-center">
                <Download size={16} className="mr-2" />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>
        
        {/* Overview Dashboard */}
        {activeTab === 'overview' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Doanh thu từ Marketing</p>
                    <h3 className="text-2xl font-bold">₫1.85 tỷ</h3>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp size={24} className="text-green-600" />
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowUpRight size={16} className="text-green-600 mr-1" />
                  <span className="text-green-600 text-sm font-medium">12.5% </span>
                  <span className="text-gray-600 text-sm ml-1">từ tháng trước</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Tổng lượt tiếp cận</p>
                    <h3 className="text-2xl font-bold">523.8k</h3>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users size={24} className="text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowUpRight size={16} className="text-green-600 mr-1" />
                  <span className="text-green-600 text-sm font-medium">8.2% </span>
                  <span className="text-gray-600 text-sm ml-1">từ tháng trước</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Tỷ lệ chuyển đổi</p>
                    <h3 className="text-2xl font-bold">4.7%</h3>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target size={24} className="text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowUpRight size={16} className="text-green-600 mr-1" />
                  <span className="text-green-600 text-sm font-medium">1.5% </span>
                  <span className="text-gray-600 text-sm ml-1">từ tháng trước</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Chi phí thu hút KH</p>
                    <h3 className="text-2xl font-bold">₫185k</h3>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <ShoppingBag size={24} className="text-red-600" />
                  </div>
                </div>
                <div className="flex items-center">
                  <ArrowDown size={16} className="text-green-600 mr-1" />
                  <span className="text-green-600 text-sm font-medium">3.2% </span>
                  <span className="text-gray-600 text-sm ml-1">từ tháng trước</span>
                </div>
              </div>
            </div>
            
            {/* Marketing Performance & Active Campaigns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <h3 className="text-lg font-medium">Hiệu suất Marketing theo kênh</h3>
                </div>
                <div className="p-4">
                  <div className="h-80 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Biểu đồ kênh Marketing sẽ hiển thị ở đây</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Facebook</p>
                      <p className="text-lg font-semibold">₫450tr</p>
                      <div className="flex items-center justify-center mt-1">
                        <ArrowUpRight size={14} className="text-green-600 mr-1" />
                        <span className="text-green-600 text-xs">15.2%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Google Ads</p>
                      <p className="text-lg font-semibold">₫380tr</p>
                      <div className="flex items-center justify-center mt-1">
                        <ArrowUpRight size={14} className="text-green-600 mr-1" />
                        <span className="text-green-600 text-xs">8.7%</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500 text-sm">Instagram</p>
                      <p className="text-lg font-semibold">₫320tr</p>
                      <div className="flex items-center justify-center mt-1">
                        <ArrowUpRight size={14} className="text-green-600 mr-1" />
                        <span className="text-green-600 text-xs">12.1%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="text-lg font-medium">Chiến dịch đang chạy</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">{campaigns.filter(c => c.status === 'active').length} chiến dịch</span>
                </div>
                <div className="p-4">
                  <ul className="space-y-4">
                    {campaigns.filter(c => c.status === 'active').slice(0, 4).map(campaign => (
                      <li key={campaign.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{campaign.name}</h4>
                          {getPerformanceBadge(campaign.performance)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{campaign.product}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Còn {calculateDaysLeft(campaign.endDate)} ngày</span>
                          <span>{parseInt(campaign.spent.replace(/,/g, '')) / parseInt(campaign.budget.replace(/,/g, '')) * 100}% đã chi tiêu</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${parseInt(campaign.spent.replace(/,/g, '')) / parseInt(campaign.budget.replace(/,/g, '')) * 100}%` }}></div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
                    Xem tất cả chiến dịch
                  </button>
                </div>
              </div>
            </div>
            
            {/* Product & Social Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow"></div>
              <div className="bg-white rounded-lg shadow">
  <div className="p-4 border-b">
    <h3 className="text-lg font-medium">Hiệu suất sản phẩm</h3>
  </div>
  <div className="p-4">
    <ul className="space-y-4">
      {products.slice(0, 4).map(product => (
        <li key={product.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center mr-3">
              <Coffee size={20} className="text-gray-500" />
            </div>
            <div>
              <h4 className="font-medium text-sm">{product.name}</h4>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className="font-semibold text-sm mr-1">
                {product.sales.toLocaleString()}
              </span>
              {getTrendIcon(product.trend)}
            </div>
            <p className="text-xs text-gray-500">Đã bán</p>
          </div>
        </li>
      ))}
    </ul>
    
    <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium mt-4">
      Xem tất cả sản phẩm
    </button>
  </div>
</div>

<div className="col-span-2 bg-white rounded-lg shadow">
  <div className="p-4 border-b">
    <h3 className="text-lg font-medium">Hoạt động mạng xã hội</h3>
  </div>
  <div className="p-4">
    <div className="h-80 flex items-center justify-center mb-6">
      <div className="text-center">
        <PieChart size={48} className="mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-500">Biểu đồ phân tích mạng xã hội sẽ hiển thị ở đây</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Facebook</h4>
          <Facebook size={20} className="text-blue-600" />
        </div>
        <p className="text-2xl font-bold">{socialMetrics.facebook.followers.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Người theo dõi</p>
        <div className="flex items-center mt-2">
          <ArrowUpRight size={14} className="text-green-600 mr-1" />
          <span className="text-green-600 text-xs">{socialMetrics.facebook.growth}%</span>
          <span className="text-xs text-gray-500 ml-1">tháng này</span>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Instagram</h4>
          <Instagram size={20} className="text-purple-600" />
        </div>
        <p className="text-2xl font-bold">{socialMetrics.instagram.followers.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Người theo dõi</p>
        <div className="flex items-center mt-2">
          <ArrowUpRight size={14} className="text-green-600 mr-1" />
          <span className="text-green-600 text-xs">{socialMetrics.instagram.growth}%</span>
          <span className="text-xs text-gray-500 ml-1">tháng này</span>
        </div>
      </div>
      
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Twitter</h4>
          <Twitter size={20} className="text-blue-400" />
        </div>
        <p className="text-2xl font-bold">{socialMetrics.twitter.followers.toLocaleString()}</p>
        <p className="text-sm text-gray-500">Người theo dõi</p>
        <div className="flex items-center mt-2">
          <ArrowUpRight size={14} className="text-green-600 mr-1" />
          <span className="text-green-600 text-xs">{socialMetrics.twitter.growth}%</span>
          <span className="text-xs text-gray-500 ml-1">tháng này</span>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
</>
)}

{/* Campaigns Tab */}
{activeTab === 'campaigns' && (
<div className="bg-white rounded-lg shadow overflow-hidden">
  <div className="p-4 border-b">
    <h3 className="text-lg font-medium">Quản lý chiến dịch</h3>
  </div>
  
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('name')}
          >
            <div className="flex items-center">
              Tên chiến dịch
              {getSortIcon('name')}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('product')}
          >
            <div className="flex items-center">
              Sản phẩm
              {getSortIcon('product')}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('status')}
          >
            <div className="flex items-center">
              Trạng thái
              {getSortIcon('status')}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('startDate')}
          >
            <div className="flex items-center">
              Ngày bắt đầu
              {getSortIcon('startDate')}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('budget')}
          >
            <div className="flex items-center">
              Ngân sách
              {getSortIcon('budget')}
            </div>
          </th>
          <th 
            scope="col" 
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('performance')}
          >
            <div className="flex items-center">
              Hiệu suất
              {getSortIcon('performance')}
            </div>
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {filteredCampaigns.map(campaign => (
          <tr key={campaign.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{campaign.product}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getCampaignStatusBadge(campaign.status)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">{campaign.startDate}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">₫{campaign.budget}</div>
              <div className="text-xs text-gray-500">Đã chi: ₫{campaign.spent}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getPerformanceBadge(campaign.performance)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <Edit size={16} />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <Copy size={16} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div className="flex-1 flex justify-between sm:hidden">
      <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Trước
      </button>
      <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Tiếp
      </button>
    </div>
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredCampaigns.length}</span> trong số <span className="font-medium">{campaigns.length}</span> chiến dịch
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Trước</span>
            <ChevronLeft size={16} />
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            1
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
            <span className="sr-only">Tiếp</span>
            <ChevronRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  </div>
</div>
)}

{/* Products Tab */}
{activeTab === 'products' && (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Hiệu suất Marketing theo sản phẩm</h3>
    </div>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Đã bán
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Doanh thu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chi phí Marketing
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Xu hướng
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <Coffee size={16} className="text-gray-500" />
                  </div>
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.sales.toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₫{product.revenue}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">₫{product.marketingSpend}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getTrendIcon(product.trend)}
                  <span className="ml-2 text-sm text-gray-500">
                    {product.trend === 'up' ? 'Tăng' : product.trend === 'down' ? 'Giảm' : 'Ổn định'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Phân tích sản phẩm</h3>
    </div>
    <div className="p-4">
      <div className="h-60 flex items-center justify-center mb-6">
        <div className="text-center">
          <PieChart size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Biểu đồ phân tích sản phẩm sẽ hiển thị ở đây</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Top sản phẩm theo doanh thu</h4>
          <div className="space-y-2">
            {products
              .sort((a, b) => parseInt(b.revenue.replace(/,/g, '')) - parseInt(a.revenue.replace(/,/g, '')))
              .slice(0, 3)
              .map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-medium">₫{product.revenue}</span>
                </div>
              ))
            }
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2">Top sản phẩm theo ROI marketing</h4>
          <div className="space-y-2">
            {products
              .sort((a, b) => {
                const roiA = parseInt(a.revenue.replace(/,/g, '')) / parseInt(a.marketingSpend.replace(/,/g, ''));
                const roiB = parseInt(b.revenue.replace(/,/g, '')) / parseInt(b.marketingSpend.replace(/,/g, ''));
                return roiB - roiA;
              })
              .slice(0, 3)
              .map(product => (
                <div key={product.id} className="flex justify-between items-center">
                  <span className="text-sm">{product.name}</span>
                  <span className="text-sm font-medium">
                    {(parseInt(product.revenue.replace(/,/g, '')) / parseInt(product.marketingSpend.replace(/,/g, ''))).toFixed(1)}x
                  </span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
)}

{/* Social Media Tab */}
{activeTab === 'social' && (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Phân tích mạng xã hội</h3>
    </div>
    <div className="p-4">
      <div className="h-80 flex items-center justify-center mb-6">
        <div className="text-center">
          <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Biểu đồ phân tích mạng xã hội sẽ hiển thị ở đây</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Facebook</h4>
            <Facebook size={20} className="text-blue-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Người theo dõi</span>
              <span className="text-xs font-medium">{socialMetrics.facebook.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Tương tác</span>
              <span className="text-xs font-medium">{socialMetrics.facebook.engagement}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Chia sẻ</span>
              <span className="text-xs font-medium">{socialMetrics.facebook.shares.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Lượt click</span>
              <span className="text-xs font-medium">{socialMetrics.facebook.clicks.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Instagram</h4>
            <Instagram size={20} className="text-purple-600" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Người theo dõi</span>
              <span className="text-xs font-medium">{socialMetrics.instagram.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Tương tác</span>
              <span className="text-xs font-medium">{socialMetrics.instagram.engagement}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Lượt thích</span>
              <span className="text-xs font-medium">{socialMetrics.instagram.likes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Bình luận</span>
              <span className="text-xs font-medium">{socialMetrics.instagram.comments.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium">Twitter</h4>
            <Twitter size={20} className="text-blue-400" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Người theo dõi</span>
              <span className="text-xs font-medium">{socialMetrics.twitter.followers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Tương tác</span>
              <span className="text-xs font-medium">{socialMetrics.twitter.engagement}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Retweets</span>
              <span className="text-xs font-medium">{socialMetrics.twitter.retweets.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Mentions</span>
              <span className="text-xs font-medium">{socialMetrics.twitter.mentions.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Top bài đăng</h3>
    </div>
    <div className="p-4">
      <div className="space-y-4">
        <div className="border rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Instagram size={16} className="text-purple-600" />
            <span className="text-xs text-gray-500">Instagram</span>
            <span className="text-xs text-gray-400">• 2 ngày trước</span>
          </div>
          <p className="text-sm mb-2">Hãy thử bộ sản phẩm mới của chúng tôi, giúp làn da của bạn rạng rỡ cả ngày! #skincare #beauty</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>12.5k lượt thích</span>
            <span>845 bình luận</span>
            <span>320 chia sẻ</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Facebook size={16} className="text-blue-600" />
            <span className="text-xs text-gray-500">Facebook</span>
            <span className="text-xs text-gray-400">• 5 ngày trước</span>
          </div>
          <p className="text-sm mb-2">Chúng tôi rất vui mừng thông báo về sự ra mắt dòng sản phẩm mới vào tháng 5! Hãy đăng ký để nhận thông báo.</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>8.3k lượt thích</span>
            <span>1.2k bình luận</span>
            <span>650 chia sẻ</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-2">
            <Twitter size={16} className="text-blue-400" />
            <span className="text-xs text-gray-500">Twitter</span>
            <span className="text-xs text-gray-400">• 1 tuần trước</span>
          </div>
          <p className="text-sm mb-2">RT @BeautyExpert: Serum dưỡng tóc mới của @YourBrand là sản phẩm phải có trong mùa hè này! #haircare #summerhair</p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>450 retweets</span>
            <span>125 quotes</span>
            <span>1.8k lượt thích</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
)}

{/* Content Calendar Tab */}
{activeTab === 'content' && (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2 bg-white rounded-lg shadow">
    <div className="p-4 border-b">
      <h3 className="text-lg font-medium">Lịch nội dung tháng 4</h3>
    </div>
    <div className="p-4">
      <div className="grid grid-cols-7 gap-2 mb-4">
        {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
          <div key={day} className={`p-2 text-center border rounded-lg ${
            contentCalendar.some(event => parseInt(event.date.split('/')[0]) === day && parseInt(event.date.split('/')[1]) === 4) 
              ? 'bg-blue-50 border-blue-200' 
              : 'border-gray-200'
          } ${day === 12 ? 'ring-2 ring-blue-500' : ''}`}>
            <p className={`text-sm font-medium ${day === 12 ? 'text-blue-600' : 'text-gray-700'}`}>{day}</p>
            {contentCalendar
              .filter(event => parseInt(event.date.split('/')[0]) === day && parseInt(event.date.split('/')[1]) === 4)
              .map(event => (
                <div key={event.id} className="mt-1">
                  <div className="w-3 h-3 mx-auto rounded-full bg-blue-500"></div>
                </div>
              ))
            }
          </div>
        ))}
      </div>
      
      <h4 className="font-medium text-gray-800 mb-3">Sắp tới</h4>
      <div className="space-y-3">
        {contentCalendar
          .sort((a, b) => {
            const dateA = a.date.split('/').map(Number);
            const dateB = b.date.split('/').map(Number);
            return new Date(2025, dateA[1]-1, dateA[0]) - new Date(2025, dateB[1]-1, dateB[0]);
          })
          .map(event => (
            <div key={event.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                {getPlatformIcon(event.platform)}
                </div>
              <div>
                <div className="flex items-center justify-between">
                  <h5 className="text-sm font-medium">{event.title}</h5>
                  <span className={`text-xs ${getStatusColor(event.status)}`}>{event.status}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <Calendar size={12} className="mr-1" />
                  <span>{event.date}</span>
                  <span className="mx-2">•</span>
                  <Users size={12} className="mr-1" />
                  <span>{event.assignee}</span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
  
  <div className="bg-white rounded-lg shadow">
    <div className="p-4 border-b flex justify-between items-center">
      <h3 className="text-lg font-medium">Thêm nội dung</h3>
      <button className="text-blue-600 text-sm font-medium">
        Xem tất cả
      </button>
    </div>
    <div className="p-4">
      <form className="space-y-4">
        <div>
          <label htmlFor="content-title" className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề nội dung
          </label>
          <input
            type="text"
            id="content-title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tiêu đề nội dung"
          />
        </div>
        
        <div>
          <label htmlFor="content-platform" className="block text-sm font-medium text-gray-700 mb-1">
            Nền tảng
          </label>
          <select
            id="content-platform"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn nền tảng</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="youtube">YouTube</option>
            <option value="website">Website</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="content-date" className="block text-sm font-medium text-gray-700 mb-1">
            Ngày đăng
          </label>
          <input
            type="date"
            id="content-date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="content-status" className="block text-sm font-medium text-gray-700 mb-1">
            Trạng thái
          </label>
          <select
            id="content-status"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn trạng thái</option>
            <option value="planned">Lên kế hoạch</option>
            <option value="draft">Nháp</option>
            <option value="scheduled">Đã lên lịch</option>
            <option value="published">Đã đăng</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="content-assignee" className="block text-sm font-medium text-gray-700 mb-1">
            Người phụ trách
          </label>
          <select
            id="content-assignee"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Chọn người phụ trách</option>
            <option value="nguyen-thi-huong">Nguyễn Thị Hương</option>
            <option value="tran-van-minh">Trần Văn Minh</option>
            <option value="pham-thu-ha">Phạm Thu Hà</option>
            <option value="le-quang-dat">Lê Quang Đạt</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Thêm nội dung
        </button>
      </form>
    </div>
  </div>
</div>
)}

{/* Reports Tab */}
{activeTab === 'reports' && (
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-3 bg-white rounded-lg shadow">
    <div className="p-4 border-b flex justify-between items-center">
      <h3 className="text-lg font-medium">Báo cáo Marketing</h3>
      <div className="flex space-x-2">
        <button className="text-gray-700 border border-gray-300 text-sm px-4 py-2 rounded-lg flex items-center">
          <Download size={16} className="mr-2" />
          Tải xuống
        </button>
        <button className="text-gray-700 border border-gray-300 text-sm px-4 py-2 rounded-lg flex items-center">
          <Share2 size={16} className="mr-2" />
          Chia sẻ
        </button>
      </div>
    </div>
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-base font-medium mb-4">Phân tích chi phí Marketing</h4>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChart size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Biểu đồ phân tích chi phí sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-base font-medium mb-4">ROI theo kênh Marketing</h4>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Biểu đồ ROI sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h4 className="text-base font-medium mb-3">Chi tiết kênh Marketing</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kênh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tiếp cận</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyển đổi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ chuyển đổi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chi phí/Chuyển đổi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Facebook size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm text-gray-900">Facebook</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫450,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">245,600</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3,780</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.53%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫119,047</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-sm text-green-700">2.8x</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-red-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      <span className="text-sm text-gray-900">YouTube</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫285,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">180,320</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,450</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.36%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫116,327</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-sm text-green-700">3.2x</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Instagram size={16} className="text-purple-600 mr-2" />
                      <span className="text-sm text-gray-900">Instagram</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫320,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">198,750</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,850</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.43%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫112,281</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-sm text-green-700">2.9x</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.977 11.835a11.175 11.175 0 0 0-11.161-11.12A11.176 11.176 0 0 0 1.642 11.892a11.177 11.177 0 0 0 7.382 10.642.5.5 0 0 0 .653-.37.5.5 0 0 0-.01-.127c0-.1-.01-.37-.01-.723a3.36 3.36 0 0 1-.789.1 1.992 1.992 0 0 1-2.07-1.426c-.231-.635-.633-1.165-1.165-1.531a1.15 1.15 0 0 1-.1-1.164.557.557 0 0 1 .54-.37c.322.033.626.166.854.371.585.535.873 1.307.77 2.07a2.044 2.044 0 0 0 .559 1.385c.313.313.74.485 1.183.473a3.2 3.2 0 0 0 1.284-.264c.1-.833.453-1.608 1.006-2.205-3.21-.37-4.637-2.213-4.637-4.637a4.003 4.003 0 0 1 1.03-2.782 3.733 3.733 0 0 1 .1-2.736.54.54 0 0 1 .339-.223c.189-.27.433.06.632.16.97.493 1.846 1.148 2.592 1.943a8.35 8.35 0 0 1 4.425 0 11.953 11.953 0 0 1 2.591-1.8.537.537 0 0 1 .36-.084c.14.025.266.1.339.223a3.733 3.733 0 0 1 .1 2.736 4.001 4.001 0 0 1 1.028 2.782c0 2.424-1.427 4.267-4.636 4.637a3.454 3.454 0 0 1 1.028 2.57v3.844a.5.5 0 0 0 .16.37.502.502 0 0 0 .369.16.5.5 0 0 0 .243-.063 11.178 11.178 0 0 0 7.11-10.404z"/>
                      </svg>
                      <span className="text-sm text-gray-900">Google Search</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫380,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">215,430</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3,250</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.51%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫116,923</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      <span className="text-sm text-green-700">2.7x</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Twitter size={16} className="text-blue-400 mr-2" />
                      <span className="text-sm text-gray-900">Twitter</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫120,000,000</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">85,320</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">950</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.11%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₫126,316</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
                      <span className="text-sm text-yellow-700">1.8x</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div>
          <h4 className="text-base font-medium mb-3">Phân tích xu hướng Marketing</h4>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart2 size={48} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Biểu đồ xu hướng sẽ hiển thị ở đây</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
)}

      </div>
    </div>
  );
};

// Helper function to calculate days left
function calculateDaysLeft(endDateStr) {
  const [day, month, year] = endDateStr.split('/').map(Number);
  const endDate = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

// Missing component that was referenced
const ChevronLeft = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
};

// Missing component that was referenced
const ChevronRight = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
};

// Missing component that was referenced
const Copy = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={props.size || 24} 
      height={props.size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={props.className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
    </svg>
  );
};

export default Marketing;