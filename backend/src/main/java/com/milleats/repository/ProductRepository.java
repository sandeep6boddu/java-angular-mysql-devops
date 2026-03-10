package com.milleats.repository;

import com.milleats.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByIsAvailableTrue();

    List<Product> findByCategoryAndIsAvailableTrue(String category);
}
