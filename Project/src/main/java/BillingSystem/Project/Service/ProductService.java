package BillingSystem.Project.Service;


import BillingSystem.Project.Entity.Product;
import BillingSystem.Project.Repositories.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

// Get All products by search
@Autowired
private ProductRepo pr;

    public List<Product> search(String name){
        return pr.findByNameContainingIgnoreCaseAndIstrueTrue(name);
    }


//product ko delete krdo
    public void deleteProduct(Long id){
        Product product=pr.findById(id).orElseThrow(() -> new RuntimeException("Produt nahi mila "));
        product.setIstrue(false);

        pr.save(product);


    }

//    get the list of all the products ;

    public List<Product> viewProducts(){

        return pr.findAllByIstrueTrue();
    }

    public Product addProduct(Product product) {
        product.setIstrue(true);
        // Naya product hamesha active hona chahiye
        return pr.save(product);
    }





}
