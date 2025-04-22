-- Add indexes for product filtering

-- Index on Brand.country_of_origin for filtering by country
CREATE INDEX [IX_Brand_CountryOfOrigin] ON [Brand]([country_of_origin]);

-- Index on Product.price for price range filtering
CREATE INDEX [IX_Product_Price] ON [Product]([price]);

-- Index on Product.volume for volume filtering
CREATE INDEX [IX_Product_Volume] ON [Product]([volume]);

-- Composite index on ProductDetail for filtering by detail_name and detail_value
CREATE INDEX [IX_ProductDetail_NameValue] ON [ProductDetail]([detail_name], [detail_value]);
