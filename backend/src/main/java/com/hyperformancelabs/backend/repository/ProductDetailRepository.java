package com.hyperformancelabs.backend.repository;

import com.hyperformancelabs.backend.model.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {
    List<ProductDetail> findByProduct_ProductId(Integer productId);
    List<ProductDetail> findByDetailNameAndDetailValue(String detailName, String detailValue);

    @Query("SELECT DISTINCT pd.detailValue FROM ProductDetail pd WHERE pd.detailName = 'tone_scent'")
    List<String> findAllToneScents();

    @Query("SELECT DISTINCT pd.detailValue FROM ProductDetail pd WHERE pd.detailName = 'style'")
    List<String> findAllStyles();
    
    @Query("SELECT DISTINCT pd.detailName FROM ProductDetail pd")
    List<String> findAllDetailNames();
    
    @Query("SELECT DISTINCT pd.detailValue FROM ProductDetail pd WHERE pd.detailName = :detailName")
    List<String> findDistinctDetailValuesByDetailName(@Param("detailName") String detailName);
    
    @Query("SELECT pd.detailValue, COUNT(DISTINCT pd.product.productId) as count " +
           "FROM ProductDetail pd " +
           "WHERE pd.detailName = :detailName " +
           "GROUP BY pd.detailValue " +
           "HAVING COUNT(DISTINCT pd.product.productId) <= 20 AND COUNT(DISTINCT pd.product.productId) > 0")
    List<Object[]> findDetailValuesWithCountLessThan20(@Param("detailName") String detailName);
    
    @Query(value = "SELECT detail_name, COUNT(DISTINCT detail_value) as value_count " +
                  "FROM ProductDetail " +
                  "GROUP BY detail_name " +
                  "HAVING COUNT(DISTINCT detail_value) <= 20 AND detail_name NOT IN ('base_note', 'middle_note', 'top_note')", nativeQuery = true)
    List<Object[]> findDetailNamesWithCountLessThan20();
    
    @Query(value = "SELECT DISTINCT detail_value " +
                  "FROM ProductDetail " +
                  "WHERE detail_name = :detailName", nativeQuery = true)
    List<String> findDistinctDetailValuesByDetailNameNative(@Param("detailName") String detailName);
}
