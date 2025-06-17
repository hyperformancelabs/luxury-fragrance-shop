import { Search } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchBar = ({
  searchQuery,
  handleSearchChange,
  handleSearchSubmit,
  onResultClick,
  results = [],
  loading,
  className = "",
  showDropdown,
  setShowDropdown,
}) => {
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click vùng ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown, setShowDropdown]);

  return (
    <div className={className} style={{ position: "relative" }} ref={dropdownRef}>
      <form
        onSubmit={handleSearchSubmit}
        className="relative"
        autoComplete="off"
        onFocus={() => setShowDropdown(true)}
      >
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, thương hiệu bạn muốn..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-300"
          autoComplete="off"
          onFocus={() => setShowDropdown(true)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
      {showDropdown && searchQuery.trim() && (loading || results.length > 0) && (
        <div className="absolute left-0 top-[110%] w-full bg-white rounded shadow-lg mt-1 z-30 border border-gray-100">
          {loading && (
            <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
          )}
          {(!loading && results.length === 0) && (
            <div className="p-4 text-center text-gray-400 text-sm">Không có sản phẩm phù hợp.</div>
          )}
          {results.length > 0 && (
            <ul className="max-h-72 overflow-y-auto">
              {results.map((item) => (
                <li key={item.productId}>
                  <Link
                    to={`/products/${item.productId}`}
                    onClick={() => onResultClick(item.productId)}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 transition"
                  >
                    <img
                      src={item.imageUrl || "/no-image.png"}
                      alt={item.productName}
                      className="w-10 h-10 rounded object-cover mr-3 border"
                      loading="lazy"
                    />
                    <span className="truncate">{item.productName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
