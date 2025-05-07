-- Add indexes to optimize filter options queries

-- Index for ProductDetail.detailName to speed up filtering
CREATE INDEX IDX_ProductDetail_DetailName ON [ProductDetail] ([detail_name]);

-- Index for ProductDetail.detailValue to speed up filtering
CREATE INDEX IDX_ProductDetail_DetailValue ON [ProductDetail] ([detail_value]);

-- Composite index for both detailName and detailValue
CREATE INDEX IDX_ProductDetail_Name_Value ON [ProductDetail] ([detail_name], [detail_value]);

-- Index for Brand.brandName to speed up brand filtering
CREATE INDEX IDX_Brand_BrandName ON [Brand] ([brand_name]);

-- Index for ProductVariant.volume to speed up volume filtering
CREATE INDEX IDX_ProductVariant_Volume ON [ProductVariant] ([volume]);

-- Index for ProductVariant.price to speed up price range filtering
CREATE INDEX IDX_ProductVariant_Price ON [ProductVariant] ([price]);
