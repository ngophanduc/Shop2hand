package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    @EntityGraph(attributePaths = { "seller", "category", "images" })
    Page<Product> findAll(Pageable pageable);

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    List<Product> findTop4ByOrderByIdDesc();

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    Page<Product> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description, Pageable pageable);

    @EntityGraph(attributePaths = { "seller", "category", "images" })
    Page<Product> findByCategoryIdAndTitleContainingIgnoreCaseOrCategoryIdAndDescriptionContainingIgnoreCase(
            Long catId1, String title, Long catId2, String description, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.category = null WHERE p.category.id = :categoryId")
    void updateCategoryToNull(Long categoryId);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.status = 'AVAILABLE' WHERE p.status IS NULL")
    void updateNullStatusToAvailable();
}
