import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Plus, Loader2 } from 'lucide-react';
import axios from 'axios';
import { debounce } from 'lodash';

/**
 * Intelligent search autocomplete input component
 * 
 * @param {Object} props Component props
 * @param {string} props.label Input label
 * @param {string} props.name Input name
 * @param {string} props.value Current input value
 * @param {function} props.onChange Function to call when value changes
 * @param {string} props.placeholder Input placeholder
 * @param {string} props.searchUrl API URL for search
 * @param {string} props.displayField Field name to display in dropdown
 * @param {string} props.valueField Field name to use as value
 * @param {function} props.onCreateNew Function to call when creating a new item
 * @param {string} props.createNewText Text to show for creating a new item
 * @param {boolean} props.required Whether the field is required
 * @returns {JSX.Element} AutocompleteInput component
 */
const AutocompleteInput = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  searchUrl, 
  displayField, 
  valueField,
  onCreateNew,
  createNewText = "Chưa có trong CSDL, tạo mới",
  required = false
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasExactMatch, setHasExactMatch] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  
  // Fetch initial data for the selected value
  useEffect(() => {
    const fetchInitialData = async () => {
      if (value && searchUrl && !selectedItem) {
        try {
          // For brand selection, we need to fetch the brand name by ID
          if (valueField === 'brandId' && !isNaN(value)) {
            const response = await axios.get(`http://localhost:8080/api/v1/emp/brands/${value}`);
            if (response.data && response.data.status === 'success' && response.data.data) {
              setInputValue(response.data.data.brandName || '');
              setSelectedItem(response.data.data);
            }
          } 
          // For product selection, we might already have the name as the value
          else if (valueField === 'productName' && typeof value === 'string') {
            setInputValue(value);
          }
          // For productId selection, fetch product details to display name
          else if (valueField === 'productId' && !isNaN(value)) {
            const baseUrl = searchUrl.split('?')[0].replace(/\/search$/, '');
            try {
              const response = await axios.get(`${baseUrl}/${value}`);
              if (response.data && response.data.status === 'success' && response.data.data) {
                const product = response.data.data;
                setInputValue(product[displayField] || '');
                setSelectedItem(product);
              }
            } catch (err) {
              console.error('Error fetching product initial data:', err);
            }
          }
        } catch (error) {
          console.error('Error fetching initial data:', error);
        }
      } else if (!value) {
        setInputValue('');
        setSelectedItem(null);
      }
    };
    
    fetchInitialData();
  }, [value, searchUrl, valueField, selectedItem]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
        
        // If we have a selected item, restore the input value to that item's display value
        if (selectedItem && displayField) {
          setInputValue(selectedItem[displayField]);
        }
        // If we don't have a selected item but have a value in the input, clear it if it doesn't match any suggestion
        else if (inputValue && suggestions.length > 0) {
          const matchingSuggestion = suggestions.find(s => 
            s[displayField].toLowerCase() === inputValue.toLowerCase());
          
          if (!matchingSuggestion && !hasExactMatch) {
            // Only show create option if there's no exact match
            if (onCreateNew) {
              // Don't clear, allow creating new
            } else {
              setInputValue('');
              onChange({ target: { name, value: '' } });
            }
          }
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedItem, displayField, inputValue, suggestions, hasExactMatch, onCreateNew, name, onChange]);
  
  // Fetch suggestions implementation
  const fetchSuggestionsImpl = async (query) => {
    if (!searchUrl || !query.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`${searchUrl}?query=${encodeURIComponent(query)}&limit=10`);
      if (response.data && response.data.status === 'success' && response.data.data) {
        const results = response.data.data.results || [];
        setSuggestions(results);
        setHasExactMatch(response.data.data.hasExactMatch || false);
        
        // If there's an exact match, select it automatically
        if (response.data.data.hasExactMatch && results.length > 0) {
          const exactMatch = results.find(item => 
            item[displayField].toLowerCase() === query.toLowerCase());
          if (exactMatch) {
            setSelectedItem(exactMatch);
          }
        }
      } else {
        setSuggestions([]);
        setHasExactMatch(false);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setHasExactMatch(false);
    } finally {
      setLoading(false);
    }
  };
  
  // Create a debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useCallback(
    debounce((query) => fetchSuggestionsImpl(query), 300),
    [searchUrl, displayField]
  );
  
  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);
    
    // If input is cleared, also clear the selected value
    if (!newValue.trim()) {
      setSuggestions([]);
      setSelectedItem(null);
      onChange({ target: { name, value: '' } });
    } else {
      debouncedFetchSuggestions(newValue);
    }
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion[displayField]);
    setSelectedItem(suggestion);
    onChange({ 
      target: { 
        name, 
        value: suggestion[valueField], 
        selectedItem: suggestion,
        selectedLabel: suggestion[displayField] 
      } 
    });
    setShowSuggestions(false);
  };
  
  // Handle creating new item
  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew(inputValue);
    }
    setShowSuggestions(false);
  };
  
  return (
    <div className="relative mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative" ref={inputRef}>
        <input
          id={name}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          className="w-full border rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader2 size={18} className="text-gray-400 animate-spin" />
          ) : (
            <Search size={18} className="text-gray-400" />
          )}
        </div>
      </div>
      
      {showSuggestions && inputValue.trim() && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
        >
          {suggestions.length > 0 ? (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedItem && selectedItem[valueField] === suggestion[valueField] ? 'bg-blue-50' : ''}`}
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion[displayField]}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-gray-500">Không tìm thấy kết quả</div>
          )}
          
          {/* Always show create option when no exact match and we have a search term */}
          {!hasExactMatch && inputValue.trim() && onCreateNew && (
            <div 
              className="px-4 py-3 border-t border-gray-200 flex items-center text-blue-600 hover:bg-blue-50 cursor-pointer"
              onClick={handleCreateNew}
            >
              <Plus size={16} className="mr-2" />
              <span>{createNewText} "{inputValue}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
