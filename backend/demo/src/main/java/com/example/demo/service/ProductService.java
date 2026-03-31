package com.example.demo.service;

import com.example.demo.dto.ProductRequest;
import com.example.demo.dto.ProductResponse;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private BroadcasterService broadcasterService;

    public Page<ProductResponse> getAllProducts(Long categoryId, String search, String status, Pageable pageable) {
        Specification<Product> spec = buildSpecification(categoryId, search, status);
        return productRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    public List<ProductResponse> getAllProductsList(Long categoryId, String search, String status) {
        Specification<Product> spec = buildSpecification(categoryId, search, status);
        return productRepository.findAll(spec).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private Specification<Product> buildSpecification(Long categoryId, String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }

            if (search != null && !search.trim().isEmpty()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("title")), searchPattern);
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), searchPattern);
                predicates.add(cb.or(titlePredicate, descPredicate));
            }

            if (status != null && !status.trim().isEmpty()) {
                try {
                    Product.Status productStatus = Product.Status.valueOf(status.trim().toUpperCase());
                    predicates.add(cb.equal(root.get("status"), productStatus));
                } catch (IllegalArgumentException e) {
                    // Ignore invalid status
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository
                .findTop4ByOrderByIdDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request,
            List<org.springframework.web.multipart.MultipartFile> imageFiles) {
        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        User seller = userRepository.findByUsername(username).orElseThrow();

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
        }

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .conditionStatus(request.getConditionStatus())
                .status(Product.Status.AVAILABLE)
                .seller(seller)
                .category(category)
                .size(request.getSize())
                .build();

        product = productRepository.save(product);

        if (imageFiles != null && !imageFiles.isEmpty()) {
            Product finalProduct = product;
            ExecutorService executor = Executors.newFixedThreadPool(Math.min(imageFiles.size(), 4));
            try {
                List<CompletableFuture<ProductImage>> futures = imageFiles.stream().map(file ->
                        CompletableFuture.supplyAsync(() -> {
                            try {
                                String url = cloudinaryService.uploadImage(file);
                                return ProductImage.builder().product(finalProduct).imageUrl(url).build();
                            } catch (java.io.IOException e) {
                                throw new RuntimeException("Image upload failed", e);
                            }
                        }, executor)
                ).collect(Collectors.toList());
                List<ProductImage> images = futures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList());
                productImageRepository.saveAll(images);
                product.setImages(images);
            } finally {
                executor.shutdown();
            }
        }

        broadcasterService.broadcast("PRODUCT_UPDATE");
        return mapToResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request,
            List<org.springframework.web.multipart.MultipartFile> imageFiles) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // For simplicity in this demo, we allow any ADMIN to update any product
        // SecurityConfig already ensures only users with ROLE_ADMIN can reach this

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setConditionStatus(request.getConditionStatus());
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }
        product.setSize(request.getSize());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            product.setCategory(category);
        }

        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<org.springframework.web.multipart.MultipartFile> validFiles = imageFiles.stream()
                    .filter(file -> !file.isEmpty())
                    .collect(Collectors.toList());

            if (!validFiles.isEmpty()) {
                product.getImages().clear();
                productImageRepository.deleteByProductId(id);
                Product finalProduct = product;
                ExecutorService executor = Executors.newFixedThreadPool(Math.min(validFiles.size(), 4));
                try {
                    List<CompletableFuture<ProductImage>> futures = validFiles.stream().map(file ->
                            CompletableFuture.supplyAsync(() -> {
                                try {
                                    String url = cloudinaryService.uploadImage(file);
                                    return ProductImage.builder().product(finalProduct).imageUrl(url).build();
                                } catch (java.io.IOException e) {
                                    throw new RuntimeException("Image upload failed", e);
                                }
                            }, executor)
                    ).collect(Collectors.toList());
                    List<ProductImage> images = futures.stream()
                            .map(CompletableFuture::join)
                            .collect(Collectors.toList());
                    product.getImages().addAll(images);
                } finally {
                    executor.shutdown();
                }
            }
        }

        Product updatedProduct = productRepository.save(product);
        broadcasterService.broadcast("PRODUCT_UPDATE");
        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String username = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .getUsername();
        if (!product.getSeller().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to delete this product");
        }

        productRepository.delete(product);
    }

    private ProductResponse mapToResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .conditionStatus(product.getConditionStatus())
                .status(product.getStatus())
                .sellerId(product.getSeller().getId())
                .sellerName(product.getSeller().getUsername())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .imageUrls(product.getImages() != null
                        ? product.getImages().stream().map(ProductImage::getImageUrl).collect(Collectors.toList())
                        : List.of())
                .size(product.getSize())
                .createdAt(product.getCreatedAt().toString())
                .build();
    }
}
