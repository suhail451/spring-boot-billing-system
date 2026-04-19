package BillingSystem.Project.Repositories;

import BillingSystem.Project.Entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface ProductRepo extends JpaRepository<Product,Long> {

    List<Product> findByNameContainingIgnoreCaseAndIstrueTrue(String name);
    List<Product> findAllByIstrueTrue();
    Boolean existsByName(String name);

}
