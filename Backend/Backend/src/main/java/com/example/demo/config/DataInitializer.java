package com.example.demo.config;

import com.example.demo.entity.Category;
import com.example.demo.entity.Course;
import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.ProductRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           ProductRepository productRepository,
                           CategoryRepository categoryRepository,
                           CourseRepository courseRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.courseRepository = courseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize Default Users
        if (userRepository.count() == 0) {
            userRepository.save(new User("System Admin", "admin@aurabuy.com",
                    passwordEncoder.encode("admin123"), "ADMIN"));
            userRepository.save(new User("Jane Doe", "user@aurabuy.com",
                    passwordEncoder.encode("user123"), "USER"));
            System.out.println("Default users initialized successfully.");
        }

        // Initialize Categories
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Electronics"));
            categoryRepository.save(new Category("Fashion"));
            categoryRepository.save(new Category("Home & Garden"));
            categoryRepository.save(new Category("Sports"));
            categoryRepository.save(new Category("Beauty"));
            System.out.println("Default categories initialized successfully.");
        }

        // Initialize Products
        if (productRepository.count() == 0) {
            productRepository.save(new Product(
                    "Premium Wireless Headphones",
                    "Experience crystal-clear audio with our industry-leading noise cancellation technology. Designed for comfort and long battery life.",
                    299.99, 4.8, "Electronics",
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Minimalist Smartwatch Series X",
                    "Stay connected and track your fitness with this sleek, modern smartwatch featuring a brilliant OLED display.",
                    399.00, 4.9, "Electronics",
                    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Designer Leather Backpack",
                    "Crafted from genuine leather, this backpack combines style and functionality with multiple compartments for your essentials.",
                    159.50, 4.6, "Fashion",
                    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Professional Camera Lens",
                    "Capture stunning photos with incredible depth and clarity using this professional-grade prime lens.",
                    899.99, 4.7, "Electronics",
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Classic Aviator Sunglasses",
                    "Timeless aviator design with polarized lenses for ultimate UV protection and style.",
                    125.00, 4.5, "Fashion",
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Smart Home Speaker",
                    "Control your smart home and enjoy room-filling sound with this intuitive voice-controlled speaker.",
                    149.99, 4.4, "Home & Garden",
                    "https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Ergonomic Office Chair",
                    "Work in comfort all day with our fully adjustable ergonomic office chair with lumbar support.",
                    249.00, 4.8, "Home & Garden",
                    "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=600"
            ));
            productRepository.save(new Product(
                    "Performance Running Shoes",
                    "Lightweight and responsive running shoes engineered for maximum speed and comfort.",
                    129.99, 4.7, "Sports",
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600"
            ));
            System.out.println("Default products initialized successfully.");
        }

        // Initialize Courses
        if (courseRepository.count() == 0) {
            courseRepository.save(new Course("Java Programming Masterclass", "Learn Java from scratch to advanced topics, including OOP, database integration, and concurrency.", "Beginner", "Programming"));
            courseRepository.save(new Course("React Frontend Development", "Build modern, responsive single-page applications with React, Redux, and TailwindCSS.", "Intermediate", "Frontend"));
            courseRepository.save(new Course("Advanced PostgreSQL Database Administration", "Master indexing, query tuning, replication, and performance optimization in PostgreSQL.", "Advanced", "Database"));
            System.out.println("Default courses initialized successfully.");
        }
    }
}
